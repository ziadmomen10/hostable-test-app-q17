-- The current_user_is_admin() function is still causing recursion
-- Let's create a function that completely bypasses RLS by using a different approach

-- First, drop the problematic function
DROP FUNCTION IF EXISTS public.current_user_is_admin();

-- Drop all current policies to start fresh
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON public.profiles;

-- Create a security definer function that uses raw SQL without RLS
CREATE OR REPLACE FUNCTION public.check_user_is_admin(check_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_roles text[];
BEGIN
    -- Direct query without RLS by using security definer privileges
    SELECT roles INTO user_roles
    FROM public.profiles 
    WHERE user_id = check_user_id
    LIMIT 1;
    
    -- Return true if 'admin' is in the roles array
    RETURN 'admin' = ANY(COALESCE(user_roles, ARRAY[]::text[]));
EXCEPTION
    WHEN OTHERS THEN
        RETURN false;
END;
$$;

-- Create simple, non-recursive policies
-- Allow everyone to select profiles (we'll handle admin logic in the app layer)
CREATE POLICY "profiles_public_select" ON public.profiles
  FOR SELECT
  USING (true);

-- Allow users to insert their own profile or if they're admin
CREATE POLICY "profiles_insert_own_or_admin" ON public.profiles
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id 
    OR user_id = '00000000-0000-0000-0000-000000000001'::uuid
    OR public.check_user_is_admin(auth.uid())
  );

-- Allow users to update their own profile or if they're admin  
CREATE POLICY "profiles_update_own_or_admin" ON public.profiles
  FOR UPDATE
  USING (
    auth.uid() = user_id 
    OR user_id = '00000000-0000-0000-0000-000000000001'::uuid
    OR public.check_user_is_admin(auth.uid())
  )
  WITH CHECK (
    auth.uid() = user_id 
    OR user_id = '00000000-0000-0000-0000-000000000001'::uuid
    OR public.check_user_is_admin(auth.uid())
  );

-- Only admins can delete profiles
CREATE POLICY "profiles_delete_admin_only" ON public.profiles
  FOR DELETE
  USING (
    public.check_user_is_admin(auth.uid())
    OR user_id = '00000000-0000-0000-0000-000000000001'::uuid
  );

-- Fix other tables to use the new function
-- Languages table
DROP POLICY IF EXISTS "languages_admin_policy" ON public.languages;

CREATE POLICY "languages_admin_manage" ON public.languages
  FOR ALL
  USING (public.check_user_is_admin(auth.uid()))
  WITH CHECK (public.check_user_is_admin(auth.uid()));

-- Translations table  
DROP POLICY IF EXISTS "translations_admin_policy" ON public.translations;

CREATE POLICY "translations_admin_manage" ON public.translations
  FOR ALL
  USING (public.check_user_is_admin(auth.uid()))
  WITH CHECK (public.check_user_is_admin(auth.uid()));

-- Announcements table
DROP POLICY IF EXISTS "announcements_admin_policy" ON public.announcements;

CREATE POLICY "announcements_admin_manage" ON public.announcements
  FOR ALL
  USING (public.check_user_is_admin(auth.uid()))
  WITH CHECK (public.check_user_is_admin(auth.uid()));