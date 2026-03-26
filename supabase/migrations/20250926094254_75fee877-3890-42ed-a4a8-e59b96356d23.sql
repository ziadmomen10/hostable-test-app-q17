-- Add missing translation keys for Homepage content
-- Provider names and prices
INSERT INTO public.translations (language_id, namespace, key, value) VALUES
-- English provider translations
((SELECT id FROM languages WHERE code = 'en'), 'homepage', 'provider_ultrahost', 'Ultrahost'),
((SELECT id FROM languages WHERE code = 'en'), 'homepage', 'provider_dreamhost', 'DreamHost'),
((SELECT id FROM languages WHERE code = 'en'), 'homepage', 'provider_hostgator', 'HostGator'),
((SELECT id FROM languages WHERE code = 'en'), 'homepage', 'provider_bluehost', 'Bluehost'),
((SELECT id FROM languages WHERE code = 'en'), 'homepage', 'provider_siteground', 'SiteGround'),
((SELECT id FROM languages WHERE code = 'en'), 'homepage', 'price_ultrahost', '$3.29/mo'),
((SELECT id FROM languages WHERE code = 'en'), 'homepage', 'price_dreamhost', '$4.95/mo'),
((SELECT id FROM languages WHERE code = 'en'), 'homepage', 'price_hostgator', '$11.95/mo'),
((SELECT id FROM languages WHERE code = 'en'), 'homepage', 'price_bluehost', '$10.99/mo'),
((SELECT id FROM languages WHERE code = 'en'), 'homepage', 'price_siteground', '$19.99/mo'),

-- Image alt texts
((SELECT id FROM languages WHERE code = 'en'), 'homepage', 'friendly_expert_alt', 'Friendly hosting expert'),

-- Company names
((SELECT id FROM languages WHERE code = 'en'), 'homepage', 'company_nga', 'NGA'),
((SELECT id FROM languages WHERE code = 'en'), 'homepage', 'company_forbes', 'Forbes'),
((SELECT id FROM languages WHERE code = 'en'), 'homepage', 'company_techradar', 'techradar'),
((SELECT id FROM languages WHERE code = 'en'), 'homepage', 'company_hubspot', 'HubSpot'),
((SELECT id FROM languages WHERE code = 'en'), 'homepage', 'company_cybernews', 'cybernews'),
((SELECT id FROM languages WHERE code = 'en'), 'homepage', 'company_crypto', 'crypto.com'),
((SELECT id FROM languages WHERE code = 'en'), 'homepage', 'company_website_planet', 'WEBSITE PLANET'),
((SELECT id FROM languages WHERE code = 'en'), 'homepage', 'company_np_digital', 'NP digital'),
((SELECT id FROM languages WHERE code = 'en'), 'homepage', 'company_pc', 'PC'),
((SELECT id FROM languages WHERE code = 'en'), 'homepage', 'company_cnet', 'CNET'),

-- Spanish provider translations
((SELECT id FROM languages WHERE code = 'es'), 'homepage', 'provider_ultrahost', 'Ultrahost'),
((SELECT id FROM languages WHERE code = 'es'), 'homepage', 'provider_dreamhost', 'DreamHost'),
((SELECT id FROM languages WHERE code = 'es'), 'homepage', 'provider_hostgator', 'HostGator'),
((SELECT id FROM languages WHERE code = 'es'), 'homepage', 'provider_bluehost', 'Bluehost'),
((SELECT id FROM languages WHERE code = 'es'), 'homepage', 'provider_siteground', 'SiteGround'),
((SELECT id FROM languages WHERE code = 'es'), 'homepage', 'price_ultrahost', '$3.29/mes'),
((SELECT id FROM languages WHERE code = 'es'), 'homepage', 'price_dreamhost', '$4.95/mes'),
((SELECT id FROM languages WHERE code = 'es'), 'homepage', 'price_hostgator', '$11.95/mes'),
((SELECT id FROM languages WHERE code = 'es'), 'homepage', 'price_bluehost', '$10.99/mes'),
((SELECT id FROM languages WHERE code = 'es'), 'homepage', 'price_siteground', '$19.99/mes'),
((SELECT id FROM languages WHERE code = 'es'), 'homepage', 'friendly_expert_alt', 'Experto de hosting amigable'),

