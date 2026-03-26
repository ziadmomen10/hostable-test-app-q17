-- Create page_translations table for storing element translations per language
CREATE TABLE public.page_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  language_id UUID NOT NULL REFERENCES public.languages(id) ON DELETE CASCADE,
  element_key TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page_id, language_id, element_key)
);

-- Enable RLS
ALTER TABLE public.page_translations ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (same as pages table)
CREATE POLICY "Public can view page translations" ON public.page_translations FOR SELECT USING (true);
CREATE POLICY "Public can create page translations" ON public.page_translations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update page translations" ON public.page_translations FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public can delete page translations" ON public.page_translations FOR DELETE USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_page_translations_updated_at
  BEFORE UPDATE ON public.page_translations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_page_translations_page_language ON public.page_translations(page_id, language_id);
CREATE INDEX idx_page_translations_element_key ON public.page_translations(element_key);