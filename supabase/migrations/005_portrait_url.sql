-- =============================================
-- Portrait photo for About page hero
-- =============================================
ALTER TABLE site_config
  ADD COLUMN IF NOT EXISTS portrait_url TEXT NOT NULL DEFAULT '';
