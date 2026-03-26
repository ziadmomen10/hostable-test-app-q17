-- Fix RLS policies to work with mock authentication
-- Since the app doesn't use real Supabase auth, we need to allow operations based on the hardcoded admin user ID

-- Drop existing policies
DROP POLICY IF EXISTS "profiles_admin_update_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_delete_policy" ON public.profiles;

-- Create new policies that allow operations for the hardcoded admin user
CREATE POLICY "profiles_admin_update_policy" 
ON public.profiles 
FOR UPDATE 
USING (user_id = '00000000-0000-0000-0000-000000000001'::uuid OR check_user_is_admin('00000000-0000-0000-0000-000000000001'::uuid))
WITH CHECK (user_id = '00000000-0000-0000-0000-000000000001'::uuid OR check_user_is_admin('00000000-0000-0000-0000-000000000001'::uuid));

CREATE POLICY "profiles_admin_delete_policy" 
ON public.profiles 
FOR DELETE 
USING (user_id = '00000000-0000-0000-0000-000000000001'::uuid OR check_user_is_admin('00000000-0000-0000-0000-000000000001'::uuid));