-- First, let's add RTL support to languages table
ALTER TABLE public.languages 
ADD COLUMN IF NOT EXISTS direction TEXT DEFAULT 'ltr' CHECK (direction IN ('ltr', 'rtl'));

-- Add version field for translation caching
ALTER TABLE public.translations 
ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

-- Create namespaces table for better organization
CREATE TABLE IF NOT EXISTS public.namespaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on namespaces
ALTER TABLE public.namespaces ENABLE ROW LEVEL SECURITY;

-- Create policies for namespaces
CREATE POLICY "Anyone can view namespaces" 
ON public.namespaces 
FOR SELECT 
USING (true);

CREATE POLICY "namespaces_allow_admin" 
ON public.namespaces 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Insert default namespaces
INSERT INTO public.namespaces (name, description) 
VALUES 
  ('common', 'Common translations used across the application'),
  ('auth', 'Authentication and user management translations'),
  ('dashboard', 'Dashboard and admin panel translations'),
  ('ui', 'User interface components and labels'),
  ('errors', 'Error messages and validation texts'),
  ('navigation', 'Navigation menus and links'),
  ('forms', 'Form labels, placeholders, and buttons'),
  ('notifications', 'Toast notifications and alerts')
ON CONFLICT (name) DO NOTHING;

-- Add foreign key constraint to translations for better data integrity
ALTER TABLE public.translations 
ADD CONSTRAINT fk_translations_language 
FOREIGN KEY (language_id) REFERENCES public.languages(id) ON DELETE CASCADE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_translations_language_namespace 
ON public.translations(language_id, namespace);

CREATE INDEX IF NOT EXISTS idx_translations_key 
ON public.translations(key);

-- Add trigger for updating translation versions when changed
CREATE OR REPLACE FUNCTION public.update_translation_version()
RETURNS TRIGGER AS $$
BEGIN
  NEW.version = OLD.version + 1;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_translation_version_trigger
  BEFORE UPDATE ON public.translations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_translation_version();

-- Update updated_at trigger for namespaces
CREATE TRIGGER update_namespaces_updated_at
  BEFORE UPDATE ON public.namespaces
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();