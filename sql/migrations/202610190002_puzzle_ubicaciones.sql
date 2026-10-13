-- ==============================================================================
-- LOKITRONO: PUZZLE DE UBICACIONES PARTICIPANTES
-- Migración: 202610190002
--
-- Cada pieza recortada del mapa (comunidad, provincia, ciudad, distrito, barrio o
-- código postal) se guarda ligada a un evento y a una casa (ubicación participante
-- del juego). El sorteo reparte las piezas asignándoles una posición.
--
--   eventos (1) ──< piezas_puzzle >── casas (1)
--
-- Al guardar el puzzle se crean o reutilizan las casas participantes con sus
-- referencias geográficas (ciudad_id / distrito_id / barrio_id / codigo_postal).
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. TABLA DE PIEZAS DEL PUZZLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.piezas_puzzle (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evento_id      TEXT NOT NULL REFERENCES public.eventos(id) ON DELETE CASCADE,
    casa_id        UUID REFERENCES public.casas(id) ON DELETE SET NULL,
    tipo           TEXT NOT NULL CHECK (tipo IN ('comunidad', 'provincia', 'ciudad', 'distrito', 'barrio', 'cp')),
    ref_id         TEXT NOT NULL,
    nombre         TEXT NOT NULL,
    ciudad_id      TEXT,
    distrito_id    TEXT,
    barrio_id      TEXT,
    codigo_postal  TEXT,
    color          TEXT,
    posicion       INT,
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (evento_id, tipo, ref_id)
);

CREATE INDEX IF NOT EXISTS piezas_puzzle_evento_idx ON public.piezas_puzzle (evento_id);
CREATE INDEX IF NOT EXISTS piezas_puzzle_casa_idx   ON public.piezas_puzzle (casa_id);

ALTER TABLE public.piezas_puzzle ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS piezas_puzzle_public_select ON public.piezas_puzzle;
CREATE POLICY piezas_puzzle_public_select ON public.piezas_puzzle
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS piezas_puzzle_superadmin_manage ON public.piezas_puzzle;
CREATE POLICY piezas_puzzle_superadmin_manage ON public.piezas_puzzle
    FOR ALL TO anon, authenticated USING (is_superadmin()) WITH CHECK (is_superadmin());

REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.piezas_puzzle FROM anon, authenticated;
GRANT SELECT ON public.piezas_puzzle TO anon, authenticated;

-- ------------------------------------------------------------------------------
-- 2. GUARDAR EL PUZZLE DE UN EVENTO (crea/reutiliza casas participantes)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.guardar_piezas_puzzle_superadmin(
    p_phone      TEXT,
    p_pin        TEXT,
    p_evento_id  TEXT,
    p_piezas     JSONB
)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_pieza   JSONB;
    v_tipo    TEXT;
    v_ref     TEXT;
    v_nombre  TEXT;
    v_ciudad  TEXT;
    v_dist    TEXT;
    v_barrio  TEXT;
    v_cp      TEXT;
    v_color   TEXT;
    v_casa    UUID;
    v_total   INT := 0;
