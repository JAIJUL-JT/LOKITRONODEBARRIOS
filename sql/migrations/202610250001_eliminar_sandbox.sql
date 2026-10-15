-- ============================================================================
-- LOKITRONO: ELIMINACIÓN DEFINITIVA DEL SANDBOX DE SIMULACIÓN
-- La funcionalidad de Sandbox se ha retirado por completo del cliente
-- (index.html y js/app.js). Esta migración elimina los objetos que creó la
-- migración 202610210001_juegos_reales_y_sandbox.sql para el Sandbox, sin
-- tocar el resto de la competición real (tabla juegos, juego oficial, etc.).
-- ============================================================================

-- 1. RPC del Sandbox (dependen de las tablas sandbox_*)
DROP FUNCTION IF EXISTS public.sandbox_reiniciar(UUID);
DROP FUNCTION IF EXISTS public.sandbox_cargar_partida(UUID);
DROP FUNCTION IF EXISTS public.sandbox_guardar_partida(UUID, JSONB);
DROP FUNCTION IF EXISTS public.sandbox_actor_de_token(UUID);

-- 2. Tablas espejo del Sandbox
DROP TABLE IF EXISTS public.sandbox_votos;
DROP TABLE IF EXISTS public.sandbox_eventos;
DROP TABLE IF EXISTS public.sandbox_usuarios;
DROP TABLE IF EXISTS public.sandbox_barrios;
DROP TABLE IF EXISTS public.sandbox_juegos;

-- 3. Retirar el modo 'sandbox' del catálogo de juegos reales
DO $$
DECLARE
    v_conname TEXT;
BEGIN
    SELECT c.conname
      INTO v_conname
      FROM pg_constraint c
      JOIN pg_class t ON t.oid = c.conrelid
      JOIN pg_namespace n ON n.oid = t.relnamespace
     WHERE n.nspname = 'public'
       AND t.relname = 'juegos'
       AND c.contype = 'c'
       AND pg_get_constraintdef(c.oid) ILIKE '%sandbox%'
     LIMIT 1;

    IF v_conname IS NOT NULL THEN
        EXECUTE format('ALTER TABLE public.juegos DROP CONSTRAINT %I', v_conname);
        UPDATE public.juegos SET modo = 'archivado' WHERE modo = 'sandbox';
        ALTER TABLE public.juegos
            ADD CONSTRAINT juegos_modo_check CHECK (modo IN ('oficial', 'archivado'));
    END IF;
END $$;
