-- Actualización de datos en tiempo real (Supabase Realtime) y refresco de
-- usuarios autenticado por token de sesión.
--
-- 1) Añade casas, eventos y votos_evento a la publicación `supabase_realtime`
--    para que el cliente reciba en vivo los INSERT/UPDATE/DELETE sobre esas
--    tablas (barrios/casas, eventos y resultados de votaciones).
--
--    La tabla authorized_users NO se publica: contiene teléfonos y PIN, y su
--    RLS está desactivado, de modo que emitirla por Realtime filtraría datos
--    sensibles a cualquier visitante. Los usuarios se refrescan mediante la
--    función de abajo, que exige un token de sesión administrador válido.
--
-- 2) Crea listar_usuarios_por_token(p_token): permite a un administrador
--    (superadmin o master) refrescar el listado sin volver a introducir el PIN.
--    El PIN en claro solo se revela al rol master, igual que en
--    listar_usuarios_superadmin.
--
-- Requiere las migraciones 202610130001 (sesiones/token) y 202610140001 (master).

-- ==============================================================================
-- 1. PUBLICACIÓN REALTIME (postgres_changes)
-- ==============================================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        CREATE PUBLICATION supabase_realtime FOR TABLE public.casas, public.eventos, public.votos_evento;
    ELSE
        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables
            WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'casas'
        ) THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE public.casas;
        END IF;

        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables
            WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'eventos'
        ) THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE public.eventos;
        END IF;

        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables
            WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'votos_evento'
        ) THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE public.votos_evento;
        END IF;
    END IF;
END $$;

-- ==============================================================================
-- 2. LISTAR USUARIOS POR TOKEN DE SESIÓN
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.listar_usuarios_por_token(
    p_token UUID
)
RETURNS TABLE (
    id UUID,
    phone TEXT,
    name TEXT,
    email TEXT,
    role TEXT,
    pin_code TEXT,
    barrio_asignado TEXT,
    barrio_representado TEXT,
    gender TEXT,
    titulo_custom TEXT
)
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

    IF v_actor IS NULL OR v_actor.role NOT IN ('superadmin', 'master') THEN
        RAISE EXCEPTION 'No autorizado: se requiere una cuenta administradora válida.';
    END IF;

    RETURN QUERY
    SELECT au.id, au.phone, au.name, au.email, au.role,
           CASE WHEN v_actor.role = 'master' THEN au.pin_code ELSE NULL::TEXT END,
           au.barrio_asignado, au.barrio_representado,
           COALESCE(au.gender, 'M'), au.titulo_custom
    FROM public.authorized_users au
    ORDER BY au.name ASC NULLS LAST, au.phone ASC;
END;
$$;

REVOKE ALL ON FUNCTION public.listar_usuarios_por_token(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.listar_usuarios_por_token(UUID) TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
