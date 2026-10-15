-- ============================================================================
-- 202610240003_safeupdate_delete_update_where_true.sql
--
-- FIX: el rol `authenticator` de PostgREST carga la librería `safeupdate`
-- (rolconfig: session_preload_libraries=supautils, safeupdate). Esa librería
-- rechaza cualquier DELETE/UPDATE sin cláusula WHERE, incluso dentro de
-- funciones SECURITY DEFINER, con el error:
--     {"code":"21000","message":"DELETE requires a WHERE clause"}
--
-- Cinco RPC de la corte usaban `DELETE FROM tabla;` / `UPDATE tabla SET ...;`
-- sin WHERE, por lo que fallaban SIEMPRE vía PostgREST (sorteo, restaurar
-- competición y sincronización del Sandbox). Se redefinen añadiendo
-- `WHERE TRUE` (sin cambiar datos, firma, permisos ni semántica de seguridad).
--
-- Afecta a:
--   * generar_sorteo_barrios_superadmin
--   * guardar_orden_sorteo_barrios_superadmin
--   * restaurar_competicion_superadmin
--   * sandbox_guardar_partida
--   * sandbox_reiniciar
-- ============================================================================

CREATE OR REPLACE FUNCTION public.generar_sorteo_barrios_superadmin(p_phone text, p_pin text)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    v_total INTEGER;
BEGIN
    IF NOT COALESCE(
        public.validar_superadmin_eventos(p_phone, p_pin),
        FALSE
    ) THEN
        RAISE EXCEPTION 'No autorizado: se requiere una cuenta superadministradora válida.';
    END IF;

    PERFORM pg_advisory_xact_lock(
        hashtext('orden_sorteo_barrios')
    );

    DELETE FROM public.orden_sorteo_barrios WHERE TRUE;

    INSERT INTO public.orden_sorteo_barrios (
        barrio_id,
        posicion,
        actualizado_en
    )
    SELECT
        c.id,
        ROW_NUMBER() OVER (ORDER BY random())::INTEGER,
        NOW()
    FROM public.casas c
    WHERE c.participa = TRUE;

    GET DIAGNOSTICS v_total = ROW_COUNT;

    RETURN v_total;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.guardar_orden_sorteo_barrios_superadmin(p_phone text, p_pin text, p_orden uuid[])
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    v_total INTEGER;
    v_participantes INTEGER;
BEGIN
    IF NOT COALESCE(
        public.validar_superadmin_eventos(p_phone, p_pin),
        FALSE
    ) THEN
        RAISE EXCEPTION 'No autorizado: se requiere una cuenta superadministradora válida.';
    END IF;

    IF p_orden IS NULL THEN
        RAISE EXCEPTION 'No se ha recibido el orden de los barrios.';
    END IF;

    PERFORM pg_advisory_xact_lock(
        hashtext('orden_sorteo_barrios')
    );

    SELECT COUNT(*)
    INTO v_participantes
    FROM public.casas
    WHERE participa = TRUE;

    SELECT COUNT(*)
    INTO v_total
    FROM unnest(p_orden) AS x(id);

    IF v_total <> v_participantes THEN
        RAISE EXCEPTION 'El orden debe incluir todos los barrios participantes, sin omisiones.';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM unnest(p_orden) AS x(id)
        WHERE x.id IS NULL
    ) OR (
        SELECT COUNT(DISTINCT x.id)
        FROM unnest(p_orden) AS x(id)
    ) <> v_total THEN
        RAISE EXCEPTION 'El orden contiene identificadores repetidos o vacíos.';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM unnest(p_orden) AS x(id)
        LEFT JOIN public.casas c
            ON c.id = x.id
           AND c.participa = TRUE
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
$function$
;

CREATE OR REPLACE FUNCTION public.restaurar_competicion_superadmin(p_phone text, p_pin text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
    DELETE FROM public.orden_sorteo_barrios WHERE TRUE;
    GET DIAGNOSTICS v_orden = ROW_COUNT;

    DELETE FROM public.votos_evento WHERE TRUE;
    GET DIAGNOSTICS v_votos = ROW_COUNT;

    DELETE FROM public.juicios WHERE TRUE;
    GET DIAGNOSTICS v_juicios = ROW_COUNT;

    DELETE FROM public.codigos_diarios WHERE TRUE;
    GET DIAGNOSTICS v_codigos = ROW_COUNT;

    DELETE FROM public.eventos WHERE TRUE;
    GET DIAGNOSTICS v_eventos = ROW_COUNT;

    -- Barrios: se conserva únicamente Forastero (no competitivo).
    DELETE FROM public.casas WHERE btrim(nombre) <> 'Forastero';
    GET DIAGNOSTICS v_casas = ROW_COUNT;

    -- Usuarios: se conservan master y superadmin; el resto se elimina.
    DELETE FROM public.authorized_users WHERE role NOT IN ('master', 'superadmin');
    GET DIAGNOSTICS v_usuarios = ROW_COUNT;

    UPDATE public.authorized_users
    SET barrio_asignado = 'Forastero',
        barrio_representado = 'Forastero'
    WHERE TRUE;

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
$function$
;

CREATE OR REPLACE FUNCTION public.sandbox_guardar_partida(p_token uuid, p_datos jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
    DELETE FROM public.sandbox_votos WHERE TRUE;
    DELETE FROM public.sandbox_eventos WHERE TRUE;
    DELETE FROM public.sandbox_usuarios WHERE TRUE;
    DELETE FROM public.sandbox_barrios WHERE TRUE;
    DELETE FROM public.sandbox_juegos WHERE TRUE;

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
$function$
;

CREATE OR REPLACE FUNCTION public.sandbox_reiniciar(p_token uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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

    DELETE FROM public.sandbox_votos    WHERE TRUE; GET DIAGNOSTICS v_votos = ROW_COUNT;
    DELETE FROM public.sandbox_eventos  WHERE TRUE; GET DIAGNOSTICS v_eventos = ROW_COUNT;
    DELETE FROM public.sandbox_usuarios WHERE TRUE; GET DIAGNOSTICS v_usuarios = ROW_COUNT;
    DELETE FROM public.sandbox_barrios  WHERE TRUE; GET DIAGNOSTICS v_barrios = ROW_COUNT;
    DELETE FROM public.sandbox_juegos   WHERE TRUE; GET DIAGNOSTICS v_juegos = ROW_COUNT;

    RETURN jsonb_build_object(
        'votos_eliminados', v_votos,
        'eventos_eliminados', v_eventos,
        'usuarios_eliminados', v_usuarios,
        'barrios_eliminados', v_barrios,
        'juegos_eliminados', v_juegos
    );
END;
$function$
;
