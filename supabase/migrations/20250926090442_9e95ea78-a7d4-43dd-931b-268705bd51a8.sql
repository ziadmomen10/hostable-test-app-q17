-- Create translation keys for all public pages content
-- This will insert translations for all languages that exist

-- Get language IDs
WITH language_ids AS (
  SELECT id, code FROM languages WHERE is_active = true
),

-- Define all translation keys with their English values
translation_data AS (
  SELECT * FROM (VALUES
    -- Homepage translations
    ('homepage', 'flash_sale_text', 'Flash Sale Get 40% Off All Hosting Services'),
    ('homepage', 'hero_title_line1', 'Hosting Everything'),
    ('homepage', 'hero_title_line2', 'Without Limits'),
    ('homepage', 'feature_uptime', '100% Uptime Guarantee'),
    ('homepage', 'feature_bandwidth', 'Enjoy Unlimited Bandwidth'),
    ('homepage', 'feature_ddos', 'Free DDoS Protection'),
    ('homepage', 'feature_support', '24/7 Expert Support'),
    ('homepage', 'starting_at', 'Starting at'),
    ('homepage', 'per_month', '/mo*'),
    ('homepage', 'save_percent', 'Save 40%'),
    ('homepage', 'get_started_now', 'Get Started Now'),
    ('homepage', 'try_ultra_ai', 'Try UltraAI'),
    ('homepage', 'risk_free_guarantee', 'Get Started Risk-free 30 Day Money-back Guarantee'),
    ('homepage', 'people_say_excellent', 'People Say "Excellent"'),
    ('homepage', 'based_on_reviews', 'Based on 2,000+ reviews'),
    ('homepage', 'introducing_ultra_ai', 'Introducing UltraAI'),
    ('homepage', 'domain_advisor', 'Your domain and hosting advisor.'),
    ('homepage', 'ask_anything', 'Ask anything'),
    ('homepage', 'rated_score', 'Rated 4.9'),
    ('homepage', 'reviews_count_300', '300+ Reviews'),
    ('homepage', 'reviews_count_1000', '1000+ Reviews'),
    ('homepage', 'reviews_count_1704', '1,704 Reviews'),
    
    -- VPS Hosting page translations
    ('vps_hosting', 'title_line1', '20x Faster'),
    ('vps_hosting', 'title_line2', 'VPS Hosting'),
    ('vps_hosting', 'description', 'Power up your projects with next-generation VPS hosting. Enjoy maximum flexibility, unlimited bandwidth, and blazing-fast performance. Get started today and experience the difference!'),
    ('vps_hosting', 'feature_uptime', '100% Uptime Guarantee'),
    ('vps_hosting', 'feature_snapshot', 'Free Real-Time Snapshot'),
    ('vps_hosting', 'feature_ddos', 'Free DDoS Protection'),
    ('vps_hosting', 'feature_support', '24/7 Expert Support'),
    ('vps_hosting', 'starting_at', 'Starting at'),
    ('vps_hosting', 'price', '$4.80'),
    ('vps_hosting', 'per_month', '/mo*'),
    ('vps_hosting', 'save_offer', '💰 Save 40%'),
    ('vps_hosting', 'view_plans', 'View Plans →'),
    ('vps_hosting', 'risk_free', 'Get Started Risk-free'),
    ('vps_hosting', 'money_back', '30 Day Money-back Guarantee'),
    
    -- Header translations
    ('header', 'contact_us', 'Contact Us'),
    ('header', 'knowledge_base', 'Knowledge base'),
    ('header', 'affiliate', 'Affiliate'),
    ('header', 'domain', 'Domain'),
    ('header', 'hosting', 'Hosting'),
    ('header', 'pages', 'Pages'),
    ('header', 'buy_domain_names', 'Buy Domain Names'),
    ('header', 'find_perfect_domain', 'Find your perfect domain name here.'),
    ('header', 'ssl_certificates', 'SSL Certificates'),
    ('header', 'ssl_description', 'Buy SSL Certificates to secure your website, protect user data, and enhance trust with encryption.'),
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
    ('header', 'choose_ideal_plan', 'Choose the ideal hosting plan for your website''s performance and growth.'),
    ('header', 'perfect_plan', 'Your Perfect Plan'),
    ('header', 'client_area', 'Client Area'),
    
    -- Footer translations
    ('footer', 'company_description', 'Reliable web hosting solutions for businesses of all sizes.'),
    ('footer', 'hosting_services', 'Hosting'),
    ('footer', 'domains', 'Domains'),
    ('footer', 'support', 'Support'),
    ('footer', 'shared_hosting', 'Shared Hosting'),
    ('footer', 'vps_hosting', 'VPS Hosting'),
    ('footer', 'dedicated_servers', 'Dedicated Servers'),
    ('footer', 'wordpress_hosting', 'WordPress Hosting'),
    ('footer', 'buy_domain', 'Buy Domain'),
    ('footer', 'ssl_certificates', 'SSL Certificates'),
    ('footer', 'whois_checker', 'WHOIS Checker'),
    ('footer', 'dns_checker', 'DNS Checker'),
    ('footer', 'contact_us', 'Contact Us'),
    ('footer', 'knowledge_base', 'Knowledge Base'),
    ('footer', 'affiliate_program', 'Affiliate Program'),
    ('footer', 'copyright', '© 2024 HostOnce. All rights reserved.'),
    ('footer', 'privacy_policy', 'Privacy Policy'),
    ('footer', 'terms_of_service', 'Terms of Service'),
    ('footer', 'refund_policy', 'Refund Policy')
  ) AS t(namespace, key, english_value)
)

