-- ============================================================
-- LOKITRONO: IMÁGENES DE LOS EVENTOS
-- Migración: 202611010001
-- Añade a `eventos` las URLs del logotipo, los pintxos (plebeyo y
-- real), la pócima, el elixir y la foto del local. Las imágenes se
-- guardan en el bucket público `eventos-media` de Supabase Storage.
-- ============================================================

ALTER TABLE public.eventos
    ADD COLUMN IF NOT EXISTS logo_url TEXT,
    ADD COLUMN IF NOT EXISTS pintxo_plebeyo_url TEXT,
    ADD COLUMN IF NOT EXISTS pintxo_real_url TEXT,
    ADD COLUMN IF NOT EXISTS pocima_url TEXT,
    ADD COLUMN IF NOT EXISTS elixir_url TEXT,
    ADD COLUMN IF NOT EXISTS foto_local_url TEXT;


-- ============================================================
-- CREAR O ACTUALIZAR UN EVENTO (con imágenes)
-- ============================================================

CREATE OR REPLACE FUNCTION public.guardar_evento_superadmin(
    p_phone TEXT,
    p_pin TEXT,
    p_evento JSONB
)
RETURNS JSONB
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_id TEXT;
    v_resultado public.eventos%ROWTYPE;
BEGIN
    IF NOT public.validar_superadmin_eventos(p_phone, p_pin) THEN
        RAISE EXCEPTION
            'No autorizado: se requiere una cuenta superadministradora válida.';
    END IF;

    v_id := NULLIF(btrim(p_evento->>'id'), '');

    IF v_id IS NULL THEN
        RAISE EXCEPTION 'El identificador del evento es obligatorio.';
    END IF;

    IF NULLIF(btrim(p_evento->>'nombre'), '') IS NULL THEN
        RAISE EXCEPTION 'El nombre del evento es obligatorio.';
    END IF;

    IF NULLIF(btrim(p_evento->>'fecha'), '') IS NULL THEN
        RAISE EXCEPTION 'La fecha del evento es obligatoria.';
    END IF;

    IF NULLIF(btrim(p_evento->>'lugar'), '') IS NULL THEN
        RAISE EXCEPTION 'El lugar del evento es obligatorio.';
    END IF;

    INSERT INTO public.eventos (
        id,
        nombre,
        barrio,
        fecha,
        fecha_fin,
        lugar,
        hora,
        hora_fin,
        hora_inicio_votacion,
        hora_fin_votacion,
        fecha_fin_votacion,
        descripcion,
        cerrado_manualmente,
        tiene_votacion,
        logo_url,
        pintxo_plebeyo_url,
        pintxo_real_url,
        pocima_url,
        elixir_url,
        foto_local_url,
        updated_at
    )
    VALUES (
        v_id,
        btrim(p_evento->>'nombre'),
        COALESCE(NULLIF(btrim(p_evento->>'barrio'), ''), 'Reino'),
        (p_evento->>'fecha')::DATE,
        NULLIF(btrim(p_evento->>'fecha_fin'), '')::DATE,
        btrim(p_evento->>'lugar'),
        COALESCE(NULLIF(p_evento->>'hora', ''), '20:00'),
        NULLIF(btrim(p_evento->>'hora_fin'), ''),
        COALESCE(NULLIF(p_evento->>'hora_inicio_votacion', ''), '20:30'),
        COALESCE(NULLIF(p_evento->>'hora_fin_votacion', ''), '23:30'),
        NULLIF(btrim(p_evento->>'fecha_fin_votacion'), '')::DATE,
        COALESCE(p_evento->>'desc', p_evento->>'descripcion', ''),
        COALESCE((p_evento->>'cerrado_manualmente')::BOOLEAN, FALSE),
        COALESCE((p_evento->>'tiene_votacion')::BOOLEAN, TRUE),
        NULLIF(btrim(p_evento->>'logo_url'), ''),
        NULLIF(btrim(p_evento->>'pintxo_plebeyo_url'), ''),
        NULLIF(btrim(p_evento->>'pintxo_real_url'), ''),
        NULLIF(btrim(p_evento->>'pocima_url'), ''),
        NULLIF(btrim(p_evento->>'elixir_url'), ''),
        NULLIF(btrim(p_evento->>'foto_local_url'), ''),
        NOW()
    )
    ON CONFLICT (id)
    DO UPDATE SET
        nombre = EXCLUDED.nombre,
        barrio = EXCLUDED.barrio,
        fecha = EXCLUDED.fecha,
        fecha_fin = EXCLUDED.fecha_fin,
        lugar = EXCLUDED.lugar,
        hora = EXCLUDED.hora,
        hora_fin = EXCLUDED.hora_fin,
        hora_inicio_votacion = EXCLUDED.hora_inicio_votacion,
        hora_fin_votacion = EXCLUDED.hora_fin_votacion,
        fecha_fin_votacion = EXCLUDED.fecha_fin_votacion,
        descripcion = EXCLUDED.descripcion,
        cerrado_manualmente = EXCLUDED.cerrado_manualmente,
        tiene_votacion = EXCLUDED.tiene_votacion,
        logo_url = EXCLUDED.logo_url,
        pintxo_plebeyo_url = EXCLUDED.pintxo_plebeyo_url,
        pintxo_real_url = EXCLUDED.pintxo_real_url,
        pocima_url = EXCLUDED.pocima_url,
        elixir_url = EXCLUDED.elixir_url,
        foto_local_url = EXCLUDED.foto_local_url,
        updated_at = NOW()
    RETURNING * INTO v_resultado;

    RETURN jsonb_build_object(
        'id', v_resultado.id,
        'nombre', v_resultado.nombre,
        'barrio', v_resultado.barrio,
        'fecha', v_resultado.fecha,
        'fecha_fin', v_resultado.fecha_fin,
        'lugar', v_resultado.lugar,
        'hora', v_resultado.hora,
        'hora_fin', v_resultado.hora_fin,
        'hora_inicio_votacion', v_resultado.hora_inicio_votacion,
        'hora_fin_votacion', v_resultado.hora_fin_votacion,
        'fecha_fin_votacion', v_resultado.fecha_fin_votacion,
        'desc', v_resultado.descripcion,
        'cerrado_manualmente', v_resultado.cerrado_manualmente,
        'tiene_votacion', v_resultado.tiene_votacion,
        'logo_url', v_resultado.logo_url,
        'pintxo_plebeyo_url', v_resultado.pintxo_plebeyo_url,
        'pintxo_real_url', v_resultado.pintxo_real_url,
        'pocima_url', v_resultado.pocima_url,
        'elixir_url', v_resultado.elixir_url,
        'foto_local_url', v_resultado.foto_local_url
    );
