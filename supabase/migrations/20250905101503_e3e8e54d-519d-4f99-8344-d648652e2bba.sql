-- Drop all policies that depend on current_user_is_admin() function first
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON public.profiles;
DROP POLICY IF EXISTS "languages_admin_policy" ON public.languages;
DROP POLICY IF EXISTS "translations_admin_policy" ON public.translations;
DROP POLICY IF EXISTS "announcements_admin_policy" ON public.announcements;

-- Now we can safely drop the function
DROP FUNCTION IF EXISTS public.current_user_is_admin();

-- Create a simple function that directly queries without causing recursion
CREATE OR REPLACE FUNCTION public.check_user_is_admin(check_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = check_user_id 
    AND 'admin' = ANY(COALESCE(roles, ARRAY[]::text[]))
  );
$$;

-- Create very simple policies for profiles
CREATE POLICY "profiles_public_select" ON public.profiles
  FOR SELECT
  USING (true);

CREATE POLICY "profiles_insert_policy" ON public.profiles
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id 
    OR user_id = '00000000-0000-0000-0000-000000000001'::uuid
    OR public.check_user_is_admin(auth.uid())
  );

CREATE POLICY "profiles_update_policy" ON public.profiles
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

CREATE POLICY "profiles_delete_policy" ON public.profiles
  FOR DELETE
  USING (
    public.check_user_is_admin(auth.uid())
    OR user_id = '00000000-0000-0000-0000-000000000001'::uuid
  );

-- Recreate other policies
CREATE POLICY "languages_admin_policy" ON public.languages
  FOR ALL
  USING (public.check_user_is_admin(auth.uid()))
  WITH CHECK (public.check_user_is_admin(auth.uid()));

CREATE POLICY "translations_admin_policy" ON public.translations
  FOR ALL
  USING (public.check_user_is_admin(auth.uid()))
  WITH CHECK (public.check_user_is_admin(auth.uid()));

CREATE POLICY "announcements_admin_policy" ON public.announcements
  FOR ALL
  USING (public.check_user_is_admin(auth.uid()))
  WITH CHECK (public.check_user_is_admin(auth.uid()));