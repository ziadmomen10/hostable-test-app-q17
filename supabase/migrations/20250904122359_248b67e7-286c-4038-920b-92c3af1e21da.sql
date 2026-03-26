-- Drop the problematic recursive policy
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create a secure function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

-- Create new non-recursive policies
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.is_current_user_admin());

-- Update other admin policies to use the same pattern
DROP POLICY IF EXISTS "Admins can delete other profiles" ON public.profiles;

CREATE POLICY "Admins can delete other profiles" 
ON public.profiles 
FOR DELETE 
USING (public.is_current_user_admin());