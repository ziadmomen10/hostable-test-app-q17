-- Update RLS policies for pages table to allow ALL users (including anonymous) to perform all operations

-- Drop existing policies
DROP POLICY IF EXISTS "All users can create pages" ON public.pages;
DROP POLICY IF EXISTS "Admins can update pages" ON public.pages;
DROP POLICY IF EXISTS "Admins can delete pages" ON public.pages;
DROP POLICY IF EXISTS "Anyone can view active pages" ON public.pages;

-- Allow everyone (including anonymous users) to perform all operations
CREATE POLICY "Public can create pages" 
ON public.pages 
FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Public can update pages" 
ON public.pages 
FOR UPDATE 
TO public 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Public can delete pages" 
ON public.pages 
FOR DELETE 
TO public 
USING (true);

CREATE POLICY "Public can view pages" 
ON public.pages 
FOR SELECT 
TO public 
USING (true);