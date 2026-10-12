-- ==============================================================================
-- Barrio asignado del usuario
-- ==============================================================================
-- El campo `barrio_asignado` ya existe en `authorized_users` como texto libre y
-- se alimenta desde la tabla de barrios `casas`. Esta migración garantiza la
-- columna, indexa las consultas por barrio y rellena los huecos con el barrio
-- representado cuando no hay barrio asignado.
-- ==============================================================================

ALTER TABLE public.authorized_users ADD COLUMN IF NOT EXISTS barrio_asignado TEXT;

CREATE INDEX IF NOT EXISTS idx_authorized_users_barrio_asignado
    ON public.authorized_users (barrio_asignado);

COMMENT ON COLUMN public.authorized_users.barrio_asignado IS
    'Barrio/casa de la tabla `casas` asignado al usuario. Editable: vincula a un integrante con su feudo.';

-- Backfill: si no hay barrio asignado pero sí barrio representado, se usa este
-- último como valor inicial.
UPDATE public.authorized_users
SET barrio_asignado = COALESCE(NULLIF(btrim(barrio_asignado), ''), barrio_representado)
WHERE COALESCE(NULLIF(btrim(barrio_asignado), ''), '') = ''
  AND COALESCE(NULLIF(btrim(barrio_representado), ''), '') <> '';