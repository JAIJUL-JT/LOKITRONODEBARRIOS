CREATE TABLE IF NOT EXISTS configuracion_reino (
    clave TEXT PRIMARY KEY,
    valor TEXT,
    descripcion TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO configuracion_reino (clave, valor, descripcion)
VALUES ('MAKE_WEBHOOK_URL', 'https://hook.eu1.make.com/uqb4kqpu9dnu82r3wyep3jegknqlsubk', 'Webhook global para notificaciones de juicios a Make.com')
ON CONFLICT (clave) DO NOTHING;

-- Actualizar la función notificar_make para que use la tabla de configuración
CREATE OR REPLACE FUNCTION notificar_make()
RETURNS TRIGGER AS $$
DECLARE
    v_url TEXT;
    v_payload JSONB;
    v_casa_nombre TEXT;
    v_maestre_alias TEXT;
BEGIN
    -- Obtener la URL desde la configuración
    SELECT valor INTO v_url FROM configuracion_reino WHERE clave = 'MAKE_WEBHOOK_URL';
    
    -- Fallback si no existe en la tabla
    IF v_url IS NULL THEN
        v_url := 'https://hook.eu1.make.com/uqb4kqpu9dnu82r3wyep3jegknqlsubk';
    END IF;

    -- Obtener nombre de la casa y alias del maestre
    SELECT nombre INTO v_casa_nombre FROM casas WHERE id = NEW.casa_visitada;
    SELECT alias INTO v_maestre_alias FROM maestres WHERE id = NEW.maestre_id;

    v_payload := jsonb_build_object(
        'evento', 'NUEVO_JUICIO',
        'juicio_id', NEW.id,
        'maestre_id', NEW.maestre_id,
        'maestre_alias', COALESCE(v_maestre_alias, 'Maestre Desconocido'),
        'casa_id', NEW.casa_visitada,
        'casa_nombre', COALESCE(v_casa_nombre, 'Casa Desconocida'),
        'festin', NEW.festin,
        'caminos', NEW.caminos,
        'espiritu', NEW.espiritu,
        'codigo_sello', NEW.codigo,
        'comentario', NEW.comentario,
        'fecha', NEW.created_at
    );

    BEGIN
        PERFORM net.http_post(
            url := v_url,
            headers := '{"Content-Type": "application/json"}'::jsonb,
            body := v_payload
        );
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Aviso Make no enviado: %', SQLERRM;
    END;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
