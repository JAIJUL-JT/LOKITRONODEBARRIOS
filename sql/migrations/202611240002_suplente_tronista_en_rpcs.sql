-- ============================================================================
-- MIGRACIÓN: Habilitar suplente_tronista en todas las RPCs de gestión
-- ============================================================================
-- La migración 202611240001 añadió el CHECK en la tabla, pero las funciones
-- helper lokitrono_validar_rol y lokitrono_puede_gestionar_rol no incluían
-- 'suplente_tronista', por lo que guardar/editar un usuario con ese rol
-- lo degradaba silenciosamente a 'jugador' o lanzaba error de permisos.

-- 1. VALIDAR ROL: añadir suplente_tronista a los roles reconocidos
CREATE OR REPLACE FUNCTION public.lokitrono_validar_rol(p_role TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
AS $$
    SELECT CASE
        WHEN btrim(COALESCE(p_role, '')) IN ('jugador', 'tronista', 'suplente_tronista', 'superadmin', 'master')
            THEN btrim(p_role)
        ELSE 'jugador'
    END;
$$;

-- 2. GESTIONAR ROL: superadmin puede también asignar/gestionar suplente_tronista
CREATE OR REPLACE FUNCTION public.lokitrono_puede_gestionar_rol(
    p_actor TEXT,
    p_target TEXT
)
RETURNS BOOLEAN
LANGUAGE sql
IMMUTABLE
AS $$
    SELECT CASE
        WHEN btrim(COALESCE(p_actor, '')) = 'master' THEN TRUE
        WHEN btrim(COALESCE(p_actor, '')) = 'superadmin'
            THEN btrim(COALESCE(p_target, '')) IN ('jugador', 'tronista', 'suplente_tronista')
        ELSE FALSE
    END;
$$;

-- 3. Permisos (mantenemos los existentes)
REVOKE ALL ON FUNCTION public.lokitrono_validar_rol(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.lokitrono_validar_rol(TEXT) TO anon, authenticated;
REVOKE ALL ON FUNCTION public.lokitrono_puede_gestionar_rol(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.lokitrono_puede_gestionar_rol(TEXT, TEXT) TO anon, authenticated;
