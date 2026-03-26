-- Remove background_color column from announcements table since we're not using it anymore
ALTER TABLE public.announcements DROP COLUMN background_color;