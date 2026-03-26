-- SEO History Table for tracking changes
CREATE TABLE public.seo_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  language_code VARCHAR(10) NOT NULL DEFAULT 'en',
  changed_by UUID,
  change_type VARCHAR(50) NOT NULL,
  field_name VARCHAR(100),
  old_value TEXT,
  new_value TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_seo_history_page_id ON public.seo_history(page_id);
CREATE INDEX idx_seo_history_created_at ON public.seo_history(created_at DESC);

-- Enable RLS
ALTER TABLE public.seo_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can manage SEO history"
  ON public.seo_history FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Public can view SEO history"
  ON public.seo_history FOR SELECT
  USING (true);