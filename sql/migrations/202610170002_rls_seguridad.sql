-- ============================================================
-- LOKITRONO: ENDURECIMIENTO DE SEGURIDAD (RLS)
-- Migración: 202610170002
-- Revierte la nota de seguridad: varias tablas tenían RLS
-- desactivado pese a existir políticas, dejando teléfonos/PIN
-- (authorized_users) y casas expuestos y escribibles con la
-- anon key a través de PostgREST.
-- ============================================================

-- ------------------------------------------------------------
-- 1) is_superadmin() debe saltarse RLS para poder consultar
--    authorized_users desde dentro de sus propias políticas.
--    (Sin SECURITY DEFINER provocaría recursión infinita al
--    activar RLS en authorized_users.)
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $function$
    SELECT EXISTS (
        SELECT 1 FROM public.authorized_users au
        WHERE au.role IN ('superadmin', 'master') AND (
            (au.email IS NOT NULL AND au.email = current_setting('jwt.claims.email', true))
            OR
            (au.phone IS NOT NULL AND au.phone = current_setting('jwt.claims.phone', true))
        )
    );
$function$;

-- NOTA: is_superadmin() se invoca desde las propias políticas RLS,
-- por lo que debe seguir siendo ejecutable por anon/authenticated.

-- ------------------------------------------------------------
-- 2) Activar RLS en las tablas que lo tenían desactivado.
--    Todas cuentan ya con políticas de lectura/gestión válidas.
-- ------------------------------------------------------------
ALTER TABLE public.authorized_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.casas            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maestres         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.juicios          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.codigos_diarios  ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------
-- 3) Eliminar la política de inserción pública en juicios.
--    Las altas se realizan por RPC SECURITY DEFINER.
-- ------------------------------------------------------------
DROP POLICY IF EXISTS juicios_insert_authenticated ON public.juicios;

-- ------------------------------------------------------------
-- 4) Defensa en profundidad: retirar escritura directa a los
--    navegadores. Toda la escritura pasa por RPC SECURITY DEFINER.
--    Se conserva SELECT donde hay política pública de lectura.
-- ------------------------------------------------------------
REVOKE INSERT, UPDATE, DELETE, TRUNCATE
ON public.authorized_users, public.casas, public.maestres,
   public.juicios, public.codigos_diarios
FROM anon, authenticated;

GRANT SELECT ON public.casas, public.maestres, public.juicios TO anon, authenticated;
GRANT SELECT ON public.codigos_diarios TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
