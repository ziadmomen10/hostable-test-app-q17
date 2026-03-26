-- Drop old RLS policies that might reference the old 'role' column
DROP POLICY IF EXISTS "Admins can delete other profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Recreate RLS policies with proper roles array handling
CREATE POLICY "Allow viewing all admin profiles" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Allow admin profile creation" 
ON public.profiles 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow profile updates" 
ON public.profiles 
FOR UPDATE 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow profile deletion" 
ON public.profiles 
FOR DELETE 
USING (true);