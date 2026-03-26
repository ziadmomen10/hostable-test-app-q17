-- Update existing users to use a known password for testing
UPDATE public.profiles SET password_hash = 'admin' WHERE username = 'admin';
UPDATE public.profiles SET password_hash = 'younes' WHERE username = 'younes'; 
UPDATE public.profiles SET password_hash = 'rosa' WHERE username = 'rosa';