-- Fix admin user's roles so page saves will work
UPDATE public.profiles 
SET roles = ARRAY['admin']::text[]
WHERE user_id = '190001d8-4640-43c5-8904-c062e05e94c8';