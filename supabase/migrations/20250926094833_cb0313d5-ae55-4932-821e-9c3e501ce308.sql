-- Add missing translation keys for hardcoded text in Homepage
INSERT INTO public.translations (language_id, namespace, key, value) VALUES
-- English missing keys
((SELECT id FROM languages WHERE code = 'en'), 'homepage', 'main_price', '$3.29'),
((SELECT id FROM languages WHERE code = 'en'), 'homepage', 'google_letter', 'G'),
((SELECT id FROM languages WHERE code = 'en'), 'homepage', 'star_symbol', '★'),

-- Spanish missing keys
((SELECT id FROM languages WHERE code = 'es'), 'homepage', 'main_price', '$3.29'),
((SELECT id FROM languages WHERE code = 'es'), 'homepage', 'google_letter', 'G'),
((SELECT id FROM languages WHERE code = 'es'), 'homepage', 'star_symbol', '★'),

-- French missing keys
((SELECT id FROM languages WHERE code = 'fr'), 'homepage', 'main_price', '$3.29'),
((SELECT id FROM languages WHERE code = 'fr'), 'homepage', 'google_letter', 'G'),
((SELECT id FROM languages WHERE code = 'fr'), 'homepage', 'star_symbol', '★'),

-- German missing keys
((SELECT id FROM languages WHERE code = 'de'), 'homepage', 'main_price', '$3.29'),
((SELECT id FROM languages WHERE code = 'de'), 'homepage', 'google_letter', 'G'),
((SELECT id FROM languages WHERE code = 'de'), 'homepage', 'star_symbol', '★'),

-- Arabic missing keys
((SELECT id FROM languages WHERE code = 'ar'), 'homepage', 'main_price', '$3.29'),
((SELECT id FROM languages WHERE code = 'ar'), 'homepage', 'google_letter', 'G'),
((SELECT id FROM languages WHERE code = 'ar'), 'homepage', 'star_symbol', '★');