-- EL PAPIRO DEL NORTE — SOPORTE DE IMAGEN EN ARTÍCULOS
--
-- Añade la columna imagen_url a public.blog_posts y actualiza la RPC
-- guardar_blog_post_admin para recibirla y persistirla.
-- Configura las políticas de storage para el bucket 'eventos-media' si aplica.

-- ==============================================================================
-- 1. COLUMNA imagen_url
-- ==============================================================================
ALTER TABLE public.blog_posts
    ADD COLUMN IF NOT EXISTS imagen_url TEXT DEFAULT NULL;

-- ==============================================================================
-- 2. RPC GUARDAR / CREAR CRÓNICA CON IMAGEN
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.guardar_blog_post_admin(
    p_token UUID,
    p_post JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
    v_actor public.authorized_users%ROWTYPE;
    v_id UUID;
    v_titulo TEXT := btrim(COALESCE(p_post->>'titulo', ''));
    v_fecha DATE;
    v_categoria TEXT := COALESCE(
        NULLIF(btrim(COALESCE(p_post->>'categoria', '')), ''),
        'cronica'
    );
    v_contenido TEXT := btrim(COALESCE(p_post->>'contenido', ''));
    v_autor TEXT := COALESCE(
        NULLIF(btrim(COALESCE(p_post->>'autor', '')), ''),
        'Cronista del Reino'
    );
    v_imagen_url TEXT := NULLIF(btrim(COALESCE(p_post->>'imagen_url', '')), '');
    v_guardado public.blog_posts%ROWTYPE;
BEGIN
    IF p_token IS NULL THEN
        RAISE EXCEPTION 'No autorizado: falta el token de sesión.';
    END IF;

    v_actor := public.lokitrono_usuario_de_token(p_token);

    IF v_actor IS NULL OR v_actor.role NOT IN ('master', 'superadmin') THEN
        RAISE EXCEPTION 'Solo la administración puede publicar crónicas.';
    END IF;

    IF v_titulo = '' THEN
        RAISE EXCEPTION 'El título de la crónica es obligatorio.';
    END IF;

    IF v_contenido = '' THEN
        RAISE EXCEPTION 'El contenido de la crónica es obligatorio.';
    END IF;

    IF v_categoria NOT IN ('cronica', 'anuncio', 'bando', 'evento', 'entrevista', 'receta', 'otro') THEN
        RAISE EXCEPTION 'La categoría de la crónica no es válida.';
    END IF;

    IF NULLIF(btrim(COALESCE(p_post->>'fecha', '')), '') IS NULL THEN
        v_fecha := CURRENT_DATE;
    ELSE
        v_fecha := (p_post->>'fecha')::date;
    END IF;

    IF p_post ? 'id' AND NULLIF(btrim(COALESCE(p_post->>'id', '')), '') IS NOT NULL THEN
        v_id := (p_post->>'id')::uuid;
        IF NOT EXISTS (SELECT 1 FROM public.blog_posts WHERE id = v_id) THEN
            RAISE EXCEPTION 'La crónica indicada no existe.';
        END IF;
    ELSE
        v_id := gen_random_uuid();
    END IF;

    INSERT INTO public.blog_posts (id, titulo, fecha, categoria, contenido, autor, imagen_url)
    VALUES (v_id, v_titulo, v_fecha, v_categoria, v_contenido, v_autor, v_imagen_url)
    ON CONFLICT (id) DO UPDATE SET
        titulo = EXCLUDED.titulo,
        fecha = EXCLUDED.fecha,
        categoria = EXCLUDED.categoria,
        contenido = EXCLUDED.contenido,
        autor = EXCLUDED.autor,
        imagen_url = EXCLUDED.imagen_url,
        updated_at = NOW()
    RETURNING * INTO v_guardado;

    RETURN jsonb_build_object(
        'id', v_guardado.id,
        'titulo', v_guardado.titulo,
        'fecha', v_guardado.fecha,
        'categoria', v_guardado.categoria,
        'imagen_url', v_guardado.imagen_url
    );
END;
$$;

REVOKE ALL ON FUNCTION public.guardar_blog_post_admin(UUID, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.guardar_blog_post_admin(UUID, JSONB) TO anon, authenticated;
