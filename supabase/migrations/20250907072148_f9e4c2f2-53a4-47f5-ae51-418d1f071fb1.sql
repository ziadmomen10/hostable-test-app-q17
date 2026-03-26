-- Insert a sample hosting page for testing
INSERT INTO public.pages (
  page_url,
  page_title,
  page_description,
  page_keywords,
  country,
  supported_languages,
  show_price_switcher,
  is_active
) VALUES (
  '/hosting',
  'Web Hosting Services',
  'Discover our reliable and affordable web hosting solutions. From shared hosting to VPS and dedicated servers, we have the perfect hosting plan for your website.',
  'web hosting, shared hosting, VPS hosting, dedicated servers, website hosting',
  'US',
  ARRAY[]::text[],
  true,
  true
) ON CONFLICT (page_url) DO NOTHING;