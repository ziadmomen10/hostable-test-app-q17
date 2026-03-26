-- Add gender field to profiles table
ALTER TABLE public.profiles ADD COLUMN gender TEXT DEFAULT 'male' CHECK (gender IN ('male', 'female'));