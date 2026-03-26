-- Create languages table to store supported languages
CREATE TABLE public.languages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(10) NOT NULL UNIQUE, -- Language code like 'en', 'es', 'fr'
  name VARCHAR(100) NOT NULL, -- Display name like 'English', 'Spanish', 'French'
  native_name VARCHAR(100), -- Native name like 'English', 'Español', 'Français'
  is_default BOOLEAN DEFAULT FALSE, -- Mark default language
  is_active BOOLEAN DEFAULT TRUE, -- Enable/disable language
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create translations table to store key-value translations
CREATE TABLE public.translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  language_id UUID NOT NULL REFERENCES public.languages(id) ON DELETE CASCADE,
  namespace VARCHAR(100) DEFAULT 'common', -- Namespace for grouping translations
  key VARCHAR(255) NOT NULL, -- Translation key like 'welcome_message'
  value TEXT, -- Translation value
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(language_id, namespace, key)
);

-- Enable RLS
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

-- Create policies for languages table
CREATE POLICY "Anyone can view languages" 
ON public.languages 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage languages" 
ON public.languages 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE 'admin' = ANY(roles)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE 'admin' = ANY(roles)
  )
);

-- Create policies for translations table
CREATE POLICY "Anyone can view translations" 
ON public.translations 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage translations" 
ON public.translations 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE 'admin' = ANY(roles)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE 'admin' = ANY(roles)
  )
);

-- Create update triggers
CREATE TRIGGER update_languages_updated_at
BEFORE UPDATE ON public.languages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_translations_updated_at
BEFORE UPDATE ON public.translations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default languages
INSERT INTO public.languages (code, name, native_name, is_default, is_active) VALUES
('en', 'English', 'English', true, true),
('es', 'Spanish', 'Español', false, true),
('fr', 'French', 'Français', false, true),
('de', 'German', 'Deutsch', false, true),
('it', 'Italian', 'Italiano', false, true);