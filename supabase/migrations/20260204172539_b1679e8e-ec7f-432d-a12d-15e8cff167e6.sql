-- Add exchange rate columns to currencies table
ALTER TABLE currencies 
ADD COLUMN IF NOT EXISTS exchange_rate DECIMAL(20, 10) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS rate_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;