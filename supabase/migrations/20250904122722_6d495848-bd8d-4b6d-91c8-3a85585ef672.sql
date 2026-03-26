-- Update the user_role enum to include all requested roles
DROP TYPE IF EXISTS user_role CASCADE;
CREATE TYPE user_role AS ENUM ('admin', 'seo_manager', 'content_writer', 'manager', 'user');

-- Recreate the profiles table with updated role column
ALTER TABLE public.profiles 
ALTER COLUMN role TYPE user_role USING role::text::user_role;

-- Insert the default admin user profile if it doesn't exist
INSERT INTO public.profiles (user_id, email, username, role, last_login)
VALUES (
  'admin-user',
  'admin@hostonce.com', 
  'admin',
  'admin',
  now()
)
ON CONFLICT (user_id) DO UPDATE SET
  last_login = now();