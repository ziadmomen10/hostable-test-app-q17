-- Create pages table for website page management
CREATE TABLE public.pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  page_url TEXT NOT NULL UNIQUE,
  page_title TEXT NOT NULL,
  page_description TEXT,
  page_keywords TEXT,
  cloned_from_id UUID REFERENCES public.pages(id),
  country TEXT,
  supported_languages TEXT[] DEFAULT ARRAY[]::TEXT[],
  show_price_switcher BOOLEAN DEFAULT false,
  header_image_url TEXT,
  og_image_url TEXT,
  is_active BOOLEAN DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Anyone can view active pages" 
ON public.pages 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "pages_allow_admin" 
ON public.pages 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_pages_updated_at
BEFORE UPDATE ON public.pages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_pages_url ON public.pages(page_url);
CREATE INDEX idx_pages_country ON public.pages(country);
CREATE INDEX idx_pages_active ON public.pages(is_active);