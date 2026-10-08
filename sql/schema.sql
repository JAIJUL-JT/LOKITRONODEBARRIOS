-- ==============================================================================
-- 🏰 EL TRONO DEL PINTXO - ESQUEMA SUPABASE POSTGRESQL
-- Arquitectura Feudal: Tablas, Políticas RLS, Ley II de Rankings y Webhook Make
-- ==============================================================================

-- 1. Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_net";

-- 2. Limpieza de tablas previas (opcional si se recrea)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'juicios'
    ) THEN
        DROP TRIGGER IF EXISTS juicio_insertado ON juicios;
    END IF;
END $$;
DROP FUNCTION IF EXISTS notificar_make();
DROP FUNCTION IF EXISTS calcular_ranking();
DROP TABLE IF EXISTS juicios CASCADE;
DROP TABLE IF EXISTS codigos_diarios CASCADE;
DROP TABLE IF EXISTS maestres CASCADE;
DROP TABLE IF EXISTS casas CASCADE;
DROP TABLE IF EXISTS authorized_users CASCADE;

-- ==============================================================================
-- 3. TABLAS FEUDALES
-- ==============================================================================

-- Casas feudales (Barrios de Bilbao)
CREATE TABLE casas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL UNIQUE,
    lema TEXT,
    emblema TEXT, -- Icono o emoji representativo
    color_heraldo TEXT DEFAULT '#d4af37', -- Color heráldico
    imagen_url TEXT,
    participa BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Maestres (Jurados / Usuarios participantes)
CREATE TABLE maestres (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alias TEXT NOT NULL UNIQUE,
    casa_origen UUID REFERENCES casas(id) ON DELETE SET NULL,
    clave_secreta TEXT,
    email TEXT,
    puntos_honor INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Juicios Reales (Votos y calificaciones - Voto único por Maestre y Barrio)
CREATE TABLE juicios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    maestre_id UUID REFERENCES maestres(id) ON DELETE CASCADE,
    casa_visitada UUID NOT NULL REFERENCES casas(id) ON DELETE CASCADE,
    festin INT NOT NULL CHECK (festin BETWEEN 1 AND 10),     -- Sabor, presentación, elaboración del pintxo
    caminos INT NOT NULL CHECK (caminos BETWEEN 1 AND 10),   -- Ruta, ambiente, enclave barrial
    espiritu INT NOT NULL CHECK (espiritu BETWEEN 1 AND 10), -- Hospitalidad, atención, fervor tabernero
    codigo TEXT,                                             -- Código de sello diario verificado
    comentario TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(maestre_id, casa_visitada)                        -- Ley de Bilbao: Voto único por barrio
);

-- Códigos de Sello Diario (Códigos QR / validación por jornada)
CREATE TABLE codigos_diarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    casa_id UUID NOT NULL REFERENCES casas(id) ON DELETE CASCADE,
    codigo TEXT NOT NULL,
    fecha DATE DEFAULT CURRENT_DATE,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(casa_id, fecha, codigo)
);

-- Usuarios Autorizados para la Autenticación por Teléfono / WhatsApp
CREATE TABLE authorized_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone TEXT UNIQUE,
    name TEXT,
    email TEXT UNIQUE,
    role TEXT DEFAULT 'jugador' CHECK (role IN ('jugador', 'tronista', 'superadmin')),
    pin_code VARCHAR(4),
    barrio_asignado TEXT,
    barrio_representado TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);


-- ==============================================================================
-- 4. POLÍTICAS RLS (Seguridad Feudal)
-- ============================================================================

ALTER TABLE casas ENABLE ROW LEVEL SECURITY;
ALTER TABLE maestres ENABLE ROW LEVEL SECURITY;
ALTER TABLE juicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE codigos_diarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE authorized_users ENABLE ROW LEVEL SECURITY;

-- Función helper para comprobar si el usuario actual es superadministrador
CREATE OR REPLACE FUNCTION is_superadmin()
RETURNS BOOLEAN LANGUAGE sql STABLE AS $$
    SELECT EXISTS (
        SELECT 1 FROM authorized_users au
        WHERE au.role = 'superadmin' AND (
            (au.email IS NOT NULL AND au.email = current_setting('jwt.claims.email', true))
            OR
            (au.phone IS NOT NULL AND au.phone = current_setting('jwt.claims.phone', true))
        )
    );
