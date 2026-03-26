-- Clean up corrupted translations where value is "undefined" in Arabic
-- or where source_text is NULL/empty (these came from bad translation attempts)

DELETE FROM translations 
WHERE value IN ('غير معرّف', 'غير محدد', 'undefined', 'null')
   OR source_text IS NULL
   OR source_text = ''
   OR source_text = 'undefined';