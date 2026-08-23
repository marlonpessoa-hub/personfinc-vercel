ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tithe_enabled boolean NOT NULL DEFAULT true;

COMMENT ON COLUMN public.profiles.tithe_enabled IS 'Define se o cálculo do dízimo está ativo no perfil do usuário';