-- Update existing users to have different roles for testing
UPDATE public.profiles 
SET role = 'seo_manager' 
WHERE username = 'rosa';

UPDATE public.profiles 
SET role = 'content_writer' 
WHERE username = 'younes';