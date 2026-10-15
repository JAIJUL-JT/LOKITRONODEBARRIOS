-- ==============================================================================
-- LOKITRONO: UBICACIÓN GEOGRÁFICA DE LOS BARRIOS (CASAS)
-- Migración: 202610240004
--
-- Un barrio del juego puede darse de alta eligiendo su ubicación en la cascada
-- CCAA → provincia → municipio (→ distrito → barrio → código postal). Esa
-- ubicación se guarda en `casas` (columnas ciudad_id / distrito_id / barrio_id /
-- codigo_postal), alimenta el sorteo de barrios y permite generar la ficha del
-- puzzle de ubicaciones.
--
-- Se recrean `crear_casa_superadmin` y `editar_casa_superadmin` añadiendo los
-- parámetros geográficos y la imagen de la ficha (opcionales).
-- ==============================================================================

DROP FUNCTION IF EXISTS public.crear_casa_superadmin(TEXT, TEXT, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS public.editar_casa_superadmin(TEXT, TEXT, UUID, TEXT, TEXT, TEXT, TEXT, BOOLEAN);

-- ------------------------------------------------------------------------------
-- 1. ALTA DE BARRIO CON UBICACIÓN
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.crear_casa_superadmin(
    p_phone         TEXT,
    p_pin           TEXT,
    p_nombre        TEXT,
    p_lema          TEXT DEFAULT NULL,
    p_emblema       TEXT DEFAULT '🏰',
    p_ciudad_id     TEXT DEFAULT NULL,
    p_distrito_id   TEXT DEFAULT NULL,
    p_barrio_id     TEXT DEFAULT NULL,
    p_codigo_postal TEXT DEFAULT NULL,
    p_imagen_url    TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
    v_casa_id UUID;
    v_nombre TEXT;
BEGIN
    v_nombre := btrim(COALESCE(p_nombre, ''));

    IF v_nombre = '' THEN
        RAISE EXCEPTION 'El nombre del barrio es obligatorio.';
    END IF;

    IF length(v_nombre) > 100 THEN
        RAISE EXCEPTION 'El nombre del barrio no puede superar los 100 caracteres.';
    END IF;

    IF NOT public.lokitrono_es_superadmin(p_phone, p_pin) THEN
        RAISE EXCEPTION 'No autorizado: se requiere una cuenta superadministradora válida.';
    END IF;

    IF EXISTS (
        SELECT 1 FROM public.casas c
        WHERE lower(btrim(c.nombre)) = lower(v_nombre)
    ) THEN
        RAISE EXCEPTION 'Ya existe un barrio con ese nombre.';
    END IF;

    INSERT INTO public.casas
        (nombre, lema, emblema, color_heraldo, participa,
         ciudad_id, distrito_id, barrio_id, codigo_postal, imagen_url)
    VALUES
        (v_nombre,
         NULLIF(btrim(COALESCE(p_lema, '')), ''),
         COALESCE(NULLIF(btrim(COALESCE(p_emblema, '')), ''), '🏰'),
         '#d4af37', TRUE,
         NULLIF(btrim(COALESCE(p_ciudad_id, '')), ''),
         NULLIF(btrim(COALESCE(p_distrito_id, '')), ''),
         NULLIF(btrim(COALESCE(p_barrio_id, '')), ''),
         NULLIF(btrim(COALESCE(p_codigo_postal, '')), ''),
         NULLIF(btrim(COALESCE(p_imagen_url, '')), ''))
    RETURNING id INTO v_casa_id;

    RETURN v_casa_id;
END;
$$;

-- ------------------------------------------------------------------------------
-- 2. EDICIÓN DE BARRIO CON UBICACIÓN
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.editar_casa_superadmin(
    p_phone         TEXT,
    p_pin           TEXT,
    p_casa_id       UUID,
    p_nombre        TEXT,
    p_lema          TEXT DEFAULT NULL,
    p_emblema       TEXT DEFAULT '🏰',
    p_color_heraldo TEXT DEFAULT '#d4af37',
    p_participa     BOOLEAN DEFAULT TRUE,
    p_ciudad_id     TEXT DEFAULT NULL,
    p_distrito_id   TEXT DEFAULT NULL,
    p_barrio_id     TEXT DEFAULT NULL,
    p_codigo_postal TEXT DEFAULT NULL,
    p_imagen_url    TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
    v_nombre TEXT;
BEGIN
    IF NOT public.lokitrono_es_superadmin(p_phone, p_pin) THEN
        RAISE EXCEPTION 'No autorizado: se requiere una cuenta superadministradora válida.';
    END IF;

    v_nombre := btrim(COALESCE(p_nombre, ''));

    IF v_nombre = '' THEN
        RAISE EXCEPTION 'El nombre del barrio es obligatorio.';
    END IF;

    IF length(v_nombre) > 100 THEN
        RAISE EXCEPTION 'El nombre del barrio no puede superar los 100 caracteres.';
    END IF;

    IF EXISTS (
        SELECT 1 FROM public.casas c
        WHERE lower(btrim(c.nombre)) = lower(v_nombre)
          AND c.id <> p_casa_id
    ) THEN
        RAISE EXCEPTION 'Ya existe otro barrio con ese nombre.';
    END IF;

    UPDATE public.casas
    SET nombre = v_nombre,
        lema = NULLIF(btrim(COALESCE(p_lema, '')), ''),
        emblema = COALESCE(NULLIF(btrim(COALESCE(p_emblema, '')), ''), '🏰'),
        color_heraldo = COALESCE(NULLIF(btrim(COALESCE(p_color_heraldo, '')), ''), '#d4af37'),
        participa = COALESCE(p_participa, TRUE),
        ciudad_id = NULLIF(btrim(COALESCE(p_ciudad_id, '')), ''),
        distrito_id = NULLIF(btrim(COALESCE(p_distrito_id, '')), ''),
        barrio_id = NULLIF(btrim(COALESCE(p_barrio_id, '')), ''),
        codigo_postal = NULLIF(btrim(COALESCE(p_codigo_postal, '')), ''),
        imagen_url = NULLIF(btrim(COALESCE(p_imagen_url, '')), '')
    WHERE id = p_casa_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se ha encontrado el barrio que deseas editar.';
    END IF;

    RETURN TRUE;
END;
$$;

-- ------------------------------------------------------------------------------
-- 3. PERMISOS
-- ------------------------------------------------------------------------------
REVOKE ALL ON FUNCTION public.crear_casa_superadmin(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.crear_casa_superadmin(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.editar_casa_superadmin(TEXT, TEXT, UUID, TEXT, TEXT, TEXT, TEXT, BOOLEAN, TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.editar_casa_superadmin(TEXT, TEXT, UUID, TEXT, TEXT, TEXT, TEXT, BOOLEAN, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
