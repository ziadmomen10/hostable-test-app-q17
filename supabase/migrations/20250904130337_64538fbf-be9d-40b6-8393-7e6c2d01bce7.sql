-- Just remove duplicate usernames, keeping only the most recent one
DELETE FROM public.profiles 
WHERE id NOT IN (
  SELECT DISTINCT ON (username) id 
  FROM public.profiles 
  ORDER BY username, created_at DESC
) AND username IS NOT NULL;