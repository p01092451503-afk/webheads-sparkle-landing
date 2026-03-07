
ALTER TABLE public.page_views ADD COLUMN IF NOT EXISTS visitor_id text;
ALTER TABLE public.page_views ADD COLUMN IF NOT EXISTS visit_count integer DEFAULT 1;

CREATE INDEX IF NOT EXISTS idx_page_views_visitor_id ON public.page_views(visitor_id);
