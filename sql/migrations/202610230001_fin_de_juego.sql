-- ============================================================
-- LOKITRONO: FIN DEL JUEGO Y PROTECCIÓN DE LOS DATOS
-- Migración: 202610230001
-- Objetivos:
--   1) Estado del juego (abierto / finalizado) en tabla dedicada.
--   2) RPC `finalizar_juego` exclusiva del Master: cierra el juego y
--      protege los datos; solo el Master puede reabrirlo.
--   3) Mientras el juego está finalizado, se bloquea por completo la
--      escritura en las tablas clave (eventos, votos, casas y usuarios).
-- ============================================================

CREATE TABLE IF NOT EXISTS public.estado_juego (
    id INT PRIMARY KEY DEFAULT 1,
    finalizado BOOLEAN NOT NULL DEFAULT FALSE,
    finalizado_at TIMESTAMPTZ,
    finalizado_por TEXT,
    CONSTRAINT estado_juego_fila_unica CHECK (id = 1)
);

INSERT INTO public.estado_juego (id, finalizado)
VALUES (1, FALSE)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.estado_juego ENABLE ROW LEVEL SECURITY;

-- Nadie accede directamente; solo a través de las RPC (SECURITY DEFINER).
REVOKE ALL ON public.estado_juego FROM PUBLIC, anon, authenticated;

-- ------------------------------------------------------------
-- Estado actual del juego (lectura pública a través de RPC).
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.estado_juego_actual()
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT jsonb_build_object(
        'finalizado', COALESCE(e.finalizado, FALSE),
        'finalizado_at', e.finalizado_at,
        'finalizado_por', e.finalizado_por
    )
    FROM public.estado_juego e
    WHERE e.id = 1;
$$;

REVOKE ALL ON FUNCTION public.estado_juego_actual() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.estado_juego_actual() TO anon, authenticated;

-- ------------------------------------------------------------
-- FINALIZAR / REABRIR EL JUEGO (exclusiva del Master).
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.finalizar_juego(
    p_token UUID,
    p_finalizado BOOLEAN DEFAULT TRUE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_actor public.authorized_users;
BEGIN
    v_actor := public.lokitrono_usuario_de_token(p_token);
    IF v_actor.id IS NULL THEN
        RAISE EXCEPTION 'No autorizado: se requiere una cuenta válida.';
    END IF;
    IF v_actor.role <> 'master' THEN
        RAISE EXCEPTION 'Solo el Master puede finalizar o reabrir el juego.';
    END IF;

    UPDATE public.estado_juego
    SET finalizado = p_finalizado,
        finalizado_at = CASE WHEN p_finalizado THEN now() ELSE NULL END,
        finalizado_por = CASE WHEN p_finalizado THEN v_actor.name ELSE NULL END
    WHERE id = 1;

    RETURN public.estado_juego_actual();
END;
$$;

REVOKE ALL ON FUNCTION public.finalizar_juego(UUID, BOOLEAN) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.finalizar_juego(UUID, BOOLEAN) TO anon, authenticated;

-- ------------------------------------------------------------
-- Protección: con el juego finalizado se bloquea toda escritura en
-- las tablas clave. Solo se reabre el juego desde la RPC del Master.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.bloquear_escritura_juego_finalizado()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF COALESCE((SELECT finalizado FROM public.estado_juego WHERE id = 1), FALSE) THEN
        RAISE EXCEPTION 'La competición está finalizada y sus datos protegidos. Solo el Master puede reabrirla para modificarlos.';
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_bloqueo_final_eventos ON public.eventos;
CREATE TRIGGER trg_bloqueo_final_eventos
    BEFORE INSERT OR UPDATE OR DELETE ON public.eventos
    FOR EACH ROW EXECUTE FUNCTION public.bloquear_escritura_juego_finalizado();

DROP TRIGGER IF EXISTS trg_bloqueo_final_votos ON public.votos_evento;
CREATE TRIGGER trg_bloqueo_final_votos
    BEFORE INSERT OR UPDATE OR DELETE ON public.votos_evento
    FOR EACH ROW EXECUTE FUNCTION public.bloquear_escritura_juego_finalizado();

DROP TRIGGER IF EXISTS trg_bloqueo_final_casas ON public.casas;
CREATE TRIGGER trg_bloqueo_final_casas
    BEFORE INSERT OR UPDATE OR DELETE ON public.casas
    FOR EACH ROW EXECUTE FUNCTION public.bloquear_escritura_juego_finalizado();

DROP TRIGGER IF EXISTS trg_bloqueo_final_usuarios ON public.authorized_users;
CREATE TRIGGER trg_bloqueo_final_usuarios
    BEFORE INSERT OR UPDATE OR DELETE ON public.authorized_users
    FOR EACH ROW EXECUTE FUNCTION public.bloquear_escritura_juego_finalizado();

NOTIFY pgrst, 'reload schema';
