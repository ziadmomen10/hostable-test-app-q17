-- Add the missing enum values
ALTER TYPE user_role ADD VALUE 'seo_manager';
ALTER TYPE user_role ADD VALUE 'content_writer'; 
ALTER TYPE user_role ADD VALUE 'manager';

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
  username = 'admin',
  role = 'admin';