-- Create storage bucket for work files
INSERT INTO storage.buckets (id, name, public)
VALUES ('work-files', 'work-files', true)
ON CONFLICT (id) DO NOTHING;

-- Create work_files table for metadata
CREATE TABLE IF NOT EXISTS public.work_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  content_type TEXT,
  folder TEXT NOT NULL DEFAULT '일반',
  memo TEXT,
  uploaded_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.work_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage work files"
  ON public.work_files FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Storage RLS
CREATE POLICY "Authenticated users can upload work files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'work-files');

CREATE POLICY "Authenticated users can view work files"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'work-files');

CREATE POLICY "Authenticated users can delete work files"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'work-files');