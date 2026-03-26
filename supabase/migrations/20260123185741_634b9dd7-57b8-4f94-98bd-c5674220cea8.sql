-- Add admin role to user_roles table (proper location for roles)
INSERT INTO public.user_roles (user_id, role)
VALUES ('190001d8-4640-43c5-8904-c062e05e94c8', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;