-- Insert translations for each language
INSERT INTO translations (language_id, namespace, key, value)
SELECT 
  l.id,
  td.namespace,
  td.key,
  CASE l.code
    -- English (default)
    WHEN 'en' THEN td.english_value
    
    -- Spanish translations
    WHEN 'es' THEN 
      CASE td.key
        WHEN 'flash_sale_text' THEN 'Oferta Flash 40% de Descuento en Todos los Servicios de Hosting'
        WHEN 'hero_title_line1' THEN 'Hosting de Todo'
        WHEN 'hero_title_line2' THEN 'Sin Límites'
        WHEN 'feature_uptime' THEN 'Garantía de 100% Disponibilidad'
        WHEN 'feature_bandwidth' THEN 'Disfruta Ancho de Banda Ilimitado'
        WHEN 'feature_ddos' THEN 'Protección DDoS Gratuita'
        WHEN 'feature_support' THEN 'Soporte Experto 24/7'
        WHEN 'starting_at' THEN 'Desde'
        WHEN 'per_month' THEN '/mes*'
        WHEN 'save_percent' THEN 'Ahorra 40%'
        WHEN 'get_started_now' THEN 'Comenzar Ahora'
        WHEN 'try_ultra_ai' THEN 'Prueba UltraAI'
        WHEN 'risk_free_guarantee' THEN 'Comienza Sin Riesgo Garantía de 30 Días'
        WHEN 'contact_us' THEN 'Contáctanos'
        WHEN 'knowledge_base' THEN 'Base de Conocimientos'
        WHEN 'affiliate' THEN 'Afiliados'
        WHEN 'domain' THEN 'Dominio'
        WHEN 'hosting' THEN 'Hosting'
        WHEN 'support' THEN 'Soporte'
        ELSE td.english_value
      END
      
    -- French translations
    WHEN 'fr' THEN 
      CASE td.key
        WHEN 'flash_sale_text' THEN 'Vente Flash 40% de Réduction sur Tous les Services d''Hébergement'
        WHEN 'hero_title_line1' THEN 'Hébergement de Tout'
        WHEN 'hero_title_line2' THEN 'Sans Limites'
        WHEN 'feature_uptime' THEN 'Garantie de Disponibilité 100%'
        WHEN 'feature_bandwidth' THEN 'Profitez de la Bande Passante Illimitée'
        WHEN 'feature_ddos' THEN 'Protection DDoS Gratuite'
        WHEN 'feature_support' THEN 'Support Expert 24/7'
        WHEN 'starting_at' THEN 'À partir de'
        WHEN 'per_month' THEN '/mois*'
        WHEN 'save_percent' THEN 'Économisez 40%'
        WHEN 'get_started_now' THEN 'Commencer Maintenant'
        WHEN 'try_ultra_ai' THEN 'Essayez UltraAI'
        WHEN 'contact_us' THEN 'Nous Contacter'
        WHEN 'knowledge_base' THEN 'Base de Connaissances'
        WHEN 'affiliate' THEN 'Affilié'
        WHEN 'domain' THEN 'Domaine'
        WHEN 'hosting' THEN 'Hébergement'
        WHEN 'support' THEN 'Support'
        ELSE td.english_value
      END
      
    -- German translations
    WHEN 'de' THEN 
      CASE td.key
        WHEN 'flash_sale_text' THEN 'Flash Sale 40% Rabatt auf alle Hosting-Services'
        WHEN 'hero_title_line1' THEN 'Hosting von Allem'
        WHEN 'hero_title_line2' THEN 'Ohne Grenzen'
        WHEN 'feature_uptime' THEN '100% Verfügbarkeitsgarantie'
        WHEN 'feature_bandwidth' THEN 'Unbegrenzte Bandbreite genießen'
        WHEN 'feature_ddos' THEN 'Kostenloser DDoS-Schutz'
        WHEN 'feature_support' THEN '24/7 Experten-Support'
        WHEN 'starting_at' THEN 'Ab'
        WHEN 'per_month' THEN '/Monat*'
        WHEN 'save_percent' THEN '40% sparen'
        WHEN 'get_started_now' THEN 'Jetzt Starten'
        WHEN 'try_ultra_ai' THEN 'UltraAI Testen'
        WHEN 'contact_us' THEN 'Kontakt'
        WHEN 'knowledge_base' THEN 'Wissensdatenbank'
        WHEN 'affiliate' THEN 'Partner'
        WHEN 'domain' THEN 'Domain'
        WHEN 'hosting' THEN 'Hosting'
        WHEN 'support' THEN 'Support'
        ELSE td.english_value
      END
      
    -- Arabic translations (RTL)
    WHEN 'ar' THEN 
      CASE td.key
        WHEN 'flash_sale_text' THEN 'عرض خاطف خصم 40% على جميع خدمات الاستضافة'
        WHEN 'hero_title_line1' THEN 'استضافة كل شيء'
        WHEN 'hero_title_line2' THEN 'بلا حدود'
        WHEN 'feature_uptime' THEN 'ضمان توفر 100%'
        WHEN 'feature_bandwidth' THEN 'استمتع بسرعة نقل غير محدودة'
        WHEN 'feature_ddos' THEN 'حماية مجانية من DDoS'
        WHEN 'feature_support' THEN 'دعم خبراء على مدار الساعة'
        WHEN 'starting_at' THEN 'ابتداءً من'
        WHEN 'per_month' THEN '/شهر*'
        WHEN 'save_percent' THEN 'وفر 40%'
        WHEN 'get_started_now' THEN 'ابدأ الآن'
        WHEN 'try_ultra_ai' THEN 'جرب UltraAI'
        WHEN 'contact_us' THEN 'اتصل بنا'
        WHEN 'knowledge_base' THEN 'قاعدة المعرفة'
        WHEN 'affiliate' THEN 'شراكة'
        WHEN 'domain' THEN 'النطاق'
        WHEN 'hosting' THEN 'الاستضافة'
        WHEN 'support' THEN 'الدعم'
        ELSE td.english_value
      END
    
    -- For other languages, use English as fallback for now
    ELSE td.english_value
  END
FROM language_ids l
CROSS JOIN translation_data td
ON CONFLICT (language_id, namespace, key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = now();