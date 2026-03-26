-- =============================================
-- SEO Module Feature Enhancement - Complete Database Schema
-- Phase 1-4: All 6 new tables with RLS policies
-- =============================================

-- Table 1: SEO Content Briefs (AI-generated content strategy)
CREATE TABLE public.seo_content_briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  language_code VARCHAR(10) NOT NULL DEFAULT 'en',
  focus_keyword VARCHAR(255),
  target_word_count INTEGER,
  heading_structure JSONB DEFAULT '[]'::jsonb,
  questions_to_answer JSONB DEFAULT '[]'::jsonb,
  semantic_keywords JSONB DEFAULT '[]'::jsonb,
  competitor_insights JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.seo_content_briefs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage content briefs"
ON public.seo_content_briefs FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Public can view content briefs"
ON public.seo_content_briefs FOR SELECT
USING (true);

CREATE INDEX idx_content_briefs_page ON seo_content_briefs(page_id, language_code);

-- Table 2: SEO Topic Clusters (pillar-cluster content strategy)
CREATE TABLE public.seo_topic_clusters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster_name VARCHAR(255) NOT NULL,
  cluster_description TEXT,
  pillar_page_id UUID REFERENCES pages(id) ON DELETE SET NULL,
  color VARCHAR(20) DEFAULT '#3b82f6',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.seo_topic_clusters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage topic clusters"
ON public.seo_topic_clusters FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Public can view topic clusters"
ON public.seo_topic_clusters FOR SELECT
USING (true);

-- Table 3: SEO Cluster Pages (linking pages to clusters)
CREATE TABLE public.seo_cluster_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster_id UUID REFERENCES seo_topic_clusters(id) ON DELETE CASCADE NOT NULL,
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE NOT NULL,
  relationship_type VARCHAR(50) DEFAULT 'cluster_content',
  link_strength INTEGER DEFAULT 50,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(cluster_id, page_id)
);

ALTER TABLE public.seo_cluster_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage cluster pages"
ON public.seo_cluster_pages FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Public can view cluster pages"
ON public.seo_cluster_pages FOR SELECT
USING (true);

CREATE INDEX idx_cluster_pages_cluster ON seo_cluster_pages(cluster_id);
CREATE INDEX idx_cluster_pages_page ON seo_cluster_pages(page_id);

-- Table 4: SEO Content Freshness (decay detection)
CREATE TABLE public.seo_content_freshness (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE UNIQUE NOT NULL,
  last_major_update TIMESTAMPTZ,
  content_hash VARCHAR(64),
  word_count INTEGER DEFAULT 0,
  freshness_score INTEGER DEFAULT 100,
  decay_detected_at TIMESTAMPTZ,
  refresh_suggestions JSONB DEFAULT '[]'::jsonb,
  checked_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.seo_content_freshness ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage content freshness"
ON public.seo_content_freshness FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Public can view content freshness"
ON public.seo_content_freshness FOR SELECT
USING (true);

CREATE INDEX idx_content_freshness_score ON seo_content_freshness(freshness_score);
CREATE INDEX idx_content_freshness_decay ON seo_content_freshness(decay_detected_at) WHERE decay_detected_at IS NOT NULL;

-- Table 5: SEO Tasks (dynamic task checklist)
CREATE TABLE public.seo_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE NOT NULL,
  language_code VARCHAR(10) NOT NULL DEFAULT 'en',
  task_type VARCHAR(50) NOT NULL,
  task_title VARCHAR(255) NOT NULL,
  task_description TEXT,
  priority VARCHAR(20) DEFAULT 'medium',
  impact_score INTEGER DEFAULT 50,
  category VARCHAR(50) DEFAULT 'general',
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  completed_by UUID,
  auto_generated BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.seo_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage SEO tasks"
ON public.seo_tasks FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Public can view SEO tasks"
ON public.seo_tasks FOR SELECT
USING (true);

CREATE INDEX idx_seo_tasks_page ON seo_tasks(page_id, language_code);
CREATE INDEX idx_seo_tasks_incomplete ON seo_tasks(page_id, is_completed) WHERE is_completed = false;
CREATE INDEX idx_seo_tasks_priority ON seo_tasks(priority, impact_score DESC);

-- Table 6: SEO Score History (performance tracking over time)
CREATE TABLE public.seo_score_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE NOT NULL,
  language_code VARCHAR(10) NOT NULL DEFAULT 'en',
  seo_score INTEGER DEFAULT 0,
  aeo_score INTEGER DEFAULT 0,
  geo_score INTEGER DEFAULT 0,
  combined_score INTEGER DEFAULT 0,
  issues_count INTEGER DEFAULT 0,
  snapshot_date DATE NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(page_id, language_code, snapshot_date)
);

ALTER TABLE public.seo_score_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage score history"
ON public.seo_score_history FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Public can view score history"
ON public.seo_score_history FOR SELECT
USING (true);

CREATE INDEX idx_score_history_page_date ON seo_score_history(page_id, snapshot_date DESC);
CREATE INDEX idx_score_history_date ON seo_score_history(snapshot_date DESC);

-- Update timestamp trigger for new tables
CREATE OR REPLACE FUNCTION public.update_seo_tables_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_seo_content_briefs_updated_at
  BEFORE UPDATE ON public.seo_content_briefs
  FOR EACH ROW EXECUTE FUNCTION public.update_seo_tables_updated_at();

CREATE TRIGGER update_seo_topic_clusters_updated_at
  BEFORE UPDATE ON public.seo_topic_clusters
  FOR EACH ROW EXECUTE FUNCTION public.update_seo_tables_updated_at();