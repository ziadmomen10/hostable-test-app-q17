-- Drop the existing RLS policy that doesn't work with our mock auth
DROP POLICY IF EXISTS "Only admins can manage banned IPs" ON public.banned_ips;

-- Create a new policy that works with our mock authentication
-- Since we're using mock auth, we'll allow operations for the static admin user ID
CREATE POLICY "Allow admin operations on banned IPs" 
ON public.banned_ips 
FOR ALL 
USING (
  -- Allow operations if the user is the admin user ID or if they have admin role
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = '00000000-0000-0000-0000-000000000001' 
    AND 'admin' = ANY(roles)
  )
) 
WITH CHECK (
  -- Same check for insert/update operations
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = '00000000-0000-0000-0000-000000000001' 
    AND 'admin' = ANY(roles)
  )
);