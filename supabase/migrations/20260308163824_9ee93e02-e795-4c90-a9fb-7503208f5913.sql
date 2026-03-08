ALTER TABLE public.expenses
  ADD COLUMN supply_amount bigint NOT NULL DEFAULT 0,
  ADD COLUMN tax_amount bigint NOT NULL DEFAULT 0;