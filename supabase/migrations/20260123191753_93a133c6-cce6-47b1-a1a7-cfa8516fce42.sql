-- Add all remaining roles to user c31780d7-c4ca-44df-8672-7eebae6fce53 for comprehensive testing
INSERT INTO public.user_roles (user_id, role) VALUES 
  ('c31780d7-c4ca-44df-8672-7eebae6fce53', 'manager'),
  ('c31780d7-c4ca-44df-8672-7eebae6fce53', 'seo_manager'),
  ('c31780d7-c4ca-44df-8672-7eebae6fce53', 'content_writer'),
  ('c31780d7-c4ca-44df-8672-7eebae6fce53', 'user')
ON CONFLICT (user_id, role) DO NOTHING;