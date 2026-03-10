
-- Add sort_order column to clients
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0;

-- Initialize sort_order based on current client_no ordering
UPDATE public.clients SET sort_order = sub.rn
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY client_no ASC NULLS LAST, created_at ASC) as rn
  FROM public.clients
) sub
WHERE public.clients.id = sub.id;

-- Create sequence for auto client_no
CREATE SEQUENCE IF NOT EXISTS public.client_no_seq START WITH 1001;

-- Set sequence to max existing client_no + 1
SELECT setval('public.client_no_seq', GREATEST(COALESCE((SELECT MAX(client_no) FROM public.clients), 0) + 1, 1001));

-- Set default for client_no to use the sequence
ALTER TABLE public.clients ALTER COLUMN client_no SET DEFAULT nextval('public.client_no_seq');
