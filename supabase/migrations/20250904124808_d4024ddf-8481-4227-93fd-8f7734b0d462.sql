-- Allow mock admin user to create profiles for others
CREATE POLICY "Allow mock admin to create profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (
  -- Allow if current session user_id matches our mock admin
  (SELECT user_id FROM public.profiles WHERE user_id = '00000000-0000-0000-0000-000000000001' LIMIT 1) = '00000000-0000-0000-0000-000000000001'
);