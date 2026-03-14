ALTER TABLE public.cookie_consent_logs ADD COLUMN IF NOT EXISTS country text DEFAULT NULL;
ALTER TABLE public.cookie_consent_logs ADD COLUMN IF NOT EXISTS city text DEFAULT NULL;