
CREATE TABLE public.simulator_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  plan_recommended TEXT NOT NULL,
  monthly_total BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.simulator_leads ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public form)
CREATE POLICY "Allow public insert simulator_leads"
ON public.simulator_leads FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can read
CREATE POLICY "Admins can read simulator_leads"
ON public.simulator_leads FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete
CREATE POLICY "Admins can delete simulator_leads"
ON public.simulator_leads FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
