CREATE TABLE public.inquiry_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  inquiry_id UUID REFERENCES public.contact_inquiries(id) ON DELETE CASCADE NOT NULL,
  customer_profile JSONB,
  feature_mapping JSONB,
  cost_scenarios JSONB,
  risk_flags JSONB,
  strategic_score JSONB,
  recommended_plan TEXT,
  response_email_draft TEXT,
  meeting_agenda JSONB,
  analysis_status TEXT NOT NULL DEFAULT 'completed',
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(inquiry_id)
);

ALTER TABLE public.inquiry_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage analyses"
ON public.inquiry_analyses
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));