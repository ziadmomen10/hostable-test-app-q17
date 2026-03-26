CREATE TABLE public.role_definitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_key text NOT NULL UNIQUE,
  label text NOT NULL,
  description text,
  grants_admin_access boolean DEFAULT false,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

INSERT INTO public.role_definitions (role_key, label, grants_admin_access, is_active, sort_order) VALUES
  ('admin', 'Admin', true, true, 1),
  ('seo_manager', 'SEO Manager', true, true, 2),
  ('content_writer', 'Content Writer', true, true, 3),
  ('manager', 'Manager', true, true, 4),
  ('user', 'User', false, true, 5);

ALTER TABLE public.role_definitions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view role definitions" ON public.role_definitions FOR SELECT USING (true);
CREATE POLICY "Admins can manage role definitions" ON public.role_definitions FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE TRIGGER update_role_definitions_updated_at
  BEFORE UPDATE ON public.role_definitions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();