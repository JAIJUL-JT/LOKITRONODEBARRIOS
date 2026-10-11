-- Rol MASTER (Lokitrono Mayor) y jerarquía de gestión de usuarios.
--
-- El Trono Mayor (master) se sitúa por encima del superadmin: puede conceder,
-- editar y eliminar cualquier rol, y es el único facultado para crear o tocar
-- superadmins y masters. Los superadmins solo gestionan jugador/tronista.
-- Requiere las migraciones 202610120001 y 202610130001 (pin_hash, sesiones).
--
-- ==============================================================================
-- 1. AMPLIAR EL CHECK DE ROLES PARA INCLUIR 'master'
-- ==============================================================================
DO $$
DECLARE
    v_constraint TEXT;
BEGIN
    SELECT con.conname INTO v_constraint
    FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
    WHERE nsp.nspname = 'public'
      AND rel.relname = 'authorized_users'
      AND con.contype = 'c'
      AND pg_get_constraintdef(con.oid) ILIKE '%role%'
    LIMIT 1;

    IF v_constraint IS NOT NULL THEN
        EXECUTE format('ALTER TABLE public.authorized_users DROP CONSTRAINT %I', v_constraint);
    END IF;
END;
$$;

ALTER TABLE public.authorized_users
    ADD CONSTRAINT authorized_users_role_check
    CHECK (role IN ('jugador', 'tronista', 'superadmin', 'master'));

-- ==============================================================================
-- 2. ALTA/PROMOCIÓN DEL AUTOR AL TRONO MAYOR
-- ==============================================================================
-- El autor de la aplicación (teléfono 605676002) ostenta en exclusiva el rol
-- master. Se crea su cuenta si no existe, o se promociona si ya estaba dada de
-- alta, con su barrio asignado y su PIN de acceso inicial.
INSERT INTO public.authorized_users (phone, name, role, barrio_asignado, pin_code, pin_hash)
VALUES ('605676002', 'Julio', 'master', 'Zorrotza', '123456', crypt('123456', gen_salt('bf')))
ON CONFLICT (phone) DO UPDATE
SET role = 'master',
    name = 'Julio',
    barrio_asignado = 'Zorrotza';