$$;

-- Policies for authorized_users: only superadmins can read/manage
CREATE POLICY "authorized_users_superadmin_select"
    ON authorized_users FOR SELECT USING (is_superadmin());

CREATE POLICY "authorized_users_superadmin_manage"
    ON authorized_users FOR ALL USING (is_superadmin()) WITH CHECK (is_superadmin());

-- Políticas para 'casas': lectura pública, gestión solo por superadmins
CREATE POLICY "casas_public_select" 
    ON casas FOR SELECT USING (true);

CREATE POLICY "casas_superadmin_manage"
    ON casas FOR ALL USING (is_superadmin()) WITH CHECK (is_superadmin());

-- Políticas para 'maestres': lectura pública, gestión solo por superadmins
CREATE POLICY "maestres_public_select" 
    ON maestres FOR SELECT USING (true);

CREATE POLICY "maestres_superadmin_manage"
    ON maestres FOR ALL USING (is_superadmin()) WITH CHECK (is_superadmin());

-- Políticas para 'juicios': lectura pública, inserción por usuarios autenticados,
-- modificaciones (UPDATE/DELETE) solo por superadmins
CREATE POLICY "juicios_public_select" 
    ON juicios FOR SELECT USING (true);

CREATE POLICY "juicios_insert_authenticated"
    ON juicios FOR INSERT WITH CHECK (current_setting('jwt.claims.sub', true) IS NOT NULL);

CREATE POLICY "juicios_admin_modify"
    ON juicios FOR UPDATE USING (is_superadmin()) WITH CHECK (is_superadmin());

CREATE POLICY "juicios_admin_delete"
    ON juicios FOR DELETE USING (is_superadmin());

-- Políticas para 'codigos_diarios': lectura pública de activos, gestión por superadmins
CREATE POLICY "codigos_public_select_active" 
    ON codigos_diarios FOR SELECT USING (activo = true);

CREATE POLICY "codigos_superadmin_manage"
    ON codigos_diarios FOR ALL USING (is_superadmin()) WITH CHECK (is_superadmin());

-- ==============================================================================
-- 5. LEY II DE BILBAO: FUNCIÓN calcular_ranking() (Media Ponderada y Relativa)
-- ==============================================================================
-- Calcula la clasificación feudal de cada casa con ponderación:
--   Festín: 50%, Caminos: 25%, Espíritu: 25%
-- Aplica media bayesiana/relativa para equilibrar casas con pocos votos frente
-- a casas populares, evitando que una casa con un solo 10 gane injustamente.
CREATE OR REPLACE FUNCTION calcular_ranking()
RETURNS TABLE (
    posicion BIGINT,
    casa_id UUID,
    nombre TEXT,
    lema TEXT,
    emblema TEXT,
    color_heraldo TEXT,
    total_juicios BIGINT,
    media_festin NUMERIC(4,2),
    media_caminos NUMERIC(4,2),
    media_espiritu NUMERIC(4,2),
    puntuacion_final NUMERIC(4,2)
) LANGUAGE plpgsql AS $$
DECLARE
    v_media_global NUMERIC(4,2);
    v_umbral_confianza NUMERIC := 3.0; -- Cantidad mínima ponderada de votos
