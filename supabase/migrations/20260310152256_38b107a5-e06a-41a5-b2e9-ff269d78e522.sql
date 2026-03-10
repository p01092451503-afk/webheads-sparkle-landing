
CREATE TABLE public.project_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.client_projects(id) ON DELETE CASCADE,
  note_type TEXT NOT NULL DEFAULT 'progress',
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NULL
);

ALTER TABLE public.project_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage project_notes"
  ON public.project_notes FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
