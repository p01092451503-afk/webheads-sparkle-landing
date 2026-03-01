ALTER TABLE public.contact_inquiries ADD COLUMN session_id TEXT;
CREATE INDEX idx_inquiries_session ON public.contact_inquiries(session_id);