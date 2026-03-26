-- Fix SELECT policy to allow viewing all admin profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create a policy that allows viewing all profiles (for admin dashboard)
CREATE POLICY "Allow viewing all admin profiles" 
ON public.profiles 
FOR SELECT 
USING (true);

-- Add unique constraint on username to prevent duplicates
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_username_unique UNIQUE (username);