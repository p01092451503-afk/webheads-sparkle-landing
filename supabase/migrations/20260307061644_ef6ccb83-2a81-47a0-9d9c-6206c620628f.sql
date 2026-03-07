
CREATE TABLE public.admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read settings"
  ON public.admin_settings FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Super admins can manage settings"
  ON public.admin_settings FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Seed default settings
INSERT INTO public.admin_settings (key, value) VALUES
  ('notifications', '{"email_on_new_inquiry": true, "email_on_service_request": true, "notification_email": "34bus@webheads.co.kr"}'::jsonb),
  ('company_info', '{"name": "WEBHEADS", "address": "서울시 마포구 월드컵로114, 3층", "phone": "02-540-4337", "website": "www.webheads.co.kr", "email": "34bus@webheads.co.kr"}'::jsonb);
