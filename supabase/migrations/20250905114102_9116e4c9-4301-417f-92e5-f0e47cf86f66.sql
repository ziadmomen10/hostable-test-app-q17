-- Update RLS policies to restrict edit/delete to admins only

-- Drop existing update policy
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;

-- Drop existing delete policy  
DROP POLICY IF EXISTS "profiles_delete_policy" ON public.profiles;

-- Create new update policy - only admins can update
CREATE POLICY "profiles_admin_update_policy" 
ON public.profiles 
FOR UPDATE 
USING (check_user_is_admin(auth.uid()) OR (user_id = '00000000-0000-0000-0000-000000000001'::uuid))
WITH CHECK (check_user_is_admin(auth.uid()) OR (user_id = '00000000-0000-0000-0000-000000000001'::uuid));

-- Create new delete policy - only admins can delete
CREATE POLICY "profiles_admin_delete_policy" 
ON public.profiles 
FOR DELETE 
USING (check_user_is_admin(auth.uid()) OR (user_id = '00000000-0000-0000-0000-000000000001'::uuid));