-- EL PAPIRO DEL NORTE — CRÓNICAS Y ANUNCIOS OFICIALES
--
-- Lectura pública (cualquier maestre puede consultar las crónicas) y
-- escritura exclusiva de la administración (roles master y superadmin).
--
-- Acceso:
--   * SELECT público mediante RLS (anon/authenticated) para el tablero de
--     lectura «📜 El Papiro del Norte».
--   * INSERT/UPDATE/DELETE revocados; se realizan mediante las RPC
--     SECURITY DEFINER guardar_blog_post_admin y eliminar_blog_post_admin,
--     que validan el token de sesión y el rol del usuario.

-- ==============================================================================
-- 1. TABLA blog_posts
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo TEXT NOT NULL,
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    contenido TEXT NOT NULL,
    autor TEXT NOT NULL DEFAULT 'Cronista del Reino',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS blog_posts_fecha_idx
    ON public.blog_posts (fecha DESC, created_at DESC);

-- ==============================================================================
-- 2. RLS: LECTURA PÚBLICA, ESCRITURA SOLO POR RPC
-- ==============================================================================
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS blog_posts_lectura_publica
    ON public.blog_posts;

CREATE POLICY blog_posts_lectura_publica
    ON public.blog_posts
    FOR SELECT
    USING (TRUE);

REVOKE INSERT, UPDATE, DELETE
ON public.blog_posts
FROM PUBLIC, anon, authenticated;

GRANT SELECT
ON public.blog_posts
TO anon, authenticated;

-- ==============================================================================
-- 3. RPC GUARDAR / CREAR CRÓNICA (token de sesión, SOLO ADMINISTRACIÓN)
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
    v_contenido TEXT := btrim(COALESCE(p_post->>'contenido', ''));
    v_autor TEXT := COALESCE(
        NULLIF(btrim(COALESCE(p_post->>'autor', '')), ''),
        'Cronista del Reino'
    );
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

    INSERT INTO public.blog_posts (id, titulo, fecha, contenido, autor)
    VALUES (v_id, v_titulo, v_fecha, v_contenido, v_autor)
    ON CONFLICT (id) DO UPDATE SET
        titulo = EXCLUDED.titulo,
        fecha = EXCLUDED.fecha,
        contenido = EXCLUDED.contenido,
        autor = EXCLUDED.autor,
        updated_at = NOW()
    RETURNING * INTO v_guardado;

    RETURN jsonb_build_object(
        'id', v_guardado.id,
        'titulo', v_guardado.titulo,
        'fecha', v_guardado.fecha
    );
END;
$$;

REVOKE ALL ON FUNCTION public.guardar_blog_post_admin(UUID, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.guardar_blog_post_admin(UUID, JSONB) TO anon, authenticated;

-- ==============================================================================
-- 4. RPC ELIMINAR CRÓNICA (token de sesión, SOLO ADMINISTRACIÓN)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.eliminar_blog_post_admin(
    p_token UUID,
    p_id UUID
)
RETURNS BOOLEAN
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

    IF v_actor IS NULL OR v_actor.role NOT IN ('master', 'superadmin') THEN
        RAISE EXCEPTION 'Solo la administración puede eliminar crónicas.';
    END IF;

    DELETE FROM public.blog_posts WHERE id = p_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'La crónica indicada no existe.';
    END IF;

    RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION public.eliminar_blog_post_admin(UUID, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.eliminar_blog_post_admin(UUID, UUID) TO anon, authenticated;
