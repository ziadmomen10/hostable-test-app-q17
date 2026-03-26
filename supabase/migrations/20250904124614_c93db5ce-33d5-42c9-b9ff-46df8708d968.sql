-- Add RLS policy to allow admins to create new profiles
CREATE POLICY "Admins can create new profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (is_current_user_admin());