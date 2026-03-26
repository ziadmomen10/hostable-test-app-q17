-- Keyword Rank Tracking
CREATE TABLE public.seo_keyword_ranks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  keyword VARCHAR(255) NOT NULL,
  position INTEGER,
  previous_position INTEGER,
  search_engine VARCHAR(20) DEFAULT 'google',
  checked_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_seo_keyword_ranks_page ON seo_keyword_ranks(page_id);
CREATE INDEX idx_seo_keyword_ranks_keyword ON seo_keyword_ranks(keyword);

ALTER TABLE seo_keyword_ranks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage keyword ranks"
  ON seo_keyword_ranks FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Public can view keyword ranks"
  ON seo_keyword_ranks FOR SELECT
  USING (true);