-- Add visitor_type column to page_views
ALTER TABLE public.page_views ADD COLUMN visitor_type text DEFAULT 'human';

-- Backfill existing data based on user_agent patterns
UPDATE public.page_views SET visitor_type = 'bot' WHERE user_agent IS NOT NULL AND (
  user_agent ~* 'googlebot|bingbot|yandex|baiduspider|duckduckbot|slurp|msnbot|ia_archiver|archive\.org|sogou|exabot|facebot|facebookexternalhit|twitterbot|linkedinbot|pinterestbot|semrushbot|ahrefsbot|dotbot|petalbot|megaindex|serpstatbot|dataforseo|screaming frog|sitebulb|mj12bot|blexbot|rogerbot|seznambot|applebot'
);

UPDATE public.page_views SET visitor_type = 'ai' WHERE user_agent IS NOT NULL AND (
  user_agent ~* 'gptbot|chatgpt|openai|claude|anthropic|bytespider|ccbot|cohere|perplexity|youbot|google-extended|meta-externalagent|amazonbot|claudebot|ai2bot'
);