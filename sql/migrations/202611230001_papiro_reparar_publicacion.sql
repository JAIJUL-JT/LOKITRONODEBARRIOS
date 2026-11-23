-- EL PAPIRO DEL NORTE — REPARACIÓN DE LA PUBLICACIÓN DE CRÓNICAS
--
-- Garantiza que la tabla blog_posts tiene todas las columnas necesarias
-- (categoria, imagen_url) y que la función guardar_blog_post_admin está
-- actualizada con la versión que las soporta. Idempotente: seguro de
-- aplicar aunque ya existan las columnas o la función.

-- ==============================================================================
-- 1. COLUMNAS: categoria e imagen_url (idempotentes con ADD COLUMN IF NOT EXISTS)
-- ==============================================================================
ALTER TABLE public.blog_posts
    ADD COLUMN IF NOT EXISTS categoria TEXT NOT NULL DEFAULT 'cronica';

ALTER TABLE public.blog_posts
    DROP CONSTRAINT IF EXISTS blog_posts_categoria_check;

ALTER TABLE public.blog_posts
    ADD CONSTRAINT blog_posts_categoria_check
    CHECK (categoria IN ('cronica', 'anuncio', 'bando', 'evento', 'entrevista', 'receta', 'otro'));

ALTER TABLE public.blog_posts
    ADD COLUMN IF NOT EXISTS imagen_url TEXT DEFAULT NULL;

-- Índice de apoyo si no existe
CREATE INDEX IF NOT EXISTS blog_posts_categoria_fecha_idx
    ON public.blog_posts (categoria, fecha DESC, created_at DESC);

-- ==============================================================================
-- 2. RPC GUARDAR / CREAR CRÓNICA — versión completa con imagen_url y categoria
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
        titulo      = EXCLUDED.titulo,
        fecha       = EXCLUDED.fecha,
        categoria   = EXCLUDED.categoria,
        contenido   = EXCLUDED.contenido,
        autor       = EXCLUDED.autor,
        imagen_url  = EXCLUDED.imagen_url,
        updated_at  = NOW()
    RETURNING * INTO v_guardado;

    RETURN jsonb_build_object(
        'id',         v_guardado.id,
        'titulo',     v_guardado.titulo,
        'fecha',      v_guardado.fecha,
        'categoria',  v_guardado.categoria,
        'imagen_url', v_guardado.imagen_url
    );
END;
$$;

REVOKE ALL ON FUNCTION public.guardar_blog_post_admin(UUID, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.guardar_blog_post_admin(UUID, JSONB) TO anon, authenticated;

-- ==============================================================================
-- 3. RPC ELIMINAR CRÓNICA — sin cambios, garantizar permisos
-- ==============================================================================
REVOKE ALL ON FUNCTION public.eliminar_blog_post_admin(UUID, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.eliminar_blog_post_admin(UUID, UUID) TO anon, authenticated;

-- ==============================================================================
-- 4. RLS: Reconfirmar lectura pública y bloquear escritura directa
-- ==============================================================================
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS blog_posts_lectura_publica ON public.blog_posts;
CREATE POLICY blog_posts_lectura_publica
    ON public.blog_posts
    FOR SELECT
    USING (TRUE);

REVOKE INSERT, UPDATE, DELETE ON public.blog_posts FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.blog_posts TO anon, authenticated;
