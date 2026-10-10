-- Alta segura de barrios mediante la tabla existente public.casas.
-- La función valida teléfono + PIN + rol en la base de datos; no confía en el rol
-- almacenado en localStorage del navegador.
CREATE OR REPLACE FUNCTION public.crear_casa_superadmin(
    p_phone TEXT,
    p_pin TEXT,
    p_nombre TEXT,
    p_lema TEXT DEFAULT NULL,
    p_emblema TEXT DEFAULT '🏰'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

    IF NOT EXISTS (
        SELECT 1
        FROM public.authorized_users au
        WHERE au.phone = btrim(COALESCE(p_phone, ''))
          AND au.pin_code = btrim(COALESCE(p_pin, ''))
          AND au.role = 'superadmin'
    ) THEN
        RAISE EXCEPTION 'No autorizado: se requiere una cuenta superadministradora válida.';
    END IF;

    IF EXISTS (
        SELECT 1 FROM public.casas c
        WHERE lower(btrim(c.nombre)) = lower(v_nombre)
    ) THEN
        RAISE EXCEPTION 'Ya existe un barrio con ese nombre.';
    END IF;

    INSERT INTO public.casas (nombre, lema, emblema, color_heraldo, participa)
    VALUES (v_nombre, NULLIF(btrim(COALESCE(p_lema, '')), ''),
            COALESCE(NULLIF(btrim(COALESCE(p_emblema, '')), ''), '🏰'),
            '#d4af37', TRUE)
    RETURNING id INTO v_casa_id;

    RETURN v_casa_id;
END;
$$;

REVOKE ALL ON FUNCTION public.crear_casa_superadmin(TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.crear_casa_superadmin(TEXT, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;

-- Fuerza a PostgREST/Supabase a actualizar la caché de funciones RPC.
NOTIFY pgrst, 'reload schema';
