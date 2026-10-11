-- Gestión centralizada de usuarios autorizados por superadministradores.
-- Añade género y título personalizado, actualiza el login para devolverlos y
-- expone RPCs de alta/edición/baja/asignación validadas con teléfono + PIN.
-- Requiere que exista public.lokitrono_es_superadmin(TEXT, TEXT) (migración 202610110001).

-- ==============================================================================
-- 1. NUEVAS COLUMNAS DE PERFIL
-- ==============================================================================
ALTER TABLE public.authorized_users ADD COLUMN IF NOT EXISTS gender TEXT DEFAULT 'M';
ALTER TABLE public.authorized_users ADD COLUMN IF NOT EXISTS titulo_custom TEXT;

UPDATE public.authorized_users
SET gender = 'M'
WHERE gender IS NULL OR gender NOT IN ('M', 'F');

-- ==============================================================================
-- 2. LOGIN: DEVOLVER GÉNERO Y TÍTULO PERSONALIZADO
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.validar_login_lokitrono(
    p_phone TEXT,
    p_pin TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user public.authorized_users%ROWTYPE;
    v_phone_digits TEXT;
BEGIN
    v_phone_digits := regexp_replace(COALESCE(p_phone, ''), '[^0-9]', '', 'g');

    SELECT au.* INTO v_user
    FROM public.authorized_users au
    WHERE au.pin_code = btrim(COALESCE(p_pin, ''))
      AND (
        regexp_replace(COALESCE(au.phone, ''), '[^0-9]', '', 'g') = v_phone_digits
        OR (
          length(v_phone_digits) = 9
          AND right(regexp_replace(COALESCE(au.phone, ''), '[^0-9]', '', 'g'), 9) = v_phone_digits
        )
      )
    LIMIT 1;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Teléfono o PIN incorrectos, o cuenta no autorizada.';
    END IF;

    RETURN jsonb_build_object(
        'id', v_user.id,
        'phone', v_user.phone,
        'name', v_user.name,
        'email', v_user.email,
        'role', v_user.role,
        'barrio_asignado', v_user.barrio_asignado,
        'barrio_representado', v_user.barrio_representado,
        'gender', COALESCE(v_user.gender, 'M'),
        'titulo_custom', v_user.titulo_custom
    );
END;
$$;

-- ==============================================================================
-- 3. HELPERS INTERNOS
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.lokitrono_validar_rol(p_role TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
AS $$
    SELECT CASE
        WHEN btrim(COALESCE(p_role, '')) IN ('jugador', 'tronista', 'superadmin')
            THEN btrim(p_role)
        ELSE 'jugador'
    END;
$$;

CREATE OR REPLACE FUNCTION public.lokitrono_validar_pin(p_pin TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
    v_pin TEXT := btrim(COALESCE(p_pin, ''));
BEGIN
    IF v_pin !~ '^[0-9]{4}$' THEN
        RAISE EXCEPTION 'El PIN debe contener exactamente cuatro dígitos.';
    END IF;
    RETURN v_pin;
END;
$$;

-- ==============================================================================
-- 4. LISTAR USUARIOS (SOLO SUPERADMIN)
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
SET search_path = public
AS $$
BEGIN
    IF NOT public.lokitrono_es_superadmin(p_phone, p_pin) THEN
        RAISE EXCEPTION 'No autorizado: se requiere una cuenta superadministradora válida.';
    END IF;

    RETURN QUERY
    SELECT au.id, au.phone, au.name, au.email, au.role, au.pin_code::TEXT,
           au.barrio_asignado, au.barrio_representado,
           COALESCE(au.gender, 'M'), au.titulo_custom
    FROM public.authorized_users au
    ORDER BY au.name ASC NULLS LAST, au.phone ASC;
END;
$$;

-- ==============================================================================
-- 5. CREAR USUARIO (SOLO SUPERADMIN)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.crear_usuario_superadmin(
    p_phone TEXT,
    p_pin TEXT,
    p_datos JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_new public.authorized_users%ROWTYPE;
    v_phone TEXT := btrim(COALESCE(p_datos->>'phone', ''));
    v_pin TEXT;
BEGIN
    IF NOT public.lokitrono_es_superadmin(p_phone, p_pin) THEN
        RAISE EXCEPTION 'No autorizado: se requiere una cuenta superadministradora válida.';
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
        phone, name, email, role, pin_code,
        barrio_asignado, barrio_representado, gender, titulo_custom
    ) VALUES (
        v_phone,
        NULLIF(btrim(COALESCE(p_datos->>'name', '')), ''),
        NULLIF(btrim(COALESCE(p_datos->>'email', '')), ''),
        public.lokitrono_validar_rol(p_datos->>'role'),
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
        'role', v_new.role,
        'pin_code', v_new.pin_code
    );
END;
$$;

-- ==============================================================================
-- 6. EDITAR USUARIO (SOLO SUPERADMIN)
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
SET search_path = public
AS $$
DECLARE
    v_updated public.authorized_users%ROWTYPE;
    v_phone TEXT := NULLIF(btrim(COALESCE(p_datos->>'phone', '')), '');
BEGIN
    IF NOT public.lokitrono_es_superadmin(p_phone, p_pin) THEN
        RAISE EXCEPTION 'No autorizado: se requiere una cuenta superadministradora válida.';
    END IF;

    IF p_usuario_id IS NULL THEN
        RAISE EXCEPTION 'Debes indicar el identificador del usuario.';
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
        role = public.lokitrono_validar_rol(p_datos->>'role'),
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
-- 7. ELIMINAR USUARIO (SOLO SUPERADMIN)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.eliminar_usuario_superadmin(
    p_phone TEXT,
    p_pin TEXT,
    p_usuario_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_role TEXT;
BEGIN
    IF NOT public.lokitrono_es_superadmin(p_phone, p_pin) THEN
        RAISE EXCEPTION 'No autorizado: se requiere una cuenta superadministradora válida.';
    END IF;

    IF p_usuario_id IS NULL THEN
        RAISE EXCEPTION 'Debes indicar el identificador del usuario.';
    END IF;

    SELECT role INTO v_role FROM public.authorized_users WHERE id = p_usuario_id;
    IF v_role IS NULL THEN
        RAISE EXCEPTION 'No se ha encontrado el usuario indicado.';
    END IF;

    IF v_role = 'superadmin' AND (
        SELECT COUNT(*) FROM public.authorized_users WHERE role = 'superadmin'
    ) <= 1 THEN
        RAISE EXCEPTION 'No es posible eliminar al último superadministrador.';
    END IF;

    DELETE FROM public.authorized_users WHERE id = p_usuario_id;
    RETURN TRUE;
END;
$$;

-- ==============================================================================
-- 8. ASIGNAR TÍTULO DE TRONISTA (SOLO SUPERADMIN)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.asignar_tronista_superadmin(
    p_phone TEXT,
    p_pin TEXT,
    p_usuario_id UUID,
    p_barrio TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_barrio TEXT := btrim(COALESCE(p_barrio, ''));
    v_updated public.authorized_users%ROWTYPE;
BEGIN
    IF NOT public.lokitrono_es_superadmin(p_phone, p_pin) THEN
        RAISE EXCEPTION 'No autorizado: se requiere una cuenta superadministradora válida.';
    END IF;

    IF p_usuario_id IS NULL OR v_barrio = '' THEN
        RAISE EXCEPTION 'Debes indicar el usuario y el barrio.';
    END IF;

    UPDATE public.authorized_users
    SET role = 'tronista',
        barrio_asignado = v_barrio
    WHERE id = p_usuario_id
    RETURNING * INTO v_updated;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se ha encontrado el usuario indicado.';
    END IF;

    RETURN jsonb_build_object(
        'id', v_updated.id,
        'name', v_updated.name,
        'role', v_updated.role,
        'barrio_asignado', v_updated.barrio_asignado
    );
END;
$$;

-- ==============================================================================
-- 9. PERMISOS
-- ==============================================================================
REVOKE ALL ON FUNCTION public.validar_login_lokitrono(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.validar_login_lokitrono(TEXT, TEXT) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.lokitrono_validar_rol(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.lokitrono_validar_pin(TEXT) FROM PUBLIC;

REVOKE ALL ON FUNCTION public.listar_usuarios_superadmin(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.listar_usuarios_superadmin(TEXT, TEXT) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.crear_usuario_superadmin(TEXT, TEXT, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.crear_usuario_superadmin(TEXT, TEXT, JSONB) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.editar_usuario_superadmin(TEXT, TEXT, UUID, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.editar_usuario_superadmin(TEXT, TEXT, UUID, JSONB) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.eliminar_usuario_superadmin(TEXT, TEXT, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.eliminar_usuario_superadmin(TEXT, TEXT, UUID) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.asignar_tronista_superadmin(TEXT, TEXT, UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.asignar_tronista_superadmin(TEXT, TEXT, UUID, TEXT) TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
