-- Create page_translation_coverage table to track per-language coverage for each page
CREATE TABLE public.page_translation_coverage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  language_code VARCHAR NOT NULL,
  language_name VARCHAR NOT NULL,
  translated_count INTEGER NOT NULL DEFAULT 0,
  total_keys INTEGER NOT NULL DEFAULT 0,
  coverage_percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
  last_calculated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(page_id, language_code)
);

-- Add overall coverage columns to pages table
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS overall_coverage DECIMAL(5,2) DEFAULT 0;
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS total_translatable_elements INTEGER DEFAULT 0;
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS elements_with_keys INTEGER DEFAULT 0;
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS keys_coverage_percentage DECIMAL(5,2) DEFAULT 0;

-- Enable RLS on page_translation_coverage
ALTER TABLE public.page_translation_coverage ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for page_translation_coverage (public access for admin panel)
CREATE POLICY "Public can view page translation coverage"
ON public.page_translation_coverage
FOR SELECT
USING (true);

CREATE POLICY "Public can insert page translation coverage"
ON public.page_translation_coverage
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Public can update page translation coverage"
ON public.page_translation_coverage
FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Public can delete page translation coverage"
ON public.page_translation_coverage
FOR DELETE
USING (true);

-- Create index for faster queries
CREATE INDEX idx_page_translation_coverage_page_id ON public.page_translation_coverage(page_id);
CREATE INDEX idx_page_translation_coverage_language ON public.page_translation_coverage(language_code);
CREATE INDEX idx_pages_overall_coverage ON public.pages(overall_coverage);

-- Create trigger for updated_at
CREATE TRIGGER update_page_translation_coverage_updated_at
BEFORE UPDATE ON public.page_translation_coverage
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();