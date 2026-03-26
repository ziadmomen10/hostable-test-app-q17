-- Add a proper unique constraint for translations table
-- This ensures onConflict clause works correctly with Supabase

-- First, drop any existing constraint with this name if it exists
ALTER TABLE translations DROP CONSTRAINT IF EXISTS translations_lang_namespace_key_unique;

-- Add the proper unique constraint
ALTER TABLE translations 
  ADD CONSTRAINT translations_lang_namespace_key_unique 
  UNIQUE (language_id, namespace, key);