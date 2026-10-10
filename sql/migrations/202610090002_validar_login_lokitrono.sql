-- Autenticación centralizada de LokiTrono.
-- Ejecutar en Supabase > SQL Editor.
-- Valida teléfono/PIN en servidor y devuelve solo los datos de perfil necesarios;
-- nunca devuelve pin_code ni confía en el rol del navegador.
CREATE OR REPLACE FUNCTION public.validar_login_lokitrono(
    p_phone TEXT,
    p_pin TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user public.authorized_users%ROWTYPE;
    v_phone_digits TEXT;
BEGIN
    v_phone_digits := regexp_replace(COALESCE(p_phone, ''), '[^0-9]', '', 'g');

    SELECT au.* INTO v_user
    FROM public.authorized_users au
    WHERE au.pin_code = btrim(COALESCE(p_pin, ''))
      AND (
        regexp_replace(COALESCE(au.phone, ''), '[^0-9]', '', 'g') = v_phone_digits
        OR (
          length(v_phone_digits) = 9
          AND right(regexp_replace(COALESCE(au.phone, ''), '[^0-9]', '', 'g'), 9) = v_phone_digits
        )
      )
    LIMIT 1;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Teléfono o PIN incorrectos, o cuenta no autorizada.';
    END IF;

    RETURN jsonb_build_object(
        'id', v_user.id,
        'phone', v_user.phone,
        'name', v_user.name,
        'email', v_user.email,
        'role', v_user.role,
        'barrio_asignado', v_user.barrio_asignado,
        'barrio_representado', v_user.barrio_representado
    );
END;
$$;

REVOKE ALL ON FUNCTION public.validar_login_lokitrono(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.validar_login_lokitrono(TEXT, TEXT) TO anon, authenticated;
NOTIFY pgrst, 'reload schema';
