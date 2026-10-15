-- ============================================================
-- LOKITRONO: EVENTOS CON VOTACIÓN Y SIN VOTACIÓN
-- Migración: 202610220001
-- Añade a la tabla eventos el indicador `tiene_votacion`. Los
-- eventos con votación se pueden puntuar durante su ventana; los
-- eventos sin votación son meramente informativos (no admiten
-- votos y no cuentan para el campeón final).
-- ============================================================

ALTER TABLE public.eventos
    ADD COLUMN IF NOT EXISTS tiene_votacion BOOLEAN NOT NULL DEFAULT TRUE;

-- Los eventos históricos se consideran "con votación" por defecto.
UPDATE public.eventos SET tiene_votacion = TRUE WHERE tiene_votacion IS NULL;


-- ============================================================
-- CREAR O ACTUALIZAR UN EVENTO (con indicador de votación)
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
        'tiene_votacion', v_resultado.tiene_votacion
    );
END;
$$;

REVOKE ALL
ON FUNCTION public.guardar_evento_superadmin(TEXT, TEXT, JSONB)
FROM PUBLIC, anon, authenticated;

GRANT EXECUTE
ON FUNCTION public.guardar_evento_superadmin(TEXT, TEXT, JSONB)
TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
