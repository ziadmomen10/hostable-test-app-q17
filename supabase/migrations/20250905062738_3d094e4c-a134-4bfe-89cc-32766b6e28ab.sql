-- Update the current user to have admin privileges
UPDATE public.profiles 
SET roles = array_append(roles, 'admin')
WHERE user_id = '60564265-4f1b-421b-aca0-76fa5537f922';