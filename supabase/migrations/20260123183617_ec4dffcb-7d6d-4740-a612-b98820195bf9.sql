-- Fix the specific Test page that has array-only format
-- First normalize the content to proper PageData format
UPDATE pages
SET content = jsonb_build_object(
  'id', id::text,
  'version', 1,
  'sections', content::jsonb,
  'metadata', jsonb_build_object(
    'title', page_title,
    'lastModified', now()::text
  )
)::text,
updated_at = now()
WHERE id = '214d0c74-eb31-45d3-a637-fa61311613f4'
AND content IS NOT NULL
AND content ~ '^\s*\[';

-- Reactivate translation keys for the Test page that were incorrectly deactivated
UPDATE translation_keys
SET is_active = true, updated_at = now()
WHERE page_id = '214d0c74-eb31-45d3-a637-fa61311613f4'
AND is_active = false;