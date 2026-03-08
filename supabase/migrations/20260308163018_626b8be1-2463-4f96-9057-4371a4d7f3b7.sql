
-- Expense categories (user-manageable)
CREATE TABLE public.expense_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  color text NOT NULL DEFAULT 'bg-gray-100 text-gray-600',
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.expense_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage expense categories"
ON public.expense_categories FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Expenses table
CREATE TABLE public.expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES public.expense_categories(id) ON DELETE SET NULL,
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  year integer NOT NULL,
  month integer NOT NULL,
  amount bigint NOT NULL DEFAULT 0,
  description text,
  is_paid boolean NOT NULL DEFAULT false,
  paid_date date,
  memo text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage expenses"
ON public.expenses FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Seed default categories
INSERT INTO public.expense_categories (name, color, sort_order) VALUES
  ('외주비', 'bg-orange-100 text-orange-700', 1),
  ('서버/인프라', 'bg-cyan-100 text-cyan-700', 2),
  ('임대료', 'bg-violet-100 text-violet-700', 3),
  ('정수기', 'bg-teal-100 text-teal-700', 4),
  ('전기요금', 'bg-yellow-100 text-yellow-700', 5),
  ('청소비', 'bg-lime-100 text-lime-700', 6),
  ('통신요금', 'bg-blue-100 text-blue-700', 7),
  ('부가세', 'bg-red-100 text-red-700', 8),
  ('지방세', 'bg-pink-100 text-pink-700', 9),
  ('메일호스팅', 'bg-indigo-100 text-indigo-700', 10),
  ('복합기', 'bg-amber-100 text-amber-700', 11),
  ('기타', 'bg-gray-100 text-gray-600', 99);
