-- Deactivate all corrupted keys for the affected page (they have collision issues with "section1" prefix)
UPDATE translation_keys 
SET is_active = false, updated_at = NOW()
WHERE page_id = '214d0c74-eb31-45d3-a637-fa61311613f4'
  AND is_active = true;