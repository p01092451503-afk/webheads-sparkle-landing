
-- Add UTM tracking columns to page_views
ALTER TABLE public.page_views ADD COLUMN IF NOT EXISTS utm_source text;
ALTER TABLE public.page_views ADD COLUMN IF NOT EXISTS utm_medium text;
ALTER TABLE public.page_views ADD COLUMN IF NOT EXISTS utm_campaign text;
ALTER TABLE public.page_views ADD COLUMN IF NOT EXISTS utm_term text;
ALTER TABLE public.page_views ADD COLUMN IF NOT EXISTS utm_content text;

-- Add scroll depth and first visit tracking
ALTER TABLE public.page_views ADD COLUMN IF NOT EXISTS scroll_depth integer;
ALTER TABLE public.page_views ADD COLUMN IF NOT EXISTS is_first_visit boolean DEFAULT false;

-- Create click_events table for CTA tracking
CREATE TABLE public.click_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id text,
  page_path text NOT NULL,
  element_type text NOT NULL,
  element_text text,
  element_id text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  ip_address text,
  device_type text,
  browser text
);

-- Enable RLS
ALTER TABLE public.click_events ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (from edge function with service role)
CREATE POLICY "Allow insert from service" ON public.click_events FOR INSERT WITH CHECK (true);

-- Admins can read click events
CREATE POLICY "Admins can read click events" ON public.click_events FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete click events
CREATE POLICY "Admins can delete click events" ON public.click_events FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Add indexes for performance
CREATE INDEX idx_click_events_created_at ON public.click_events (created_at);
CREATE INDEX idx_click_events_session_id ON public.click_events (session_id);
CREATE INDEX idx_page_views_utm_source ON public.page_views (utm_source) WHERE utm_source IS NOT NULL;