BEGIN
    -- Media global de todos los juicios emitidos en el reino
    SELECT COALESCE(ROUND(AVG(0.50 * j.festin + 0.25 * j.caminos + 0.25 * j.espiritu), 2), 7.00)
    INTO v_media_global
    FROM juicios j
    JOIN casas c ON c.id = j.casa_visitada
    WHERE c.participa;

    RETURN QUERY
    WITH metricas_casa AS (
        SELECT 
            c.id,
            c.nombre,
            c.lema,
            c.emblema,
            c.color_heraldo,
            COUNT(j.id) AS recuento_juicios,
            ROUND(AVG(j.festin), 2) AS prom_festin,
            ROUND(AVG(j.caminos), 2) AS prom_caminos,
            ROUND(AVG(j.espiritu), 2) AS prom_espiritu,
            ROUND(AVG(0.50 * j.festin + 0.25 * j.caminos + 0.25 * j.espiritu), 2) AS prom_crudo
        FROM casas c
        LEFT JOIN juicios j ON c.id = j.casa_visitada
        WHERE c.participa
        GROUP BY c.id, c.nombre, c.lema, c.emblema, c.color_heraldo
    ),
    ranking_calculado AS (
        SELECT 
            m.id AS r_casa_id,
            m.nombre AS r_nombre,
            m.lema AS r_lema,
            m.emblema AS r_emblema,
            m.color_heraldo AS r_color_heraldo,
            m.recuento_juicios AS r_total_juicios,
            COALESCE(m.prom_festin, 0.00) AS r_media_festin,
            COALESCE(m.prom_caminos, 0.00) AS r_media_caminos,
            COALESCE(m.prom_espiritu, 0.00) AS r_media_espiritu,
            -- Ley II (Media Ponderada Relativa con Suavizado Bayesiano):
            -- Puntuación = (recuento * prom_crudo + umbral * media_global) / (recuento + umbral)
            CASE 
                WHEN m.recuento_juicios = 0 THEN 0.00
                ELSE ROUND(
                    ((m.recuento_juicios * m.prom_crudo) + (v_umbral_confianza * v_media_global)) / 
                    (m.recuento_juicios + v_umbral_confianza),
                    2
                )
            END AS r_puntuacion_final
        FROM metricas_casa m
    )
    SELECT 
        ROW_NUMBER() OVER(ORDER BY r_puntuacion_final DESC, r_total_juicios DESC, r_nombre ASC) AS posicion,
        r_casa_id,
        r_nombre,
        r_lema,
        r_emblema,
        r_color_heraldo,
        r_total_juicios,
        r_media_festin,
        r_media_caminos,
        r_media_espiritu,
        r_puntuacion_final
    FROM ranking_calculado;
END;
$$;

CREATE OR REPLACE FUNCTION validar_casa_participante()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM casas
        WHERE id = NEW.casa_visitada
          AND (participa OR nombre = 'Forastero')
    ) THEN
        RAISE EXCEPTION 'Solo se puede votar a barrios participantes o al barrio Forastero.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER juicios_solo_casas_participantes
    BEFORE INSERT OR UPDATE OF casa_visitada ON juicios
    FOR EACH ROW EXECUTE FUNCTION validar_casa_participante();

-- ==============================================================================
-- 6. DISPARADOR MAKE: notificar_make() (El Mayordomo del Reino)
-- ==============================================================================
-- Envía un webhook HTTP POST con el nuevo juicio a Make.com mediante pg_net.
-- Configura TU_WEBHOOK_URL en Supabase o reemplaza 'TU_WEBHOOK_ID'.
CREATE OR REPLACE FUNCTION notificar_make()
RETURNS TRIGGER AS $$
DECLARE
    v_url TEXT := 'https://hook.eu1.make.com/TU_WEBHOOK_ID'; -- Reemplazar con webhook de Make
    v_payload JSONB;
    v_casa_nombre TEXT;
    v_maestre_alias TEXT;
BEGIN
    -- Obtener nombre de la casa y alias del maestre para enviar payload enriquecido
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

    -- Disparo asíncrono con pg_net si está habilitado
    BEGIN
        PERFORM net.http_post(
            url := v_url,
            headers := '{"Content-Type": "application/json"}'::jsonb,
            body := v_payload
        );
    EXCEPTION WHEN OTHERS THEN
        -- Si pg_net no está activo o la URL no es válida en desarrollo, no bloquear la inserción
        RAISE NOTICE 'Aviso Make no enviado: %', SQLERRM;
    END;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger sobre la tabla juicios
CREATE TRIGGER juicio_insertado
AFTER INSERT ON juicios
FOR EACH ROW EXECUTE FUNCTION notificar_make();

