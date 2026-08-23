ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS card_id uuid REFERENCES public.cards(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS payer text,
  ADD COLUMN IF NOT EXISTS purchase_id uuid,
  ADD COLUMN IF NOT EXISTS installment_no integer,
  ADD COLUMN IF NOT EXISTS installments integer;

CREATE INDEX IF NOT EXISTS transactions_card_id_idx ON public.transactions (card_id);
CREATE INDEX IF NOT EXISTS transactions_purchase_id_idx ON public.transactions (purchase_id);