CREATE POLICY "Anyone can read cookie settings"
ON public.admin_settings
FOR SELECT
TO anon
USING (key IN ('cookie_banner_enabled', 'cookie_banner_text'));