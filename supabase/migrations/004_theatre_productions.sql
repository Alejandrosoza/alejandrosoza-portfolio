-- =============================================
-- Theatre productions: group photos/videos by play
-- =============================================
ALTER TABLE site_config
  ADD COLUMN IF NOT EXISTS theatre_productions JSONB NOT NULL DEFAULT '[]';
