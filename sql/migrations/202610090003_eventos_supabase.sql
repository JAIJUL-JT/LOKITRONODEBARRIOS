-- ============================================================
-- LOKITRONO: EVENTOS COMPARTIDOS EN SUPABASE
-- Migración: 202610090003
-- ============================================================

CREATE TABLE IF NOT EXISTS public.eventos (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    barrio TEXT NOT NULL DEFAULT 'Reino',
    fecha DATE NOT NULL,
    lugar TEXT NOT NULL,
    hora TEXT NOT NULL DEFAULT '20:00',
    hora_inicio_votacion TEXT NOT NULL DEFAULT '20:30',
    hora_fin_votacion TEXT NOT NULL DEFAULT '23:30',
    descripcion TEXT NOT NULL DEFAULT '',
    cerrado_manualmente BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;

-- Los eventos pueden consultarse sin iniciar sesión.
DROP POLICY IF EXISTS eventos_public_select ON public.eventos;

CREATE POLICY eventos_public_select
ON public.eventos
FOR SELECT
TO anon, authenticated
USING (TRUE);

-- No se conceden permisos de escritura directa a los navegadores.
REVOKE INSERT, UPDATE, DELETE
ON public.eventos
FROM PUBLIC, anon, authenticated;

GRANT SELECT
ON public.eventos
TO anon, authenticated;


-- ============================================================
-- FUNCIÓN PRIVADA DE VALIDACIÓN DEL SUPERADMINISTRADOR
-- ============================================================

CREATE OR REPLACE FUNCTION public.validar_superadmin_eventos(
    p_phone TEXT,
    p_pin TEXT
)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.authorized_users au
        WHERE au.role = 'superadmin'
          AND btrim(COALESCE(au.pin_code, '')) =
              btrim(COALESCE(p_pin, ''))
          AND (
              regexp_replace(
                  COALESCE(au.phone, ''),
                  '[^0-9]', '', 'g'
              ) =
              regexp_replace(
                  COALESCE(p_phone, ''),
                  '[^0-9]', '', 'g'
              )
              OR (
                  length(
                      regexp_replace(
                          COALESCE(p_phone, ''),
                          '[^0-9]', '', 'g'
                      )
                  ) = 9
                  AND right(
                      regexp_replace(
                          COALESCE(au.phone, ''),
                          '[^0-9]', '', 'g'
                      ),
                      9
                  ) =
                  regexp_replace(
                      COALESCE(p_phone, ''),
                      '[^0-9]', '', 'g'
                  )
              )
          )
    );
$$;

REVOKE ALL
ON FUNCTION public.validar_superadmin_eventos(TEXT, TEXT)
FROM PUBLIC, anon, authenticated;


-- ============================================================
-- CREAR O ACTUALIZAR UN EVENTO
-- ============================================================

CREATE OR REPLACE FUNCTION public.guardar_evento_superadmin(
    p_phone TEXT,
    p_pin TEXT,
    p_evento JSONB
)
RETURNS JSONB
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_id TEXT;
    v_resultado public.eventos%ROWTYPE;
BEGIN
    IF NOT public.validar_superadmin_eventos(p_phone, p_pin) THEN
        RAISE EXCEPTION
            'No autorizado: se requiere una cuenta superadministradora válida.';
    END IF;

    v_id := NULLIF(btrim(p_evento->>'id'), '');

    IF v_id IS NULL THEN
        RAISE EXCEPTION 'El identificador del evento es obligatorio.';
    END IF;

    IF NULLIF(btrim(p_evento->>'nombre'), '') IS NULL THEN
        RAISE EXCEPTION 'El nombre del evento es obligatorio.';
    END IF;

    IF NULLIF(btrim(p_evento->>'fecha'), '') IS NULL THEN
        RAISE EXCEPTION 'La fecha del evento es obligatoria.';
    END IF;

    IF NULLIF(btrim(p_evento->>'lugar'), '') IS NULL THEN
        RAISE EXCEPTION 'El lugar del evento es obligatorio.';
    END IF;

    INSERT INTO public.eventos (
        id,
        nombre,
        barrio,
        fecha,
        lugar,
        hora,
        hora_inicio_votacion,
        hora_fin_votacion,
        descripcion,
        cerrado_manualmente,
        updated_at
    )
    VALUES (
        v_id,
        btrim(p_evento->>'nombre'),
        COALESCE(NULLIF(btrim(p_evento->>'barrio'), ''), 'Reino'),
        (p_evento->>'fecha')::DATE,
        btrim(p_evento->>'lugar'),
        COALESCE(NULLIF(p_evento->>'hora', ''), '20:00'),
        COALESCE(NULLIF(p_evento->>'hora_inicio_votacion', ''), '20:30'),
        COALESCE(NULLIF(p_evento->>'hora_fin_votacion', ''), '23:30'),
        COALESCE(p_evento->>'desc', p_evento->>'descripcion', ''),
        COALESCE((p_evento->>'cerrado_manualmente')::BOOLEAN, FALSE),
        NOW()
    )
    ON CONFLICT (id)
    DO UPDATE SET
        nombre = EXCLUDED.nombre,
        barrio = EXCLUDED.barrio,
        fecha = EXCLUDED.fecha,
        lugar = EXCLUDED.lugar,
        hora = EXCLUDED.hora,
        hora_inicio_votacion = EXCLUDED.hora_inicio_votacion,
        hora_fin_votacion = EXCLUDED.hora_fin_votacion,
        descripcion = EXCLUDED.descripcion,
        cerrado_manualmente = EXCLUDED.cerrado_manualmente,
        updated_at = NOW()
    RETURNING * INTO v_resultado;

    RETURN jsonb_build_object(
        'id', v_resultado.id,
        'nombre', v_resultado.nombre,
        'barrio', v_resultado.barrio,
        'fecha', v_resultado.fecha,
        'lugar', v_resultado.lugar,
        'hora', v_resultado.hora,
        'hora_inicio_votacion', v_resultado.hora_inicio_votacion,
        'hora_fin_votacion', v_resultado.hora_fin_votacion,
        'desc', v_resultado.descripcion,
        'cerrado_manualmente', v_resultado.cerrado_manualmente
    );
END;
$$;


-- ============================================================
-- ELIMINAR UN EVENTO
-- ============================================================

CREATE OR REPLACE FUNCTION public.eliminar_evento_superadmin(
    p_phone TEXT,
    p_pin TEXT,
    p_evento_id TEXT
)
RETURNS BOOLEAN
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NOT public.validar_superadmin_eventos(p_phone, p_pin) THEN
        RAISE EXCEPTION
            'No autorizado: se requiere una cuenta superadministradora válida.';
    END IF;

    DELETE FROM public.eventos
    WHERE id = p_evento_id;

    RETURN FOUND;
END;
$$;


-- ============================================================
-- PERMISOS DE LAS FUNCIONES
-- ============================================================

REVOKE ALL
ON FUNCTION public.guardar_evento_superadmin(TEXT, TEXT, JSONB)
FROM PUBLIC;

REVOKE ALL
ON FUNCTION public.eliminar_evento_superadmin(TEXT, TEXT, TEXT)
FROM PUBLIC;

GRANT EXECUTE
ON FUNCTION public.guardar_evento_superadmin(TEXT, TEXT, JSONB)
TO anon, authenticated;

GRANT EXECUTE
ON FUNCTION public.eliminar_evento_superadmin(TEXT, TEXT, TEXT)
TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
