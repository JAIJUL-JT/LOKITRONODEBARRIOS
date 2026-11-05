-- ==============================================================================
-- Migración: Asegurar rol master y permisos totales para Julio (605676002)
-- Fecha: 2026-11-05
-- ==============================================================================

-- 1. Asegurar restricción de roles en authorized_users para admitir 'master'
DO $$
DECLARE
    v_constraint TEXT;
BEGIN
    SELECT con.conname INTO v_constraint
    FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
    WHERE nsp.nspname = 'public'
      AND rel.relname = 'authorized_users'
      AND con.contype = 'c'
      AND pg_get_constraintdef(con.oid) ILIKE '%role%'
    LIMIT 1;

    IF v_constraint IS NOT NULL THEN
        EXECUTE format('ALTER TABLE public.authorized_users DROP CONSTRAINT %I', v_constraint);
    END IF;
END;
$$;

ALTER TABLE public.authorized_users
    ADD CONSTRAINT authorized_users_role_check
    CHECK (role IN ('jugador', 'tronista', 'superadmin', 'master'));

-- 2. Asignar rol master a Julio (605676002)
UPDATE public.authorized_users
SET role = 'master'
WHERE regexp_replace(COALESCE(phone, ''), '[^0-9]', '', 'g') = '605676002'
   OR (
       length(regexp_replace(COALESCE(phone, ''), '[^0-9]', '', 'g')) = 9
       AND right(regexp_replace(COALESCE(phone, ''), '[^0-9]', '', 'g'), 9) = '605676002'
   );

-- 3. Actualizar función lokitrono_puede_gestionar_rol para dar control total al master
-- y permitir a un superadmin o usuario gestionar su propio PIN si coincide el id,
-- garantizando que el rol 'master' tenga autoridad absoluta sobre cualquier rol.
CREATE OR REPLACE FUNCTION public.lokitrono_puede_gestionar_rol(
    p_actor TEXT,
    p_target TEXT
)
RETURNS BOOLEAN
LANGUAGE sql
IMMUTABLE
AS $$
    SELECT CASE
        WHEN btrim(COALESCE(p_actor, '')) = 'master' THEN TRUE
        WHEN btrim(COALESCE(p_actor, '')) = 'superadmin'
            THEN btrim(COALESCE(p_target, '')) IN ('jugador', 'tronista')
        ELSE FALSE
    END;
$$;
