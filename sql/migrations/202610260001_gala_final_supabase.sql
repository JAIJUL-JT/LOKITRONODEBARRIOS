-- GRAN GALA FINAL: CONFIGURACIÓN PERSISTENTE EN EL REINO
--
-- La configuración de la Gala (título, lugar, fecha, premio y si está
-- publicada) vivía solo en localStorage, por lo que cada navegador tenía su
-- propia copia y los maestres nunca veían la Gala publicada por la corte.
--
-- Ahora reside en una única fila de public.config_gala_final. La lectura es
-- pública (la convocatoria es información para todos los maestres) mediante
-- RPC SIN token; la escritura y el borrado exigen token de sesión con rol
-- superadmin o master. No hay acceso directo a la tabla.
--
-- Aplicar con: psql "$POSTGRES_URL_NON_POOLING" -f sql/migrations/202610260001_gala_final_supabase.sql

-- ==============================================================================
-- 1. TABLA config_gala_final (fila única id = 1)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.config_gala_final (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    titulo TEXT NOT NULL,
    lugar TEXT NOT NULL DEFAULT '',
    fecha TEXT,
    premio TEXT NOT NULL DEFAULT '',
    publicada BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 2. RLS: SIN ACCESO DIRECTO (solo mediante RPC SECURITY DEFINER)
-- ==============================================================================
ALTER TABLE public.config_gala_final ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS config_gala_final_no_acceso ON public.config_gala_final;

CREATE POLICY config_gala_final_no_acceso
    ON public.config_gala_final
    FOR ALL
    USING (FALSE)
    WITH CHECK (FALSE);

REVOKE ALL ON public.config_gala_final FROM PUBLIC, anon, authenticated;

-- ==============================================================================
-- 3. RPC LECTURA PÚBLICA: gala_final_config_actual()
--    Devuelve la configuración publicada, o NULL si no hay ninguna.
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.gala_final_config_actual()
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, extensions
AS $$
    SELECT to_jsonb(g)
    FROM (
        SELECT titulo, lugar, fecha, premio, publicada
        FROM public.config_gala_final
        WHERE id = 1 AND publicada IS TRUE
    ) AS g;
$$;

REVOKE ALL ON FUNCTION public.gala_final_config_actual() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.gala_final_config_actual() TO anon, authenticated;

-- ==============================================================================
-- 4. RPC GUARDAR / PUBLICAR (token, SOLO ADMINISTRACIÓN)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.guardar_gala_final(
    p_token UUID,
    p_config JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
    v_actor public.authorized_users%ROWTYPE;
    v_titulo TEXT := btrim(COALESCE(p_config->>'titulo', ''));
    v_lugar TEXT := btrim(COALESCE(p_config->>'lugar', ''));
    v_fecha TEXT := NULLIF(btrim(COALESCE(p_config->>'fecha', '')), '');
    v_premio TEXT := btrim(COALESCE(p_config->>'premio', ''));
    v_publicada BOOLEAN := COALESCE((p_config->>'publicada')::boolean, TRUE);
    v_guardado public.config_gala_final%ROWTYPE;
BEGIN
    IF p_token IS NULL THEN
        RAISE EXCEPTION 'No autorizado: falta el token de sesión.';
    END IF;

    v_actor := public.lokitrono_usuario_de_token(p_token);
    IF v_actor IS NULL OR v_actor.role NOT IN ('superadmin', 'master') THEN
        RAISE EXCEPTION 'Solo la administración de la corte puede publicar la Gala Final.';
    END IF;

    IF v_titulo = '' THEN
        RAISE EXCEPTION 'El título de la Gala Final es obligatorio.';
    END IF;

    INSERT INTO public.config_gala_final (id, titulo, lugar, fecha, premio, publicada, updated_at)
    VALUES (1, v_titulo, v_lugar, v_fecha, v_premio, v_publicada, NOW())
    ON CONFLICT (id) DO UPDATE SET
        titulo = EXCLUDED.titulo,
        lugar = EXCLUDED.lugar,
        fecha = EXCLUDED.fecha,
        premio = EXCLUDED.premio,
        publicada = EXCLUDED.publicada,
        updated_at = NOW()
    RETURNING * INTO v_guardado;

    RETURN jsonb_build_object(
        'titulo', v_guardado.titulo,
        'lugar', v_guardado.lugar,
        'fecha', v_guardado.fecha,
        'premio', v_guardado.premio,
        'publicada', v_guardado.publicada
    );
END;
$$;

REVOKE ALL ON FUNCTION public.guardar_gala_final(UUID, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.guardar_gala_final(UUID, JSONB) TO anon, authenticated;

-- ==============================================================================
-- 5. RPC BORRAR / REINICIAR (token, SOLO ADMINISTRACIÓN)
--    Marca la Gala como NO publicada (sin borrar la fila), de modo que vuelve
--    a quedar oculta a los maestres hasta que se publique de nuevo.
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.borrar_gala_final(
    p_token UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
    v_actor public.authorized_users%ROWTYPE;
    v_resultado BOOLEAN;
BEGIN
    IF p_token IS NULL THEN
        RAISE EXCEPTION 'No autorizado: falta el token de sesión.';
    END IF;

    v_actor := public.lokitrono_usuario_de_token(p_token);
    IF v_actor IS NULL OR v_actor.role NOT IN ('superadmin', 'master') THEN
        RAISE EXCEPTION 'Solo la administración de la corte puede reiniciar la Gala Final.';
    END IF;

    DELETE FROM public.config_gala_final WHERE id = 1
    RETURNING TRUE INTO v_resultado;

    RETURN COALESCE(v_resultado, FALSE);
END;
$$;

REVOKE ALL ON FUNCTION public.borrar_gala_final(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.borrar_gala_final(UUID) TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