-- ==============================================================================
-- 7. FUNCIÓN AUXILIAR: Contar sellos de un Maestre (Para Pase VIP Dorado)
-- ==============================================================================
CREATE OR REPLACE FUNCTION sellos_por_maestre(p_maestre_id UUID)
RETURNS INT LANGUAGE plpgsql AS $$
DECLARE
    v_total_sellos INT;
BEGIN
    SELECT COUNT(DISTINCT casa_visitada)
    INTO v_total_sellos
    FROM juicios
    WHERE maestre_id = p_maestre_id AND codigo IS NOT NULL AND codigo <> '';

    RETURN COALESCE(v_total_sellos, 0);
END;
$$;

-- ==============================================================================
-- 8. DATOS INICIALES (Las 8 Casas Feudales de Bilbao)
-- ==============================================================================
INSERT INTO casas (nombre, lema, emblema, color_heraldo, imagen_url) VALUES
('Casco Viejo', 'Las Siete Calles de la Tradición y el Acero', '🏰', '#8b1e2f', 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop'),
('Indautxu', 'Vanguardia, Distinción y Sabores Nobles', '🍷', '#d4af37', 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=600&auto=format&fit=crop'),
('Deusto', 'La Ribera del Saber y el Brío Estudiantil', '⚓', '#1b4d3e', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop'),
('Santutxu', 'La Fortaleza del Orgullo y el Calor Barrial', '🛡️', '#c0392b', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop'),
('Abando', 'El Trono de la Gran Vía y el Esplendor Cívico', '👑', '#2c3e50', 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=600&auto=format&fit=crop'),
('San Mamés - Basurto', 'La Catedral de los Leones y el Fervor Inmortal', '🦁', '#e74c3c', 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&auto=format&fit=crop'),
('Bilbao La Vieja', 'El Puente Milenario, Arte y Resistencia Bohemia', '🌉', '#8e44ad', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop'),
('Uribarri', 'La Colina Vigilante y la Lealtad de las Alturas', '🦅', '#2980b9', 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=600&auto=format&fit=crop')
ON CONFLICT (nombre) DO UPDATE 
SET lema = EXCLUDED.lema, 
    emblema = EXCLUDED.emblema, 
    color_heraldo = EXCLUDED.color_heraldo;

INSERT INTO casas (nombre, lema, emblema, color_heraldo, participa) VALUES
('Forastero', 'Casa de origen para quienes vienen de fuera de los barrios participantes', '🌍', '#64748b', false)
ON CONFLICT (nombre) DO UPDATE SET participa = false;

-- Códigos de demostración para el día actual
INSERT INTO codigos_diarios (casa_id, codigo, fecha, activo)
SELECT id, 'PIN-' || UPPER(SUBSTRING(MD5(nombre || CURRENT_DATE::text) FROM 1 FOR 4)), CURRENT_DATE, true
FROM casas
ON CONFLICT (casa_id, fecha, codigo) DO NOTHING;

-- Usuarios Autorizados Iniciales (Ejemplo de inicio)
INSERT INTO authorized_users (phone, name, email, role, pin_code, barrio_asignado) VALUES
('+34605676002', 'Maestre Julio', NULL, 'superadmin', '1234', 'Indautxu'),
('605676002', 'Maestre Julio', NULL, 'superadmin', '1234', 'Indautxu')
ON CONFLICT (phone) DO UPDATE SET role = 'superadmin';
-- Usuario SORAYA para despliegue (teléfono, barrio y PIN)
INSERT INTO authorized_users (phone, name, email, role, pin_code, barrio_asignado) VALUES
('456123456', 'SORAYA', NULL, 'superadmin', '1234', 'Deusto'),
('123456789', 'Superadmin Bilbao', NULL, 'superadmin', '1234', 'Abando')
ON CONFLICT (phone) DO NOTHING;

-- Superadministrador inicial (para administración del sistema)
INSERT INTO authorized_users (phone, name, email, role) VALUES
(NULL, 'AFJ Bilbao', 'afjbilbao@gmail.com', 'superadmin')
ON CONFLICT (email) DO NOTHING;