END;
$$;

REVOKE ALL
ON FUNCTION public.guardar_evento_superadmin(TEXT, TEXT, JSONB)
FROM PUBLIC, anon, authenticated;

GRANT EXECUTE
ON FUNCTION public.guardar_evento_superadmin(TEXT, TEXT, JSONB)
TO anon, authenticated;


-- ============================================================
-- STORAGE: BUCKET PÚBLICO PARA LAS IMÁGENES DEL EVENTO
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'eventos-media',
    'eventos-media',
    TRUE,
    5242880,
    ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE
SET public = TRUE,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS eventos_media_select ON storage.objects;
CREATE POLICY eventos_media_select
    ON storage.objects
    FOR SELECT
    TO anon, authenticated
    USING (bucket_id = 'eventos-media');

DROP POLICY IF EXISTS eventos_media_insert ON storage.objects;
CREATE POLICY eventos_media_insert
    ON storage.objects
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (bucket_id = 'eventos-media');

DROP POLICY IF EXISTS eventos_media_update ON storage.objects;
CREATE POLICY eventos_media_update
    ON storage.objects
    FOR UPDATE
    TO anon, authenticated
    USING (bucket_id = 'eventos-media')
    WITH CHECK (bucket_id = 'eventos-media');

DROP POLICY IF EXISTS eventos_media_delete ON storage.objects;
CREATE POLICY eventos_media_delete
    ON storage.objects
    FOR DELETE
    TO anon, authenticated
    USING (bucket_id = 'eventos-media');

NOTIFY pgrst, 'reload schema';
