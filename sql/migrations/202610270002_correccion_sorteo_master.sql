-- ============================================================================
-- 202610270002_correccion_sorteo_master.sql
--
-- 1. Asegurar que el sorteo sea realmente aleatorio en cada llamada.
-- 2. Permitir explícitamente al rol 'master' gestionar el sorteo.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.generar_sorteo_barrios_superadmin(p_phone text, p_pin text)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
DECLARE
    v_total INTEGER;
BEGIN
    -- Verificación de autoridad (Superadmin o Master)
    IF NOT public.lokitrono_es_superadmin(p_phone, p_pin) THEN
        RAISE EXCEPTION 'No autorizado: se requiere una cuenta de administración (Superadmin o Master) válida.';
    END IF;

    PERFORM pg_advisory_xact_lock(hashtext('orden_sorteo_barrios'));

    DELETE FROM public.orden_sorteo_barrios WHERE TRUE;

    -- Inserción aleatoria: random() garantiza un orden diferente en cada ejecución.
    INSERT INTO public.orden_sorteo_barrios (
        barrio_id,
        posicion,
        actualizado_en
    )
    SELECT
        c.id,
        ROW_NUMBER() OVER (ORDER BY random()),
        NOW()
    FROM public.casas c
    WHERE c.participa = TRUE;

    GET DIAGNOSTICS v_total = ROW_COUNT;
    RETURN v_total;
END;
$$;

CREATE OR REPLACE FUNCTION public.guardar_orden_sorteo_barrios_superadmin(p_phone text, p_pin text, p_orden uuid[])
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
DECLARE
    v_total INTEGER;
    v_participantes INTEGER;
BEGIN
    -- Verificación de autoridad (Superadmin o Master)
    IF NOT public.lokitrono_es_superadmin(p_phone, p_pin) THEN
        RAISE EXCEPTION 'No autorizado: se requiere una cuenta de administración (Superadmin o Master) válida.';
    END IF;

    IF p_orden IS NULL THEN
        RAISE EXCEPTION 'No se ha recibido el orden de los barrios.';
    END IF;

    PERFORM pg_advisory_xact_lock(hashtext('orden_sorteo_barrios'));

    SELECT COUNT(*) INTO v_participantes FROM public.casas WHERE participa = TRUE;
    SELECT COUNT(*) INTO v_total FROM unnest(p_orden) AS x(id);

    IF v_total <> v_participantes THEN
        RAISE EXCEPTION 'El orden debe incluir todos los barrios participantes, sin omisiones.';
    END IF;

    IF EXISTS (SELECT 1 FROM unnest(p_orden) AS x(id) WHERE x.id IS NULL)
       OR (SELECT COUNT(DISTINCT x.id) FROM unnest(p_orden) AS x(id)) <> v_total THEN
        RAISE EXCEPTION 'El orden contiene identificadores repetidos o vacíos.';
    END IF;

    IF EXISTS (
        SELECT 1 FROM unnest(p_orden) AS x(id)
        LEFT JOIN public.casas c ON c.id = x.id AND c.participa = TRUE
        WHERE c.id IS NULL
    ) THEN
        RAISE EXCEPTION 'El orden contiene barrios inexistentes o que no participan.';
    END IF;

    DELETE FROM public.orden_sorteo_barrios WHERE TRUE;

    INSERT INTO public.orden_sorteo_barrios (
        barrio_id,
        posicion,
        actualizado_en
    )
    SELECT
        x.id,
        x.ord::INTEGER,
        NOW()
    FROM unnest(p_orden) WITH ORDINALITY AS x(id, ord);

    GET DIAGNOSTICS v_total = ROW_COUNT;
    RETURN v_total;
END;
$$;
