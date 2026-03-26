-- Add password field to profiles table
ALTER TABLE public.profiles ADD COLUMN password_hash TEXT NOT NULL DEFAULT 'password';