-- Spanish company names (same as English for brand names)
((SELECT id FROM languages WHERE code = 'es'), 'homepage', 'company_nga', 'NGA'),
((SELECT id FROM languages WHERE code = 'es'), 'homepage', 'company_forbes', 'Forbes'),
((SELECT id FROM languages WHERE code = 'es'), 'homepage', 'company_techradar', 'techradar'),
((SELECT id FROM languages WHERE code = 'es'), 'homepage', 'company_hubspot', 'HubSpot'),
((SELECT id FROM languages WHERE code = 'es'), 'homepage', 'company_cybernews', 'cybernews'),
((SELECT id FROM languages WHERE code = 'es'), 'homepage', 'company_crypto', 'crypto.com'),
((SELECT id FROM languages WHERE code = 'es'), 'homepage', 'company_website_planet', 'WEBSITE PLANET'),
((SELECT id FROM languages WHERE code = 'es'), 'homepage', 'company_np_digital', 'NP digital'),
((SELECT id FROM languages WHERE code = 'es'), 'homepage', 'company_pc', 'PC'),
((SELECT id FROM languages WHERE code = 'es'), 'homepage', 'company_cnet', 'CNET'),

-- French provider translations
((SELECT id FROM languages WHERE code = 'fr'), 'homepage', 'provider_ultrahost', 'Ultrahost'),
((SELECT id FROM languages WHERE code = 'fr'), 'homepage', 'provider_dreamhost', 'DreamHost'),
((SELECT id FROM languages WHERE code = 'fr'), 'homepage', 'provider_hostgator', 'HostGator'),
((SELECT id FROM languages WHERE code = 'fr'), 'homepage', 'provider_bluehost', 'Bluehost'),
((SELECT id FROM languages WHERE code = 'fr'), 'homepage', 'provider_siteground', 'SiteGround'),
((SELECT id FROM languages WHERE code = 'fr'), 'homepage', 'price_ultrahost', '$3.29/mois'),
((SELECT id FROM languages WHERE code = 'fr'), 'homepage', 'price_dreamhost', '$4.95/mois'),
((SELECT id FROM languages WHERE code = 'fr'), 'homepage', 'price_hostgator', '$11.95/mois'),
((SELECT id FROM languages WHERE code = 'fr'), 'homepage', 'price_bluehost', '$10.99/mois'),
((SELECT id FROM languages WHERE code = 'fr'), 'homepage', 'price_siteground', '$19.99/mois'),
((SELECT id FROM languages WHERE code = 'fr'), 'homepage', 'friendly_expert_alt', 'Expert hébergement amical'),

-- French company names (same as English for brand names)
((SELECT id FROM languages WHERE code = 'fr'), 'homepage', 'company_nga', 'NGA'),
((SELECT id FROM languages WHERE code = 'fr'), 'homepage', 'company_forbes', 'Forbes'),
((SELECT id FROM languages WHERE code = 'fr'), 'homepage', 'company_techradar', 'techradar'),
((SELECT id FROM languages WHERE code = 'fr'), 'homepage', 'company_hubspot', 'HubSpot'),
((SELECT id FROM languages WHERE code = 'fr'), 'homepage', 'company_cybernews', 'cybernews'),
((SELECT id FROM languages WHERE code = 'fr'), 'homepage', 'company_crypto', 'crypto.com'),
((SELECT id FROM languages WHERE code = 'fr'), 'homepage', 'company_website_planet', 'WEBSITE PLANET'),
((SELECT id FROM languages WHERE code = 'fr'), 'homepage', 'company_np_digital', 'NP digital'),
((SELECT id FROM languages WHERE code = 'fr'), 'homepage', 'company_pc', 'PC'),
((SELECT id FROM languages WHERE code = 'fr'), 'homepage', 'company_cnet', 'CNET'),

-- German provider translations
((SELECT id FROM languages WHERE code = 'de'), 'homepage', 'provider_ultrahost', 'Ultrahost'),
((SELECT id FROM languages WHERE code = 'de'), 'homepage', 'provider_dreamhost', 'DreamHost'),
((SELECT id FROM languages WHERE code = 'de'), 'homepage', 'provider_hostgator', 'HostGator'),
((SELECT id FROM languages WHERE code = 'de'), 'homepage', 'provider_bluehost', 'Bluehost'),
((SELECT id FROM languages WHERE code = 'de'), 'homepage', 'provider_siteground', 'SiteGround'),
((SELECT id FROM languages WHERE code = 'de'), 'homepage', 'price_ultrahost', '$3.29/Monat'),
((SELECT id FROM languages WHERE code = 'de'), 'homepage', 'price_dreamhost', '$4.95/Monat'),
((SELECT id FROM languages WHERE code = 'de'), 'homepage', 'price_hostgator', '$11.95/Monat'),
((SELECT id FROM languages WHERE code = 'de'), 'homepage', 'price_bluehost', '$10.99/Monat'),
((SELECT id FROM languages WHERE code = 'de'), 'homepage', 'price_siteground', '$19.99/Monat'),
((SELECT id FROM languages WHERE code = 'de'), 'homepage', 'friendly_expert_alt', 'Freundlicher Hosting-Experte'),

