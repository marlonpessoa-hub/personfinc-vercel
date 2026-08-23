CREATE OR REPLACE FUNCTION private.generate_access_key_impl(
  _valid_days integer,
  _note text DEFAULT NULL,
  _creator uuid DEFAULT NULL
)
RETURNS public.access_keys
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _code text;
  _row public.access_keys;
BEGIN
  IF _valid_days IS NULL OR _valid_days < 1 OR _valid_days > 3650 THEN
    RAISE EXCEPTION 'Validade inválida';
  END IF;

  LOOP
    _code := 'PFIN-' || array_to_string(ARRAY(
      SELECT substr('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', floor(random()*32)::int + 1, 1)
      FROM generate_series(1, 12)
    ), '');
    _code := 'PFIN-' || substr(_code, 6, 4) || '-' || substr(_code, 10, 4) || '-' || substr(_code, 14, 4);
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.access_keys WHERE code = _code);
  END LOOP;

  INSERT INTO public.access_keys (code, valid_days, note, created_by)
  VALUES (_code, _valid_days, _note, _creator)
  RETURNING * INTO _row;
  RETURN _row;
END;
$$;

CREATE OR REPLACE FUNCTION private.redeem_access_key_impl(
  _code text,
  _uid uuid
)
RETURNS timestamp with time zone
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _key public.access_keys;
  _base timestamptz;
  _new_expires timestamptz;
BEGIN
  SELECT * INTO _key FROM public.access_keys
  WHERE upper(trim(code)) = upper(trim(_code)) FOR UPDATE;

  IF _key.id IS NULL THEN
    RAISE EXCEPTION 'Chave inválida';
  END IF;
  IF _key.revoked_at IS NOT NULL THEN
    RAISE EXCEPTION 'Chave revogada';
  END IF;
  IF _key.redeemed_by IS NOT NULL THEN
    RAISE EXCEPTION 'Chave já utilizada';
  END IF;

  SELECT expires_at INTO _base FROM public.account_access WHERE user_id = _uid;
  IF _base IS NULL OR _base < now() THEN
    _base := now();
  END IF;
  _new_expires := _base + make_interval(days => _key.valid_days);

  UPDATE public.access_keys
  SET redeemed_by = _uid, redeemed_at = now(), expires_at = _new_expires
  WHERE id = _key.id;

  INSERT INTO public.account_access (user_id, expires_at, key_id)
  VALUES (_uid, _new_expires, _key.id)
  ON CONFLICT (user_id) DO UPDATE SET expires_at = EXCLUDED.expires_at, key_id = EXCLUDED.key_id, updated_at = now();

  RETURN _new_expires;
END;
$$;

CREATE OR REPLACE FUNCTION private.revoke_access_key_impl(
  _key_id uuid,
  _uid uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT private.has_role(_uid, 'admin') THEN
    RAISE EXCEPTION 'Apenas administradores podem revogar chaves';
  END IF;
  UPDATE public.access_keys SET revoked_at = now() WHERE id = _key_id AND revoked_at IS NULL;
  UPDATE public.account_access SET expires_at = now() WHERE key_id = _key_id AND expires_at > now();
END;
$$;

ALTER FUNCTION public.generate_access_key(integer, text) SECURITY INVOKER;
CREATE OR REPLACE FUNCTION public.generate_access_key(
  _valid_days integer,
  _note text DEFAULT NULL
)
RETURNS public.access_keys
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF NOT private.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Apenas administradores podem gerar chaves';
  END IF;
  RETURN private.generate_access_key_impl(_valid_days, _note, auth.uid());
END;
$$;

ALTER FUNCTION public.redeem_access_key(text) SECURITY INVOKER;
CREATE OR REPLACE FUNCTION public.redeem_access_key(
  _code text
)
RETURNS timestamp with time zone
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Não autenticado';
  END IF;
  RETURN private.redeem_access_key_impl(_code, auth.uid());
END;
$$;

ALTER FUNCTION public.revoke_access_key(uuid) SECURITY INVOKER;
CREATE OR REPLACE FUNCTION public.revoke_access_key(
  _key_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  PERFORM private.revoke_access_key_impl(_key_id, auth.uid());
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated, anon;
