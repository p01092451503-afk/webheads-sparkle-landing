
-- Cookie consent logs table for GDPR compliance
CREATE TABLE public.cookie_consent_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text,
  visitor_id text,
  essential boolean NOT NULL DEFAULT true,
  analytics boolean NOT NULL DEFAULT false,
  marketing boolean NOT NULL DEFAULT false,
  action text NOT NULL DEFAULT 'accept_all',
  ip_address text,
  user_agent text,
  language text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cookie_consent_logs ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (anonymous visitors)
CREATE POLICY "Allow anonymous cookie consent inserts"
  ON public.cookie_consent_logs FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only admins can read
CREATE POLICY "Admins can read cookie consent logs"
  ON public.cookie_consent_logs FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete
CREATE POLICY "Admins can delete cookie consent logs"
  ON public.cookie_consent_logs FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Index for analytics queries
CREATE INDEX idx_cookie_consent_created_at ON public.cookie_consent_logs(created_at DESC);
