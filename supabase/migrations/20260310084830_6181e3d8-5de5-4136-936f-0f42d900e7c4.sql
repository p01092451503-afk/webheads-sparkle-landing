-- Tax invoice issuance logs
CREATE TABLE public.tax_invoice_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id uuid REFERENCES public.payments(id) ON DELETE SET NULL,
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  nts_confirm_num text,
  invoice_num text,
  supplier_corp_num text,
  buyer_corp_num text,
  buyer_corp_name text,
  buyer_ceo_name text,
  buyer_email text,
  supply_amount bigint NOT NULL DEFAULT 0,
  tax_amount bigint NOT NULL DEFAULT 0,
  total_amount bigint NOT NULL DEFAULT 0,
  issue_date date,
  status text NOT NULL DEFAULT 'issued',
  memo text,
  popbill_response jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.tax_invoice_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage tax invoice logs"
  ON public.tax_invoice_logs
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));