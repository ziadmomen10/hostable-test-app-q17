-- Create default admin user
-- Note: This will create a user in auth.users table and corresponding profile
-- First, we need to insert into auth.users, but since we can't directly insert there,
-- we'll create a profile entry that assumes the admin user exists
-- The actual user creation will need to be done through Supabase Auth

-- Create the profile for the admin user (assuming user will be created with specific UUID)
-- We'll use a known UUID for the admin user
INSERT INTO public.profiles (user_id, email, role) 
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid, 
  'admin@hostonce.com', 
  'admin'::user_role
) ON CONFLICT (user_id) DO NOTHING;

-- Set the admin hash path in config
INSERT INTO public.admin_config (key, value) 
VALUES ('admin_hash_path', 'a93jf02kd92ms71x8qp4') 
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;