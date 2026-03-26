-- Drop policies that depend on the functions
DROP POLICY IF EXISTS "Only admins can access admin config" ON public.admin_config;
DROP POLICY IF EXISTS "Admins can delete other profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can create new profiles" ON public.profiles;

-- Drop and recreate functions to use the roles array properly
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;
DROP FUNCTION IF EXISTS public.is_current_user_admin() CASCADE;

-- Create new function that checks for admin role in roles array
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND 'admin' = ANY(roles)
  );
$$;

-- Create helper function to check for admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND 'admin' = ANY(roles)
  );
$$;

-- Recreate the admin policies with updated functions
CREATE POLICY "Only admins can access admin config" 
ON public.admin_config 
FOR ALL 
USING (is_admin());

CREATE POLICY "Admins can delete other profiles" 
ON public.profiles 
FOR DELETE 
USING (is_current_user_admin());

CREATE POLICY "Admins can create new profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (is_current_user_admin());