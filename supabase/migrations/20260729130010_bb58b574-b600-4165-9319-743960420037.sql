CREATE TABLE public.fixed_expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  description text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  day_of_month integer NOT NULL DEFAULT 1,
  active boolean NOT NULL DEFAULT true,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.fixed_expenses TO authenticated;
GRANT ALL ON public.fixed_expenses TO service_role;

ALTER TABLE public.fixed_expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own fixed expenses" ON public.fixed_expenses
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER update_fixed_expenses_updated_at
BEFORE UPDATE ON public.fixed_expenses
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.transactions
  ADD COLUMN fixed_expense_id uuid REFERENCES public.fixed_expenses(id) ON DELETE SET NULL;

ALTER TABLE public.transactions
  ADD COLUMN month_key integer GENERATED ALWAYS AS
    ((EXTRACT(YEAR FROM date)::integer * 100) + EXTRACT(MONTH FROM date)::integer) STORED;

CREATE UNIQUE INDEX transactions_fixed_expense_month_idx
  ON public.transactions (fixed_expense_id, month_key)
  WHERE fixed_expense_id IS NOT NULL;