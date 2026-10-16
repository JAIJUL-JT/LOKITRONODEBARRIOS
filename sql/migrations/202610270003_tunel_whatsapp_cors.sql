-- ============================================================================
-- 202610270003_tunel_whatsapp_cors.sql
--
-- SOLUCIÓN DEFINITIVA A CORS: Envío de Webhooks vía Servidor (Supabase -> Make)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.enviar_webhook_whatsapp_admin(p_payload jsonb)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $$
DECLARE
    v_url TEXT;
BEGIN
    -- 1. Obtener la URL del webhook desde la tabla de configuración
    SELECT valor INTO v_url FROM configuracion_reino WHERE clave = 'MAKE_WEBHOOK_URL';
    
    -- Fallback si no existe en la tabla
    IF v_url IS NULL THEN
        v_url := 'https://hook.eu1.make.com/uqb4kqpu9dnu82r3wyep3jegknqlsubk';
    END IF;

    -- 2. Disparo asíncrono mediante pg_net (Servidor -> Servidor)
    -- Esto elimina cualquier problema de CORS del navegador.
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
