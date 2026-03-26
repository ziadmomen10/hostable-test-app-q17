-- Add all remaining roles to user admin2 (190001d8-4640-43c5-8904-c062e05e94c8) for comprehensive testing
INSERT INTO public.user_roles (user_id, role) VALUES 
  ('190001d8-4640-43c5-8904-c062e05e94c8', 'manager'),
  ('190001d8-4640-43c5-8904-c062e05e94c8', 'seo_manager'),
  ('190001d8-4640-43c5-8904-c062e05e94c8', 'content_writer'),
  ('190001d8-4640-43c5-8904-c062e05e94c8', 'user')
ON CONFLICT (user_id, role) DO NOTHING;