-- ==============================================
-- CMS Enhancement: SEO, Translations, Versioning
-- ==============================================

-- 1. PAGE SEO TABLE (separate from pages for clean architecture)
CREATE TABLE public.page_seo (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  language_code VARCHAR(10) NOT NULL DEFAULT 'en',
  
  -- Core SEO fields
  meta_title VARCHAR(70),
  meta_description VARCHAR(160),
  canonical_url TEXT,
  
  -- Open Graph
  og_title VARCHAR(70),
  og_description VARCHAR(200),
  og_image_url TEXT,
  og_type VARCHAR(50) DEFAULT 'website',
  
  -- Twitter Card
  twitter_card VARCHAR(20) DEFAULT 'summary_large_image',
  twitter_title VARCHAR(70),
  twitter_description VARCHAR(200),
  
  -- Indexing
  no_index BOOLEAN DEFAULT false,
  no_follow BOOLEAN DEFAULT false,
  
  -- Schema.org structured data
  structured_data JSONB,
  
  -- SEO Score (calculated)
  seo_score INTEGER DEFAULT 0,
  seo_issues JSONB DEFAULT '[]'::jsonb,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(page_id, language_code)
);

-- 2. TRANSLATION HISTORY (audit trail)
CREATE TABLE public.translation_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  translation_id UUID NOT NULL,
  language_id UUID NOT NULL,
  namespace VARCHAR(100) NOT NULL,
  key VARCHAR(255) NOT NULL,
  old_value TEXT,
  new_value TEXT,
  changed_by UUID,
  change_type VARCHAR(20) NOT NULL, -- 'created', 'updated', 'deleted', 'approved', 'rejected'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. PAGE VERSIONS (version history)
CREATE TABLE public.page_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  
  -- Snapshot of page data
  content TEXT,
  css_content TEXT,
  page_title TEXT,
  page_description TEXT,
  metadata JSONB,
  
  -- Version info
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  change_summary TEXT,
  
  UNIQUE(page_id, version_number)
);

-- 4. PAGE LOCKS (soft-locking for concurrent editing)
CREATE TABLE public.page_locks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE UNIQUE,
  locked_by UUID NOT NULL,
  locked_by_username TEXT,
  locked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '5 minutes')
);

-- 5. ADD STATUS TO TRANSLATIONS TABLE
ALTER TABLE public.translations 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS reviewed_by UUID,
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS approved_by UUID,
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;

-- 6. ACTIVITY LOGS TABLE (if not exists - for comprehensive logging)
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  activity_type VARCHAR(50) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  entity_type VARCHAR(50),
  entity_id UUID,
  user_id UUID,
  user_email TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.page_seo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_locks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for page_seo
CREATE POLICY "Public can view page SEO" ON public.page_seo FOR SELECT USING (true);
CREATE POLICY "Admins can manage page SEO" ON public.page_seo FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- RLS Policies for translation_history
CREATE POLICY "Public can view translation history" ON public.translation_history FOR SELECT USING (true);
CREATE POLICY "Admins can manage translation history" ON public.translation_history FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- RLS Policies for page_versions
CREATE POLICY "Public can view page versions" ON public.page_versions FOR SELECT USING (true);
CREATE POLICY "Admins can manage page versions" ON public.page_versions FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- RLS Policies for page_locks
CREATE POLICY "Anyone can view page locks" ON public.page_locks FOR SELECT USING (true);
CREATE POLICY "Admins can manage page locks" ON public.page_locks FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- RLS Policies for activity_logs
CREATE POLICY "Admins can view activity logs" ON public.activity_logs FOR SELECT USING (is_admin());
CREATE POLICY "Anyone can insert activity logs" ON public.activity_logs FOR INSERT WITH CHECK (true);

-- Trigger to auto-update updated_at
CREATE TRIGGER update_page_seo_updated_at
  BEFORE UPDATE ON public.page_seo
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger to log translation changes
CREATE OR REPLACE FUNCTION public.log_translation_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF OLD.value IS DISTINCT FROM NEW.value OR OLD.status IS DISTINCT FROM NEW.status THEN
      INSERT INTO public.translation_history (
        translation_id, language_id, namespace, key,
        old_value, new_value, change_type
      ) VALUES (
        NEW.id, NEW.language_id, NEW.namespace, NEW.key,
        OLD.value, NEW.value,
        CASE 
          WHEN OLD.status IS DISTINCT FROM NEW.status THEN NEW.status
          ELSE 'updated'
        END
      );
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.translation_history (
      translation_id, language_id, namespace, key,
      old_value, new_value, change_type
    ) VALUES (
      NEW.id, NEW.language_id, NEW.namespace, NEW.key,
      NULL, NEW.value, 'created'
    );
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER translation_audit_trigger
  AFTER INSERT OR UPDATE ON public.translations
  FOR EACH ROW EXECUTE FUNCTION public.log_translation_change();

-- Function to create page version
CREATE OR REPLACE FUNCTION public.create_page_version(
  p_page_id UUID,
  p_change_summary TEXT DEFAULT 'Manual save'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_version_number INTEGER;
  v_version_id UUID;
BEGIN
  -- Get next version number
  SELECT COALESCE(MAX(version_number), 0) + 1 INTO v_version_number
  FROM public.page_versions WHERE page_id = p_page_id;
  
  -- Keep only last 10 versions
  DELETE FROM public.page_versions 
  WHERE page_id = p_page_id 
  AND version_number <= v_version_number - 10;
  
  -- Create new version
  INSERT INTO public.page_versions (
    page_id, version_number, content, css_content, 
    page_title, page_description, metadata, change_summary
  )
  SELECT 
    id, v_version_number, content, css_content,
    page_title, page_description,
    jsonb_build_object(
      'page_url', page_url,
      'page_keywords', page_keywords,
      'og_image_url', og_image_url
    ),
    p_change_summary
  FROM public.pages WHERE id = p_page_id
  RETURNING id INTO v_version_id;
  
  RETURN v_version_id;
END;
$$;

-- Function to acquire page lock
CREATE OR REPLACE FUNCTION public.acquire_page_lock(
  p_page_id UUID,
  p_user_id UUID,
  p_username TEXT
)
RETURNS TABLE(success BOOLEAN, locked_by_username TEXT, locked_at TIMESTAMPTZ)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_existing RECORD;
BEGIN
  -- Clean expired locks
  DELETE FROM public.page_locks WHERE expires_at < now();
  
  -- Check for existing lock
  SELECT * INTO v_existing FROM public.page_locks 
  WHERE page_id = p_page_id AND locked_by != p_user_id;
  
  IF FOUND THEN
    RETURN QUERY SELECT false, v_existing.locked_by_username, v_existing.locked_at;
    RETURN;
  END IF;
  
  -- Upsert lock
  INSERT INTO public.page_locks (page_id, locked_by, locked_by_username, locked_at, expires_at)
  VALUES (p_page_id, p_user_id, p_username, now(), now() + interval '5 minutes')
  ON CONFLICT (page_id) DO UPDATE SET
    locked_by = p_user_id,
    locked_by_username = p_username,
    locked_at = now(),
    expires_at = now() + interval '5 minutes';
  
  RETURN QUERY SELECT true, p_username, now();
END;
$$;

-- Function to release page lock
CREATE OR REPLACE FUNCTION public.release_page_lock(p_page_id UUID, p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.page_locks 
  WHERE page_id = p_page_id AND locked_by = p_user_id;
END;
$$;