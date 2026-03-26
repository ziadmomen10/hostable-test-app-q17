-- Fix the announcements RLS policy issue
-- The problem is that the policy is using check_user_is_admin(auth.uid()) but
-- the announcements table had a hardcoded user_id check in the old policy

-- Let's check the current policy first and then fix it
SELECT schemaname, tablename, policyname, cmd, permissive, roles, qual, with_check 
FROM pg_policies 
WHERE tablename = 'announcements';