-- Fix SELECT policy first
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Allow viewing all admin profiles" 
ON public.profiles 
FOR SELECT 
USING (true);

-- Remove duplicate usernames, keeping only the most recent one
DELETE FROM public.profiles 
WHERE id NOT IN (
  SELECT DISTINCT ON (username) id 
  FROM public.profiles 
  ORDER BY username, created_at DESC
) AND username IS NOT NULL;

-- Now add the unique constraint
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_username_unique UNIQUE (username);