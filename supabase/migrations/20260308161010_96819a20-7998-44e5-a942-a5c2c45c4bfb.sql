
-- 1. Add invoice_status, invoice_date, is_recurring to payments
ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS invoice_status text NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS invoice_date date,
  ADD COLUMN IF NOT EXISTS is_recurring boolean NOT NULL DEFAULT false;

-- 2. Create client_recurring_fees table for per-client recurring amounts
CREATE TABLE IF NOT EXISTS public.client_recurring_fees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  payment_type text NOT NULL DEFAULT 'hosting',
  amount bigint NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(client_id, payment_type)
);

-- 3. Enable RLS on client_recurring_fees
ALTER TABLE public.client_recurring_fees ENABLE ROW LEVEL SECURITY;

-- 4. RLS policy: admins can manage
CREATE POLICY "Admins can manage recurring fees"
  ON public.client_recurring_fees
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
