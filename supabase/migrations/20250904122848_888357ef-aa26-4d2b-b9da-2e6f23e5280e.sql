-- Add the missing enum values
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'seo_manager';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'content_writer'; 
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'manager';

-- Insert the default admin user profile with proper UUID
INSERT INTO public.profiles (user_id, email, username, role, last_login)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@hostonce.com', 
  'admin',
  'admin',
  now()
)
ON CONFLICT (user_id) DO UPDATE SET
  last_login = now(),
  username = 'admin',
  role = 'admin';