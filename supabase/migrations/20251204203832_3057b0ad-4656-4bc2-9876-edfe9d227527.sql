-- Add hidden_sections column to pages table
ALTER TABLE public.pages 
ADD COLUMN hidden_sections text[] DEFAULT ARRAY[]::text[];