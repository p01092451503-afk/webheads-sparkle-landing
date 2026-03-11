
-- Create storage bucket for expense attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('expense-attachments', 'expense-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Create expense_attachments table
CREATE TABLE IF NOT EXISTS public.expense_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id UUID NOT NULL REFERENCES public.expenses(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  content_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.expense_attachments ENABLE ROW LEVEL SECURITY;

-- RLS: authenticated users can manage expense attachments
CREATE POLICY "Authenticated users can manage expense attachments"
  ON public.expense_attachments FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Storage RLS: allow authenticated users to upload/read/delete
CREATE POLICY "Authenticated users can upload expense attachments"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'expense-attachments');

CREATE POLICY "Anyone can view expense attachments"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'expense-attachments');

CREATE POLICY "Authenticated users can delete expense attachments"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'expense-attachments');
