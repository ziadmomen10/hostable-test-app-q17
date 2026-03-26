-- Fix enum values - add missing ones
DO $$
BEGIN
    -- Add missing enum values if they don't exist
    IF NOT EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid WHERE t.typname = 'user_role' AND e.enumlabel = 'seo_manager') THEN
        ALTER TYPE user_role ADD VALUE 'seo_manager';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid WHERE t.typname = 'user_role' AND e.enumlabel = 'content_writer') THEN
        ALTER TYPE user_role ADD VALUE 'content_writer';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid WHERE t.typname = 'user_role' AND e.enumlabel = 'manager') THEN
        ALTER TYPE user_role ADD VALUE 'manager';
    END IF;
END $$;

-- Create a bypass policy for mock admin user
CREATE POLICY "Allow mock admin user" 
ON public.profiles 
FOR ALL 
USING (user_id = '00000000-0000-0000-0000-000000000001');

-- Insert the admin user directly (bypassing RLS check)
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