-- Temporarily disable RLS on profiles table for development with mock auth
-- This allows edit/delete operations to work with the mock authentication system
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;