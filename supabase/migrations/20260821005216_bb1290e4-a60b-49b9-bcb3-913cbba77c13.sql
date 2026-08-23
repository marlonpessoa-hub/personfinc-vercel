ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN public.goals.is_featured IS 'Indica a meta em destaque no Dashboard (apenas uma por usuário).';