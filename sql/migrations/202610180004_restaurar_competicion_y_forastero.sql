-- ==============================================================================
-- Restaurar la competición, retirar el barrio Altamira y normalizar Forastero
-- ==============================================================================
-- Requiere que existan `lokitrono_es_superadmin`, `casas`, `authorized_users`,
-- `juicios`, `votos_evento`, `eventos`, `codigos_diarios` y `orden_sorteo_barrios`.
-- ==============================================================================

-- ==============================================================================
-- 1. NORMALIZACIÓN DE BARRIO: vacío ⇒ Forastero
-- ==============================================================================
-- Cualquier alta o modificación de usuario deja los barrios sin asignar como
-- 'Forastero', que es el caso especial no competitivo del juego.
CREATE OR REPLACE FUNCTION public.normalizar_barrio_forastero()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.barrio_asignado := COALESCE(NULLIF(btrim(NEW.barrio_asignado), ''), 'Forastero');
    NEW.barrio_representado := COALESCE(NULLIF(btrim(NEW.barrio_representado), ''), 'Forastero');
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_normalizar_barrio_forastero ON public.authorized_users;
CREATE TRIGGER trg_normalizar_barrio_forastero
    BEFORE INSERT OR UPDATE ON public.authorized_users
    FOR EACH ROW EXECUTE FUNCTION public.normalizar_barrio_forastero();

-- Rellena huecos existentes.
UPDATE public.authorized_users
SET barrio_asignado = COALESCE(NULLIF(btrim(barrio_asignado), ''), 'Forastero'),
    barrio_representado = COALESCE(NULLIF(btrim(barrio_representado), ''), 'Forastero')
WHERE COALESCE(NULLIF(btrim(barrio_asignado), ''), '') = ''
   OR COALESCE(NULLIF(btrim(barrio_representado), ''), '') = '';

-- ==============================================================================
-- 2. RETIRAR EL BARRIO ALTAMIRA
-- ==============================================================================
-- Altamira no forma parte de los barrios oficiales de Bilbao: se elimina la casa
-- y se reasignan a Forastero los usuarios que la tuvieran como barrio.
UPDATE public.authorized_users
SET barrio_asignado = 'Forastero'
WHERE lower(btrim(COALESCE(barrio_asignado, ''))) = 'altamira';

UPDATE public.authorized_users
SET barrio_representado = 'Forastero'
WHERE lower(btrim(COALESCE(barrio_representado, ''))) = 'altamira';

DELETE FROM public.casas WHERE lower(btrim(nombre)) = 'altamira';

-- ==============================================================================
-- 3. ASEGURAR EL BARRIO FORASTERO
-- ==============================================================================
INSERT INTO public.casas (nombre, lema, emblema, color_heraldo, participa)
VALUES ('Forastero',
        'Casa de origen para quienes vienen de fuera de los barrios participantes',
        '🌍', '#64748b', false)
ON CONFLICT (nombre) DO UPDATE SET participa = false;

-- ==============================================================================
-- 4. RESTAURAR LA COMPETICIÓN (solo superadministrador)
-- ==============================================================================
-- Borra votos, eventos, códigos diarios y barrios (excepto Forastero), y deja
-- únicamente las cuentas master/superadmin con barrio Forastero. NO elimina los
-- maestres (jurados) ni los datos geográficos.
CREATE OR REPLACE FUNCTION public.restaurar_competicion_superadmin(
    p_phone TEXT,
    p_pin TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_orden INT := 0;
    v_votos INT := 0;
    v_juicios INT := 0;
    v_codigos INT := 0;
    v_eventos INT := 0;
    v_casas INT := 0;
    v_usuarios INT := 0;
BEGIN
    IF NOT public.lokitrono_es_superadmin(p_phone, p_pin) THEN
        RAISE EXCEPTION 'No autorizado: se requiere una cuenta superadministradora válida.';
    END IF;

    -- Votos y orden del sorteo.
    DELETE FROM public.orden_sorteo_barrios;
    GET DIAGNOSTICS v_orden = ROW_COUNT;

    DELETE FROM public.votos_evento;
    GET DIAGNOSTICS v_votos = ROW_COUNT;

    DELETE FROM public.juicios;
    GET DIAGNOSTICS v_juicios = ROW_COUNT;

    DELETE FROM public.codigos_diarios;
    GET DIAGNOSTICS v_codigos = ROW_COUNT;

    DELETE FROM public.eventos;
    GET DIAGNOSTICS v_eventos = ROW_COUNT;

    -- Barrios: se conserva únicamente Forastero (no competitivo).
    DELETE FROM public.casas WHERE btrim(nombre) <> 'Forastero';
    GET DIAGNOSTICS v_casas = ROW_COUNT;

    -- Usuarios: se conservan master y superadmin; el resto se elimina.
    DELETE FROM public.authorized_users WHERE role NOT IN ('master', 'superadmin');
    GET DIAGNOSTICS v_usuarios = ROW_COUNT;

    UPDATE public.authorized_users
    SET barrio_asignado = 'Forastero',
        barrio_representado = 'Forastero';

    INSERT INTO public.casas (nombre, lema, emblema, color_heraldo, participa)
    VALUES ('Forastero',
            'Casa de origen para quienes vienen de fuera de los barrios participantes',
            '🌍', '#64748b', false)
    ON CONFLICT (nombre) DO UPDATE SET participa = false;

    RETURN jsonb_build_object(
        'orden_sorteo', v_orden,
        'votos_evento', v_votos,
        'juicios', v_juicios,
        'codigos_diarios', v_codigos,
        'eventos', v_eventos,
        'casas_eliminadas', v_casas,
        'usuarios_eliminados', v_usuarios
    );
END;
$$;

-- ==============================================================================
-- 5. PERMISOS
-- ==============================================================================
REVOKE ALL ON FUNCTION public.restaurar_competicion_superadmin(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.restaurar_competicion_superadmin(TEXT, TEXT) TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
