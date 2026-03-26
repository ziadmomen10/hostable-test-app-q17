-- Fix security issues: set search_path for functions and update view security

-- 1. Fix update_translation_keys_updated_at function
CREATE OR REPLACE FUNCTION public.update_translation_keys_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- 2. Fix get_missing_translations function
CREATE OR REPLACE FUNCTION public.get_missing_translations(p_page_id UUID, p_language_code VARCHAR(10))
RETURNS TABLE (
  key VARCHAR(500),
  source_text TEXT,
  section_id VARCHAR(100),
  section_type VARCHAR(100),
  prop_path VARCHAR(255)
)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    tk.key,
    tk.source_text,
    tk.section_id,
    tk.section_type,
    tk.prop_path
  FROM public.translation_keys tk
  LEFT JOIN public.languages l ON l.code = p_language_code AND l.is_active = true
  LEFT JOIN public.translations t ON t.key = tk.key AND t.language_id = l.id
  WHERE tk.page_id = p_page_id
    AND tk.is_active = true
    AND (t.value IS NULL OR t.value = '');
END;
$$;

-- 3. Fix validate_page_translations function  
CREATE OR REPLACE FUNCTION public.validate_page_translations(p_page_id UUID)
RETURNS TABLE (
  is_valid BOOLEAN,
  error_count INTEGER,
  warning_count INTEGER,
  errors JSONB,
  warnings JSONB
)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_errors JSONB := '[]'::JSONB;
  v_warnings JSONB := '[]'::JSONB;
  v_error_count INTEGER := 0;
  v_warning_count INTEGER := 0;
  v_key_record RECORD;
BEGIN
  FOR v_key_record IN
    SELECT tk.key, tk.section_id, tk.prop_path
    FROM public.translation_keys tk
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

  FOR v_key_record IN
    SELECT tk.key, COUNT(*) as count
    FROM public.translation_keys tk
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
$$;

-- 4. Drop and recreate view with SECURITY INVOKER
DROP VIEW IF EXISTS public.translation_coverage_stats;

CREATE VIEW public.translation_coverage_stats 
WITH (security_invoker = true)
AS
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
FROM public.translation_keys tk
CROSS JOIN public.languages l
LEFT JOIN public.pages p ON p.id = tk.page_id
LEFT JOIN public.translations t ON t.key = tk.key AND t.language_id = l.id
WHERE l.is_active = true AND tk.is_active = true
GROUP BY tk.page_id, p.page_url, p.page_title, l.id, l.code, l.name;