-- LOCALES PROMOCIONADOS (SEDES DE LOS EVENTOS)
--
-- Sección privada de promoción de los locales donde se celebran los eventos.
-- De momento SOLO el Trono Mayor (rol master) la gestiona y la consulta:
-- el modelo de cobro/donación y la facturación aún están por definir
-- (asociación sin ánimo de lucro). Cada local aporta nombre, dirección,
-- redes sociales, foto, y una fecha/hora propia de evento para la cuenta atrás
-- («cuándo se celebrará el evento en el local»), además de un sello de
-- donación confirmada por el master.
--
-- Acceso: sin SELECT público directo. Las lecturas se hacen por token de
-- sesión (listar_locales_promocion_token) y las escrituras por teléfono+PIN
-- (guardar/eliminar/marcar_donacion), todas RPC SECURITY DEFINER que exigen
-- el rol 'master'. La promoción es visible solo para el master hasta que se
-- defina el encaje legal y el modo de cobro.
--
-- Almacenamiento: se crea un bucket público 'locales-promocion' para las
-- fotos, con lectura anónima y subida limitada (anónima mientras la sección
-- sea privada; se recomienda restringir cuando se abra al público).

-- ==============================================================================
-- 1. TABLA locales_promocion
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.locales_promocion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    direccion TEXT NOT NULL DEFAULT '',
    redes JSONB NOT NULL DEFAULT '[]',
    foto_url TEXT NOT NULL DEFAULT '',
    fecha_evento DATE,
    hora_evento TEXT,
    donacion_confirmada BOOLEAN NOT NULL DEFAULT FALSE,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    orden INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS locales_promocion_activo_idx
    ON public.locales_promocion (activo, donacion_confirmada, orden);

-- ==============================================================================
-- 2. RLS: NADIE ACCEDE DIRECTAMENTE (solo mediante RPC SECURITY DEFINER)
-- ==============================================================================
ALTER TABLE public.locales_promocion ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS locales_promocion_no_acceso
    ON public.locales_promocion;

CREATE POLICY locales_promocion_no_acceso
    ON public.locales_promocion
    FOR ALL
    USING (FALSE)
    WITH CHECK (FALSE);

REVOKE ALL
ON public.locales_promocion
FROM PUBLIC, anon, authenticated;

