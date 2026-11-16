-- ==============================================================================
-- ACTUALIZACIÓN DE WEBHOOK MAKE ACTIVO Y CONFIGURACIÓN DEL REINO
-- ==============================================================================
-- El webhook https://hook.eu1.make.com/8gare3elotna39vuqba1t3spp6kk7nb9 quedó inactivo en Make.
-- Se restablece la URL activa del Mayordomo del Reino:
-- https://hook.eu1.make.com/uqb4kqpu9dnu82r3wyep3jegknqlsubk

INSERT INTO public.configuracion_reino (clave, valor, descripcion, updated_at)
VALUES (
    'MAKE_WEBHOOK_URL', 
    'https://hook.eu1.make.com/uqb4kqpu9dnu82r3wyep3jegknqlsubk', 
    'Webhook activo global para notificaciones del Reino, alertas y recuperación de PIN a Make.com',
    NOW()
)
ON CONFLICT (clave) DO UPDATE 
SET valor = EXCLUDED.valor,
    updated_at = NOW();

CREATE OR REPLACE FUNCTION public.enviar_webhook_whatsapp_admin(p_payload jsonb)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $$
DECLARE
    v_url TEXT;
BEGIN
    SELECT valor INTO v_url FROM configuracion_reino WHERE clave = 'MAKE_WEBHOOK_URL';
    
    IF v_url IS NULL OR trim(v_url) = '' THEN
        v_url := 'https://hook.eu1.make.com/uqb4kqpu9dnu82r3wyep3jegknqlsubk';
    END IF;

    BEGIN
        PERFORM net.http_post(
            url := v_url,
            headers := '{"Content-Type": "application/json"}'::jsonb,
            body := p_payload
        );
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Error disparando webhook desde servidor: %', SQLERRM;
        RETURN FALSE;
    END;

    RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION public.enviar_webhook_whatsapp_admin(jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.enviar_webhook_whatsapp_admin(jsonb) TO anon, authenticated;
