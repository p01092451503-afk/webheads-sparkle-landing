CREATE TABLE public.proposal_edit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_id uuid NOT NULL REFERENCES public.contact_inquiries(id) ON DELETE CASCADE,
  editor_email text NOT NULL,
  editor_id uuid NOT NULL,
  edit_summary text,
  previous_data jsonb,
  new_data jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.proposal_edit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage proposal edit logs"
  ON public.proposal_edit_logs
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));