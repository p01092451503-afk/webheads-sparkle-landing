
-- Allow the edge function (service role) to update duration_seconds
-- The existing RLS allows anonymous inserts and admin reads, which is sufficient
-- since the edge function uses service_role_key which bypasses RLS
-- No additional policy needed
SELECT 1;
