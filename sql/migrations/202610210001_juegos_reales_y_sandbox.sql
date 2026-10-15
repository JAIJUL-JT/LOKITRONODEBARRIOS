-- ==============================================================================
-- LOKITRONO: JUEGOS REALES, AISLAMIENTO DEL SANDBOX Y CUENTAS CANÓNICAS
-- Migración: 202610210001
-- ==============================================================================
-- Objetivos:
--   1) Crear la tabla `juegos` y marcar eventos/votos con su juego (oficial).
--   2) Fijar las cuentas canónicas: Julio (master) y Ainhoa (superadmin), y
--      consolidar los teléfonos duplicados con prefijo +34.
--   3) Endurecer el reinicio real para conservar master/superadmin y garantizar
--      que siempre quede un Master; nunca toca el Sandbox.
--   4) Crear las tablas espejo del Sandbox (sandbox_*) y sus RPC. El Sandbox
--      SOLO crea/edita/borra/carga/guarda datos del Sandbox; el entorno real
--      SOLO crea/edita/carga/guarda datos reales. Nunca se cruzan.
--
-- Requiere: 202610090003 (eventos), 202610130001 (votos/sesiones),
--           202610140001/202610140002 (master), 202610160001 (tokens),
--           202610180004 (restaurar_competicion_superadmin).
-- ==============================================================================

-- ==============================================================================
-- 1. TABLA `juegos` Y JUEGO OFICIAL ACTIVO
-- ==============================================================================
-- Preparada para temporadas/ediciones. Por ahora existe un único juego oficial
-- activo; el Sandbox vive en sus propias tablas (sandbox_*) y no usa esta tabla.
CREATE TABLE IF NOT EXISTS public.juegos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    modo TEXT NOT NULL DEFAULT 'oficial'
        CHECK (modo IN ('oficial', 'sandbox', 'archivado')),
    activo BOOLEAN NOT NULL DEFAULT false,
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Garantiza que exista un juego oficial activo.
INSERT INTO public.juegos (nombre, modo, activo)
SELECT 'Competición Oficial', 'oficial', true
WHERE NOT EXISTS (
    SELECT 1 FROM public.juegos WHERE modo = 'oficial' AND activo
);

-- Devuelve el identificador del juego oficial activo (NULL si no hubiera).
CREATE OR REPLACE FUNCTION public.juego_oficial_activo()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT j.id
    FROM public.juegos j
    WHERE j.modo = 'oficial' AND j.activo
    ORDER BY j.fecha_creacion ASC
    LIMIT 1;
$$;

-- ==============================================================================
-- 2. MARCADO DEL JUEGO EN EVENTOS Y VOTOS
-- ==============================================================================
ALTER TABLE public.eventos
    ADD COLUMN IF NOT EXISTS juego_id UUID REFERENCES public.juegos(id) ON DELETE SET NULL;

