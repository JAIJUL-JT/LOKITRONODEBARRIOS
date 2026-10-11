-- Acceso del rol MASTER a los PIN de acceso.
--
-- El Trono Mayor (master) puede crear, editar, restablecer, borrar, ver y
-- descargar los PIN de todos los usuarios, en su condición de autor de la
-- aplicación. Para ello el PIN se guarda además de forma recuperable en la
-- columna `pin_code` (el hash bcrypt en `pin_hash` sigue siendo el que valida
-- el inicio de sesión). Solo el master recibe el PIN en claro; para el resto
-- de administradores la consulta devuelve NULL.
--
-- ADVERTENCIA: guardar el PIN en claro reduce la seguridad del sistema; solo
-- se hace porque el autor lo necesita para la gestión operativa del juego.
--
-- Requiere la migración 202610140001 (rol master).

-- ==============================================================================
-- 1. LISTAR USUARIOS: EL PIN SOLO SE REVELA AL MASTER
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.listar_usuarios_superadmin(
    p_phone TEXT,
    p_pin TEXT
)
RETURNS TABLE (
    id UUID,
    phone TEXT,
    name TEXT,
    email TEXT,
    role TEXT,
    pin_code TEXT,
    barrio_asignado TEXT,
    barrio_representado TEXT,
    gender TEXT,
    titulo_custom TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
    v_actor TEXT;
BEGIN
    v_actor := public.lokitrono_rol_autenticado(p_phone, p_pin);
    IF v_actor IS NULL THEN
        RAISE EXCEPTION 'No autorizado: se requiere una cuenta superadministradora válida.';
    END IF;

    RETURN QUERY
    SELECT au.id, au.phone, au.name, au.email, au.role,
           CASE WHEN v_actor = 'master' THEN au.pin_code ELSE NULL::TEXT END,
           au.barrio_asignado, au.barrio_representado,
           COALESCE(au.gender, 'M'), au.titulo_custom
    FROM public.authorized_users au
    ORDER BY au.name ASC NULLS LAST, au.phone ASC;
END;
$$;

-- ==============================================================================
-- 2. CREAR USUARIO: GUARDAR EL PIN TAMBIÉN EN CLARO
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.crear_usuario_superadmin(
    p_phone TEXT,
    p_pin TEXT,
    p_datos JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
    v_new public.authorized_users%ROWTYPE;
    v_phone TEXT := btrim(COALESCE(p_datos->>'phone', ''));
    v_actor TEXT;
    v_role TEXT;
    v_pin TEXT;
BEGIN
    v_actor := public.lokitrono_rol_autenticado(p_phone, p_pin);
    IF v_actor IS NULL THEN
        RAISE EXCEPTION 'No autorizado: se requiere una cuenta superadministradora válida.';
    END IF;

    v_role := public.lokitrono_validar_rol(p_datos->>'role');
    IF NOT public.lokitrono_puede_gestionar_rol(v_actor, v_role) THEN
        RAISE EXCEPTION 'No tienes permiso para crear usuarios con el rol %.', v_role;
    END IF;

    IF v_phone = '' THEN
        RAISE EXCEPTION 'El teléfono es obligatorio.';
    END IF;

    IF EXISTS (
        SELECT 1 FROM public.authorized_users au
        WHERE btrim(COALESCE(au.phone, '')) = v_phone
    ) THEN
        RAISE EXCEPTION 'Ya existe un usuario con ese teléfono.';
    END IF;

    v_pin := public.lokitrono_validar_pin(COALESCE(p_datos->>'pin_code', ''));

    INSERT INTO public.authorized_users (
        phone, name, email, role, pin_hash, pin_code,
        barrio_asignado, barrio_representado, gender, titulo_custom
    ) VALUES (
        v_phone,
        NULLIF(btrim(COALESCE(p_datos->>'name', '')), ''),
        NULLIF(btrim(COALESCE(p_datos->>'email', '')), ''),
        v_role,
        crypt(v_pin, gen_salt('bf')),
        v_pin,
        NULLIF(btrim(COALESCE(p_datos->>'barrio_asignado', '')), ''),
        NULLIF(btrim(COALESCE(p_datos->>'barrio_representado', '')), ''),
        COALESCE(NULLIF(p_datos->>'gender', ''), 'M'),
        NULLIF(btrim(COALESCE(p_datos->>'titulo_custom', '')), '')
    )
    RETURNING * INTO v_new;

    RETURN jsonb_build_object(
        'id', v_new.id,
        'phone', v_new.phone,
        'name', v_new.name,
        'role', v_new.role
    );
END;
$$;

-- ==============================================================================
-- 3. EDITAR USUARIO: PERMITE CAMBIAR EL PIN (OPCIONAL)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.editar_usuario_superadmin(
    p_phone TEXT,
    p_pin TEXT,
    p_usuario_id UUID,
    p_datos JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
    v_updated public.authorized_users%ROWTYPE;
    v_phone TEXT := NULLIF(btrim(COALESCE(p_datos->>'phone', '')), '');
    v_actor TEXT;
    v_actual TEXT;
    v_role TEXT;
    v_nuevo_pin TEXT := NULLIF(btrim(COALESCE(p_datos->>'pin_code', '')), '');
BEGIN
    v_actor := public.lokitrono_rol_autenticado(p_phone, p_pin);
    IF v_actor IS NULL THEN
        RAISE EXCEPTION 'No autorizado: se requiere una cuenta superadministradora válida.';
    END IF;

    IF p_usuario_id IS NULL THEN
        RAISE EXCEPTION 'Debes indicar el identificador del usuario.';
    END IF;

    SELECT role INTO v_actual FROM public.authorized_users WHERE id = p_usuario_id;
    IF v_actual IS NULL THEN
        RAISE EXCEPTION 'No se ha encontrado el usuario indicado.';
    END IF;

    IF NOT public.lokitrono_puede_gestionar_rol(v_actor, v_actual) THEN
        RAISE EXCEPTION 'No tienes permiso para editar a un usuario con el rol %.', v_actual;
    END IF;

    v_role := public.lokitrono_validar_rol(p_datos->>'role');
    IF NOT public.lokitrono_puede_gestionar_rol(v_actor, v_role) THEN
        RAISE EXCEPTION 'No tienes permiso para asignar el rol %.', v_role;
    END IF;

    IF v_nuevo_pin IS NOT NULL THEN
        v_nuevo_pin := public.lokitrono_validar_pin(v_nuevo_pin);
    END IF;

    IF v_phone IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.authorized_users au
        WHERE btrim(COALESCE(au.phone, '')) = v_phone
          AND au.id <> p_usuario_id
    ) THEN
        RAISE EXCEPTION 'Ya existe otro usuario con ese teléfono.';
    END IF;

    UPDATE public.authorized_users
    SET phone = COALESCE(v_phone, phone),
        name = NULLIF(btrim(COALESCE(p_datos->>'name', '')), ''),
        email = NULLIF(btrim(COALESCE(p_datos->>'email', '')), ''),
        role = v_role,
        pin_hash = CASE WHEN v_nuevo_pin IS NOT NULL THEN crypt(v_nuevo_pin, gen_salt('bf')) ELSE pin_hash END,
        pin_code = CASE WHEN v_nuevo_pin IS NOT NULL THEN v_nuevo_pin ELSE pin_code END,
        barrio_asignado = NULLIF(btrim(COALESCE(p_datos->>'barrio_asignado', '')), ''),
        barrio_representado = NULLIF(btrim(COALESCE(p_datos->>'barrio_representado', '')), ''),
        gender = COALESCE(NULLIF(p_datos->>'gender', ''), 'M'),
        titulo_custom = NULLIF(btrim(COALESCE(p_datos->>'titulo_custom', '')), '')
    WHERE id = p_usuario_id
    RETURNING * INTO v_updated;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se ha encontrado el usuario indicado.';
    END IF;

    RETURN jsonb_build_object(
        'id', v_updated.id,
        'phone', v_updated.phone,
        'name', v_updated.name,
        'role', v_updated.role
    );
END;
$$;

-- ==============================================================================
-- 4. RESTABLECER PIN: GUARDARLO TAMBIÉN EN CLARO
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.restablecer_pin_superadmin(
    p_phone TEXT,
    p_pin TEXT,
    p_usuario_id UUID,
    p_nuevo_pin TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
    v_nuevo TEXT;
    v_actor TEXT;
    v_actual TEXT;
BEGIN
    v_actor := public.lokitrono_rol_autenticado(p_phone, p_pin);
    IF v_actor IS NULL THEN
        RAISE EXCEPTION 'No autorizado: se requiere una cuenta superadministradora válida.';
    END IF;

    IF p_usuario_id IS NULL THEN
        RAISE EXCEPTION 'Debes indicar el identificador del usuario.';
    END IF;

    SELECT role INTO v_actual FROM public.authorized_users WHERE id = p_usuario_id;
    IF v_actual IS NULL THEN
        RAISE EXCEPTION 'No se ha encontrado el usuario indicado.';
    END IF;

    IF NOT public.lokitrono_puede_gestionar_rol(v_actor, v_actual) THEN
        RAISE EXCEPTION 'No tienes permiso para restablecer el PIN de un usuario con el rol %.', v_actual;
    END IF;

    v_nuevo := public.lokitrono_validar_pin(COALESCE(p_nuevo_pin, ''));

    UPDATE public.authorized_users
    SET pin_hash = crypt(v_nuevo, gen_salt('bf')),
        pin_code = v_nuevo
    WHERE id = p_usuario_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se ha encontrado el usuario indicado.';
    END IF;

    RETURN TRUE;
END;
$$;

-- ==============================================================================
-- 5. BORRAR PIN (SOLO MASTER): DEJA LA CUENTA SIN PIN Y REVOCA SUS SESIONES
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.borrar_pin_superadmin(
    p_phone TEXT,
    p_pin TEXT,
    p_usuario_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
    v_actor TEXT;
BEGIN
    v_actor := public.lokitrono_rol_autenticado(p_phone, p_pin);
    IF v_actor IS NULL THEN
        RAISE EXCEPTION 'No autorizado: se requiere una cuenta superadministradora válida.';
    END IF;

    IF v_actor <> 'master' THEN
        RAISE EXCEPTION 'Solo el Master puede borrar PIN de acceso.';
    END IF;

    IF p_usuario_id IS NULL THEN
        RAISE EXCEPTION 'Debes indicar el identificador del usuario.';
    END IF;

    UPDATE public.authorized_users
    SET pin_hash = NULL,
        pin_code = NULL
    WHERE id = p_usuario_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se ha encontrado el usuario indicado.';
    END IF;

    UPDATE public.sesiones_lokitrono
    SET revocado = true
    WHERE usuario_id = p_usuario_id;

    RETURN TRUE;
END;
$$;

-- ==============================================================================
-- 6. PERMISOS
-- ==============================================================================
REVOKE ALL ON FUNCTION public.listar_usuarios_superadmin(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.listar_usuarios_superadmin(TEXT, TEXT) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.crear_usuario_superadmin(TEXT, TEXT, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.crear_usuario_superadmin(TEXT, TEXT, JSONB) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.editar_usuario_superadmin(TEXT, TEXT, UUID, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.editar_usuario_superadmin(TEXT, TEXT, UUID, JSONB) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.restablecer_pin_superadmin(TEXT, TEXT, UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.restablecer_pin_superadmin(TEXT, TEXT, UUID, TEXT) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.borrar_pin_superadmin(TEXT, TEXT, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.borrar_pin_superadmin(TEXT, TEXT, UUID) TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
