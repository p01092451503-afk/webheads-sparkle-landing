CREATE INDEX idx_page_views_visitor_type ON public.page_views(visitor_type);
CREATE INDEX idx_page_views_type_created ON public.page_views(visitor_type, created_at DESC);
CREATE INDEX idx_click_events_visitor_type ON public.click_events(visitor_type);