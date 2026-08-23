CREATE TABLE public.cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  brand text NOT NULL DEFAULT 'outro',
  kind text NOT NULL DEFAULT 'credito',
  last4 text,
  credit_limit numeric,
  closing_day integer,
  due_day integer,
  color text NOT NULL DEFAULT 'from-primary to-tertiary',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.cards TO authenticated;
GRANT ALL ON public.cards TO service_role;

ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read own cards" ON public.cards FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert own cards" ON public.cards FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND private.has_active_access(auth.uid()));
CREATE POLICY "update own cards" ON public.cards FOR UPDATE TO authenticated USING (auth.uid() = user_id AND private.has_active_access(auth.uid())) WITH CHECK (auth.uid() = user_id AND private.has_active_access(auth.uid()));
CREATE POLICY "delete own cards" ON public.cards FOR DELETE TO authenticated USING (auth.uid() = user_id AND private.has_active_access(auth.uid()));

CREATE TRIGGER update_cards_updated_at BEFORE UPDATE ON public.cards FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();