
-- Add email reply summary column to contact_inquiries
ALTER TABLE public.contact_inquiries 
ADD COLUMN IF NOT EXISTS email_reply_summary text;

-- Create storage bucket for inquiry attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('inquiry-attachments', 'inquiry-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Create inquiry_attachments table to track files
CREATE TABLE IF NOT EXISTS public.inquiry_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_id uuid REFERENCES public.contact_inquiries(id) ON DELETE CASCADE NOT NULL,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size bigint,
  content_type text,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.inquiry_attachments ENABLE ROW LEVEL SECURITY;

-- RLS: Only authenticated admins can manage attachments
CREATE POLICY "Admins can manage inquiry attachments"
ON public.inquiry_attachments
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Storage RLS: Allow authenticated users to upload/read
CREATE POLICY "Admins can upload inquiry attachments"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'inquiry-attachments' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin')));

CREATE POLICY "Admins can read inquiry attachments"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'inquiry-attachments' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin')));

CREATE POLICY "Admins can delete inquiry attachments"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'inquiry-attachments' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin')));

-- Public can read (for download links)
CREATE POLICY "Public can read inquiry attachments"
ON storage.objects
FOR SELECT
TO anon
USING (bucket_id = 'inquiry-attachments');
