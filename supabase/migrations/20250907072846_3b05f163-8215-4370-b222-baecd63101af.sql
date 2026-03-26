-- Create a sample page for testing
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
  '/example',
  'Example Page',
  'This is an example page created for testing the dynamic page system.',
  'example, test, dynamic page',
  'US',
  ARRAY[]::text[],
  true,
  true
) ON CONFLICT (page_url) DO NOTHING;