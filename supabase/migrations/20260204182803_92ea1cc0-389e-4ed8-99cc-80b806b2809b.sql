-- Deactivate all price-related translation keys
-- These props should NOT be translated - they are converted dynamically via PriceDisplay

UPDATE translation_keys 
SET is_active = false, 
    updated_at = now()
WHERE is_active = true 
  AND (
    prop_path ILIKE '%price%' 
    OR prop_path ILIKE '%originalPrice%' 
    OR prop_path ILIKE '%discountedPrice%'
    OR prop_path ILIKE '%discount%'
  )
  AND prop_path != 'priceText'; -- Keep priceText translatable (marketing text in Hero section)