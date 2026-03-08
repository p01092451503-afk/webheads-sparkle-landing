
-- Add payment_type column to payments table
ALTER TABLE public.payments ADD COLUMN payment_type text NOT NULL DEFAULT 'hosting';

-- Drop the existing unique constraint so multiple payment types per client/month are allowed
ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS payments_client_id_year_month_key;

-- Add new unique constraint including payment_type
ALTER TABLE public.payments ADD CONSTRAINT payments_client_id_year_month_type_key UNIQUE (client_id, year, month, payment_type);
