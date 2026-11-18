-- ==============================================================================
-- RESOLUCIÓN DE ALERTA DE SEGURIDAD SUPABASE: rls_disabled_in_public
-- ==============================================================================
-- Activa Row Level Security (RLS) y revoca accesos públicos no autorizados
-- en las tablas públicas que carecían de RLS activo.

-- 1. Tabla configuracion_reino (Almacena secretos internos como MAKE_WEBHOOK_URL)
ALTER TABLE public.configuracion_reino ENABLE ROW LEVEL SECURITY;

-- Revocar permisos de acceso directo a anon y authenticated (solo accesible por funciones SECURITY DEFINER o service_role)
REVOKE ALL ON public.configuracion_reino FROM anon, authenticated, PUBLIC;

-- Política de bloqueo total para clientes públicos (anon/authenticated)
DROP POLICY IF EXISTS configuracion_reino_no_acceso_publico ON public.configuracion_reino;
CREATE POLICY configuracion_reino_no_acceso_publico ON public.configuracion_reino
    FOR ALL
    TO anon, authenticated
    USING (false);

-- 2. Tablas auxiliares / residuales de organizaciones (si existen)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'organizations') THEN
        ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
        REVOKE ALL ON public.organizations FROM anon, authenticated, PUBLIC;
        DROP POLICY IF EXISTS organizations_no_acceso ON public.organizations;
        CREATE POLICY organizations_no_acceso ON public.organizations
            FOR ALL TO anon, authenticated USING (false);
    END IF;

    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'organization_users') THEN
        ALTER TABLE public.organization_users ENABLE ROW LEVEL SECURITY;
        REVOKE ALL ON public.organization_users FROM anon, authenticated, PUBLIC;
        DROP POLICY IF EXISTS organization_users_no_acceso ON public.organization_users;
        CREATE POLICY organization_users_no_acceso ON public.organization_users
            FOR ALL TO anon, authenticated USING (false);
    END IF;
END $$;
