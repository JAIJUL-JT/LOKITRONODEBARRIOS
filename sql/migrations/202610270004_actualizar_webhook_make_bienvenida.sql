-- ============================================================================
-- 202610270004_actualizar_webhook_make_bienvenida.sql
--
-- Actualiza la URL por defecto del Webhook de Make para bienvenidas de WhatsApp
-- ============================================================================

INSERT INTO configuracion_reino (clave, valor, descripcion, updated_at)
VALUES (
    'MAKE_WEBHOOK_URL', 
    'https://hook.eu1.make.com/8gare3elotna39vuqba1t3spp6kk7nb9', 
    'Webhook oficial de Make.com para bienvenidas por WhatsApp',
    NOW()
)
ON CONFLICT (clave) DO UPDATE 
SET valor = EXCLUDED.valor,
    updated_at = NOW();

-- Actualizar función con el nuevo fallback por si la tabla no tuviese registro
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
        v_url := 'https://hook.eu1.make.com/8gare3elotna39vuqba1t3spp6kk7nb9';
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
