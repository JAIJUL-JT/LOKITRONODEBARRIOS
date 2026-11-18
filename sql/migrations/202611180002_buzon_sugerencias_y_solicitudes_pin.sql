-- ==============================================================================
-- BUZÓN DE SUGERENCIAS Y SOLICITUDES DE PIN DEL REINO
-- ==============================================================================
-- Tablas protegidas con RLS para almacenar sugerencias de usuarios y
-- peticiones de recuperación de PIN, consultables desde el panel de administración.

-- 1. Tabla de sugerencias
CREATE TABLE IF NOT EXISTS public.buzon_sugerencias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT,
    contacto TEXT,
    tipo TEXT NOT NULL DEFAULT 'mejora',
    mensaje TEXT NOT NULL,
    leido BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.buzon_sugerencias ENABLE ROW LEVEL SECURITY;

-- Lectura exclusiva para master / superadmin
DROP POLICY IF EXISTS buzon_sugerencias_admin_select ON public.buzon_sugerencias;
CREATE POLICY buzon_sugerencias_admin_select ON public.buzon_sugerencias
    FOR SELECT TO public
    USING (
        EXISTS (
            SELECT 1 FROM public.authorized_users au
            WHERE (au.role = 'master' OR au.role = 'superadmin')
        )
    );

-- Inserción pública permitida (cualquier usuario / visitante puede sugerir)
DROP POLICY IF EXISTS buzon_sugerencias_insert_public ON public.buzon_sugerencias;
CREATE POLICY buzon_sugerencias_insert_public ON public.buzon_sugerencias
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

-- 2. Tabla de solicitudes de PIN
CREATE TABLE IF NOT EXISTS public.solicitudes_pin (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    telefono TEXT NOT NULL,
    nombre TEXT,
    barrio TEXT,
    atendido BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.solicitudes_pin ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS solicitudes_pin_admin_select ON public.solicitudes_pin;
CREATE POLICY solicitudes_pin_admin_select ON public.solicitudes_pin
    FOR SELECT TO public
    USING (
        EXISTS (
            SELECT 1 FROM public.authorized_users au
            WHERE (au.role = 'master' OR au.role = 'superadmin')
        )
    );

DROP POLICY IF EXISTS solicitudes_pin_insert_public ON public.solicitudes_pin;
CREATE POLICY solicitudes_pin_insert_public ON public.solicitudes_pin
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

-- 3. Funciones RPC seguras para inserción directa desde el cliente
CREATE OR REPLACE FUNCTION public.registrar_sugerencia_reino(
    p_nombre TEXT,
    p_contacto TEXT,
    p_tipo TEXT,
    p_mensaje TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
    v_id UUID;
BEGIN
    IF btrim(COALESCE(p_mensaje, '')) = '' THEN
        RAISE EXCEPTION 'El mensaje de la sugerencia no puede estar vacío.';
    END IF;

    INSERT INTO public.buzon_sugerencias (nombre, contacto, tipo, mensaje)
    VALUES (
        NULLIF(btrim(p_nombre), ''),
        NULLIF(btrim(p_contacto), ''),
        COALESCE(NULLIF(btrim(p_tipo), ''), 'mejora'),
        btrim(p_mensaje)
    )
    RETURNING id INTO v_id;

    RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.registrar_solicitud_pin_reino(
    p_telefono TEXT,
    p_nombre TEXT,
    p_barrio TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
    v_id UUID;
BEGIN
    IF btrim(COALESCE(p_telefono, '')) = '' THEN
        RAISE EXCEPTION 'El teléfono es obligatorio.';
    END IF;

    INSERT INTO public.solicitudes_pin (telefono, nombre, barrio)
    VALUES (
        btrim(p_telefono),
        NULLIF(btrim(p_nombre), ''),
        NULLIF(btrim(p_barrio), '')
    )
    RETURNING id INTO v_id;

    RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.registrar_sugerencia_reino(TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.registrar_solicitud_pin_reino(TEXT, TEXT, TEXT) TO anon, authenticated;
