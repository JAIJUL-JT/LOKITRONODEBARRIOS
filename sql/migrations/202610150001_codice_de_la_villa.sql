-- Códice de la Villa: nueva ponderación de la clasificación feudal.
--
-- La votación pasa de «Festín 50% / Caminos 25% / Espíritu 25%» a tres
-- disciplinas del Códice de la Villa:
--   Ocio Hostelero: 50%, Accesibilidad: 20%, Ambiente de Barrio: 30%
-- Se mantiene la regularización bayesiana con umbral K = 3.0 (Ley II).
--
-- No exige migración previa; solo recrea la función calcular_ranking().

-- ==============================================================================
-- 1. LEY II DE BILBAO: calcular_ranking() CON PONDERACIÓN DEL CÓDICE DE LA VILLA
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.calcular_ranking()
RETURNS TABLE (
    posicion BIGINT,
    casa_id UUID,
    nombre TEXT,
    lema TEXT,
    emblema TEXT,
    color_heraldo TEXT,
    total_juicios BIGINT,
    media_festin NUMERIC(4,2),
    media_caminos NUMERIC(4,2),
    media_espiritu NUMERIC(4,2),
    puntuacion_final NUMERIC(4,2)
) LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
    v_media_global NUMERIC(4,2);
    v_umbral_confianza NUMERIC := 3.0;
BEGIN
    SELECT COALESCE(ROUND(AVG(0.50 * j.festin + 0.20 * j.caminos + 0.30 * j.espiritu), 2), 7.00)
    INTO v_media_global
    FROM public.juicios j
    JOIN public.casas c ON c.id = j.casa_visitada
    WHERE c.participa;

    RETURN QUERY
    WITH metricas_casa AS (
        SELECT
            c.id,
            c.nombre,
            c.lema,
            c.emblema,
            c.color_heraldo,
            COUNT(j.id) AS recuento_juicios,
            ROUND(AVG(j.festin), 2) AS prom_festin,
            ROUND(AVG(j.caminos), 2) AS prom_caminos,
            ROUND(AVG(j.espiritu), 2) AS prom_espiritu,
            ROUND(AVG(0.50 * j.festin + 0.20 * j.caminos + 0.30 * j.espiritu), 2) AS prom_crudo
        FROM public.casas c
        LEFT JOIN public.juicios j ON c.id = j.casa_visitada
        WHERE c.participa
        GROUP BY c.id, c.nombre, c.lema, c.emblema, c.color_heraldo
    ),
    ranking_calculado AS (
        SELECT
            m.id AS r_casa_id,
            m.nombre AS r_nombre,
            m.lema AS r_lema,
            m.emblema AS r_emblema,
            m.color_heraldo AS r_color_heraldo,
            m.recuento_juicios AS r_total_juicios,
            COALESCE(m.prom_festin, 0.00) AS r_media_festin,
            COALESCE(m.prom_caminos, 0.00) AS r_media_caminos,
            COALESCE(m.prom_espiritu, 0.00) AS r_media_espiritu,
            CASE
                WHEN m.recuento_juicios = 0 THEN 0.00
                ELSE ROUND(
                    ((m.recuento_juicios * m.prom_crudo) + (v_umbral_confianza * v_media_global)) /
                    (m.recuento_juicios + v_umbral_confianza),
                    2
                )
            END AS r_puntuacion_final
        FROM metricas_casa m
    )
    SELECT
        ROW_NUMBER() OVER(ORDER BY r_puntuacion_final DESC, r_total_juicios DESC, r_nombre ASC) AS posicion,
        r_casa_id,
        r_nombre,
        r_lema,
        r_emblema,
        r_color_heraldo,
        r_total_juicios,
        r_media_festin,
        r_media_caminos,
        r_media_espiritu,
        r_puntuacion_final
    FROM ranking_calculado;
END;
$$;