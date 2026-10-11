-- Gestión segura de barrios por superadministradores.
-- No elimina registros relacionados en cascada.

CREATE OR REPLACE FUNCTION public.editar_casa_superadmin(
    p_phone TEXT,
    p_pin TEXT,
    p_casa_id UUID,
    p_nombre TEXT,
    p_lema TEXT DEFAULT NULL,
    p_emblema TEXT DEFAULT '🏰',
    p_color_heraldo TEXT DEFAULT '#d4af37',
    p_participa BOOLEAN DEFAULT TRUE
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_nombre TEXT;
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM public.authorized_users au
        WHERE au.phone = btrim(COALESCE(p_phone, ''))
          AND au.pin_code = btrim(COALESCE(p_pin, ''))
          AND au.role = 'superadmin'
    ) THEN
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
        SELECT 1
        FROM public.casas c
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
        participa = COALESCE(p_participa, TRUE)
    WHERE id = p_casa_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se ha encontrado el barrio que deseas editar.';
    END IF;

    RETURN TRUE;
END;
$$;


CREATE OR REPLACE FUNCTION public.eliminar_casa_superadmin(
    p_phone TEXT,
    p_pin TEXT,
    p_casa_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM public.authorized_users au
        WHERE au.phone = btrim(COALESCE(p_phone, ''))
          AND au.pin_code = btrim(COALESCE(p_pin, ''))
          AND au.role = 'superadmin'
    ) THEN
        RAISE EXCEPTION 'No autorizado: se requiere una cuenta superadministradora válida.';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM public.casas
        WHERE id = p_casa_id
    ) THEN
        RAISE EXCEPTION 'No se ha encontrado el barrio que deseas eliminar.';
    END IF;

    IF EXISTS (
        SELECT 1 FROM public.juicios
        WHERE casa_visitada = p_casa_id
    ) THEN
        RAISE EXCEPTION 'Este barrio tiene votos o calificaciones. Desactívalo en lugar de eliminarlo.';
    END IF;

    IF EXISTS (
        SELECT 1 FROM public.codigos_diarios
        WHERE casa_id = p_casa_id
    ) THEN
        RAISE EXCEPTION 'Este barrio tiene códigos diarios asociados. Desactívalo en lugar de eliminarlo.';
    END IF;

    IF EXISTS (
        SELECT 1 FROM public.maestres
        WHERE casa_origen = p_casa_id
    ) THEN
        RAISE EXCEPTION 'Hay maestres asociados a este barrio. Desactívalo en lugar de eliminarlo.';
    END IF;

    IF EXISTS (
        SELECT 1 FROM public.authorized_users
        WHERE lower(btrim(COALESCE(barrio_asignado, ''))) =
              lower((SELECT btrim(nombre) FROM public.casas WHERE id = p_casa_id))
           OR lower(btrim(COALESCE(barrio_representado, ''))) =
              lower((SELECT btrim(nombre) FROM public.casas WHERE id = p_casa_id))
    ) THEN
        RAISE EXCEPTION 'Hay usuarios asociados a este barrio. Desactívalo en lugar de eliminarlo.';
    END IF;

    DELETE FROM public.casas
    WHERE id = p_casa_id;

    RETURN TRUE;
END;
$$;


REVOKE ALL ON FUNCTION public.editar_casa_superadmin(TEXT, TEXT, UUID, TEXT, TEXT, TEXT, TEXT, BOOLEAN) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.editar_casa_superadmin(TEXT, TEXT, UUID, TEXT, TEXT, TEXT, TEXT, BOOLEAN) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.eliminar_casa_superadmin(TEXT, TEXT, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.eliminar_casa_superadmin(TEXT, TEXT, UUID) TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