-- ==============================================================================
-- 3. VALIDACIÓN DE ROL (ahora admite 'master')
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.lokitrono_validar_rol(p_role TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
AS $$
    SELECT CASE
        WHEN btrim(COALESCE(p_role, '')) IN ('jugador', 'tronista', 'superadmin', 'master')
            THEN btrim(p_role)
        ELSE 'jugador'
    END;
$$;

-- ==============================================================================
-- 3. VERIFICACIÓN DE ADMINISTRADOR (superadmin o master)
-- ==============================================================================
-- Se conserva el nombre canónico `lokitrono_es_superadmin` (lo usan todas las
-- RPC) pero ahora también valida al Trono Mayor.
CREATE OR REPLACE FUNCTION public.lokitrono_es_superadmin(
    p_phone TEXT,
    p_pin TEXT
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, extensions
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.authorized_users au
        WHERE au.role IN ('superadmin', 'master')
          AND (
              (au.pin_hash IS NOT NULL
               AND au.pin_hash = crypt(btrim(COALESCE(p_pin, '')), au.pin_hash))
              OR
              (au.pin_hash IS NULL
               AND au.pin_code IS NOT NULL
               AND au.pin_code = btrim(COALESCE(p_pin, '')))
          )
          AND (
              regexp_replace(COALESCE(au.phone, ''), '[^0-9]', '', 'g') =
              regexp_replace(COALESCE(p_phone, ''), '[^0-9]', '', 'g')
              OR (
                  length(regexp_replace(COALESCE(p_phone, ''), '[^0-9]', '', 'g')) = 9
                  AND right(regexp_replace(COALESCE(au.phone, ''), '[^0-9]', '', 'g'), 9) =
                      regexp_replace(COALESCE(p_phone, ''), '[^0-9]', '', 'g')
              )
          )
    );
$$;

-- Rol autenticado a partir de teléfono + PIN (NULL si las credenciales no son válidas).
CREATE OR REPLACE FUNCTION public.lokitrono_rol_autenticado(
    p_phone TEXT,
    p_pin TEXT
)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, extensions
AS $$
    SELECT au.role
    FROM public.authorized_users au
    WHERE (
        (au.pin_hash IS NOT NULL
         AND au.pin_hash = crypt(btrim(COALESCE(p_pin, '')), au.pin_hash))
        OR
        (au.pin_hash IS NULL
         AND au.pin_code IS NOT NULL
         AND au.pin_code = btrim(COALESCE(p_pin, '')))
    )
      AND (
          regexp_replace(COALESCE(au.phone, ''), '[^0-9]', '', 'g') =
          regexp_replace(COALESCE(p_phone, ''), '[^0-9]', '', 'g')
          OR (
              length(regexp_replace(COALESCE(p_phone, ''), '[^0-9]', '', 'g')) = 9
              AND right(regexp_replace(COALESCE(au.phone, ''), '[^0-9]', '', 'g'), 9) =
                  regexp_replace(COALESCE(p_phone, ''), '[^0-9]', '', 'g')
          )
      )
    LIMIT 1;
$$;

-- Jerarquía: master gestiona todos los roles; superadmin solo jugador/tronista.
CREATE OR REPLACE FUNCTION public.lokitrono_puede_gestionar_rol(
    p_actor TEXT,
    p_target TEXT
)
RETURNS BOOLEAN
LANGUAGE sql
IMMUTABLE
AS $$
    SELECT CASE
        WHEN btrim(COALESCE(p_actor, '')) = 'master' THEN TRUE
        WHEN btrim(COALESCE(p_actor, '')) = 'superadmin'
            THEN btrim(COALESCE(p_target, '')) IN ('jugador', 'tronista')
        ELSE FALSE
    END;
$$;

-- ==============================================================================
-- 4. CREAR USUARIO (SUPERADMIN O MASTER, CON JERARQUÍA)
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
        phone, name, email, role, pin_hash,
        barrio_asignado, barrio_representado, gender, titulo_custom
    ) VALUES (
        v_phone,
        NULLIF(btrim(COALESCE(p_datos->>'name', '')), ''),
        NULLIF(btrim(COALESCE(p_datos->>'email', '')), ''),
        v_role,
        crypt(v_pin, gen_salt('bf')),
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
-- 5. EDITAR USUARIO (SUPERADMIN O MASTER, CON JERARQUÍA)
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
-- 6. ELIMINAR USUARIO (CON JERARQUÍA Y PROTECCIÓN DEL ÚLTIMO ADMIN)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.eliminar_usuario_superadmin(
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
    v_role TEXT;
    v_actor TEXT;
BEGIN
    v_actor := public.lokitrono_rol_autenticado(p_phone, p_pin);
    IF v_actor IS NULL THEN
        RAISE EXCEPTION 'No autorizado: se requiere una cuenta superadministradora válida.';
    END IF;

    IF p_usuario_id IS NULL THEN
        RAISE EXCEPTION 'Debes indicar el identificador del usuario.';
    END IF;

    SELECT role INTO v_role FROM public.authorized_users WHERE id = p_usuario_id;
    IF v_role IS NULL THEN
        RAISE EXCEPTION 'No se ha encontrado el usuario indicado.';
    END IF;

    IF NOT public.lokitrono_puede_gestionar_rol(v_actor, v_role) THEN
        RAISE EXCEPTION 'No tienes permiso para eliminar a un usuario con el rol %.', v_role;
    END IF;

    IF v_role = 'master' AND (
        SELECT COUNT(*) FROM public.authorized_users WHERE role = 'master'
    ) <= 1 THEN
        RAISE EXCEPTION 'No es posible eliminar al último Master del Trono Mayor.';
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
-- 7. RESTABLECER PIN (CON JERARQUÍA)
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
        pin_code = NULL
    WHERE id = p_usuario_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se ha encontrado el usuario indicado.';
    END IF;

    RETURN TRUE;
END;
$$;

-- ==============================================================================
-- 8. ASIGNAR TRONISTA (SOLO A JUGADORES/TRONISTAS)
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
SET search_path = public, extensions
AS $$
DECLARE
    v_barrio TEXT := btrim(COALESCE(p_barrio, ''));
    v_updated public.authorized_users%ROWTYPE;
    v_actor TEXT;
    v_actual TEXT;
BEGIN
    v_actor := public.lokitrono_rol_autenticado(p_phone, p_pin);
    IF v_actor IS NULL THEN
        RAISE EXCEPTION 'No autorizado: se requiere una cuenta superadministradora válida.';
    END IF;

    IF p_usuario_id IS NULL OR v_barrio = '' THEN
        RAISE EXCEPTION 'Debes indicar el usuario y el barrio.';
    END IF;

    SELECT role INTO v_actual FROM public.authorized_users WHERE id = p_usuario_id;
    IF v_actual IS NULL THEN
        RAISE EXCEPTION 'No se ha encontrado el usuario indicado.';
    END IF;

    IF v_actual NOT IN ('jugador', 'tronista') THEN
        RAISE EXCEPTION 'Solo se puede nombrar Lokitronista a un Maestre.';
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
-- 9. RLS: EL MASTER TAMBIÉN ES ADMINISTRADOR
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS BOOLEAN LANGUAGE sql STABLE AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.authorized_users au
        WHERE au.role IN ('superadmin', 'master') AND (
            (au.email IS NOT NULL AND au.email = current_setting('jwt.claims.email', true))
            OR
            (au.phone IS NOT NULL AND au.phone = current_setting('jwt.claims.phone', true))
        )
    );
$$;

-- ==============================================================================
-- 10. PERMISOS
-- ==============================================================================
REVOKE ALL ON FUNCTION public.lokitrono_rol_autenticado(TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.lokitrono_puede_gestionar_rol(TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.lokitrono_validar_rol(TEXT) FROM PUBLIC;

REVOKE ALL ON FUNCTION public.crear_usuario_superadmin(TEXT, TEXT, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.crear_usuario_superadmin(TEXT, TEXT, JSONB) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.editar_usuario_superadmin(TEXT, TEXT, UUID, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.editar_usuario_superadmin(TEXT, TEXT, UUID, JSONB) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.eliminar_usuario_superadmin(TEXT, TEXT, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.eliminar_usuario_superadmin(TEXT, TEXT, UUID) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.restablecer_pin_superadmin(TEXT, TEXT, UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.restablecer_pin_superadmin(TEXT, TEXT, UUID, TEXT) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.asignar_tronista_superadmin(TEXT, TEXT, UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.asignar_tronista_superadmin(TEXT, TEXT, UUID, TEXT) TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
