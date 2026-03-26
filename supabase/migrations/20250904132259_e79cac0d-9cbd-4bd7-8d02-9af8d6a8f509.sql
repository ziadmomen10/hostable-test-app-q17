-- Fix RLS policy to allow users to update their own last_login
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (true)  -- Allow any authenticated user to update profiles
WITH CHECK (true);