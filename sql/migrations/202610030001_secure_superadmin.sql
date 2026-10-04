-- Safe additive migration for secure administrator access.
-- This migration does not recreate tables or delete data.

ALTER TABLE authorized_users ADD COLUMN IF NOT EXISTS email TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS authorized_users_email_unique
    ON public.authorized_users (email)
    WHERE email IS NOT NULL;

ALTER TABLE public.authorized_users ALTER COLUMN phone DROP NOT NULL;

CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.authorized_users au
        WHERE au.role = 'superadmin'
          AND (
              (au.email IS NOT NULL AND au.email = COALESCE(current_setting('request.jwt.claims', true)::jsonb->>'email', ''))
              OR
              (au.phone IS NOT NULL AND au.phone = COALESCE(current_setting('request.jwt.claims', true)::jsonb->>'phone', ''))
          )
    );
$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = 'authorized_users'
          AND policyname = 'authorized_users_superadmin_select'
    ) THEN
        CREATE POLICY "authorized_users_superadmin_select"
            ON public.authorized_users
            FOR SELECT
            USING (public.is_superadmin());
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = 'authorized_users'
          AND policyname = 'authorized_users_superadmin_manage'
    ) THEN
        CREATE POLICY "authorized_users_superadmin_manage"
            ON public.authorized_users
            FOR ALL
            USING (public.is_superadmin())
            WITH CHECK (public.is_superadmin());
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = 'casas'
          AND policyname = 'casas_superadmin_manage'
    ) THEN
        CREATE POLICY "casas_superadmin_manage"
            ON public.casas
            FOR ALL
            USING (public.is_superadmin())
            WITH CHECK (public.is_superadmin());
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = 'maestres'
          AND policyname = 'maestres_superadmin_manage'
    ) THEN
        CREATE POLICY "maestres_superadmin_manage"
            ON public.maestres
            FOR ALL
            USING (public.is_superadmin())
            WITH CHECK (public.is_superadmin());
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = 'codigos_diarios'
          AND policyname = 'codigos_superadmin_manage'
    ) THEN
        CREATE POLICY "codigos_superadmin_manage"
            ON public.codigos_diarios
            FOR ALL
            USING (public.is_superadmin())
            WITH CHECK (public.is_superadmin());
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = 'juicios'
          AND policyname = 'juicios_admin_modify'
    ) THEN
        CREATE POLICY "juicios_admin_modify"
            ON public.juicios
            FOR UPDATE
            USING (public.is_superadmin())
            WITH CHECK (public.is_superadmin());
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = 'juicios'
          AND policyname = 'juicios_admin_delete'
    ) THEN
        CREATE POLICY "juicios_admin_delete"
            ON public.juicios
            FOR DELETE
            USING (public.is_superadmin());
    END IF;
END $$;

INSERT INTO public.authorized_users (phone, name, email, role)
VALUES (NULL, 'AFJ Bilbao', 'afjbilbao@gmail.com', 'superadmin')
ON CONFLICT (email) DO NOTHING;
