-- ============================================================================
-- MIGRACIÓN: Incorporar rol 'suplente_tronista' a authorized_users
-- ============================================================================
-- Permite que los Suplentes de Lokitronista sean dados de alta oficialmente
-- en la corte, con acceso libre a las secciones y capacidad de votar en su barrio.

DO $$
BEGIN
    -- Si la tabla authorized_users existe, actualizamos su CHECK de roles
    IF EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'authorized_users'
    ) THEN
        -- Eliminar constraints previas de CHECK sobre el rol si existen
        ALTER TABLE public.authorized_users
            DROP CONSTRAINT IF EXISTS authorized_users_role_check;

        ALTER TABLE public.authorized_users
            ADD CONSTRAINT authorized_users_role_check
            CHECK (role IN ('jugador', 'tronista', 'suplente_tronista', 'superadmin', 'master'));
    END IF;
END $$;
