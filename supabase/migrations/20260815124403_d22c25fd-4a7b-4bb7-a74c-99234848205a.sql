-- transactions: origem externa
ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS external_id text;

CREATE UNIQUE INDEX IF NOT EXISTS transactions_user_external_id_key
  ON public.transactions (user_id, external_id) WHERE external_id IS NOT NULL;

-- bank_connections
CREATE TABLE public.bank_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pluggy_item_id text NOT NULL,
  institution_name text NOT NULL DEFAULT '',
  institution_image_url text,
  status text NOT NULL DEFAULT 'UPDATED',
  last_synced_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, pluggy_item_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.bank_connections TO authenticated;
GRANT ALL ON public.bank_connections TO service_role;
ALTER TABLE public.bank_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read own bank connections" ON public.bank_connections
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert own bank connections" ON public.bank_connections
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND private.has_active_access(auth.uid()));
CREATE POLICY "update own bank connections" ON public.bank_connections
  FOR UPDATE TO authenticated USING (auth.uid() = user_id AND private.has_active_access(auth.uid()))
  WITH CHECK (auth.uid() = user_id AND private.has_active_access(auth.uid()));
CREATE POLICY "delete own bank connections" ON public.bank_connections
  FOR DELETE TO authenticated USING (auth.uid() = user_id AND private.has_active_access(auth.uid()));

CREATE TRIGGER update_bank_connections_updated_at BEFORE UPDATE ON public.bank_connections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- bank_accounts
CREATE TABLE public.bank_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  connection_id uuid NOT NULL REFERENCES public.bank_connections(id) ON DELETE CASCADE,
  pluggy_account_id text NOT NULL,
  name text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'BANK',
  number text,
  balance numeric NOT NULL DEFAULT 0,
  credit_limit numeric,
  due_day integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, pluggy_account_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.bank_accounts TO authenticated;
GRANT ALL ON public.bank_accounts TO service_role;
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read own bank accounts" ON public.bank_accounts
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert own bank accounts" ON public.bank_accounts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND private.has_active_access(auth.uid()));
CREATE POLICY "update own bank accounts" ON public.bank_accounts
  FOR UPDATE TO authenticated USING (auth.uid() = user_id AND private.has_active_access(auth.uid()))
  WITH CHECK (auth.uid() = user_id AND private.has_active_access(auth.uid()));
CREATE POLICY "delete own bank accounts" ON public.bank_accounts
  FOR DELETE TO authenticated USING (auth.uid() = user_id AND private.has_active_access(auth.uid()));

CREATE TRIGGER update_bank_accounts_updated_at BEFORE UPDATE ON public.bank_accounts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- staged_transactions
CREATE TABLE public.staged_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  connection_id uuid REFERENCES public.bank_connections(id) ON DELETE CASCADE,
  account_id uuid REFERENCES public.bank_accounts(id) ON DELETE CASCADE,
  pluggy_transaction_id text NOT NULL,
  description text NOT NULL DEFAULT '',
  amount numeric NOT NULL DEFAULT 0,
  date date NOT NULL DEFAULT CURRENT_DATE,
  kind text NOT NULL DEFAULT 'extrato',
  suggested_category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pendente',
  transaction_id uuid REFERENCES public.transactions(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, pluggy_transaction_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.staged_transactions TO authenticated;
GRANT ALL ON public.staged_transactions TO service_role;
ALTER TABLE public.staged_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read own staged transactions" ON public.staged_transactions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert own staged transactions" ON public.staged_transactions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND private.has_active_access(auth.uid()));
CREATE POLICY "update own staged transactions" ON public.staged_transactions
  FOR UPDATE TO authenticated USING (auth.uid() = user_id AND private.has_active_access(auth.uid()))
  WITH CHECK (auth.uid() = user_id AND private.has_active_access(auth.uid()));
CREATE POLICY "delete own staged transactions" ON public.staged_transactions
  FOR DELETE TO authenticated USING (auth.uid() = user_id AND private.has_active_access(auth.uid()));

CREATE TRIGGER update_staged_transactions_updated_at BEFORE UPDATE ON public.staged_transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS staged_transactions_user_status_idx ON public.staged_transactions (user_id, status, date DESC);