-- Add roles array column and migrate existing data
ALTER TABLE public.profiles ADD COLUMN roles TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Migrate existing single role to roles array
UPDATE public.profiles 
SET roles = ARRAY[role::TEXT] 
WHERE role IS NOT NULL;

-- Drop the old single role column
ALTER TABLE public.profiles DROP COLUMN role;