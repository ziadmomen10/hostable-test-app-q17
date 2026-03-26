-- First check current enum values
DO $$
BEGIN
    -- Drop and recreate the enum with all roles
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        DROP TYPE user_role CASCADE;
    END IF;
    
    CREATE TYPE user_role AS ENUM ('admin', 'seo_manager', 'content_writer', 'manager', 'user');
    
    -- Recreate the column with new enum type
    ALTER TABLE public.profiles 
    ALTER COLUMN role SET DEFAULT 'user'::user_role,
    ALTER COLUMN role TYPE user_role USING 'user'::user_role;
END $$;

-- Insert the default admin user profile
INSERT INTO public.profiles (user_id, email, username, role, last_login)
VALUES (
  'admin-user',
  'admin@hostonce.com', 
  'admin',
  'admin'::user_role,
  now()
)
ON CONFLICT (user_id) DO UPDATE SET
  last_login = now(),
  role = 'admin'::user_role;