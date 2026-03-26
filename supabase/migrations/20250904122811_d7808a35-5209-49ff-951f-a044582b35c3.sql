-- Create the enum type first
CREATE TYPE user_role AS ENUM ('admin', 'seo_manager', 'content_writer', 'manager', 'user');

-- Drop and recreate the role column
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role CASCADE;
ALTER TABLE public.profiles ADD COLUMN role user_role NOT NULL DEFAULT 'user';

-- Insert the default admin user profile
INSERT INTO public.profiles (user_id, email, username, role, last_login)
VALUES (
  'admin-user',
  'admin@hostonce.com', 
  'admin',
  'admin',
  now()
)
ON CONFLICT (user_id) DO UPDATE SET
  last_login = now(),
  role = 'admin';