ALTER TABLE public.votos_evento
    ADD COLUMN IF NOT EXISTS juego_id UUID REFERENCES public.juegos(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS eventos_juego_idx ON public.eventos (juego_id);
CREATE INDEX IF NOT EXISTS votos_evento_juego_idx ON public.votos_evento (juego_id);

-- Rellena el juego oficial en el histórico existente.
UPDATE public.eventos
SET juego_id = public.juego_oficial_activo()
WHERE juego_id IS NULL;

UPDATE public.votos_evento
SET juego_id = public.juego_oficial_activo()
WHERE juego_id IS NULL;

-- Triggers: toda escritura real queda marcada con el juego oficial activo sin
-- necesidad de tocar las RPC existentes (guardar_evento / emitir_voto).
CREATE OR REPLACE FUNCTION public.marcar_juego_oficial()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    IF NEW.juego_id IS NULL THEN
        NEW.juego_id := public.juego_oficial_activo();
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_eventos_juego_oficial ON public.eventos;
CREATE TRIGGER trg_eventos_juego_oficial
    BEFORE INSERT OR UPDATE OF juego_id ON public.eventos
    FOR EACH ROW EXECUTE FUNCTION public.marcar_juego_oficial();

DROP TRIGGER IF EXISTS trg_votos_juego_oficial ON public.votos_evento;
CREATE TRIGGER trg_votos_juego_oficial
    BEFORE INSERT OR UPDATE OF juego_id ON public.votos_evento
    FOR EACH ROW EXECUTE FUNCTION public.marcar_juego_oficial();

-- RLS: lectura pública del catálogo de juegos; escritura solo por administradores
-- (RPC SECURITY DEFINER). El Sandbox no se apoya en esta tabla.
ALTER TABLE public.juegos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS juegos_public_select ON public.juegos;
CREATE POLICY juegos_public_select
    ON public.juegos
    FOR SELECT
    TO anon, authenticated
    USING (TRUE);

REVOKE INSERT, UPDATE, DELETE ON public.juegos FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.juegos TO anon, authenticated;

-- ==============================================================================
-- 3. CUENTAS CANÓNICAS: MASTER (Julio) Y SUPERADMIN (Ainhoa)
-- ==============================================================================
-- 3.1 Master: Julio 605676002 / 123456.
INSERT INTO public.authorized_users (phone, name, role, pin_code, pin_hash)
VALUES ('605676002', 'Julio', 'master', '123456', crypt('123456', gen_salt('bf')))
ON CONFLICT (phone) DO UPDATE
SET name = 'Julio',
    role = 'master',
    pin_code = '123456',
    pin_hash = crypt('123456', gen_salt('bf'));

-- 3.2 Superadmin: Ainhoa 663366786 / 300725.
INSERT INTO public.authorized_users (phone, name, role, pin_code, pin_hash)
VALUES ('663366786', 'Ainhoa', 'superadmin', '300725', crypt('300725', gen_salt('bf')))
ON CONFLICT (phone) DO UPDATE
SET name = 'Ainhoa',
    role = 'superadmin',
    pin_code = '300725',
    pin_hash = crypt('300725', gen_salt('bf'));

-- 3.3 Consolidación de teléfonos duplicados con prefijo (+34...). Se reasignan
-- los votos y sesiones al teléfono canónico y se elimina el duplicado. Si un
-- voto del duplicado colisionara con uno del canónico para el mismo evento,
-- el duplicado se descarta (la Ley del voto único por evento prevalece).
DO $$
DECLARE
    v_canon UUID;
    v_dup UUID;
BEGIN
    -- Julio: '+34605676002' -> '605676002'
    SELECT id INTO v_canon FROM public.authorized_users WHERE phone = '605676002' LIMIT 1;
    SELECT id INTO v_dup FROM public.authorized_users WHERE phone = '+34605676002' LIMIT 1;
    IF v_canon IS NOT NULL AND v_dup IS NOT NULL AND v_canon <> v_dup THEN
        UPDATE public.votos_evento v
        SET usuario_id = v_canon
        WHERE v.usuario_id = v_dup
          AND NOT EXISTS (
              SELECT 1 FROM public.votos_evento w
              WHERE w.usuario_id = v_canon AND w.evento_id = v.evento_id
          );
        DELETE FROM public.votos_evento WHERE usuario_id = v_dup;
        UPDATE public.sesiones_lokitrono SET usuario_id = v_canon WHERE usuario_id = v_dup;
        DELETE FROM public.authorized_users WHERE id = v_dup;
    END IF;

    -- Ainhoa: '+34663366786' -> '663366786'
    SELECT id INTO v_canon FROM public.authorized_users WHERE phone = '663366786' LIMIT 1;
    SELECT id INTO v_dup FROM public.authorized_users WHERE phone = '+34663366786' LIMIT 1;
    IF v_canon IS NOT NULL AND v_dup IS NOT NULL AND v_canon <> v_dup THEN
        UPDATE public.votos_evento v
        SET usuario_id = v_canon
        WHERE v.usuario_id = v_dup
          AND NOT EXISTS (
              SELECT 1 FROM public.votos_evento w
              WHERE w.usuario_id = v_canon AND w.evento_id = v.evento_id
          );
        DELETE FROM public.votos_evento WHERE usuario_id = v_dup;
        UPDATE public.sesiones_lokitrono SET usuario_id = v_canon WHERE usuario_id = v_dup;
        DELETE FROM public.authorized_users WHERE id = v_dup;
    END IF;
END;
$$;

-- 3.4 Solo Julio (master) y Ainhoa (superadmin) conservan rango administrativo.
-- Cualquier otra cuenta con rol superadmin/master (incluidas cuentas de
-- despliegue antiguas) se degrada a jugador, conservando sus votos.
UPDATE public.authorized_users
SET role = 'jugador'
WHERE role IN ('superadmin', 'master')
  AND COALESCE(regexp_replace(COALESCE(phone, ''), '[^0-9]', '', 'g'), '')
      NOT IN ('605676002', '663366786');

-- ==============================================================================
-- 4. REINICIO REAL: CONSERVA MASTER/SUPERADMIN Y NO TOCA EL SANDBOX
-- ==============================================================================
-- Borra votos, eventos, juicios, códigos y barrios (salvo Forastero) y conserva
-- master/superadmin. NO elimina maestres, catálogos geográficos, locales de
-- promoción ni consultas del LokiBot. NO toca ninguna tabla sandbox_*.
-- Garantiza que siempre quede al menos un Master; si no hubiera, promociona al
-- superadministrador más antiguo.
CREATE OR REPLACE FUNCTION public.restaurar_competicion_superadmin(
    p_phone TEXT,
    p_pin TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_orden INT := 0;
    v_votos INT := 0;
    v_juicios INT := 0;
    v_codigos INT := 0;
    v_eventos INT := 0;
    v_casas INT := 0;
    v_usuarios INT := 0;
    v_master_promovido TEXT := NULL;
BEGIN
    IF NOT public.lokitrono_es_superadmin(p_phone, p_pin) THEN
        RAISE EXCEPTION 'No autorizado: se requiere una cuenta superadministradora válida.';
    END IF;

    -- Datos reales del Reino.
    DELETE FROM public.orden_sorteo_barrios;
    GET DIAGNOSTICS v_orden = ROW_COUNT;

    DELETE FROM public.votos_evento;
    GET DIAGNOSTICS v_votos = ROW_COUNT;

    DELETE FROM public.juicios;
    GET DIAGNOSTICS v_juicios = ROW_COUNT;

    DELETE FROM public.codigos_diarios;
    GET DIAGNOSTICS v_codigos = ROW_COUNT;

    DELETE FROM public.eventos;
    GET DIAGNOSTICS v_eventos = ROW_COUNT;

    -- Barrios: se conserva únicamente Forastero (no competitivo).
    DELETE FROM public.casas WHERE btrim(nombre) <> 'Forastero';
    GET DIAGNOSTICS v_casas = ROW_COUNT;

    -- Usuarios: se conservan master y superadmin; el resto se elimina.
    DELETE FROM public.authorized_users WHERE role NOT IN ('master', 'superadmin');
    GET DIAGNOSTICS v_usuarios = ROW_COUNT;

    UPDATE public.authorized_users
    SET barrio_asignado = 'Forastero',
        barrio_representado = 'Forastero';

    INSERT INTO public.casas (nombre, lema, emblema, color_heraldo, participa)
    VALUES ('Forastero',
            'Casa de origen para quienes vienen de fuera de los barrios participantes',
            '🌍', '#64748b', false)
    ON CONFLICT (nombre) DO UPDATE SET participa = false;

    -- Salvaguarda: el Reino siempre debe tener un Master.
    IF NOT EXISTS (SELECT 1 FROM public.authorized_users WHERE role = 'master') THEN
        UPDATE public.authorized_users
        SET role = 'master'
        WHERE id = (
            SELECT id FROM public.authorized_users
            WHERE role = 'superadmin'
            ORDER BY created_at ASC NULLS LAST, phone ASC
            LIMIT 1
        )
        RETURNING phone INTO v_master_promovido;
    END IF;

    RETURN jsonb_build_object(
        'orden_sorteo', v_orden,
        'votos_evento', v_votos,
        'juicios', v_juicios,
        'codigos_diarios', v_codigos,
        'eventos', v_eventos,
        'casas_eliminadas', v_casas,
        'usuarios_eliminados', v_usuarios,
        'master_promovido', v_master_promovido
    );
END;
$$;

REVOKE ALL ON FUNCTION public.restaurar_competicion_superadmin(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.restaurar_competicion_superadmin(TEXT, TEXT) TO anon, authenticated;

-- ==============================================================================
-- 5. SANDBOX: TABLAS ESPEJO AISLADAS
-- ==============================================================================
-- Espejo normalizado del Reino. Se accede EXCLUSIVAMENTE por las RPC de abajo
-- (SECURITY DEFINER). No se concede acceso directo a anon/authenticated.
CREATE TABLE IF NOT EXISTS public.sandbox_juegos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL DEFAULT 'Partida Sandbox',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.sandbox_barrios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL UNIQUE,
    orden INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.sandbox_usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone TEXT NOT NULL UNIQUE,
    name TEXT,
    email TEXT,
    role TEXT NOT NULL DEFAULT 'jugador'
        CHECK (role IN ('jugador', 'tronista', 'superadmin', 'master')),
    barrio_representado TEXT,
    barrio_asignado TEXT,
    gender TEXT DEFAULT 'M',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.sandbox_eventos (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    barrio TEXT,
    fecha DATE,
    hora TEXT,
    hora_inicio_votacion TEXT,
    hora_fin_votacion TEXT,
    lugar TEXT,
    estado TEXT NOT NULL DEFAULT 'celebrado',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.sandbox_votos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    maestre_id TEXT NOT NULL,
    maestre_nombre TEXT,
    evento_id TEXT,
    casa_visitada TEXT,
    barrio TEXT,
    nota_festin NUMERIC(4,2),
    nota_caminos NUMERIC(4,2),
    nota_espiritu NUMERIC(4,2),
    fecha_juicio TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.sandbox_juegos   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sandbox_barrios  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sandbox_usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sandbox_eventos  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sandbox_votos    ENABLE ROW LEVEL SECURITY;

-- Sin políticas: nadie accede directamente. Solo las RPC (SECURITY DEFINER).
REVOKE ALL ON public.sandbox_juegos, public.sandbox_barrios, public.sandbox_usuarios,
              public.sandbox_eventos, public.sandbox_votos
FROM PUBLIC, anon, authenticated;

-- Helper: valida que el token pertenezca a un administrador (master/superadmin).
CREATE OR REPLACE FUNCTION public.sandbox_actor_de_token(p_token UUID)
RETURNS public.authorized_users
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT au.*
    FROM public.lokitrono_usuario_de_token(p_token) au
    WHERE au.role IN ('superadmin', 'master')
    LIMIT 1;
$$;

-- ------------------------------------------------------------------
-- 5.1 GUARDAR PARTIDA SANDBOX (crea/edita; solo toca sandbox_*)
-- ------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.sandbox_guardar_partida(
    p_token UUID,
    p_datos JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_actor public.authorized_users;
    v_barrios INT := 0;
    v_usuarios INT := 0;
    v_eventos INT := 0;
    v_votos INT := 0;
    v_nombre TEXT;
BEGIN
    v_actor := public.sandbox_actor_de_token(p_token);
    IF v_actor.id IS NULL THEN
        RAISE EXCEPTION 'No autorizado: se requiere una cuenta administradora válida.';
    END IF;

    -- Reemplazo íntegro de la partida del Sandbox (nunca toca tablas reales).
    DELETE FROM public.sandbox_votos;
    DELETE FROM public.sandbox_eventos;
    DELETE FROM public.sandbox_usuarios;
    DELETE FROM public.sandbox_barrios;
    DELETE FROM public.sandbox_juegos;

    v_nombre := COALESCE(NULLIF(btrim(COALESCE(p_datos->>'nombre', '')), ''), 'Partida Sandbox');
    INSERT INTO public.sandbox_juegos (nombre) VALUES (v_nombre);

    INSERT INTO public.sandbox_barrios (nombre, orden)
    SELECT btrim(b), ord
    FROM jsonb_array_elements_text(COALESCE(p_datos->'barrios', '[]'::jsonb))
         WITH ORDINALITY AS t(b, ord)
    WHERE btrim(COALESCE(b, '')) <> '';
    GET DIAGNOSTICS v_barrios = ROW_COUNT;

    INSERT INTO public.sandbox_usuarios (
        phone, name, email, role, barrio_representado, barrio_asignado, gender
    )
    SELECT
        COALESCE(NULLIF(btrim(COALESCE(u->>'phone', '')), ''), 'sim-' || ord),
        NULLIF(btrim(COALESCE(u->>'name', '')), ''),
        NULLIF(btrim(COALESCE(u->>'email', '')), ''),
        public.lokitrono_validar_rol(u->>'role'),
        NULLIF(btrim(COALESCE(u->>'barrio_representado', '')), ''),
        NULLIF(btrim(COALESCE(u->>'barrio_asignado', '')), ''),
        COALESCE(NULLIF(u->>'gender', ''), 'M')
    FROM jsonb_array_elements(COALESCE(p_datos->'usuarios', '[]'::jsonb))
         WITH ORDINALITY AS t(u, ord);
    GET DIAGNOSTICS v_usuarios = ROW_COUNT;

    INSERT INTO public.sandbox_eventos (
        id, nombre, barrio, fecha, hora, hora_inicio_votacion,
        hora_fin_votacion, lugar, estado
    )
    SELECT
        COALESCE(NULLIF(btrim(COALESCE(e->>'id', '')), ''), 'sim-evt-' || ord),
        COALESCE(NULLIF(btrim(COALESCE(e->>'nombre', '')), ''), 'Evento Sandbox'),
        NULLIF(btrim(COALESCE(e->>'barrio', '')), ''),
        NULLIF(btrim(COALESCE(e->>'fecha', '')), '')::DATE,
        NULLIF(btrim(COALESCE(e->>'hora', '')), ''),
        NULLIF(btrim(COALESCE(e->>'hora_inicio_votacion', '')), ''),
        NULLIF(btrim(COALESCE(e->>'hora_fin_votacion', '')), ''),
        NULLIF(btrim(COALESCE(e->>'lugar', '')), ''),
        COALESCE(NULLIF(btrim(COALESCE(e->>'estado', '')), ''), 'celebrado')
    FROM jsonb_array_elements(COALESCE(p_datos->'eventos', '[]'::jsonb))
         WITH ORDINALITY AS t(e, ord);
    GET DIAGNOSTICS v_eventos = ROW_COUNT;

    INSERT INTO public.sandbox_votos (
        maestre_id, maestre_nombre, evento_id, casa_visitada, barrio,
        nota_festin, nota_caminos, nota_espiritu, fecha_juicio
    )
    SELECT
        COALESCE(btrim(COALESCE(v->>'maestre_id', '')), 'sim'),
        NULLIF(btrim(COALESCE(v->>'maestre_nombre', '')), ''),
        NULLIF(btrim(COALESCE(v->>'evento_id', '')), ''),
        NULLIF(btrim(COALESCE(v->>'casa_visitada', '')), ''),
        NULLIF(btrim(COALESCE(v->>'barrio', '')), ''),
        NULLIF(btrim(COALESCE(v->>'nota_festin', '')), '')::NUMERIC,
        NULLIF(btrim(COALESCE(v->>'nota_caminos', '')), '')::NUMERIC,
        NULLIF(btrim(COALESCE(v->>'nota_espiritu', '')), '')::NUMERIC,
        NULLIF(btrim(COALESCE(v->>'fecha_juicio', '')), '')::TIMESTAMPTZ
    FROM jsonb_array_elements(COALESCE(p_datos->'votos', '[]'::jsonb)) AS t(v);
    GET DIAGNOSTICS v_votos = ROW_COUNT;

    RETURN jsonb_build_object(
        'nombre', v_nombre,
        'barrios', v_barrios,
        'usuarios', v_usuarios,
        'eventos', v_eventos,
        'votos', v_votos
    );
END;
$$;

-- ------------------------------------------------------------------
-- 5.2 CARGAR PARTIDA SANDBOX (solo lee sandbox_*)
-- ------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.sandbox_cargar_partida(p_token UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_actor public.authorized_users;
    v_result JSONB;
BEGIN
    v_actor := public.sandbox_actor_de_token(p_token);
    IF v_actor.id IS NULL THEN
        RAISE EXCEPTION 'No autorizado: se requiere una cuenta administradora válida.';
    END IF;

    SELECT jsonb_build_object(
        'nombre', (SELECT j.nombre FROM public.sandbox_juegos j ORDER BY j.created_at DESC LIMIT 1),
        'barrios', COALESCE((
            SELECT jsonb_agg(b.nombre ORDER BY b.orden, b.nombre)
            FROM public.sandbox_barrios b
        ), '[]'::jsonb),
        'usuarios', COALESCE((
            SELECT jsonb_agg(jsonb_build_object(
                'id', u.id,
                'phone', u.phone,
                'name', u.name,
                'email', u.email,
                'role', u.role,
                'barrio_representado', u.barrio_representado,
                'barrio_asignado', u.barrio_asignado,
                'gender', u.gender
            ) ORDER BY u.name NULLS LAST, u.phone)
            FROM public.sandbox_usuarios u
        ), '[]'::jsonb),
        'eventos', COALESCE((
            SELECT jsonb_agg(jsonb_build_object(
                'id', e.id,
                'nombre', e.nombre,
                'barrio', e.barrio,
                'fecha', e.fecha,
                'hora', e.hora,
                'hora_inicio_votacion', e.hora_inicio_votacion,
                'hora_fin_votacion', e.hora_fin_votacion,
                'lugar', e.lugar,
                'estado', e.estado
            ) ORDER BY e.fecha NULLS LAST, e.id)
            FROM public.sandbox_eventos e
        ), '[]'::jsonb),
        'votos', COALESCE((
            SELECT jsonb_agg(jsonb_build_object(
                'id', v.id,
                'maestre_id', v.maestre_id,
                'maestre_nombre', v.maestre_nombre,
                'evento_id', v.evento_id,
                'casa_visitada', v.casa_visitada,
                'barrio', v.barrio,
                'nota_festin', v.nota_festin,
                'nota_caminos', v.nota_caminos,
                'nota_espiritu', v.nota_espiritu,
                'fecha_juicio', v.fecha_juicio
            ) ORDER BY v.created_at)
            FROM public.sandbox_votos v
        ), '[]'::jsonb)
    ) INTO v_result;

    RETURN v_result;
END;
$$;

-- ------------------------------------------------------------------
-- 5.3 REINICIAR SANDBOX (borra SOLO sandbox_*)
-- ------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.sandbox_reiniciar(p_token UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_actor public.authorized_users;
    v_votos INT := 0;
    v_eventos INT := 0;
    v_usuarios INT := 0;
    v_barrios INT := 0;
    v_juegos INT := 0;
BEGIN
    v_actor := public.sandbox_actor_de_token(p_token);
    IF v_actor.id IS NULL THEN
        RAISE EXCEPTION 'No autorizado: se requiere una cuenta administradora válida.';
    END IF;

    DELETE FROM public.sandbox_votos;    GET DIAGNOSTICS v_votos = ROW_COUNT;
    DELETE FROM public.sandbox_eventos;  GET DIAGNOSTICS v_eventos = ROW_COUNT;
    DELETE FROM public.sandbox_usuarios; GET DIAGNOSTICS v_usuarios = ROW_COUNT;
    DELETE FROM public.sandbox_barrios;  GET DIAGNOSTICS v_barrios = ROW_COUNT;
    DELETE FROM public.sandbox_juegos;   GET DIAGNOSTICS v_juegos = ROW_COUNT;

    RETURN jsonb_build_object(
        'votos_eliminados', v_votos,
        'eventos_eliminados', v_eventos,
        'usuarios_eliminados', v_usuarios,
        'barrios_eliminados', v_barrios,
        'juegos_eliminados', v_juegos
    );
END;
$$;

-- ==============================================================================
-- 6. PERMISOS
-- ==============================================================================
REVOKE ALL ON FUNCTION public.juego_oficial_activo() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.juego_oficial_activo() TO anon, authenticated;

REVOKE ALL ON FUNCTION public.marcar_juego_oficial() FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION public.sandbox_actor_de_token(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.sandbox_guardar_partida(UUID, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.sandbox_guardar_partida(UUID, JSONB) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.sandbox_cargar_partida(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.sandbox_cargar_partida(UUID) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.sandbox_reiniciar(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.sandbox_reiniciar(UUID) TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