-- ==============================================================================
-- 3. RPC LISTAR (por token de sesión, SOLO MASTER)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.listar_locales_promocion_token(
    p_token UUID
)
RETURNS TABLE (
    id UUID,
    nombre TEXT,
    direccion TEXT,
    redes JSONB,
    foto_url TEXT,
    fecha_evento DATE,
    hora_evento TEXT,
    donacion_confirmada BOOLEAN,
    activo BOOLEAN,
    orden INT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
    v_actor public.authorized_users%ROWTYPE;
BEGIN
    IF p_token IS NULL THEN
        RAISE EXCEPTION 'No autorizado: falta el token de sesión.';
    END IF;

    v_actor := public.lokitrono_usuario_de_token(p_token);

    IF v_actor IS NULL OR v_actor.role <> 'master' THEN
        RAISE EXCEPTION 'Solo el Trono Mayor puede consultar los locales promocionados.';
    END IF;

    RETURN QUERY
    SELECT lp.id, lp.nombre, lp.direccion, lp.redes, lp.foto_url,
           lp.fecha_evento, lp.hora_evento,
           lp.donacion_confirmada, lp.activo, lp.orden
    FROM public.locales_promocion lp
    ORDER BY lp.orden ASC NULLS LAST, lp.nombre ASC;
END;
$$;

REVOKE ALL ON FUNCTION public.listar_locales_promocion_token(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.listar_locales_promocion_token(UUID) TO anon, authenticated;

-- ==============================================================================
-- 4. RPC GUARDAR / CREAR LOCAL (teléfono+PIN, SOLO MASTER)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.guardar_local_promocion_master(
    p_phone TEXT,
    p_pin TEXT,
    p_local JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
    v_actor TEXT;
    v_id UUID;
    v_nombre TEXT := btrim(COALESCE(p_local->>'nombre', ''));
    v_direccion TEXT := btrim(COALESCE(p_local->>'direccion', ''));
    v_redes JSONB := COALESCE(p_local->'redes', '[]'::jsonb);
    v_foto TEXT := btrim(COALESCE(p_local->>'foto_url', ''));
    v_fecha DATE;
    v_hora TEXT;
    v_donacion BOOLEAN := COALESCE((p_local->>'donacion_confirmada')::boolean, FALSE);
    v_activo BOOLEAN := COALESCE((p_local->>'activo')::boolean, TRUE);
    v_orden INT := COALESCE((p_local->>'orden')::integer, 0);
    v_guardado public.locales_promocion%ROWTYPE;
BEGIN
    v_actor := public.lokitrono_rol_autenticado(p_phone, p_pin);
    IF v_actor IS NULL OR v_actor <> 'master' THEN
        RAISE EXCEPTION 'Solo el Trono Mayor puede gestionar los locales promocionados.';
    END IF;

    IF v_nombre = '' THEN
        RAISE EXCEPTION 'El nombre del local es obligatorio.';
    END IF;

    IF p_local ? 'id' AND p_local->>'id' IS NOT NULL AND p_local->>'id' <> '' THEN
        v_id := (p_local->>'id')::uuid;
        IF NOT EXISTS (SELECT 1 FROM public.locales_promocion WHERE id = v_id) THEN
            RAISE EXCEPTION 'El local indicado no existe.';
        END IF;
    ELSE
        v_id := gen_random_uuid();
    END IF;

    IF v_foto IS NULL THEN v_foto := ''; END IF;

    IF p_local->>'fecha_evento' IS NOT NULL AND p_local->>'fecha_evento' <> '' THEN
        v_fecha := (p_local->>'fecha_evento')::date;
    END IF;

    v_hora := NULLIF(btrim(COALESCE(p_local->>'hora_evento', '')), '');
    IF (v_fecha IS NULL) <> (v_hora IS NULL) THEN
        RAISE EXCEPTION 'La fecha y la hora del evento deben indicarse juntas.';
    END IF;

    -- Normalizar redes: se admiten objetos {nombre, url}, {label, url} o strings "URL".
    SELECT COALESCE(jsonb_agg(n), '[]'::jsonb) INTO v_redes
    FROM (
        SELECT CASE
            WHEN jsonb_typeof(item) = 'string'
                THEN jsonb_build_object('nombre', '', 'url', btrim(item #>> '{}'))
            ELSE jsonb_build_object(
                'nombre', COALESCE(NULLIF(btrim(COALESCE(item->>'nombre', item->>'label', '')), ''), ''),
                'url', btrim(COALESCE(item->>'url', ''))
            )
        END AS n
        FROM jsonb_array_elements(
            CASE WHEN jsonb_typeof(v_redes) = 'array' THEN v_redes ELSE '[]'::jsonb END
        ) AS item
        WHERE btrim(COALESCE(item->>'url', CASE WHEN jsonb_typeof(item) = 'string' THEN item #>> '{}' ELSE '' END)) <> ''
    ) AS redes;

    INSERT INTO public.locales_promocion (
        id, nombre, direccion, redes, foto_url, fecha_evento, hora_evento,
        donacion_confirmada, activo, orden
    ) VALUES (
        v_id, v_nombre, v_direccion, v_redes, v_foto, v_fecha, NULLIF(v_hora, ''),
        v_donacion, v_activo, v_orden
    )
    ON CONFLICT (id) DO UPDATE SET
        nombre = EXCLUDED.nombre,
        direccion = EXCLUDED.direccion,
        redes = EXCLUDED.redes,
        foto_url = EXCLUDED.foto_url,
        fecha_evento = EXCLUDED.fecha_evento,
        hora_evento = EXCLUDED.hora_evento,
        donacion_confirmada = EXCLUDED.donacion_confirmada,
        activo = EXCLUDED.activo,
        orden = EXCLUDED.orden,
        updated_at = NOW()
    RETURNING * INTO v_guardado;

    RETURN jsonb_build_object(
        'id', v_guardado.id,
        'nombre', v_guardado.nombre,
        'donacion_confirmada', v_guardado.donacion_confirmada
    );
END;
$$;

REVOKE ALL ON FUNCTION public.guardar_local_promocion_master(TEXT, TEXT, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.guardar_local_promocion_master(TEXT, TEXT, JSONB) TO anon, authenticated;

-- ==============================================================================
-- 5. RPC MARCAR DONACIÓN (teléfono+PIN, SOLO MASTER)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.marcar_donacion_local_master(
    p_phone TEXT,
    p_pin TEXT,
    p_local_id UUID,
    p_confirmada BOOLEAN
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
    v_actor TEXT;
    v_resultado BOOLEAN;
BEGIN
    v_actor := public.lokitrono_rol_autenticado(p_phone, p_pin);
    IF v_actor IS NULL OR v_actor <> 'master' THEN
        RAISE EXCEPTION 'Solo el Trono Mayor puede confirmar las donaciones de los locales.';
    END IF;

    IF p_local_id IS NULL THEN
        RAISE EXCEPTION 'Debes indicar el local.';
    END IF;

    UPDATE public.locales_promocion
    SET donacion_confirmada = COALESCE(p_confirmada, FALSE),
        updated_at = NOW()
    WHERE id = p_local_id
    RETURNING TRUE INTO v_resultado;

    IF v_resultado IS NULL THEN
        RAISE EXCEPTION 'No se ha encontrado el local indicado.';
    END IF;

    RETURN v_resultado;
END;
$$;

REVOKE ALL ON FUNCTION public.marcar_donacion_local_master(TEXT, TEXT, UUID, BOOLEAN) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.marcar_donacion_local_master(TEXT, TEXT, UUID, BOOLEAN) TO anon, authenticated;

-- ==============================================================================
-- 6. RPC ELIMINAR LOCAL (teléfono+PIN, SOLO MASTER)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.eliminar_local_promocion_master(
    p_phone TEXT,
    p_pin TEXT,
    p_local_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
    v_actor TEXT;
    v_resultado BOOLEAN;
BEGIN
    v_actor := public.lokitrono_rol_autenticado(p_phone, p_pin);
    IF v_actor IS NULL OR v_actor <> 'master' THEN
        RAISE EXCEPTION 'Solo el Trono Mayor puede eliminar locales promocionados.';
    END IF;

    IF p_local_id IS NULL THEN
        RAISE EXCEPTION 'Debes indicar el local.';
    END IF;

    DELETE FROM public.locales_promocion WHERE id = p_local_id
    RETURNING TRUE INTO v_resultado;

    IF v_resultado IS NULL THEN
        RAISE EXCEPTION 'No se ha encontrado el local indicado.';
    END IF;

    RETURN v_resultado;
END;
$$;

REVOKE ALL ON FUNCTION public.eliminar_local_promocion_master(TEXT, TEXT, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.eliminar_local_promocion_master(TEXT, TEXT, UUID) TO anon, authenticated;

-- ==============================================================================
-- 7. STORAGE: BUCKET PÚBLICO PARA LAS FOTOS
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'locales-promocion',
    'locales-promocion',
    TRUE,
    5242880,
    ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE
SET public = TRUE,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS locales_promocion_select ON storage.objects;
CREATE POLICY locales_promocion_select
    ON storage.objects
    FOR SELECT
    TO anon, authenticated
    USING (bucket_id = 'locales-promocion');

DROP POLICY IF EXISTS locales_promocion_insert ON storage.objects;
CREATE POLICY locales_promocion_insert
    ON storage.objects
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (bucket_id = 'locales-promocion');

NOTIFY pgrst, 'reload schema';