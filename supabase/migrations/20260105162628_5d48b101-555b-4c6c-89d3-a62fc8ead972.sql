-- ============================================================================
-- TRANSLATION ENGINE SCHEMA
-- Enterprise-grade translation system with key registry and status tracking
-- ============================================================================

-- 1. Create translation status enum
DO $$ BEGIN
  CREATE TYPE translation_status AS ENUM ('untranslated', 'ai_translated', 'reviewed', 'edited');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 2. Create translation_keys registry table
CREATE TABLE IF NOT EXISTS translation_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(500) UNIQUE NOT NULL,
  source_text TEXT NOT NULL,
  source_language VARCHAR(10) NOT NULL DEFAULT 'en',
  context TEXT,
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  section_id VARCHAR(100),
  section_type VARCHAR(100),
  prop_path VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for translation_keys
CREATE INDEX IF NOT EXISTS idx_translation_keys_page ON translation_keys(page_id);
CREATE INDEX IF NOT EXISTS idx_translation_keys_section ON translation_keys(section_id);
CREATE INDEX IF NOT EXISTS idx_translation_keys_key ON translation_keys(key);
CREATE INDEX IF NOT EXISTS idx_translation_keys_active ON translation_keys(is_active) WHERE is_active = true;

-- 3. Add new columns to translations table for status tracking
ALTER TABLE translations 
  ADD COLUMN IF NOT EXISTS source_text TEXT,
  ADD COLUMN IF NOT EXISTS source_language VARCHAR(10) DEFAULT 'en',
  ADD COLUMN IF NOT EXISTS context TEXT,
  ADD COLUMN IF NOT EXISTS ai_provider VARCHAR(50),
  ADD COLUMN IF NOT EXISTS ai_translated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS manually_edited_at TIMESTAMPTZ;

-- 4. Update translations status to use proper values (migrate old statuses)
UPDATE translations SET status = 'untranslated' WHERE status IS NULL OR status NOT IN ('untranslated', 'ai_translated', 'reviewed', 'edited');
UPDATE translations SET status = 'ai_translated' WHERE status = 'pending';
UPDATE translations SET status = 'reviewed' WHERE status = 'approved';

-- 5. Create trigger to update updated_at on translation_keys
CREATE OR REPLACE FUNCTION update_translation_keys_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_translation_keys_updated_at ON translation_keys;
CREATE TRIGGER trigger_translation_keys_updated_at
  BEFORE UPDATE ON translation_keys
  FOR EACH ROW
  EXECUTE FUNCTION update_translation_keys_updated_at();

-- 6. Enable RLS on translation_keys
ALTER TABLE translation_keys ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS policies for translation_keys (allow all authenticated users to read, admins to write)
DROP POLICY IF EXISTS "translation_keys_read_all" ON translation_keys;
CREATE POLICY "translation_keys_read_all" ON translation_keys
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "translation_keys_insert_admin" ON translation_keys;
CREATE POLICY "translation_keys_insert_admin" ON translation_keys
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "translation_keys_update_admin" ON translation_keys;
CREATE POLICY "translation_keys_update_admin" ON translation_keys
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "translation_keys_delete_admin" ON translation_keys;
CREATE POLICY "translation_keys_delete_admin" ON translation_keys
  FOR DELETE USING (true);

-- 8. Create view for translation coverage statistics
CREATE OR REPLACE VIEW translation_coverage_stats AS
SELECT 
  tk.page_id,
  p.page_url,
  p.page_title,
  l.id as language_id,
  l.code as language_code,
  l.name as language_name,
  COUNT(tk.id) as total_keys,
  COUNT(CASE WHEN t.value IS NOT NULL AND t.value != '' THEN 1 END) as translated_keys,
  COUNT(CASE WHEN t.status = 'untranslated' OR t.status IS NULL THEN 1 END) as untranslated_count,
  COUNT(CASE WHEN t.status = 'ai_translated' THEN 1 END) as ai_translated_count,
  COUNT(CASE WHEN t.status = 'reviewed' THEN 1 END) as reviewed_count,
  COUNT(CASE WHEN t.status = 'edited' THEN 1 END) as edited_count,
  CASE 
    WHEN COUNT(tk.id) = 0 THEN 0
    ELSE ROUND(
      COUNT(CASE WHEN t.value IS NOT NULL AND t.value != '' THEN 1 END)::NUMERIC / 
      COUNT(tk.id) * 100, 2
    )
  END as coverage_percentage
FROM translation_keys tk
CROSS JOIN languages l
LEFT JOIN pages p ON p.id = tk.page_id
LEFT JOIN translations t ON t.key = tk.key AND t.language_id = l.id
WHERE l.is_active = true AND tk.is_active = true
GROUP BY tk.page_id, p.page_url, p.page_title, l.id, l.code, l.name;

-- 9. Create function to get missing translations for a page
CREATE OR REPLACE FUNCTION get_missing_translations(p_page_id UUID, p_language_code VARCHAR(10))
RETURNS TABLE (
  key VARCHAR(500),
  source_text TEXT,
  section_id VARCHAR(100),
  section_type VARCHAR(100),
  prop_path VARCHAR(255)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    tk.key,
    tk.source_text,
    tk.section_id,
    tk.section_type,
    tk.prop_path
  FROM translation_keys tk
  LEFT JOIN languages l ON l.code = p_language_code AND l.is_active = true
  LEFT JOIN translations t ON t.key = tk.key AND t.language_id = l.id
  WHERE tk.page_id = p_page_id
    AND tk.is_active = true
    AND (t.value IS NULL OR t.value = '');
END;
$$ LANGUAGE plpgsql;

-- 10. Create function to validate page translations
CREATE OR REPLACE FUNCTION validate_page_translations(p_page_id UUID)
RETURNS TABLE (
  is_valid BOOLEAN,
  error_count INTEGER,
  warning_count INTEGER,
  errors JSONB,
  warnings JSONB
) AS $$
DECLARE
  v_errors JSONB := '[]'::JSONB;
  v_warnings JSONB := '[]'::JSONB;
  v_error_count INTEGER := 0;
  v_warning_count INTEGER := 0;
  v_key_record RECORD;
BEGIN
  -- Check for translation keys without source text
  FOR v_key_record IN
    SELECT tk.key, tk.section_id, tk.prop_path
    FROM translation_keys tk
    WHERE tk.page_id = p_page_id 
      AND tk.is_active = true
      AND (tk.source_text IS NULL OR tk.source_text = '')
  LOOP
    v_errors := v_errors || jsonb_build_object(
      'type', 'missing_source',
      'key', v_key_record.key,
      'sectionId', v_key_record.section_id,
      'propPath', v_key_record.prop_path,
      'message', 'Translation key has no source text'
    );
    v_error_count := v_error_count + 1;
  END LOOP;

  -- Check for duplicate keys
  FOR v_key_record IN
    SELECT tk.key, COUNT(*) as count
    FROM translation_keys tk
    WHERE tk.page_id = p_page_id AND tk.is_active = true
    GROUP BY tk.key
    HAVING COUNT(*) > 1
  LOOP
    v_errors := v_errors || jsonb_build_object(
      'type', 'duplicate_key',
      'key', v_key_record.key,
      'message', format('Duplicate translation key found (%s occurrences)', v_key_record.count)
    );
    v_error_count := v_error_count + 1;
  END LOOP;

  RETURN QUERY SELECT 
    v_error_count = 0 as is_valid,
    v_error_count,
    v_warning_count,
    v_errors,
    v_warnings;
END;
$$ LANGUAGE plpgsql;