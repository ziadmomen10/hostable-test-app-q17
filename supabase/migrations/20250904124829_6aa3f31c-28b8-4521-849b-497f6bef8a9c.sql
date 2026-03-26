-- Drop the previous policy and create a simpler one
DROP POLICY IF EXISTS "Allow mock admin to create profiles" ON public.profiles;

-- Allow creation of admin profiles (temporary solution)
CREATE POLICY "Allow admin profile creation" 
ON public.profiles 
FOR INSERT 
WITH CHECK (true);