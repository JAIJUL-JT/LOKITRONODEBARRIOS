-- Sorteo y orden de barrios, y desvinculación de usuarios por superadministradores.
-- Requiere que las funciones crear/editar/eliminar_casa_superadmin ya existan.

-- ==============================================================================
-- 1. TABLA DE ORDEN DEL SORTEO
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.orden_sorteo_barrios (
    casa_id UUID PRIMARY KEY REFERENCES public.casas(id) ON DELETE CASCADE,
    posicion INT NOT NULL,
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.orden_sorteo_barrios ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "orden_sorteo_public_select" ON public.orden_sorteo_barrios;
CREATE POLICY "orden_sorteo_public_select"
    ON public.orden_sorteo_barrios FOR SELECT USING (true);

DROP POLICY IF EXISTS "orden_sorteo_superadmin_manage" ON public.orden_sorteo_barrios;
CREATE POLICY "orden_sorteo_superadmin_manage"
    ON public.orden_sorteo_barrios FOR ALL
    USING (is_superadmin()) WITH CHECK (is_superadmin());

-- ==============================================================================
-- 2. VALIDACIÓN REUTILIZABLE DE SUPERADMINISTRADOR (teléfono + PIN)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.lokitrono_es_superadmin(
    p_phone TEXT,
    p_pin TEXT
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.authorized_users au
        WHERE au.role = 'superadmin'
          AND au.pin_code = btrim(COALESCE(p_pin, ''))
          AND btrim(COALESCE(au.phone, '')) = btrim(COALESCE(p_phone, ''))
    );
$$;

-- ==============================================================================
-- 3. DESVINCULAR UN USUARIO DE SU BARRIO (pasa a Forastero)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.desvincular_usuario_barrio_superadmin(
    p_phone TEXT,
    p_pin TEXT,
    p_target_phone TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_target TEXT := btrim(COALESCE(p_target_phone, ''));
BEGIN
    IF NOT public.lokitrono_es_superadmin(p_phone, p_pin) THEN
        RAISE EXCEPTION 'No autorizado: se requiere una cuenta superadministradora válida.';
    END IF;

    IF v_target = '' THEN
        RAISE EXCEPTION 'Debes indicar el teléfono del usuario a desvincular.';
    END IF;

    UPDATE public.authorized_users
    SET barrio_representado = 'Forastero',
        barrio_asignado = 'Forastero'
    WHERE btrim(COALESCE(phone, '')) = v_target;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se ha encontrado el usuario indicado.';
    END IF;

    RETURN TRUE;
END;
$$;

-- ==============================================================================
-- 4. OBTENER EL ORDEN DE SORTEO DE LOS BARRIOS PARTICIPANTES
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.obtener_orden_sorteo_barrios()
RETURNS TABLE (
    barrio_id UUID,
    nombre TEXT,
    emblema TEXT,
    posicion INT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT c.id AS barrio_id,
           c.nombre,
           c.emblema,
           o.posicion
    FROM public.casas c
    LEFT JOIN public.orden_sorteo_barrios o ON o.casa_id = c.id
    WHERE c.participa
    ORDER BY o.posicion ASC NULLS LAST, c.nombre ASC;
$$;

-- ==============================================================================
-- 5. GENERAR UN SORTEO ALEATORIO Y GUARDARLO
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.generar_sorteo_barrios_superadmin(
    p_phone TEXT,
    p_pin TEXT
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

    -- Elimina las posiciones de barrios que ya no participan.
    DELETE FROM public.orden_sorteo_barrios o
    WHERE NOT EXISTS (
        SELECT 1 FROM public.casas c
        WHERE c.id = o.casa_id AND c.participa
    );

    WITH mezcla AS (
        SELECT c.id AS casa_id,
               row_number() OVER (ORDER BY random()) AS posicion
        FROM public.casas c
        WHERE c.participa
    )
    INSERT INTO public.orden_sorteo_barrios (casa_id, posicion, actualizado_en)
    SELECT casa_id, posicion, now() FROM mezcla
    ON CONFLICT (casa_id) DO UPDATE
        SET posicion = EXCLUDED.posicion,
            actualizado_en = now();

    SELECT COUNT(*) INTO v_total
    FROM public.orden_sorteo_barrios o
    JOIN public.casas c ON c.id = o.casa_id
    WHERE c.participa;

    RETURN COALESCE(v_total, 0);
END;
$$;

-- ==============================================================================
-- 6. GUARDAR UN ORDEN MANUAL DE BARRIOS
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.guardar_orden_sorteo_barrios_superadmin(
    p_phone TEXT,
    p_pin TEXT,
    p_orden UUID[]
)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_total INT;
    v_ids UUID[] := COALESCE(p_orden, ARRAY[]::UUID[]);
BEGIN
    IF NOT public.lokitrono_es_superadmin(p_phone, p_pin) THEN
        RAISE EXCEPTION 'No autorizado: se requiere una cuenta superadministradora válida.';
    END IF;

    IF array_length(v_ids, 1) IS NULL THEN
        RAISE EXCEPTION 'El orden recibido está vacío.';
    END IF;

    IF (SELECT COUNT(*) FROM (SELECT DISTINCT unnest(v_ids)) AS d) <> array_length(v_ids, 1) THEN
        RAISE EXCEPTION 'El orden contiene barrios repetidos.';
    END IF;

    IF EXISTS (
        SELECT 1 FROM unnest(v_ids) AS x(casa_id)
        WHERE NOT EXISTS (
            SELECT 1 FROM public.casas c
            WHERE c.id = x.casa_id AND c.participa
        )
    ) THEN
        RAISE EXCEPTION 'El orden incluye barrios inexistentes o no participantes.';
    END IF;

    -- Elimina las posiciones de barrios que ya no participan.
    DELETE FROM public.orden_sorteo_barrios o
    WHERE NOT EXISTS (
        SELECT 1 FROM public.casas c
        WHERE c.id = o.casa_id AND c.participa
    );

    INSERT INTO public.orden_sorteo_barrios (casa_id, posicion, actualizado_en)
    SELECT x.casa_id, x.ord, now()
    FROM unnest(v_ids) WITH ORDINALITY AS x(casa_id, ord)
    ON CONFLICT (casa_id) DO UPDATE
        SET posicion = EXCLUDED.posicion,
            actualizado_en = now();

    SELECT COUNT(*) INTO v_total
    FROM public.orden_sorteo_barrios o
    JOIN public.casas c ON c.id = o.casa_id
    WHERE c.participa;

    RETURN COALESCE(v_total, 0);
END;
$$;

-- ==============================================================================
-- 7. PERMISOS
-- ==============================================================================
REVOKE ALL ON FUNCTION public.lokitrono_es_superadmin(TEXT, TEXT) FROM PUBLIC;

REVOKE ALL ON FUNCTION public.desvincular_usuario_barrio_superadmin(TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.desvincular_usuario_barrio_superadmin(TEXT, TEXT, TEXT) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.obtener_orden_sorteo_barrios() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.obtener_orden_sorteo_barrios() TO anon, authenticated;

REVOKE ALL ON FUNCTION public.generar_sorteo_barrios_superadmin(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.generar_sorteo_barrios_superadmin(TEXT, TEXT) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.guardar_orden_sorteo_barrios_superadmin(TEXT, TEXT, UUID[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.guardar_orden_sorteo_barrios_superadmin(TEXT, TEXT, UUID[]) TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
