-- PIN de 6 dígitos con hash (bcrypt), sesiones por token y votos autenticados.
-- Reasigna todos los PIN existentes a '123456' (hasheado) y migra la verificación
-- de credenciales de texto plano a pin_hash. Requiere las migraciones previas.
-- Depende de: pgcrypto, authorized_users, casas, eventos, juicios.

-- ==============================================================================
-- 1. HASH DE PIN Y LONGITUD DE 6 DÍGITOS
-- ==============================================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

ALTER TABLE public.authorized_users
    ALTER COLUMN pin_code TYPE VARCHAR(6);

ALTER TABLE public.authorized_users
    ADD COLUMN IF NOT EXISTS pin_hash TEXT;

-- Reasigna todos los PIN al valor por defecto del Reino y elimina el texto plano.
UPDATE public.authorized_users
SET pin_hash = crypt('123456', gen_salt('bf')),
    pin_code = NULL;

-- ==============================================================================
-- 2. VERIFICACIÓN CANÓNICA DE SUPERADMINISTRADOR (hash)
-- ==============================================================================
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
        WHERE au.role = 'superadmin'
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

-- El gestor de eventos usa su propio verificador: lo redirigimos al canónico.
CREATE OR REPLACE FUNCTION public.validar_superadmin_eventos(
    p_phone TEXT,
    p_pin TEXT
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, extensions
AS $$
    SELECT public.lokitrono_es_superadmin(p_phone, p_pin);
$$;

-- ==============================================================================
-- 3. LOGIN CON HASH + EMISIÓN DE TOKEN DE SESIÓN
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.sesiones_lokitrono (
    token UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES public.authorized_users(id) ON DELETE CASCADE,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT now(),
    expira_en TIMESTAMPTZ NOT NULL DEFAULT now() + interval '7 days',
    revocado BOOLEAN NOT NULL DEFAULT false
);

ALTER TABLE public.sesiones_lokitrono ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.sesiones_lokitrono FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.validar_login_lokitrono(
    p_phone TEXT,
    p_pin TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
    v_user public.authorized_users%ROWTYPE;
    v_phone_digits TEXT;
    v_token UUID;
    v_expira TIMESTAMPTZ;
BEGIN
    v_phone_digits := regexp_replace(COALESCE(p_phone, ''), '[^0-9]', '', 'g');

    SELECT au.* INTO v_user
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

    -- Migración transparente de cuentas con PIN en texto plano.
    IF v_user.pin_hash IS NULL THEN
        UPDATE public.authorized_users
        SET pin_hash = crypt(btrim(COALESCE(p_pin, '')), gen_salt('bf')),
            pin_code = NULL
        WHERE id = v_user.id;
    END IF;

    -- Limpieza de sesiones caducadas o revocadas.
    DELETE FROM public.sesiones_lokitrono
    WHERE expira_en < now() OR revocado;

    INSERT INTO public.sesiones_lokitrono (usuario_id)
    VALUES (v_user.id)
    RETURNING token, expira_en INTO v_token, v_expira;

    RETURN jsonb_build_object(
        'id', v_user.id,
        'phone', v_user.phone,
        'name', v_user.name,
        'email', v_user.email,
        'role', v_user.role,
        'barrio_asignado', v_user.barrio_asignado,
        'barrio_representado', v_user.barrio_representado,
        'gender', COALESCE(v_user.gender, 'M'),
        'titulo_custom', v_user.titulo_custom,
        'token', v_token,
        'token_expira_en', v_expira
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.cerrar_sesion_lokitrono(
    p_token UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF p_token IS NULL THEN
        RETURN false;
    END IF;
    UPDATE public.sesiones_lokitrono
    SET revocado = true
    WHERE token = p_token;
    RETURN FOUND;
END;
$$;

-- ==============================================================================
-- 4. HELPERS DE VALIDACIÓN
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.lokitrono_validar_pin(p_pin TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
    v_pin TEXT := btrim(COALESCE(p_pin, ''));
BEGIN
    IF v_pin !~ '^[0-9]{6}$' THEN
        RAISE EXCEPTION 'El PIN debe contener exactamente seis dígitos.';
    END IF;
    RETURN v_pin;
END;
$$;

CREATE OR REPLACE FUNCTION public.lokitrono_usuario_de_token(p_token UUID)
RETURNS public.authorized_users
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT au.*
    FROM public.authorized_users au
    JOIN public.sesiones_lokitrono s ON s.usuario_id = au.id
    WHERE s.token = p_token
      AND NOT s.revocado
      AND s.expira_en > now()
    LIMIT 1;
$$;

-- ==============================================================================
-- 5. GESTIÓN DE USUARIOS: PIN HASHEADO Y RESTABLECIMIENTO
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
BEGIN
    IF NOT public.lokitrono_es_superadmin(p_phone, p_pin) THEN
        RAISE EXCEPTION 'No autorizado: se requiere una cuenta superadministradora válida.';
    END IF;

    RETURN QUERY
    SELECT au.id, au.phone, au.name, au.email, au.role, NULL::TEXT AS pin_code,
           au.barrio_asignado, au.barrio_representado,
           COALESCE(au.gender, 'M'), au.titulo_custom
    FROM public.authorized_users au
    ORDER BY au.name ASC NULLS LAST, au.phone ASC;
END;
$$;

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
        phone, name, email, role, pin_hash,
        barrio_asignado, barrio_representado, gender, titulo_custom
    ) VALUES (
        v_phone,
        NULLIF(btrim(COALESCE(p_datos->>'name', '')), ''),
        NULLIF(btrim(COALESCE(p_datos->>'email', '')), ''),
        public.lokitrono_validar_rol(p_datos->>'role'),
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
BEGIN
    IF NOT public.lokitrono_es_superadmin(p_phone, p_pin) THEN
        RAISE EXCEPTION 'No autorizado: se requiere una cuenta superadministradora válida.';
    END IF;

    IF p_usuario_id IS NULL THEN
        RAISE EXCEPTION 'Debes indicar el identificador del usuario.';
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
-- 6. GESTIÓN DE BARRIOS: REDIRIGIR AL VERIFICADOR CANÓNICO
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.crear_casa_superadmin(
    p_phone TEXT,
    p_pin TEXT,
    p_nombre TEXT,
    p_lema TEXT DEFAULT NULL,
    p_emblema TEXT DEFAULT '🏰'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
    v_casa_id UUID;
    v_nombre TEXT;
BEGIN
    v_nombre := btrim(COALESCE(p_nombre, ''));

    IF v_nombre = '' THEN
        RAISE EXCEPTION 'El nombre del barrio es obligatorio.';
    END IF;

    IF length(v_nombre) > 100 THEN
        RAISE EXCEPTION 'El nombre del barrio no puede superar los 100 caracteres.';
    END IF;

    IF NOT public.lokitrono_es_superadmin(p_phone, p_pin) THEN
        RAISE EXCEPTION 'No autorizado: se requiere una cuenta superadministradora válida.';
    END IF;

    IF EXISTS (
        SELECT 1 FROM public.casas c
        WHERE lower(btrim(c.nombre)) = lower(v_nombre)
    ) THEN
        RAISE EXCEPTION 'Ya existe un barrio con ese nombre.';
    END IF;

    INSERT INTO public.casas (nombre, lema, emblema, color_heraldo, participa)
    VALUES (v_nombre, NULLIF(btrim(COALESCE(p_lema, '')), ''),
            COALESCE(NULLIF(btrim(COALESCE(p_emblema, '')), ''), '🏰'),
            '#d4af37', TRUE)
    RETURNING id INTO v_casa_id;

    RETURN v_casa_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.editar_casa_superadmin(
    p_phone TEXT,
    p_pin TEXT,
    p_casa_id UUID,
    p_nombre TEXT,
    p_lema TEXT DEFAULT NULL,
    p_emblema TEXT DEFAULT '🏰',
    p_color_heraldo TEXT DEFAULT '#d4af37',
    p_participa BOOLEAN DEFAULT TRUE
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
    v_nombre TEXT;
BEGIN
    IF NOT public.lokitrono_es_superadmin(p_phone, p_pin) THEN
        RAISE EXCEPTION 'No autorizado: se requiere una cuenta superadministradora válida.';
    END IF;

    v_nombre := btrim(COALESCE(p_nombre, ''));

    IF v_nombre = '' THEN
        RAISE EXCEPTION 'El nombre del barrio es obligatorio.';
    END IF;

    IF length(v_nombre) > 100 THEN
        RAISE EXCEPTION 'El nombre del barrio no puede superar los 100 caracteres.';
    END IF;

    IF EXISTS (
        SELECT 1 FROM public.casas c
        WHERE lower(btrim(c.nombre)) = lower(v_nombre)
          AND c.id <> p_casa_id
    ) THEN
        RAISE EXCEPTION 'Ya existe otro barrio con ese nombre.';
    END IF;

    UPDATE public.casas
    SET nombre = v_nombre,
        lema = NULLIF(btrim(COALESCE(p_lema, '')), ''),
        emblema = COALESCE(NULLIF(btrim(COALESCE(p_emblema, '')), ''), '🏰'),
        color_heraldo = COALESCE(NULLIF(btrim(COALESCE(p_color_heraldo, '')), ''), '#d4af37'),
        participa = COALESCE(p_participa, TRUE)
    WHERE id = p_casa_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se ha encontrado el barrio que deseas editar.';
    END IF;

    RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION public.eliminar_casa_superadmin(
    p_phone TEXT,
    p_pin TEXT,
    p_casa_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
    IF NOT public.lokitrono_es_superadmin(p_phone, p_pin) THEN
        RAISE EXCEPTION 'No autorizado: se requiere una cuenta superadministradora válida.';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.casas WHERE id = p_casa_id
    ) THEN
        RAISE EXCEPTION 'No se ha encontrado el barrio que deseas eliminar.';
    END IF;

    IF EXISTS (SELECT 1 FROM public.juicios WHERE casa_visitada = p_casa_id) THEN
        RAISE EXCEPTION 'Este barrio tiene votos o calificaciones. Desactívalo en lugar de eliminarlo.';
    END IF;

    IF EXISTS (SELECT 1 FROM public.codigos_diarios WHERE casa_id = p_casa_id) THEN
        RAISE EXCEPTION 'Este barrio tiene códigos diarios asociados. Desactívalo en lugar de eliminarlo.';
    END IF;

    IF EXISTS (SELECT 1 FROM public.maestres WHERE casa_origen = p_casa_id) THEN
        RAISE EXCEPTION 'Hay maestres asociados a este barrio. Desactívalo en lugar de eliminarlo.';
    END IF;

    IF EXISTS (
        SELECT 1 FROM public.authorized_users
        WHERE lower(btrim(COALESCE(barrio_asignado, ''))) =
              lower((SELECT btrim(nombre) FROM public.casas WHERE id = p_casa_id))
           OR lower(btrim(COALESCE(barrio_representado, ''))) =
              lower((SELECT btrim(nombre) FROM public.casas WHERE id = p_casa_id))
    ) THEN
        RAISE EXCEPTION 'Hay usuarios asociados a este barrio. Desactívalo en lugar de eliminarlo.';
    END IF;

    DELETE FROM public.casas WHERE id = p_casa_id;
    RETURN TRUE;
END;
$$;

-- ==============================================================================
-- 7. VOTOS AUTENTICADOS POR TOKEN DE SESIÓN
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.votos_evento (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES public.authorized_users(id) ON DELETE CASCADE,
    evento_id TEXT NOT NULL,
    casa_id UUID REFERENCES public.casas(id) ON DELETE SET NULL,
    barrio TEXT,
    nota_festin NUMERIC(4,2) NOT NULL CHECK (nota_festin BETWEEN 0 AND 10),
    nota_caminos NUMERIC(4,2) NOT NULL CHECK (nota_caminos BETWEEN 0 AND 10),
    nota_espiritu NUMERIC(4,2) NOT NULL CHECK (nota_espiritu BETWEEN 0 AND 10),
    detalles_notas JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (usuario_id, evento_id)
);

CREATE INDEX IF NOT EXISTS votos_evento_evento_idx ON public.votos_evento (evento_id);
CREATE INDEX IF NOT EXISTS votos_evento_casa_idx ON public.votos_evento (casa_id);

ALTER TABLE public.votos_evento ENABLE ROW LEVEL SECURITY;

-- Los votos pueden consultarse sin sesión (ranking público); la escritura solo
-- se permite a través de la función SECURITY DEFINER de abajo.
DROP POLICY IF EXISTS votos_evento_public_select ON public.votos_evento;
CREATE POLICY votos_evento_public_select
    ON public.votos_evento
    FOR SELECT
    TO anon, authenticated
    USING (TRUE);

REVOKE INSERT, UPDATE, DELETE ON public.votos_evento FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.votos_evento TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.emitir_voto_lokitrono(
    p_token UUID,
    p_evento_id TEXT,
    p_casa_id UUID,
    p_barrio TEXT,
    p_festin NUMERIC,
    p_caminos NUMERIC,
    p_espiritu NUMERIC,
    p_detalles JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
    v_user public.authorized_users;
    v_casa_id UUID := p_casa_id;
    v_barrio TEXT := btrim(COALESCE(p_barrio, ''));
    v_evento TEXT := btrim(COALESCE(p_evento_id, ''));
    v_cerrado BOOLEAN;
    v_voto public.votos_evento%ROWTYPE;
BEGIN
    v_user := public.lokitrono_usuario_de_token(p_token);
    IF v_user.id IS NULL THEN
        RAISE EXCEPTION 'Sesión no válida o caducada. Vuelve a iniciar sesión.';
    END IF;

    IF v_evento = '' THEN
        RAISE EXCEPTION 'Selecciona un evento válido antes de votar.';
    END IF;

    SELECT cerrado_manualmente INTO v_cerrado
    FROM public.eventos WHERE id = v_evento;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'El evento indicado no existe.';
    END IF;
    IF v_cerrado THEN
        RAISE EXCEPTION 'La votación de este evento está cerrada.';
    END IF;

    IF v_casa_id IS NULL AND v_barrio <> '' THEN
        SELECT id INTO v_casa_id
        FROM public.casas
        WHERE lower(btrim(nombre)) = lower(v_barrio)
        LIMIT 1;
    END IF;

    IF p_festin IS NULL OR p_caminos IS NULL OR p_espiritu IS NULL
       OR p_festin < 0 OR p_festin > 10
       OR p_caminos < 0 OR p_caminos > 10
       OR p_espiritu < 0 OR p_espiritu > 10 THEN
        RAISE EXCEPTION 'El límite máximo del Reino es de 10 puntos por criterio.';
    END IF;

    INSERT INTO public.votos_evento (
        usuario_id, evento_id, casa_id, barrio,
        nota_festin, nota_caminos, nota_espiritu, detalles_notas
    ) VALUES (
        v_user.id, v_evento, v_casa_id, NULLIF(v_barrio, ''),
        p_festin, p_caminos, p_espiritu, COALESCE(p_detalles, '{}'::jsonb)
    )
    RETURNING * INTO v_voto;

    RETURN jsonb_build_object(
        'id', v_voto.id,
        'usuario_id', v_voto.usuario_id,
        'evento_id', v_voto.evento_id,
        'casa_id', v_voto.casa_id,
        'barrio', v_voto.barrio
    );
EXCEPTION
    WHEN unique_violation THEN
        RAISE EXCEPTION 'Ya has emitido un voto para este evento.';
END;
$$;

CREATE OR REPLACE FUNCTION public.listar_votos_lokitrono()
RETURNS TABLE (
    id UUID,
    usuario_id UUID,
    usuario_phone TEXT,
    usuario_nombre TEXT,
    evento_id TEXT,
    casa_id UUID,
    barrio TEXT,
    nota_festin NUMERIC,
    nota_caminos NUMERIC,
    nota_espiritu NUMERIC,
    detalles_notas JSONB,
    created_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT v.id, v.usuario_id, au.phone, au.name,
           v.evento_id, v.casa_id, v.barrio,
           v.nota_festin, v.nota_caminos, v.nota_espiritu,
           v.detalles_notas, v.created_at
    FROM public.votos_evento v
    LEFT JOIN public.authorized_users au ON au.id = v.usuario_id
    ORDER BY v.created_at ASC;
$$;

-- ==============================================================================
-- 8. PERMISOS
-- ==============================================================================
REVOKE ALL ON FUNCTION public.lokitrono_es_superadmin(TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.validar_superadmin_eventos(TEXT, TEXT) FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION public.validar_login_lokitrono(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.validar_login_lokitrono(TEXT, TEXT) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.cerrar_sesion_lokitrono(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.cerrar_sesion_lokitrono(UUID) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.lokitrono_validar_pin(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.lokitrono_validar_rol(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.lokitrono_usuario_de_token(UUID) FROM PUBLIC;

REVOKE ALL ON FUNCTION public.listar_usuarios_superadmin(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.listar_usuarios_superadmin(TEXT, TEXT) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.crear_usuario_superadmin(TEXT, TEXT, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.crear_usuario_superadmin(TEXT, TEXT, JSONB) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.restablecer_pin_superadmin(TEXT, TEXT, UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.restablecer_pin_superadmin(TEXT, TEXT, UUID, TEXT) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.emitir_voto_lokitrono(UUID, TEXT, UUID, TEXT, NUMERIC, NUMERIC, NUMERIC, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.emitir_voto_lokitrono(UUID, TEXT, UUID, TEXT, NUMERIC, NUMERIC, NUMERIC, JSONB) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.listar_votos_lokitrono() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.listar_votos_lokitrono() TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
