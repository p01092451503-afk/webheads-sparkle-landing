INSERT INTO admin_settings (key, value) 
VALUES ('slack_notifications', '{"channel": "general", "enabled": true, "notify_new_inquiry": true, "notify_service_request": true, "notify_site_error": true}'::jsonb) 
ON CONFLICT (key) DO NOTHING;