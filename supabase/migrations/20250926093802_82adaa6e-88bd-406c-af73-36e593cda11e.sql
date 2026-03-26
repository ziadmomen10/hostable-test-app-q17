-- Add ALL missing translation keys for complete coverage
-- This ensures every text element on every page has a translation key

WITH language_ids AS (
  SELECT id, code FROM languages WHERE is_active = true
),

-- Define ALL missing translation keys
missing_keys AS (
  SELECT * FROM (VALUES
    -- More Header translations (missing ones)
    ('header', 'client_area', 'Client Area'),
    ('header', 'whois_checker', 'WHOIS Checker'),
    ('header', 'whois_description', 'Perform a WHOIS lookup to find the domain owner, registration date, and contact details.'),
    ('header', 'domain_ssl_checker', 'Domain SSL Checker'),
    ('header', 'ssl_checker_description', 'Verify SSL encryption on your site.'),
    ('header', 'domain_dns_checker', 'Domain DNS Checker'),
    ('header', 'dns_checker_description', 'Quickly verify DNS settings to ensure proper setup and avoid connectivity issues.'),
    ('header', 'ai_domain_generator', 'AI Domain Name Generator'),
    ('header', 'ai_generator_description', 'Generator name with AI suggestion.'),
    ('header', 'shared_hosting', 'Shared Hosting'),
    ('header', 'shared_hosting_description', 'Learn more about an affordable solution for various websites'),
    ('header', 'vps_hosting', 'VPS Hosting'),
    ('header', 'vps_hosting_description', 'Discover a virtual server with enhanced capabilities'),
    ('header', 'dedicated_servers', 'Dedicated Servers'),
    ('header', 'dedicated_description', 'Discover a server for business applications'),
    ('header', 'wordpress_hosting', 'WordPress Hosting'),
    ('header', 'wordpress_description', 'Learn more about hosting optimized for WordPress'),
    ('header', 'windows_hosting', 'Windows Hosting'),
    ('header', 'windows_description', 'Explore Windows-based hosting for professional solutions'),
    ('header', 'find_suitable_plan', 'Find the most suitable plan for your website'),
    ('header', 'choose_ideal_plan', 'Choose the ideal hosting plan for your website performance and growth.'),
    ('header', 'perfect_plan', 'Your Perfect Plan'),
    
    -- More Homepage translations (missing ones)
    ('homepage', 'friendly_hosting_expert', 'Friendly hosting expert'),
    ('homepage', 'server_infrastructure', 'Server infrastructure'),
    ('homepage', 'ultrahost_price', '$3.29/mo'),
    ('homepage', 'dreamhost_price', '$4.95/mo'),
    ('homepage', 'hostgator_price', '$11.95/mo'),
    ('homepage', 'bluehost_price', '$10.99/mo'),
    ('homepage', 'siteground_price', '$19.99/mo'),
    ('homepage', 'ultrahost', 'Ultrahost'),
    ('homepage', 'dreamhost', 'DreamHost'),
    ('homepage', 'hostgator', 'HostGator'),
    ('homepage', 'bluehost', 'Bluehost'),
    ('homepage', 'siteground', 'SiteGround'),
    ('homepage', 'nga', 'NGA'),
    ('homepage', 'forbes', 'Forbes'),
    ('homepage', 'techradar', 'techradar'),
    ('homepage', 'hubspot', 'HubSpot'),
    ('homepage', 'cybernews', 'cybernews'),
    ('homepage', 'crypto_com', 'crypto.com'),
    ('homepage', 'website_planet', 'WEBSITE PLANET'),
    ('homepage', 'np_digital', 'NP digital'),
    ('homepage', 'pc_magazine', 'PC'),
    ('homepage', 'cnet', 'CNET'),
    
    -- VPS Hosting missing translations
    ('vps_hosting', 'server_infrastructure_alt', 'Server infrastructure'),
    ('vps_hosting', 'enhanced_vps_hosting', '20x Faster VPS Hosting'),
    
    -- Add domain-related page translations
    ('domain', 'page_title', 'Domain Services'),
    ('domain', 'page_description', 'Find and register your perfect domain name'),
    ('domain', 'buy_domain_title', 'Buy Domain Names'),
    ('domain', 'ssl_certificates_title', 'SSL Certificates'),
    ('domain', 'whois_checker_title', 'WHOIS Checker'),
    ('domain', 'dns_checker_title', 'DNS Checker'),
    
    -- Add hosting-related page translations  
    ('hosting', 'page_title', 'Web Hosting Services'),
    ('hosting', 'page_description', 'Reliable hosting solutions for your website'),
    ('hosting', 'shared_hosting_title', 'Shared Hosting'),
    ('hosting', 'vps_hosting_title', 'VPS Hosting'),
    ('hosting', 'dedicated_servers_title', 'Dedicated Servers'),
    ('hosting', 'wordpress_hosting_title', 'WordPress Hosting'),
    
    -- Add common page elements that might be missing
    ('common', 'loading', 'Loading...'),
    ('common', 'error', 'Error'),
    ('common', 'success', 'Success'),
    ('common', 'try_again', 'Try Again'),
    ('common', 'go_back', 'Go Back'),
    ('common', 'learn_more', 'Learn More'),
    ('common', 'get_started', 'Get Started'),
    ('common', 'view_details', 'View Details'),
    ('common', 'read_more', 'Read More'),
    ('common', 'see_all', 'See All'),
    ('common', 'show_more', 'Show More'),
    ('common', 'show_less', 'Show Less')
  ) AS t(namespace, key, english_value)
)

