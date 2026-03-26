-- Create announcements table for managing homepage announcements
CREATE TABLE public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  background_color TEXT DEFAULT '#1e293b',
  text_color TEXT DEFAULT '#ffffff',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Create policies for announcements
CREATE POLICY "Anyone can view active announcements" 
ON public.announcements 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage all announcements" 
ON public.announcements 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = auth.uid() 
  AND 'admin' = ANY(roles)
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = auth.uid() 
  AND 'admin' = ANY(roles)
));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_announcements_updated_at
BEFORE UPDATE ON public.announcements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert the current announcement from the homepage
INSERT INTO public.announcements (
  title,
  message,
  is_active,
  background_color,
  text_color
) VALUES (
  'Hosting Flash Sale',
  'Get 40% Off all hosting services for a limited time!',
  true,
  '#1e293b',
  '#ffffff'
);