BEGIN
    IF NOT public.lokitrono_es_superadmin(p_phone, p_pin) THEN
        RAISE EXCEPTION 'No autorizado: se requiere una cuenta superadministradora válida.';
    END IF;

    IF btrim(COALESCE(p_evento_id, '')) = '' THEN
        RAISE EXCEPTION 'Debes indicar el evento del puzzle.';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM public.eventos WHERE id = p_evento_id) THEN
        RAISE EXCEPTION 'El evento indicado no existe.';
    END IF;

    DELETE FROM public.piezas_puzzle WHERE evento_id = p_evento_id;

    FOR v_pieza IN SELECT * FROM jsonb_array_elements(COALESCE(p_piezas, '[]'::jsonb))
    LOOP
        v_tipo   := btrim(COALESCE(v_pieza->>'tipo', ''));
        v_ref    := btrim(COALESCE(v_pieza->>'ref_id', ''));
        v_nombre := btrim(COALESCE(v_pieza->>'nombre', ''));

        IF v_nombre = '' OR v_tipo = '' THEN
            CONTINUE;
        END IF;
        IF v_tipo NOT IN ('comunidad', 'provincia', 'ciudad', 'distrito', 'barrio', 'cp') THEN
            CONTINUE;
        END IF;

        v_ciudad := NULLIF(btrim(COALESCE(v_pieza->>'ciudad_id', '')), '');
        v_dist   := NULLIF(btrim(COALESCE(v_pieza->>'distrito_id', '')), '');
        v_barrio := NULLIF(btrim(COALESCE(v_pieza->>'barrio_id', '')), '');
        v_cp     := NULLIF(btrim(COALESCE(v_pieza->>'codigo_postal', '')), '');
        v_color  := COALESCE(NULLIF(btrim(COALESCE(v_pieza->>'color', '')), ''), '#d4af37');

        SELECT c.id INTO v_casa
        FROM public.casas c
        WHERE lower(btrim(c.nombre)) = lower(v_nombre)
        LIMIT 1;

        IF v_casa IS NULL THEN
            INSERT INTO public.casas
                (nombre, lema, emblema, color_heraldo, participa,
                 ciudad_id, distrito_id, barrio_id, codigo_postal)
            VALUES
                (v_nombre, 'Ubicación participante creada desde el mapa', '🧩', v_color, TRUE,
                 v_ciudad, v_dist, v_barrio, v_cp)
            RETURNING id INTO v_casa;
        ELSE
            UPDATE public.casas
            SET ciudad_id      = COALESCE(v_ciudad, ciudad_id),
                distrito_id    = COALESCE(v_dist, distrito_id),
                barrio_id      = COALESCE(v_barrio, barrio_id),
                codigo_postal  = COALESCE(v_cp, codigo_postal),
                color_heraldo  = COALESCE(v_color, color_heraldo)
            WHERE id = v_casa;
        END IF;

        INSERT INTO public.piezas_puzzle
            (evento_id, casa_id, tipo, ref_id, nombre,
             ciudad_id, distrito_id, barrio_id, codigo_postal, color, actualizado_en)
        VALUES
            (p_evento_id, v_casa, v_tipo, v_ref, v_nombre,
             v_ciudad, v_dist, v_barrio, v_cp, v_color, now())
        ON CONFLICT (evento_id, tipo, ref_id) DO UPDATE
            SET casa_id       = EXCLUDED.casa_id,
                nombre        = EXCLUDED.nombre,
                ciudad_id     = EXCLUDED.ciudad_id,
                distrito_id   = EXCLUDED.distrito_id,
                barrio_id     = EXCLUDED.barrio_id,
                codigo_postal = EXCLUDED.codigo_postal,
                color         = EXCLUDED.color,
                actualizado_en = now();

        v_total := v_total + 1;
    END LOOP;

    RETURN v_total;
END;
$$;

-- ------------------------------------------------------------------------------
-- 3. SORTEAR LAS PIEZAS DE UN EVENTO (orden aleatorio)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.sortear_piezas_puzzle_superadmin(
    p_phone     TEXT,
    p_pin       TEXT,
    p_evento_id TEXT
)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_total INT;
BEGIN
    IF NOT public.lokitrono_es_superadmin(p_phone, p_pin) THEN
        RAISE EXCEPTION 'No autorizado: se requiere una cuenta superadministradora válida.';
    END IF;

    UPDATE public.piezas_puzzle p
    SET posicion = sub.posicion,
        actualizado_en = now()
    FROM (
        SELECT id, row_number() OVER (ORDER BY random()) AS posicion
        FROM public.piezas_puzzle
        WHERE evento_id = p_evento_id
    ) AS sub
    WHERE p.id = sub.id;

    SELECT COUNT(*) INTO v_total
    FROM public.piezas_puzzle
    WHERE evento_id = p_evento_id;

    RETURN COALESCE(v_total, 0);
END;
$$;

-- ------------------------------------------------------------------------------
-- 4. GUARDAR UN ORDEN MANUAL DE PIEZAS
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.guardar_orden_piezas_puzzle_superadmin(
    p_phone     TEXT,
    p_pin       TEXT,
    p_evento_id TEXT,
    p_orden     UUID[]
)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_total INT;
    v_ids   UUID[] := COALESCE(p_orden, ARRAY[]::UUID[]);
BEGIN
    IF NOT public.lokitrono_es_superadmin(p_phone, p_pin) THEN
        RAISE EXCEPTION 'No autorizado: se requiere una cuenta superadministradora válida.';
    END IF;

    IF array_length(v_ids, 1) IS NULL THEN
        RAISE EXCEPTION 'El orden recibido está vacío.';
    END IF;

    UPDATE public.piezas_puzzle p
    SET posicion = x.ord,
        actualizado_en = now()
    FROM unnest(v_ids) WITH ORDINALITY AS x(pieza_id, ord)
    WHERE p.id = x.pieza_id AND p.evento_id = p_evento_id;

    SELECT COUNT(*) INTO v_total
    FROM public.piezas_puzzle
    WHERE evento_id = p_evento_id;

    RETURN COALESCE(v_total, 0);
END;
$$;

-- ------------------------------------------------------------------------------
-- 5. PERMISOS
-- ------------------------------------------------------------------------------
REVOKE ALL ON FUNCTION public.guardar_piezas_puzzle_superadmin(TEXT, TEXT, TEXT, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.guardar_piezas_puzzle_superadmin(TEXT, TEXT, TEXT, JSONB) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.sortear_piezas_puzzle_superadmin(TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.sortear_piezas_puzzle_superadmin(TEXT, TEXT, TEXT) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.guardar_orden_piezas_puzzle_superadmin(TEXT, TEXT, TEXT, UUID[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.guardar_orden_piezas_puzzle_superadmin(TEXT, TEXT, TEXT, UUID[]) TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
