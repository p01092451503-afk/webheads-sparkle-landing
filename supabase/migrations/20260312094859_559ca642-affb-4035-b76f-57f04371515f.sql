
-- Create backup_files table (same structure as work_files)
CREATE TABLE public.backup_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size bigint,
  content_type text,
  folder text NOT NULL DEFAULT '일반',
  memo text,
  uploaded_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.backup_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage backup files"
  ON public.backup_files
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create backup-files storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('backup-files', 'backup-files', true);

-- Storage RLS policies for backup-files bucket
CREATE POLICY "Admins can upload backup files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'backup-files' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can read backup files"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'backup-files' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete backup files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'backup-files' AND has_role(auth.uid(), 'admin'::app_role));
