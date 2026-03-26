-- Fix RTL language directions
UPDATE languages 
SET direction = 'rtl' 
WHERE code IN ('ar', 'fa', 'ur', 'iw');

-- Add page-specific namespaces for public pages
INSERT INTO namespaces (name, description) VALUES 
('homepage', 'Homepage/Index page translations'),
('vps_hosting', 'VPS Hosting page translations'),
('header', 'Site header and navigation translations'),
('footer', 'Site footer translations')
ON CONFLICT (name) DO UPDATE SET 
description = EXCLUDED.description,
updated_at = now();