-- Reclassify known cloud datacenter IPs that were misclassified as human

-- AWS 3.x.x.x (Ohio Dublin etc)
UPDATE page_views SET visitor_type = 'scraper_datacenter' 
WHERE visitor_type = 'human' AND ip_address LIKE '3.1%';

-- Huawei Cloud IPs
UPDATE page_views SET visitor_type = 'scraper_datacenter' 
WHERE visitor_type = 'human' AND (
  ip_address LIKE '121.37.%' OR ip_address LIKE '121.38.%' OR ip_address LIKE '121.39.%' OR
  ip_address LIKE '121.4%' OR
  ip_address LIKE '116.204.%' OR ip_address LIKE '116.205.%' OR ip_address LIKE '116.63.%' OR
  ip_address LIKE '124.242.%' OR ip_address LIKE '124.243.%'
);

-- Tencent Cloud IPs
UPDATE page_views SET visitor_type = 'scraper_datacenter' 
WHERE visitor_type = 'human' AND (
  ip_address LIKE '150.109.%' OR ip_address LIKE '150.110.%' OR
  ip_address LIKE '43.153.%' OR ip_address LIKE '43.154.%' OR ip_address LIKE '43.155.%' OR
  ip_address LIKE '43.134.%' OR ip_address LIKE '43.135.%' OR ip_address LIKE '43.136.%' OR ip_address LIKE '43.137.%'
);

-- Fake Safari UA (Version/26.0 on iOS 16_0 is impossible)
UPDATE page_views SET visitor_type = 'scraper_fake_ua'
WHERE visitor_type = 'human' AND user_agent LIKE '%iPhone OS 16_0%Version/26.0%';

-- Also reclassify click_events
UPDATE click_events SET visitor_type = 'scraper_datacenter'
WHERE visitor_type = 'human' AND (
  ip_address LIKE '3.1%' OR
  ip_address LIKE '121.37.%' OR ip_address LIKE '121.38.%' OR ip_address LIKE '121.39.%' OR
  ip_address LIKE '116.204.%' OR ip_address LIKE '124.243.%' OR
  ip_address LIKE '150.109.%' OR ip_address LIKE '43.154.%' OR ip_address LIKE '43.153.%'
);