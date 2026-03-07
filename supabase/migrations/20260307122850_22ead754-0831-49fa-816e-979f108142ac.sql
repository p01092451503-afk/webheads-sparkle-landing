
CREATE TABLE public.ai_call_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_id uuid REFERENCES public.contact_inquiries(id),
  function_name text NOT NULL,
  model_used text,
  prompt_tokens integer,
  completion_tokens integer,
  total_tokens integer,
  duration_ms integer,
  status text NOT NULL DEFAULT 'success',
  error_code text,
  error_message text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_ai_call_logs_function_name ON public.ai_call_logs(function_name);
CREATE INDEX idx_ai_call_logs_created_at ON public.ai_call_logs(created_at DESC);

ALTER TABLE public.ai_call_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read ai call logs"
  ON public.ai_call_logs
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));
