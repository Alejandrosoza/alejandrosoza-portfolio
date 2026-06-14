-- =============================================
-- Add theatre and sports photo/video galleries to site_config
-- =============================================
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS theatre_photos TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS theatre_youtube_ids TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS sports_photos TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS sports_youtube_ids TEXT[] NOT NULL DEFAULT '{}';
