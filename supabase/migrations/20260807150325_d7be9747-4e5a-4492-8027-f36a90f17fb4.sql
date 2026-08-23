-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "admins read roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users WHERE lower(email) = 'marlonfpessoa@gmail.com'
ON CONFLICT DO NOTHING;

-- Access keys
CREATE TABLE public.access_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  valid_days integer NOT NULL DEFAULT 30,
  note text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  redeemed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  redeemed_at timestamptz,
  expires_at timestamptz,
  revoked_at timestamptz
);
GRANT SELECT ON public.access_keys TO authenticated;
GRANT ALL ON public.access_keys TO service_role;
ALTER TABLE public.access_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins read keys" ON public.access_keys FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Account access
CREATE TABLE public.account_access (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  key_id uuid REFERENCES public.access_keys(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.account_access TO authenticated;
GRANT ALL ON public.account_access TO service_role;
ALTER TABLE public.account_access ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own access" ON public.account_access FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "admins read access" ON public.account_access FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_account_access_updated_at BEFORE UPDATE ON public.account_access
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.has_active_access(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.account_access
    WHERE user_id = _user_id AND expires_at > now()
  );
$$;

-- Admin: generate key
CREATE OR REPLACE FUNCTION public.generate_access_key(_valid_days integer, _note text DEFAULT NULL)
RETURNS public.access_keys LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _code text;
  _row public.access_keys;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Apenas administradores podem gerar chaves';
  END IF;
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
  VALUES (_code, _valid_days, _note, auth.uid())
  RETURNING * INTO _row;
  RETURN _row;
END;
$$;
REVOKE ALL ON FUNCTION public.generate_access_key(integer, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.generate_access_key(integer, text) TO authenticated;

-- Admin: revoke key
CREATE OR REPLACE FUNCTION public.revoke_access_key(_key_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Apenas administradores podem revogar chaves';
  END IF;
  UPDATE public.access_keys SET revoked_at = now() WHERE id = _key_id AND revoked_at IS NULL;
  UPDATE public.account_access SET expires_at = now() WHERE key_id = _key_id AND expires_at > now();
END;
$$;
REVOKE ALL ON FUNCTION public.revoke_access_key(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.revoke_access_key(uuid) TO authenticated;

-- User: redeem key
CREATE OR REPLACE FUNCTION public.redeem_access_key(_code text)
RETURNS timestamptz LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _key public.access_keys;
  _uid uuid := auth.uid();
  _base timestamptz;
  _new_expires timestamptz;
BEGIN
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'Não autenticado';
  END IF;

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
REVOKE ALL ON FUNCTION public.redeem_access_key(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.redeem_access_key(text) TO authenticated;

-- Write gating on user data tables
DROP POLICY "own transactions" ON public.transactions;
CREATE POLICY "read own transactions" ON public.transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert own transactions" ON public.transactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND public.has_active_access(auth.uid()));
CREATE POLICY "update own transactions" ON public.transactions FOR UPDATE TO authenticated USING (auth.uid() = user_id AND public.has_active_access(auth.uid())) WITH CHECK (auth.uid() = user_id AND public.has_active_access(auth.uid()));
CREATE POLICY "delete own transactions" ON public.transactions FOR DELETE TO authenticated USING (auth.uid() = user_id AND public.has_active_access(auth.uid()));

DROP POLICY "own categories" ON public.categories;
CREATE POLICY "read own categories" ON public.categories FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert own categories" ON public.categories FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND public.has_active_access(auth.uid()));
CREATE POLICY "update own categories" ON public.categories FOR UPDATE TO authenticated USING (auth.uid() = user_id AND public.has_active_access(auth.uid())) WITH CHECK (auth.uid() = user_id AND public.has_active_access(auth.uid()));
CREATE POLICY "delete own categories" ON public.categories FOR DELETE TO authenticated USING (auth.uid() = user_id AND public.has_active_access(auth.uid()));

DROP POLICY "own fixed expenses" ON public.fixed_expenses;
CREATE POLICY "read own fixed expenses" ON public.fixed_expenses FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert own fixed expenses" ON public.fixed_expenses FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND public.has_active_access(auth.uid()));
CREATE POLICY "update own fixed expenses" ON public.fixed_expenses FOR UPDATE TO authenticated USING (auth.uid() = user_id AND public.has_active_access(auth.uid())) WITH CHECK (auth.uid() = user_id AND public.has_active_access(auth.uid()));
CREATE POLICY "delete own fixed expenses" ON public.fixed_expenses FOR DELETE TO authenticated USING (auth.uid() = user_id AND public.has_active_access(auth.uid()));

DROP POLICY "own goals" ON public.goals;
CREATE POLICY "read own goals" ON public.goals FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert own goals" ON public.goals FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND public.has_active_access(auth.uid()));
CREATE POLICY "update own goals" ON public.goals FOR UPDATE TO authenticated USING (auth.uid() = user_id AND public.has_active_access(auth.uid())) WITH CHECK (auth.uid() = user_id AND public.has_active_access(auth.uid()));
CREATE POLICY "delete own goals" ON public.goals FOR DELETE TO authenticated USING (auth.uid() = user_id AND public.has_active_access(auth.uid()));