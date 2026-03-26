-- Add username and last_login fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN username text,
ADD COLUMN last_login timestamp with time zone;

-- Create index for better performance on username lookups
CREATE INDEX idx_profiles_username ON public.profiles(username);

-- Create index for last_login for sorting
CREATE INDEX idx_profiles_last_login ON public.profiles(last_login);

-- Update RLS policies to allow admins to manage other users
CREATE POLICY "Admins can delete other profiles" 
ON public.profiles 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.user_id = auth.uid() AND p.role = 'admin'
  )
);

-- Create trigger to update last_login when user signs in
CREATE OR REPLACE FUNCTION public.update_last_login()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles 
  SET last_login = now()
  WHERE user_id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: This trigger would need to be attached to auth.users table
-- but we can't modify auth schema, so we'll handle last_login updates in the application