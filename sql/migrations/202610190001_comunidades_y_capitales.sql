-- ==============================================================================
-- LOKITRONO: COMUNIDADES AUTÓNOMAS Y CAPITALES DE PROVINCIA
-- Migración: 202610190001
--
-- Completa la jerarquía geográfica:
--   comunidades (código INE de 2 díg.) → provincias → ciudades → distritos → barrios
--
-- Añade:
--   * public.comunidades: catálogo de las 19 comunidades/ciudades autónomas.
--   * public.provincias.comunidad_id: enlace a su comunidad autónoma.
--   * public.provincias.capital_id: municipio capital de la provincia.
--   * public.ciudades.es_capital: marca de capital de provincia (para filtros).
--
-- Fuente: INE (www.ine.es) — códigos de comunidad, provincia y municipio.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. COMUNIDADES AUTÓNOMAS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.comunidades (
    id     TEXT PRIMARY KEY,   -- "16"
    nombre TEXT NOT NULL       -- "País Vasco"
);

INSERT INTO public.comunidades (id, nombre) VALUES
    ('01', 'Andalucía'),
    ('02', 'Aragón'),
    ('03', 'Principado de Asturias'),
    ('04', 'Illes Balears'),
    ('05', 'Canarias'),
    ('06', 'Cantabria'),
    ('07', 'Castilla y León'),
    ('08', 'Castilla-La Mancha'),
    ('09', 'Cataluña'),
    ('10', 'Comunitat Valenciana'),
    ('11', 'Extremadura'),
    ('12', 'Galicia'),
    ('13', 'Comunidad de Madrid'),
    ('14', 'Región de Murcia'),
    ('15', 'Comunidad Foral de Navarra'),
    ('16', 'País Vasco'),
    ('17', 'La Rioja'),
    ('18', 'Ceuta'),
    ('19', 'Melilla')
ON CONFLICT (id) DO UPDATE SET nombre = EXCLUDED.nombre;

-- ------------------------------------------------------------------------------
-- 2. NUEVAS COLUMNAS EN PROVINCIAS Y CIUDADES
-- ------------------------------------------------------------------------------
ALTER TABLE public.provincias
    ADD COLUMN IF NOT EXISTS comunidad_id TEXT,
    ADD COLUMN IF NOT EXISTS capital_id   TEXT;

ALTER TABLE public.ciudades
    ADD COLUMN IF NOT EXISTS es_capital BOOLEAN NOT NULL DEFAULT FALSE;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'provincias_comunidad_id_fkey') THEN
        ALTER TABLE public.provincias
            ADD CONSTRAINT provincias_comunidad_id_fkey
            FOREIGN KEY (comunidad_id) REFERENCES public.comunidades(id) ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'provincias_capital_id_fkey') THEN
        ALTER TABLE public.provincias
            ADD CONSTRAINT provincias_capital_id_fkey
            FOREIGN KEY (capital_id) REFERENCES public.ciudades(id) ON DELETE SET NULL;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS provincias_comunidad_idx ON public.provincias (comunidad_id);
CREATE INDEX IF NOT EXISTS ciudades_capital_idx     ON public.ciudades (es_capital);

-- ------------------------------------------------------------------------------
-- 3. MAPEO PROVINCIA → COMUNIDAD AUTÓNOMA (código INE de 2 díg.)
-- ------------------------------------------------------------------------------
UPDATE public.provincias AS p
SET comunidad_id = m.comunidad_id
FROM (VALUES
    -- Andalucía
    ('04','01'), ('11','01'), ('14','01'), ('18','01'), ('21','01'),
    ('23','01'), ('29','01'), ('41','01'),
    -- Aragón
    ('22','02'), ('44','02'), ('50','02'),
    -- Principado de Asturias
    ('33','03'),
    -- Illes Balears
    ('07','04'),
    -- Canarias
    ('35','05'), ('38','05'),
    -- Cantabria
    ('39','06'),
    -- Castilla y León
    ('05','07'), ('09','07'), ('24','07'), ('34','07'), ('37','07'),
    ('40','07'), ('42','07'), ('47','07'), ('49','07'),
    -- Castilla-La Mancha
    ('02','08'), ('13','08'), ('16','08'), ('19','08'), ('45','08'),
    -- Cataluña
    ('08','09'), ('17','09'), ('25','09'), ('43','09'),
    -- Comunitat Valenciana
    ('03','10'), ('12','10'), ('46','10'),
    -- Extremadura
    ('06','11'), ('10','11'),
    -- Galicia
    ('15','12'), ('27','12'), ('32','12'), ('36','12'),
    -- Comunidad de Madrid
    ('28','13'),
    -- Región de Murcia
    ('30','14'),
    -- Comunidad Foral de Navarra
    ('31','15'),
    -- País Vasco
    ('01','16'), ('20','16'), ('48','16'),
    -- La Rioja
    ('26','17'),
    -- Ceuta / Melilla
    ('51','18'), ('52','19')
) AS m(provincia_id, comunidad_id)
WHERE p.id = m.provincia_id;

