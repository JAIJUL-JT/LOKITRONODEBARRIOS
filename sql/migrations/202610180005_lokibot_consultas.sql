-- Loki-Bot: registro de consultas no resueltas por el buscador de ayuda local.
--
-- El Loki-Bot es un bot de AYUDA sin IA: responde con una base de preguntas
-- frecuentes incrustada en el cliente (js/app.js). Cuando el buscador local no
-- encuentra respuesta, registra aquí la pregunta para que la organización
-- amplíe el manual de ayuda.
--
-- La tabla tiene RLS activado SIN políticas: el acceso directo queda denegado.
-- Solo se escribe/lee a través de funciones SECURITY DEFINER que validan el
-- token de sesión (mismo patrón que 202610130001 y 202610160001).
--
-- Requiere: 202610130001 (sesiones/token) y 202610170002 (RLS).

-- ==============================================================================
-- 1. TABLA DE CONSULTAS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.lokibot_consultas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pregunta TEXT NOT NULL,
    telefono TEXT,
    rol TEXT,
    resuelta BOOLEAN NOT NULL DEFAULT FALSE,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lokibot_consultas_creado_en_idx
    ON public.lokibot_consultas (creado_en DESC);

ALTER TABLE public.lokibot_consultas ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.lokibot_consultas FROM PUBLIC, anon, authenticated;

-- ==============================================================================
-- 2. REGISTRAR CONSULTA (usuario autenticado por token)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.registrar_consulta_lokibot(
    p_token UUID,
    p_pregunta TEXT,
    p_resuelta BOOLEAN DEFAULT FALSE
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
    v_actor public.authorized_users%ROWTYPE;
    v_pregunta TEXT;
BEGIN
    IF p_token IS NULL THEN
        RAISE EXCEPTION 'No autorizado: falta el token de sesión.';
    END IF;

    v_actor := public.lokitrono_usuario_de_token(p_token);
    IF v_actor IS NULL THEN
        RAISE EXCEPTION 'No autorizado: sesión no válida.';
    END IF;

    v_pregunta := btrim(coalesce(p_pregunta, ''));
    IF v_pregunta = '' THEN
        RAISE EXCEPTION 'La consulta no puede estar vacía.';
    END IF;

    INSERT INTO public.lokibot_consultas (pregunta, telefono, rol, resuelta)
    VALUES (left(v_pregunta, 2000), v_actor.phone, v_actor.role, COALESCE(p_resuelta, FALSE));
END;
$$;

REVOKE ALL ON FUNCTION public.registrar_consulta_lokibot(UUID, TEXT, BOOLEAN) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.registrar_consulta_lokibot(UUID, TEXT, BOOLEAN) TO anon, authenticated;

-- ==============================================================================
-- 3. LISTAR CONSULTAS (solo superadmin/master)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.listar_consultas_lokibot(
    p_token UUID
)
RETURNS TABLE (
    id UUID,
    pregunta TEXT,
    telefono TEXT,
    rol TEXT,
    resuelta BOOLEAN,
    creado_en TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
    v_actor public.authorized_users%ROWTYPE;
BEGIN
    IF p_token IS NULL THEN
        RAISE EXCEPTION 'No autorizado: falta el token de sesión.';
    END IF;

    v_actor := public.lokitrono_usuario_de_token(p_token);
    IF v_actor IS NULL OR v_actor.role NOT IN ('superadmin', 'master') THEN
        RAISE EXCEPTION 'No autorizado: se requiere una cuenta administradora válida.';
    END IF;

    RETURN QUERY
    SELECT l.id, l.pregunta, l.telefono, l.rol, l.resuelta, l.creado_en
    FROM public.lokibot_consultas l
    ORDER BY l.creado_en DESC
    LIMIT 500;
END;
$$;

REVOKE ALL ON FUNCTION public.listar_consultas_lokibot(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.listar_consultas_lokibot(UUID) TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
