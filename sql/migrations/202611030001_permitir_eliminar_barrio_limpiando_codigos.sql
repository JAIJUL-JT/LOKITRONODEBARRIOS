-- Migración: Permitir eliminar barrio limpiando códigos diarios huérfanos
-- Fecha: 2026-11-03

CREATE OR REPLACE FUNCTION public.eliminar_casa_superadmin(
    p_phone TEXT,
    p_pin TEXT,
    p_casa_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
    IF NOT public.lokitrono_es_superadmin(p_phone, p_pin) THEN
        RAISE EXCEPTION 'No autorizado: se requiere una cuenta superadministradora válida.';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.casas WHERE id = p_casa_id
    ) THEN
        RAISE EXCEPTION 'No se ha encontrado el barrio que deseas eliminar.';
    END IF;

    IF EXISTS (SELECT 1 FROM public.juicios WHERE casa_visitada = p_casa_id) THEN
        RAISE EXCEPTION 'Este barrio tiene votos o calificaciones. Desactívalo en lugar de eliminarlo.';
    END IF;

    IF EXISTS (SELECT 1 FROM public.votos_evento WHERE casa_id = p_casa_id) THEN
        RAISE EXCEPTION 'Este barrio tiene votos de eventos asociados. Desactívalo en lugar de eliminarlo.';
    END IF;

    IF EXISTS (SELECT 1 FROM public.maestres WHERE casa_origen = p_casa_id) THEN
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

    -- Si existen códigos diarios asociados a este barrio y no hay votos ni usuarios,
    -- se limpian automáticamente para permitir la eliminación física
    DELETE FROM public.codigos_diarios WHERE casa_id = p_casa_id;

    DELETE FROM public.casas WHERE id = p_casa_id;
    RETURN TRUE;
END;
$$;

NOTIFY pgrst, 'reload schema';
