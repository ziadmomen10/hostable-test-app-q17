-- Fix infinite recursion in RLS policies by creating security definer functions
-- and simplifying the policy structure

-- First, drop all existing problematic policies on profiles table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow mock admin user" ON public.profiles;
DROP POLICY IF EXISTS "Allow admin profile creation" ON public.profiles;
DROP POLICY IF EXISTS "Allow admin users to delete profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow profile creation by admin users" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile, admins view all" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile only" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;

-- Create security definer function to check if current user is admin
-- This avoids recursion by using a direct query without RLS
CREATE OR REPLACE FUNCTION public.current_user_is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND 'admin' = ANY(roles)
  );
$$;

-- Create simplified RLS policies that avoid recursion
-- Policy for selecting profiles
CREATE POLICY "profiles_select_policy" ON public.profiles
  FOR SELECT
  USING (
    -- Allow users to see their own profile
    auth.uid() = user_id
    OR 
    -- Allow mock admin user (for development)
    user_id = '00000000-0000-0000-0000-000000000001'::uuid
    OR
    -- Allow admins to see all profiles (using security definer function)
    public.current_user_is_admin()
  );

-- Policy for inserting profiles
CREATE POLICY "profiles_insert_policy" ON public.profiles
  FOR INSERT
  WITH CHECK (
    -- Allow users to create their own profile
    auth.uid() = user_id
    OR
    -- Allow mock admin creation
    user_id = '00000000-0000-0000-0000-000000000001'::uuid
    OR
    -- Allow admins to create any profile
    public.current_user_is_admin()
  );

-- Policy for updating profiles
CREATE POLICY "profiles_update_policy" ON public.profiles
  FOR UPDATE
  USING (
    -- Allow users to update their own profile
    auth.uid() = user_id
    OR
    -- Allow mock admin updates
    user_id = '00000000-0000-0000-0000-000000000001'::uuid
    OR
    -- Allow admins to update any profile
    public.current_user_is_admin()
  )
  WITH CHECK (
    -- Same conditions for the updated data
    auth.uid() = user_id
    OR
    user_id = '00000000-0000-0000-0000-000000000001'::uuid
    OR
    public.current_user_is_admin()
  );

-- Policy for deleting profiles
CREATE POLICY "profiles_delete_policy" ON public.profiles
  FOR DELETE
  USING (
    -- Only admins can delete profiles
    public.current_user_is_admin()
    OR
    -- Allow mock admin deletion
    user_id = '00000000-0000-0000-0000-000000000001'::uuid
  );

-- Fix languages table policies to use the same security definer function
DROP POLICY IF EXISTS "Admins can manage languages" ON public.languages;

CREATE POLICY "languages_admin_policy" ON public.languages
  FOR ALL
  USING (public.current_user_is_admin())
  WITH CHECK (public.current_user_is_admin());

-- Fix translations table policies
DROP POLICY IF EXISTS "Admins can manage translations" ON public.translations;

CREATE POLICY "translations_admin_policy" ON public.translations
  FOR ALL
  USING (public.current_user_is_admin())
  WITH CHECK (public.current_user_is_admin());

-- Fix announcements table policies
DROP POLICY IF EXISTS "Admins can manage all announcements" ON public.announcements;

CREATE POLICY "announcements_admin_policy" ON public.announcements
  FOR ALL
  USING (public.current_user_is_admin())
  WITH CHECK (public.current_user_is_admin());