ALTER TABLE public.client_recurring_fees 
ADD COLUMN billing_cycle text NOT NULL DEFAULT 'monthly',
ADD COLUMN contract_start_date date NULL;