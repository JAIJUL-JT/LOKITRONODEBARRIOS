-- ==============================================================================
-- Migración: RPC para que el master (o superadmin) pueda cambiar su propio PIN sin
-- necesidad de proveer el PIN actual.
-- Fecha: 2026-11-05
-- ==============================================================================

-- Permite a un usuario con rol 'master' o 'superadmin' (según la política is_superadmin)
-- establecer un nuevo PIN para cualquier usuario (incluido él mismo).
CREATE OR REPLACE FUNCTION public.editar_pin_master(
    p_usuario_id UUID,
    p_nuevo_pin TEXT
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'extensions'
AS $$
DECLARE
    v_actor_role TEXT;
BEGIN
    -- Verifica que quien llama la función sea master o superadmin usando la política
    IF NOT public.is_superadmin() THEN
        RAISE EXCEPTION 'No autorizado: se requiere una cuenta administradora válida.';
    END IF;

    -- Actualiza el PIN sin requerir la autenticación previa del usuario objetivo.
    UPDATE public.authorized_users
    SET pin_hash = crypt(p_nuevo_pin, gen_salt('bf')),
        pin_code = p_nuevo_pin
    WHERE id = p_usuario_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se ha encontrado el usuario indicado.';
    END IF;

    RETURN TRUE;
END;
$$;

GRANT EXECUTE ON FUNCTION public.editar_pin_master(UUID, TEXT) TO anon, authenticated;
