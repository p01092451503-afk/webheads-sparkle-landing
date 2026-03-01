
CREATE TABLE public.service_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_type text NOT NULL CHECK (request_type IN ('sms_recharge', 'remote_support')),
  company text NOT NULL,
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  amount text,
  reason text,
  preferred_datetime text,
  status text NOT NULL DEFAULT 'new',
  notes text,
  session_id text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insert from service" ON public.service_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage service requests" ON public.service_requests
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_service_requests_updated_at
  BEFORE UPDATE ON public.service_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
