-- ==============================================================================
-- Migración: RPC para que el master pueda editar su propio PIN
-- Fecha: 2026-11-05
-- ==============================================================================

-- Función que permite a un usuario con rol 'master' o 'superadmin' restablecer el PIN de cualquier usuario, incluido el propio.
CREATE OR REPLACE FUNCTION public.editar_pin_master(
    p_phone TEXT,
    p_pin TEXT,
    p_usuario_id UUID,
    p_nuevo_pin TEXT
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'extensions'
AS $$
BEGIN
    -- Reutiliza la lógica existente para restablecer PIN con verificación de permisos.
    RETURN public.restablecer_pin_superadmin(p_phone, p_pin, p_usuario_id, p_nuevo_pin);
END;
$$;

GRANT EXECUTE ON FUNCTION public.editar_pin_master(TEXT, TEXT, UUID, TEXT) TO anon, authenticated;
