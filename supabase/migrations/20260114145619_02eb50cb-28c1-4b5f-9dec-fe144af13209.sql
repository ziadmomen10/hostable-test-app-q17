-- Deactivate orphaned translation keys from deleted sections
WITH current_sections AS (
  SELECT jsonb_array_elements(content::jsonb->'sections')->>'id' as section_id
  FROM pages 
  WHERE id = '214d0c74-eb31-45d3-a637-fa61311613f4'
)
UPDATE translation_keys
SET is_active = false, updated_at = now()
WHERE page_id = '214d0c74-eb31-45d3-a637-fa61311613f4'
AND is_active = true
AND section_id NOT IN (SELECT section_id FROM current_sections);