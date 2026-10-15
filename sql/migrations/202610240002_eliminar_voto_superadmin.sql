-- ============================================================
-- LOKITRONO: ELIMINAR UN VOTO DEL REPOSITORIO (Master / Superadmin)
-- Migración: 202610240002
-- Objetivo:
--   El botón 🗑️ del Repositorio Central solo borraba la copia local del
--   navegador; al recargar, los votos volvían desde Supabase. Esta RPC
--   borra el voto de verdad en `votos_evento`, autorizando por la sesión
--   del actor (token) y exigiendo rol master o superadmin.
--   Con el juego finalizado, el trigger de fin de juego impide el borrado.
-- ============================================================

CREATE OR REPLACE FUNCTION public.eliminar_voto_superadmin(
    p_token UUID,
    p_voto_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_actor public.authorized_users;
BEGIN
    v_actor := public.lokitrono_usuario_de_token(p_token);
    IF v_actor.id IS NULL OR v_actor.role NOT IN ('superadmin', 'master') THEN
        RAISE EXCEPTION 'No autorizado: se requiere una cuenta administradora válida.';
    END IF;

    IF p_voto_id IS NULL THEN
        RAISE EXCEPTION 'Debes indicar el voto a eliminar.';
    END IF;

    DELETE FROM public.votos_evento WHERE id = p_voto_id;
    RETURN FOUND;
END;
$$;

REVOKE ALL ON FUNCTION public.eliminar_voto_superadmin(UUID, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.eliminar_voto_superadmin(UUID, UUID) TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
