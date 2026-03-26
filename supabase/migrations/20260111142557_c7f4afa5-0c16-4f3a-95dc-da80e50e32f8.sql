-- Clean up corrupted English translations that contain Arabic text
-- This happened because key generation extracted source text while viewing Arabic translations

DELETE FROM translations
WHERE language_id IN (SELECT id FROM languages WHERE code = 'en')
AND value ~ '[؀-ۿ]';

-- Also clean up the translation_keys source_text that may contain Arabic
UPDATE translation_keys
SET source_text = ''
WHERE source_text ~ '[؀-ۿ]';