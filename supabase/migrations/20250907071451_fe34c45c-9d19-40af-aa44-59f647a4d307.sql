-- Update RLS policies for pages table to allow all authenticated users to create pages

-- Drop existing admin-only policy
DROP POLICY IF EXISTS "pages_allow_admin" ON public.pages;

-- Allow all authenticated users to insert pages
CREATE POLICY "All users can create pages" 
ON public.pages 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Allow admins to update and delete pages
CREATE POLICY "Admins can update pages" 
ON public.pages 
FOR UPDATE 
TO authenticated 
USING (is_admin()) 
WITH CHECK (is_admin());

CREATE POLICY "Admins can delete pages" 
ON public.pages 
FOR DELETE 
TO authenticated 
USING (is_admin());

-- Keep the existing select policy for active pages
-- Policy "Anyone can view active pages" already exists