-- Insert missing translations for each language
INSERT INTO translations (language_id, namespace, key, value)
SELECT 
  l.id,
  mk.namespace,
  mk.key,
  CASE l.code
    -- English (default)
    WHEN 'en' THEN mk.english_value
    
    -- Spanish translations
    WHEN 'es' THEN 
      CASE mk.key
        WHEN 'client_area' THEN 'Área de Cliente'
        WHEN 'loading' THEN 'Cargando...'
        WHEN 'error' THEN 'Error'
        WHEN 'success' THEN 'Éxito' 
        WHEN 'try_again' THEN 'Intentar de Nuevo'
        WHEN 'go_back' THEN 'Volver'
        WHEN 'learn_more' THEN 'Aprende Más'
        WHEN 'get_started' THEN 'Comenzar'
        WHEN 'view_details' THEN 'Ver Detalles'
        WHEN 'read_more' THEN 'Leer Más'
        WHEN 'see_all' THEN 'Ver Todo'
        WHEN 'show_more' THEN 'Mostrar Más'
        WHEN 'show_less' THEN 'Mostrar Menos'
        WHEN 'page_title' THEN 'Servicios de Dominio'
        WHEN 'page_description' THEN 'Encuentra y registra tu nombre de dominio perfecto'
        ELSE mk.english_value
      END
      
    -- French translations
    WHEN 'fr' THEN 
      CASE mk.key
        WHEN 'client_area' THEN 'Espace Client'
        WHEN 'loading' THEN 'Chargement...'
        WHEN 'error' THEN 'Erreur'
        WHEN 'success' THEN 'Succès'
        WHEN 'try_again' THEN 'Réessayer'
        WHEN 'go_back' THEN 'Retourner'
        WHEN 'learn_more' THEN 'En Savoir Plus'
        WHEN 'get_started' THEN 'Commencer'
        WHEN 'view_details' THEN 'Voir les Détails'
        WHEN 'page_title' THEN 'Services de Domaine'
        WHEN 'page_description' THEN 'Trouvez et enregistrez votre nom de domaine parfait'
        ELSE mk.english_value
      END
      
    -- German translations
    WHEN 'de' THEN 
      CASE mk.key
        WHEN 'client_area' THEN 'Kundenbereich'
        WHEN 'loading' THEN 'Wird geladen...'
        WHEN 'error' THEN 'Fehler'
        WHEN 'success' THEN 'Erfolg'
        WHEN 'try_again' THEN 'Erneut Versuchen'
        WHEN 'go_back' THEN 'Zurück'
        WHEN 'learn_more' THEN 'Mehr Erfahren'
        WHEN 'get_started' THEN 'Loslegen'
        WHEN 'view_details' THEN 'Details Anzeigen'
        WHEN 'page_title' THEN 'Domain-Services'
        WHEN 'page_description' THEN 'Finden und registrieren Sie Ihren perfekten Domainnamen'
        ELSE mk.english_value
      END
      
    -- Arabic translations
    WHEN 'ar' THEN 
      CASE mk.key
        WHEN 'client_area' THEN 'منطقة العميل'
        WHEN 'loading' THEN 'جارٍ التحميل...'
        WHEN 'error' THEN 'خطأ'
        WHEN 'success' THEN 'نجح'
        WHEN 'try_again' THEN 'حاول مرة أخرى'
        WHEN 'go_back' THEN 'العودة'
        WHEN 'learn_more' THEN 'اعرف المزيد'
        WHEN 'get_started' THEN 'ابدأ'
        WHEN 'view_details' THEN 'عرض التفاصيل'
        WHEN 'page_title' THEN 'خدمات النطاق'
        WHEN 'page_description' THEN 'اعثر على اسم النطاق المثالي واسجله'
        ELSE mk.english_value
      END
    
    -- For other languages, use English as fallback
    ELSE mk.english_value
  END
FROM language_ids l
CROSS JOIN missing_keys mk
ON CONFLICT (language_id, namespace, key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = now();