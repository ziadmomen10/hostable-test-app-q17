
-- Create departments table
CREATE TABLE public.departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar NOT NULL UNIQUE,
  icon_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view departments" ON public.departments
  FOR SELECT TO public USING (true);

CREATE POLICY "Admins can manage departments" ON public.departments
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Create job_posts table
CREATE TABLE public.job_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title varchar NOT NULL,
  slug varchar NOT NULL UNIQUE,
  department_id uuid NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  location_type varchar NOT NULL DEFAULT 'remote',
  location_country varchar,
  commitment_type varchar NOT NULL DEFAULT 'full-time',
  commitment_custom varchar,
  about_the_role text NOT NULL DEFAULT '',
  key_responsibilities text NOT NULL DEFAULT '',
  requirements text NOT NULL DEFAULT '',
  nice_to_have text,
  what_we_offer text,
  apply_type varchar NOT NULL DEFAULT 'internal',
  apply_external_url text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.job_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active job posts" ON public.job_posts
  FOR SELECT TO public USING (is_active = true);

CREATE POLICY "Admins can manage job posts" ON public.job_posts
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Create job_applications table
CREATE TABLE public.job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_post_id uuid NOT NULL REFERENCES public.job_posts(id) ON DELETE CASCADE,
  full_name varchar NOT NULL,
  email varchar NOT NULL,
  phone varchar,
  resume_url text,
  cover_letter text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit applications" ON public.job_applications
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Admins can view applications" ON public.job_applications
  FOR SELECT TO authenticated USING (is_admin());

CREATE POLICY "Admins can manage applications" ON public.job_applications
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Trigger to auto-update updated_at on job_posts
CREATE TRIGGER update_job_posts_updated_at
  BEFORE UPDATE ON public.job_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
