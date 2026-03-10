
CREATE OR REPLACE FUNCTION public.sync_company_name_to_clients()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.company_name IS DISTINCT FROM OLD.company_name AND NEW.num IS NOT NULL AND NEW.num != '' THEN
    UPDATE clients SET name = NEW.company_name WHERE client_no::text = NEW.num;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_sync_company_name
AFTER UPDATE OF company_name ON public.client_companies
FOR EACH ROW
EXECUTE FUNCTION public.sync_company_name_to_clients();
