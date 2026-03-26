-- Add blog_tags field to pages table
ALTER TABLE public.pages 
ADD COLUMN blog_tags TEXT;