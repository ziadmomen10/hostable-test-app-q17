-- Add default_currency field to pages table
ALTER TABLE public.pages 
ADD COLUMN default_currency TEXT;