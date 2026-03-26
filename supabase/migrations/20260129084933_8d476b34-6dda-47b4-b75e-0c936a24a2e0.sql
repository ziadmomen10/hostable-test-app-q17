-- Gap 3.1: Add missing score columns for AEO and GEO
ALTER TABLE page_seo 
ADD COLUMN IF NOT EXISTS aeo_score integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS geo_score integer DEFAULT 0;

-- Add index for audit page queries
CREATE INDEX IF NOT EXISTS idx_page_seo_scores 
ON page_seo(seo_score, aeo_score, geo_score);