-- German company names (same as English for brand names)
((SELECT id FROM languages WHERE code = 'de'), 'homepage', 'company_nga', 'NGA'),
((SELECT id FROM languages WHERE code = 'de'), 'homepage', 'company_forbes', 'Forbes'),
((SELECT id FROM languages WHERE code = 'de'), 'homepage', 'company_techradar', 'techradar'),
((SELECT id FROM languages WHERE code = 'de'), 'homepage', 'company_hubspot', 'HubSpot'),
((SELECT id FROM languages WHERE code = 'de'), 'homepage', 'company_cybernews', 'cybernews'),
((SELECT id FROM languages WHERE code = 'de'), 'homepage', 'company_crypto', 'crypto.com'),
((SELECT id FROM languages WHERE code = 'de'), 'homepage', 'company_website_planet', 'WEBSITE PLANET'),
((SELECT id FROM languages WHERE code = 'de'), 'homepage', 'company_np_digital', 'NP digital'),
((SELECT id FROM languages WHERE code = 'de'), 'homepage', 'company_pc', 'PC'),
((SELECT id FROM languages WHERE code = 'de'), 'homepage', 'company_cnet', 'CNET'),

-- Arabic provider translations
((SELECT id FROM languages WHERE code = 'ar'), 'homepage', 'provider_ultrahost', 'Ultrahost'),
((SELECT id FROM languages WHERE code = 'ar'), 'homepage', 'provider_dreamhost', 'DreamHost'),
((SELECT id FROM languages WHERE code = 'ar'), 'homepage', 'provider_hostgator', 'HostGator'),
((SELECT id FROM languages WHERE code = 'ar'), 'homepage', 'provider_bluehost', 'Bluehost'),
((SELECT id FROM languages WHERE code = 'ar'), 'homepage', 'provider_siteground', 'SiteGround'),
((SELECT id FROM languages WHERE code = 'ar'), 'homepage', 'price_ultrahost', '$3.29/شهر'),
((SELECT id FROM languages WHERE code = 'ar'), 'homepage', 'price_dreamhost', '$4.95/شهر'),
((SELECT id FROM languages WHERE code = 'ar'), 'homepage', 'price_hostgator', '$11.95/شهر'),
((SELECT id FROM languages WHERE code = 'ar'), 'homepage', 'price_bluehost', '$10.99/شهر'),
((SELECT id FROM languages WHERE code = 'ar'), 'homepage', 'price_siteground', '$19.99/شهر'),
((SELECT id FROM languages WHERE code = 'ar'), 'homepage', 'friendly_expert_alt', 'خبير استضافة ودود'),

-- Arabic company names (same as English for brand names)
((SELECT id FROM languages WHERE code = 'ar'), 'homepage', 'company_nga', 'NGA'),
((SELECT id FROM languages WHERE code = 'ar'), 'homepage', 'company_forbes', 'Forbes'),
((SELECT id FROM languages WHERE code = 'ar'), 'homepage', 'company_techradar', 'techradar'),
((SELECT id FROM languages WHERE code = 'ar'), 'homepage', 'company_hubspot', 'HubSpot'),
((SELECT id FROM languages WHERE code = 'ar'), 'homepage', 'company_cybernews', 'cybernews'),
((SELECT id FROM languages WHERE code = 'ar'), 'homepage', 'company_crypto', 'crypto.com'),
((SELECT id FROM languages WHERE code = 'ar'), 'homepage', 'company_website_planet', 'WEBSITE PLANET'),
((SELECT id FROM languages WHERE code = 'ar'), 'homepage', 'company_np_digital', 'NP digital'),
((SELECT id FROM languages WHERE code = 'ar'), 'homepage', 'company_pc', 'PC'),
((SELECT id FROM languages WHERE code = 'ar'), 'homepage', 'company_cnet', 'CNET');