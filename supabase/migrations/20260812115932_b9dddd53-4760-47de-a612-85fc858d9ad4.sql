CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM anon;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE OR REPLACE FUNCTION private.has_active_access(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$ SELECT EXISTS (SELECT 1 FROM public.account_access WHERE user_id = _user_id AND expires_at > now()) $$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION private.has_active_access(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.has_active_access(uuid) TO authenticated, service_role;

DROP POLICY "admins read roles" ON public.user_roles;
CREATE POLICY "admins read roles" ON public.user_roles FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY "admins read keys" ON public.access_keys;
CREATE POLICY "admins read keys" ON public.access_keys FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY "admins read access" ON public.account_access;
CREATE POLICY "admins read access" ON public.account_access FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY "insert own transactions" ON public.transactions;
CREATE POLICY "insert own transactions" ON public.transactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND private.has_active_access(auth.uid()));
DROP POLICY "update own transactions" ON public.transactions;
CREATE POLICY "update own transactions" ON public.transactions FOR UPDATE TO authenticated USING (auth.uid() = user_id AND private.has_active_access(auth.uid())) WITH CHECK (auth.uid() = user_id AND private.has_active_access(auth.uid()));
DROP POLICY "delete own transactions" ON public.transactions;
CREATE POLICY "delete own transactions" ON public.transactions FOR DELETE TO authenticated USING (auth.uid() = user_id AND private.has_active_access(auth.uid()));

DROP POLICY "insert own categories" ON public.categories;
CREATE POLICY "insert own categories" ON public.categories FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND private.has_active_access(auth.uid()));
DROP POLICY "update own categories" ON public.categories;
CREATE POLICY "update own categories" ON public.categories FOR UPDATE TO authenticated USING (auth.uid() = user_id AND private.has_active_access(auth.uid())) WITH CHECK (auth.uid() = user_id AND private.has_active_access(auth.uid()));
DROP POLICY "delete own categories" ON public.categories;
CREATE POLICY "delete own categories" ON public.categories FOR DELETE TO authenticated USING (auth.uid() = user_id AND private.has_active_access(auth.uid()));

DROP POLICY "insert own fixed expenses" ON public.fixed_expenses;
CREATE POLICY "insert own fixed expenses" ON public.fixed_expenses FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND private.has_active_access(auth.uid()));
DROP POLICY "update own fixed expenses" ON public.fixed_expenses;
CREATE POLICY "update own fixed expenses" ON public.fixed_expenses FOR UPDATE TO authenticated USING (auth.uid() = user_id AND private.has_active_access(auth.uid())) WITH CHECK (auth.uid() = user_id AND private.has_active_access(auth.uid()));
DROP POLICY "delete own fixed expenses" ON public.fixed_expenses;
CREATE POLICY "delete own fixed expenses" ON public.fixed_expenses FOR DELETE TO authenticated USING (auth.uid() = user_id AND private.has_active_access(auth.uid()));

DROP POLICY "insert own goals" ON public.goals;
CREATE POLICY "insert own goals" ON public.goals FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND private.has_active_access(auth.uid()));
DROP POLICY "update own goals" ON public.goals;
CREATE POLICY "update own goals" ON public.goals FOR UPDATE TO authenticated USING (auth.uid() = user_id AND private.has_active_access(auth.uid())) WITH CHECK (auth.uid() = user_id AND private.has_active_access(auth.uid()));
DROP POLICY "delete own goals" ON public.goals;
CREATE POLICY "delete own goals" ON public.goals FOR DELETE TO authenticated USING (auth.uid() = user_id AND private.has_active_access(auth.uid()));

CREATE OR REPLACE FUNCTION public.generate_access_key(_valid_days integer, _note text DEFAULT NULL::text)
RETURNS public.access_keys LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE
  _code text;
  _row public.access_keys;
BEGIN
  IF NOT private.has_role(auth.uid(), 'admin') THEN
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
$function$;

CREATE OR REPLACE FUNCTION public.revoke_access_key(_key_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT private.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Apenas administradores podem revogar chaves';
  END IF;
  UPDATE public.access_keys SET revoked_at = now() WHERE id = _key_id AND revoked_at IS NULL;
  UPDATE public.account_access SET expires_at = now() WHERE key_id = _key_id AND expires_at > now();
END;
$function$;

DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
DROP FUNCTION IF EXISTS public.has_active_access(uuid);

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.generate_access_key(integer, text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.revoke_access_key(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.redeem_access_key(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.generate_access_key(integer, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.revoke_access_key(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.redeem_access_key(text) TO authenticated;