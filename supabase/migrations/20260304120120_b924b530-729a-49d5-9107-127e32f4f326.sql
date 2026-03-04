UPDATE page_views SET visitor_type = 'scraper_datacenter' WHERE visitor_type = 'human' AND (
  ip_address LIKE '34.%' OR ip_address LIKE '35.1%' OR 
  ip_address LIKE '54.%' OR ip_address LIKE '52.%' OR 
  ip_address LIKE '13.%' OR ip_address LIKE '18.%'
) AND (city ILIKE '%Mountain View%' OR city ILIKE '%Ashburn%' OR city ILIKE '%Council Bluffs%' OR city ILIKE '%Portland%' OR city ILIKE '%Columbus%' OR country != 'South Korea');