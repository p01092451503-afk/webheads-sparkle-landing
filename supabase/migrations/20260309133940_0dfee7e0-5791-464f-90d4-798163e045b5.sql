
CREATE TABLE public.not_found_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL,
  referrer text,
  user_agent text,
  session_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.not_found_logs ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (anonymous visitors)
CREATE POLICY "Allow anonymous 404 log inserts"
  ON public.not_found_logs FOR INSERT
  TO anon WITH CHECK (true);

-- Only admins can read
CREATE POLICY "Admins can read 404 logs"
  ON public.not_found_logs FOR SELECT
  TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete
CREATE POLICY "Admins can delete 404 logs"
  ON public.not_found_logs FOR DELETE
  TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Index for admin queries
CREATE INDEX idx_not_found_logs_created_at ON public.not_found_logs (created_at DESC);
CREATE INDEX idx_not_found_logs_path ON public.not_found_logs (path);
