-- =============================================
-- Add theatre and sports photo fields to site_config
-- =============================================
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS theatre_photo_url TEXT NOT NULL DEFAULT '';
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS sports_photo_url TEXT NOT NULL DEFAULT '';