-- ------------------------------------------------------------------------------
-- 4. CAPITALES DE PROVINCIA (código INE del municipio capital)
-- ------------------------------------------------------------------------------
UPDATE public.ciudades SET es_capital = FALSE;

UPDATE public.provincias AS p
SET capital_id = c.id
FROM (VALUES
    ('01','01059'), -- Araba/Álava → Vitoria-Gasteiz
    ('02','02003'), -- Albacete → Albacete
    ('03','03014'), -- Alicante/Alacant → Alacant/Alicante
    ('04','04013'), -- Almería → Almería
    ('05','05019'), -- Ávila → Ávila
    ('06','06015'), -- Badajoz → Badajoz
    ('07','07040'), -- Balears, Illes → Palma
    ('08','08019'), -- Barcelona → Barcelona
    ('09','09059'), -- Burgos → Burgos
    ('10','10037'), -- Cáceres → Cáceres
    ('11','11012'), -- Cádiz → Cádiz
    ('12','12040'), -- Castellón/Castelló → Castelló de la Plana
    ('13','13034'), -- Ciudad Real → Ciudad Real
    ('14','14021'), -- Córdoba → Córdoba
    ('15','15030'), -- Coruña, A → A Coruña
    ('16','16078'), -- Cuenca → Cuenca
    ('17','17079'), -- Girona → Girona
    ('18','18087'), -- Granada → Granada
    ('19','19130'), -- Guadalajara → Guadalajara
    ('20','20069'), -- Gipuzkoa → Donostia/San Sebastián
    ('21','21041'), -- Huelva → Huelva
    ('22','22125'), -- Huesca → Huesca
    ('23','23050'), -- Jaén → Jaén
    ('24','24089'), -- León → León
    ('25','25120'), -- Lleida → Lleida
    ('26','26089'), -- Rioja, La → Logroño
    ('27','27028'), -- Lugo → Lugo
    ('28','28079'), -- Madrid → Madrid
    ('29','29067'), -- Málaga → Málaga
    ('30','30030'), -- Murcia → Murcia
    ('31','31201'), -- Navarra → Pamplona/Iruña
    ('32','32054'), -- Ourense → Ourense
    ('33','33044'), -- Asturias → Oviedo
    ('34','34120'), -- Palencia → Palencia
    ('35','35016'), -- Palmas, Las → Palmas de Gran Canaria, Las
    ('36','36038'), -- Pontevedra → Pontevedra
    ('37','37274'), -- Salamanca → Salamanca
    ('38','38038'), -- Santa Cruz de Tenerife → Santa Cruz de Tenerife
    ('39','39075'), -- Cantabria → Santander
    ('40','40194'), -- Segovia → Segovia
    ('41','41091'), -- Sevilla → Sevilla
    ('42','42173'), -- Soria → Soria
    ('43','43148'), -- Tarragona → Tarragona
    ('44','44216'), -- Teruel → Teruel
    ('45','45168'), -- Toledo → Toledo
    ('46','46250'), -- Valencia/València → València
    ('47','47186'), -- Valladolid → Valladolid
    ('48','48020'), -- Bizkaia → Bilbao
    ('49','49275'), -- Zamora → Zamora
    ('50','50297'), -- Zaragoza → Zaragoza
    ('51','51001'), -- Ceuta → Ceuta
    ('52','52001')  -- Melilla → Melilla
) AS m(provincia_id, capital_id)
JOIN public.ciudades AS c ON c.id = m.capital_id
WHERE p.id = m.provincia_id;

UPDATE public.ciudades AS c
SET es_capital = TRUE
FROM public.provincias AS p
WHERE p.capital_id = c.id;

-- ------------------------------------------------------------------------------
-- 5. RLS: lectura pública, gestión solo superadmin (patrón del resto del esquema)
-- ------------------------------------------------------------------------------
ALTER TABLE public.comunidades ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS comunidades_public_select ON public.comunidades;
CREATE POLICY comunidades_public_select ON public.comunidades
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS comunidades_superadmin_manage ON public.comunidades;
CREATE POLICY comunidades_superadmin_manage ON public.comunidades
    FOR ALL TO anon, authenticated USING (is_superadmin()) WITH CHECK (is_superadmin());

REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.comunidades FROM anon, authenticated;
GRANT SELECT ON public.comunidades TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
