-- ============================================================
-- LOKITRONO: RESTAURAR COMPETICIÓN REABRE EL JUEGO
-- Migración: 202610240001
-- Objetivo:
--   Al restaurar la competición, el juego vuelve a su estado inicial.
--   Si estaba finalizado (estado_juego.finalizado = true), los triggers
--   `bloquear_escritura_juego_finalizado` impiden borrar votos, eventos,
--   barrios y usuarios. Por eso se reabre el juego ANTES de borrar.
--   Además se restablecen a 0 los datos de la competición (votos, eventos,
--   códigos, orden del sorteo y barrios excepto Forastero).
-- ============================================================

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
BEGIN
    IF NOT public.lokitrono_es_superadmin(p_phone, p_pin) THEN
        RAISE EXCEPTION 'No autorizado: se requiere una cuenta superadministradora válida.';
    END IF;

    -- Reabrir el juego: sin esto, los triggers de fin de juego bloquearían
    -- los borrados siguientes y la competición no podría restaurarse.
    UPDATE public.estado_juego
    SET finalizado = FALSE,
        finalizado_at = NULL,
        finalizado_por = NULL
    WHERE id = 1;

    -- Votos y orden del sorteo.
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

    RETURN jsonb_build_object(
        'orden_sorteo', v_orden,
        'votos_evento', v_votos,
        'juicios', v_juicios,
        'codigos_diarios', v_codigos,
        'eventos', v_eventos,
        'casas_eliminadas', v_casas,
        'usuarios_eliminados', v_usuarios
    );
END;
$$;

REVOKE ALL ON FUNCTION public.restaurar_competicion_superadmin(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.restaurar_competicion_superadmin(TEXT, TEXT) TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
