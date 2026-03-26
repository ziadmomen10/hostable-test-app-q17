-- Add real content translations from the HostOnce website
DO $$
DECLARE
    english_lang_id UUID;
BEGIN
    SELECT id INTO english_lang_id FROM public.languages WHERE code = 'en';
    
    -- Insert navigation and homepage translations
    INSERT INTO public.translations (language_id, namespace, key, value) VALUES
    -- Homepage content
    (english_lang_id, 'homepage', 'welcome_title', 'Welcome to HostOnce'),
    (english_lang_id, 'homepage', 'welcome_subtitle', 'Manage your hosting platform efficiently'),
    (english_lang_id, 'homepage', 'languages_title', 'Languages'),
    (english_lang_id, 'homepage', 'languages_description', 'Manage supported languages and translations for your platform.'),
    (english_lang_id, 'homepage', 'currencies_title', 'Currencies'),
    (english_lang_id, 'homepage', 'currencies_description', 'Configure supported currencies and exchange rates for billing.'),
    (english_lang_id, 'homepage', 'security_title', 'Security'),
    (english_lang_id, 'homepage', 'security_description', 'Monitor security settings and manage access controls.'),
    (english_lang_id, 'homepage', 'system_title', 'System'),
    (english_lang_id, 'homepage', 'system_description', 'Access system configuration and monitoring tools.'),
    (english_lang_id, 'homepage', 'manage_languages', 'Manage Languages'),
    (english_lang_id, 'homepage', 'manage_currencies', 'Manage Currencies'),
    (english_lang_id, 'homepage', 'security_settings', 'Security Settings'),
    (english_lang_id, 'homepage', 'admin_dashboard', 'Admin Dashboard'),
    
    -- Navigation content
    (english_lang_id, 'navigation', 'contact_us', 'Contact Us'),
    (english_lang_id, 'navigation', 'knowledge_base', 'Knowledge base'),
    (english_lang_id, 'navigation', 'affiliate', 'Affiliate'),
    (english_lang_id, 'navigation', 'domain', 'Domain'),
    (english_lang_id, 'navigation', 'hosting', 'Hosting'),
    (english_lang_id, 'navigation', 'tools_services', 'Tools & Services'),
    (english_lang_id, 'navigation', 'support', 'Support'),
    (english_lang_id, 'navigation', 'dashboard', 'Dashboard'),
    (english_lang_id, 'navigation', 'chat_onceai', 'Chat with OnceAI'),
    (english_lang_id, 'navigation', 'client_area', 'Client Area'),
    
    -- Domain related
    (english_lang_id, 'domain', 'domain_registration', 'Domain Registration'),
    (english_lang_id, 'domain', 'domain_transfer', 'Domain Transfer'),
    (english_lang_id, 'domain', 'domain_checker', 'Domain Checker'),
    (english_lang_id, 'domain', 'whois_lookup', 'Whois Lookup'),
    (english_lang_id, 'domain', 'register_new_domain', 'Register a new domain.'),
    (english_lang_id, 'domain', 'transfer_your_domain', 'Transfer your domain to us.'),
    (english_lang_id, 'domain', 'check_domain_availability', 'Check domain availability.'),
    (english_lang_id, 'domain', 'lookup_domain_info', 'Lookup domain information.'),
    
    -- Hosting related
    (english_lang_id, 'hosting', 'shared_hosting', 'Shared Hosting'),
    (english_lang_id, 'hosting', 'vps_hosting', 'VPS Hosting'),
    (english_lang_id, 'hosting', 'dedicated_servers', 'Dedicated Servers'),
    (english_lang_id, 'hosting', 'cloud_hosting', 'Cloud Hosting'),
    (english_lang_id, 'hosting', 'web_hosting', 'Web Hosting'),
    (english_lang_id, 'hosting', 'wordpress_hosting', 'WordPress Hosting'),
    (english_lang_id, 'hosting', 'game_server_hosting', 'Game Server Hosting'),
    (english_lang_id, 'hosting', 'affordable_shared_hosting', 'Affordable shared hosting.'),
    (english_lang_id, 'hosting', 'scalable_vps_solutions', 'Scalable VPS solutions.'),
    (english_lang_id, 'hosting', 'powerful_dedicated_servers', 'Powerful dedicated servers.'),
    (english_lang_id, 'hosting', 'reliable_cloud_hosting', 'Reliable cloud hosting.'),
    (english_lang_id, 'hosting', 'fast_reliable_hosting', 'Fast and reliable hosting.'),
    (english_lang_id, 'hosting', 'optimized_wordpress', 'Optimized for WordPress.'),
    (english_lang_id, 'hosting', 'best_game_server_hosting', 'Best Game Server Hosting.'),
    
    -- Support related
    (english_lang_id, 'support', 'knowledge_base', 'Knowledge Base'),
    (english_lang_id, 'support', 'download', 'Download'),
    (english_lang_id, 'support', 'system_status', 'System Status'),
    (english_lang_id, 'support', 'contact_us', 'Contact Us'),
    (english_lang_id, 'support', 'blog', 'Blog'),
    (english_lang_id, 'support', 'here_to_help', 'We''re here to help you'),
    (english_lang_id, 'support', 'download_area', 'Our Download area'),
    (english_lang_id, 'support', 'check_system_status', 'Check our System Status'),
    (english_lang_id, 'support', 'get_in_touch', 'Get in touch with us'),
    (english_lang_id, 'support', 'read_latest_news', 'Read latest news on our Blog'),
    
    -- Translation management specific
    (english_lang_id, 'translations', 'translation_manager', 'Translation Manager'),
    (english_lang_id, 'translations', 'manage_website_translations', 'Manage all website content translations from one place'),
    (english_lang_id, 'translations', 'select_language', 'Select language to translate'),
    (english_lang_id, 'translations', 'select_namespace', 'Select content section'),
    (english_lang_id, 'translations', 'add_translation', 'Add Translation'),
    (english_lang_id, 'translations', 'edit_translation', 'Edit Translation'),
    (english_lang_id, 'translations', 'delete_translation', 'Delete Translation'),
    (english_lang_id, 'translations', 'translation_key', 'Translation Key'),
    (english_lang_id, 'translations', 'translation_value', 'Translation Text'),
    (english_lang_id, 'translations', 'namespace', 'Content Section'),
    (english_lang_id, 'translations', 'export_translations', 'Export Translations'),
    (english_lang_id, 'translations', 'no_translations_found', 'No translations found for this language and section'),
    (english_lang_id, 'translations', 'create_first_translation', 'Create your first translation to get started'),
    
    -- Admin panel
    (english_lang_id, 'admin', 'dashboard_overview', 'Dashboard Overview'),
    (english_lang_id, 'admin', 'user_management', 'User Management'),
    (english_lang_id, 'admin', 'language_management', 'Language Management'),
    (english_lang_id, 'admin', 'translation_management', 'Translation Management'),
    (english_lang_id, 'admin', 'currency_management', 'Currency Management'),
    (english_lang_id, 'admin', 'page_management', 'Page Management'),
    (english_lang_id, 'admin', 'package_management', 'Package Management'),
    (english_lang_id, 'admin', 'system_settings', 'System Settings')
    
    ON CONFLICT (language_id, namespace, key) DO UPDATE SET
      value = EXCLUDED.value,
      updated_at = now();
END $$;