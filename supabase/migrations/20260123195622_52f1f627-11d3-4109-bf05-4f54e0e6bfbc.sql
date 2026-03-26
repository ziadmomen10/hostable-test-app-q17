-- Clean up orphan translation keys for the affected page
-- These are keys from sections that were deleted but their keys remained active

UPDATE translation_keys
SET is_active = false, updated_at = now()
WHERE page_id = '214d0c74-eb31-45d3-a637-fa61311613f4'
  AND is_active = true;