-- ==============================================================================
-- LOKITRONO: GEOGRAFÍA DE ESPAÑA (CIUDADES, DISTRITOS, BARRIOS Y CÓDIGOS POSTALES)
-- Migración: 202610180003
--
-- Jerarquía:
--   provincias (2 díg. INE) → ciudades / municipios (5 díg. INE)
--   → distritos (municipal | censal | cp) → barrios
--   códigos postales (relación N:M con ciudades).
--
-- Fuentes (atribución obligatoria):
--   * Municipios y códigos postales: INE (www.ine.es).
--   * Límites municipales: IGN/CNIG, API-Features (api-features.ign.es).
--   * Distritos y barrios: open data municipal (Ayto. de Barcelona; Ayto. de Bilbao).
--
-- Los datos se cargan con `scripts/ingestar_geografia.mjs` y las geometrías se
-- sirven como assets estáticos en `data/ciudades/<codigo_ine>.geojson`.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. PROVINCIAS (código INE de 2 dígitos)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.provincias (
    id     TEXT PRIMARY KEY,                 -- "48"
    nombre TEXT NOT NULL,                    -- "Bizkaia"
    ccaa   TEXT                              -- "País Vasco"
);

-- ------------------------------------------------------------------------------
-- 2. CIUDADES / MUNICIPIOS (código INE de 5 dígitos)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ciudades (
    id              TEXT PRIMARY KEY,        -- "48020" (Bilbao)
    nombre          TEXT NOT NULL,
    provincia_id    TEXT REFERENCES public.provincias(id) ON DELETE SET NULL,
    lat             DOUBLE PRECISION,
    lon             DOUBLE PRECISION,
    geom_path       TEXT,                    -- "data/ciudades/48020.geojson"
    tiene_distritos BOOLEAN NOT NULL DEFAULT FALSE,
    tiene_barrios   BOOLEAN NOT NULL DEFAULT FALSE,
    fuente          TEXT,
    actualizado_en  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ciudades_provincia_idx ON public.ciudades (provincia_id);
CREATE INDEX IF NOT EXISTS ciudades_nombre_idx    ON public.ciudades (nombre);

-- ------------------------------------------------------------------------------
-- 3. DISTRITOS
--    tipo: 'municipal' (oficial del ayuntamiento), 'censal' (INE) o
--          'cp' (agrupación por código postal como nivel inferior de respaldo).
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.distritos (
    id             TEXT PRIMARY KEY,         -- "48020-02"
    ciudad_id      TEXT NOT NULL REFERENCES public.ciudades(id) ON DELETE CASCADE,
    nombre         TEXT NOT NULL,
    tipo           TEXT NOT NULL DEFAULT 'municipal'
                   CHECK (tipo IN ('municipal', 'censal', 'cp')),
    codigo         TEXT,                     -- código dentro de la ciudad
    color          TEXT,                     -- color asignado (hex)
    geom_path      TEXT,
    orden          INT,
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS distritos_ciudad_idx ON public.distritos (ciudad_id);

-- ------------------------------------------------------------------------------
-- 4. BARRIOS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.barrios (
    id             TEXT PRIMARY KEY,         -- "48020-02-204"
    distrito_id    TEXT NOT NULL REFERENCES public.distritos(id) ON DELETE CASCADE,
    ciudad_id      TEXT NOT NULL REFERENCES public.ciudades(id) ON DELETE CASCADE,
    nombre         TEXT NOT NULL,
    codigo         TEXT,                     -- código de barrio dentro del distrito
    codigo_postal  TEXT,
    color          TEXT,                     -- color asignado (hex)
    geom_path      TEXT,
    orden          INT,
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS barrios_distrito_idx ON public.barrios (distrito_id);
CREATE INDEX IF NOT EXISTS barrios_ciudad_idx    ON public.barrios (ciudad_id);
CREATE INDEX IF NOT EXISTS barrios_cp_idx        ON public.barrios (codigo_postal);

-- ------------------------------------------------------------------------------
-- 5. CÓDIGOS POSTALES (N:M con ciudades: un CP puede servir a varios municipios)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.codigos_postales (
    codigo   TEXT PRIMARY KEY,               -- "48001"
    provincia_id TEXT REFERENCES public.provincias(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.codigo_postal_ciudad (
    codigo_postal TEXT NOT NULL REFERENCES public.codigos_postales(codigo) ON DELETE CASCADE,
    ciudad_id     TEXT NOT NULL REFERENCES public.ciudades(id) ON DELETE CASCADE,
    PRIMARY KEY (codigo_postal, ciudad_id)
);

CREATE INDEX IF NOT EXISTS cp_ciudad_ciudad_idx ON public.codigo_postal_ciudad (ciudad_id);

-- ------------------------------------------------------------------------------
-- 6. ENLACE CON LAS CASAS COMPETITIVAS (barrios del juego)
--    Las `casas` existentes siguen igual; se añaden referencias opcionales a la
--    jerarquía geográfica para la creación en cascada.
-- ------------------------------------------------------------------------------
ALTER TABLE public.casas ADD COLUMN IF NOT EXISTS ciudad_id     TEXT;
ALTER TABLE public.casas ADD COLUMN IF NOT EXISTS distrito_id   TEXT;
ALTER TABLE public.casas ADD COLUMN IF NOT EXISTS barrio_id     TEXT;
ALTER TABLE public.casas ADD COLUMN IF NOT EXISTS codigo_postal TEXT;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'casas_ciudad_id_fkey') THEN
        ALTER TABLE public.casas
            ADD CONSTRAINT casas_ciudad_id_fkey
            FOREIGN KEY (ciudad_id) REFERENCES public.ciudades(id) ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'casas_distrito_id_fkey') THEN
        ALTER TABLE public.casas
            ADD CONSTRAINT casas_distrito_id_fkey
            FOREIGN KEY (distrito_id) REFERENCES public.distritos(id) ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'casas_barrio_id_fkey') THEN
        ALTER TABLE public.casas
            ADD CONSTRAINT casas_barrio_id_fkey
            FOREIGN KEY (barrio_id) REFERENCES public.barrios(id) ON DELETE SET NULL;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS casas_ciudad_idx ON public.casas (ciudad_id);
CREATE INDEX IF NOT EXISTS casas_barrio_idx ON public.casas (barrio_id);

-- ------------------------------------------------------------------------------
-- 7. RLS: lectura pública, gestión solo superadmin (patrón del resto del esquema)
-- ------------------------------------------------------------------------------
ALTER TABLE public.provincias           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ciudades             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.distritos            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barrios              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.codigos_postales     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.codigo_postal_ciudad ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
    t TEXT;
BEGIN
    FOREACH t IN ARRAY ARRAY[
        'provincias', 'ciudades', 'distritos', 'barrios',
        'codigos_postales', 'codigo_postal_ciudad'
    ]
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', t || '_public_select', t);
        EXECUTE format(
            'CREATE POLICY %I ON public.%I FOR SELECT TO anon, authenticated USING (true)',
            t || '_public_select', t
        );
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', t || '_superadmin_manage', t);
        EXECUTE format(
            'CREATE POLICY %I ON public.%I FOR ALL TO anon, authenticated USING (is_superadmin()) WITH CHECK (is_superadmin())',
            t || '_superadmin_manage', t
        );
    END LOOP;
END $$;

-- Lectura pública; la escritura pasa por RPC SECURITY DEFINER o por superadmin.
REVOKE INSERT, UPDATE, DELETE, TRUNCATE
ON public.provincias, public.ciudades, public.distritos, public.barrios,
   public.codigos_postales, public.codigo_postal_ciudad
FROM anon, authenticated;

GRANT SELECT
ON public.provincias, public.ciudades, public.distritos, public.barrios,
   public.codigos_postales, public.codigo_postal_ciudad
TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
