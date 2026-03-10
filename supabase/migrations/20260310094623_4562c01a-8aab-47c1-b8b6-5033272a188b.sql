
-- Client companies table
CREATE TABLE public.client_companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_number text NOT NULL,
  num text,
  company_name text NOT NULL,
  ceo_name text,
  business_type text,
  business_item text,
  zip_code text,
  address1 text,
  address2 text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Client contacts table (multiple per company)
CREATE TABLE public.client_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.client_companies(id) ON DELETE CASCADE,
  name text,
  position text,
  department text,
  phone text,
  mobile text,
  email text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.client_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_contacts ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Admins can manage client companies"
  ON public.client_companies FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage client contacts"
  ON public.client_contacts FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
