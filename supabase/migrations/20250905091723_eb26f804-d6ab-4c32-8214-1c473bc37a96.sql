-- Fix RLS policy for announcements to work with current authentication
-- Drop existing policy and recreate with better logic

DROP POLICY IF EXISTS "Admins can manage all announcements" ON announcements;

-- Create new policy that checks admin role more directly
CREATE POLICY "Admins can manage all announcements" ON announcements
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = '60564265-4f1b-421b-aca0-76fa5537f922'::uuid 
    AND 'admin' = ANY(roles)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = '60564265-4f1b-421b-aca0-76fa5537f922'::uuid 
    AND 'admin' = ANY(roles)
  )
);

-- Also create a user in auth.users if it doesn't exist to fix authentication
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '60564265-4f1b-421b-aca0-76fa5537f922'::uuid,
  'authenticated',
  'authenticated',
  'admin@example.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now(),
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;