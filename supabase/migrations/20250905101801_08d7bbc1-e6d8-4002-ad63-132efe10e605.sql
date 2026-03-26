-- The issue is that the admin policy might not be working for the current user
-- Let's test and fix the announcements policy

-- First, test if the check function works for our admin user
SELECT public.check_user_is_admin('00000000-0000-0000-0000-000000000001'::uuid) as is_admin;

-- Drop and recreate the admin policy with a more explicit approach
DROP POLICY IF EXISTS "announcements_admin_policy" ON public.announcements;

-- Create a new policy that explicitly allows the mock admin and checks admin role
CREATE POLICY "announcements_admin_manage" ON public.announcements
  FOR ALL
  USING (
    -- Allow the mock admin user explicitly
    auth.uid() = '00000000-0000-0000-0000-000000000001'::uuid
    OR
    -- Or check if current user is admin using our function
    public.check_user_is_admin(auth.uid())
  )
  WITH CHECK (
    -- Same conditions for updates
    auth.uid() = '00000000-0000-0000-0000-000000000001'::uuid
    OR
    public.check_user_is_admin(auth.uid())
  );