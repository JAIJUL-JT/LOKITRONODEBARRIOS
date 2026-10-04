-- Migrate the retired organizer role to the barrio-scoped tronista role.
UPDATE public.authorized_users
SET role = 'tronista'
WHERE role = 'organizador';

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'authorized_users_role_allowed'
          AND conrelid = 'public.authorized_users'::regclass
    ) THEN
        ALTER TABLE public.authorized_users
            ADD CONSTRAINT authorized_users_role_allowed
            CHECK (role IN ('jugador', 'tronista', 'superadmin')) NOT VALID;
    END IF;
END $$;