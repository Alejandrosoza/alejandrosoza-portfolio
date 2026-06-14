-- =============================================
-- ALEJANDRO SOZA PORTFOLIO — Initial Schema
-- Migration 001
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABLE: films
-- Stores short films and narrative works
-- =============================================
CREATE TABLE IF NOT EXISTS films (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,

  -- Trilingual title
  title_en TEXT NOT NULL,
  title_es TEXT NOT NULL DEFAULT '',
  title_fr TEXT NOT NULL DEFAULT '',

  -- Trilingual synopsis
  synopsis_en TEXT NOT NULL DEFAULT '',
  synopsis_es TEXT NOT NULL DEFAULT '',
  synopsis_fr TEXT NOT NULL DEFAULT '',

  -- Trilingual director's statement
  statement_en TEXT NOT NULL DEFAULT '',
  statement_es TEXT NOT NULL DEFAULT '',
  statement_fr TEXT NOT NULL DEFAULT '',

  -- Trilingual role description
  role_en TEXT NOT NULL DEFAULT '',
  role_es TEXT NOT NULL DEFAULT '',
  role_fr TEXT NOT NULL DEFAULT '',

  -- Credits (plain text, not translated)
  credits TEXT NOT NULL DEFAULT '',

  -- Metadata
  category TEXT NOT NULL CHECK (category IN ('short_film','documentary','narrative','experimental')),
  year INTEGER NOT NULL,
  month INTEGER CHECK (month BETWEEN 1 AND 12),
  runtime_minutes INTEGER,

  -- Media
  youtube_id TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL DEFAULT '',
  behind_the_scenes TEXT[] NOT NULL DEFAULT '{}',

  -- Tags and display
  tags TEXT[] NOT NULL DEFAULT '{}',
  featured BOOLEAN NOT NULL DEFAULT false,
  order_index INTEGER NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- TABLE: videos
-- Stores commercials, music videos, other work
-- =============================================
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  title_en TEXT NOT NULL,
  title_es TEXT NOT NULL DEFAULT '',
  title_fr TEXT NOT NULL DEFAULT '',

  description_en TEXT NOT NULL DEFAULT '',
  description_es TEXT NOT NULL DEFAULT '',
  description_fr TEXT NOT NULL DEFAULT '',

  category TEXT NOT NULL CHECK (category IN ('commercial','music_video','other')),
  year INTEGER NOT NULL,

  youtube_id TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL DEFAULT '',

  order_index INTEGER NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- TABLE: photos
-- Stores photography gallery images
-- =============================================
CREATE TABLE IF NOT EXISTS photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  title_en TEXT NOT NULL DEFAULT '',
  title_es TEXT NOT NULL DEFAULT '',
  title_fr TEXT NOT NULL DEFAULT '',

  caption_en TEXT NOT NULL DEFAULT '',
  caption_es TEXT NOT NULL DEFAULT '',
  caption_fr TEXT NOT NULL DEFAULT '',

  -- Cloudinary URL
  url TEXT NOT NULL,

  -- Optional link to a film project
  film_id UUID REFERENCES films(id) ON DELETE SET NULL,

  order_index INTEGER NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- TABLE: site_config
-- Stores sitewide settings (single row)
-- =============================================
CREATE TABLE IF NOT EXISTS site_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Showreel
  showreel_youtube_id TEXT NOT NULL DEFAULT '',

  -- Trilingual bio (short version for hero)
  bio_short_en TEXT NOT NULL DEFAULT '',
  bio_short_es TEXT NOT NULL DEFAULT '',
  bio_short_fr TEXT NOT NULL DEFAULT '',

  -- Trilingual bio (long version for about page)
  bio_long_en TEXT NOT NULL DEFAULT '',
  bio_long_es TEXT NOT NULL DEFAULT '',
  bio_long_fr TEXT NOT NULL DEFAULT '',

  -- Theatre experience (trilingual)
  theatre_en TEXT NOT NULL DEFAULT '',
  theatre_es TEXT NOT NULL DEFAULT '',
  theatre_fr TEXT NOT NULL DEFAULT '',

  -- Sports achievement (trilingual)
  sports_en TEXT NOT NULL DEFAULT '',
  sports_es TEXT NOT NULL DEFAULT '',
  sports_fr TEXT NOT NULL DEFAULT '',

  -- CV
  cv_url TEXT NOT NULL DEFAULT '',

  -- Contact & socials
  contact_email TEXT NOT NULL DEFAULT '',
  instagram_url TEXT NOT NULL DEFAULT '',
  youtube_channel_url TEXT NOT NULL DEFAULT '',
  letterboxd_url TEXT NOT NULL DEFAULT '',
  imdb_url TEXT NOT NULL DEFAULT '',

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default site_config row
INSERT INTO site_config (id) VALUES (uuid_generate_v4())
ON CONFLICT DO NOTHING;

-- =============================================
-- UPDATED_AT TRIGGER
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER films_updated_at
  BEFORE UPDATE ON films
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER videos_updated_at
  BEFORE UPDATE ON videos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER site_config_updated_at
  BEFORE UPDATE ON site_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_films_slug ON films(slug);
CREATE INDEX IF NOT EXISTS idx_films_featured ON films(featured);
CREATE INDEX IF NOT EXISTS idx_films_order ON films(order_index);
CREATE INDEX IF NOT EXISTS idx_videos_order ON videos(order_index);
CREATE INDEX IF NOT EXISTS idx_photos_order ON photos(order_index);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
ALTER TABLE films ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Public can read everything
CREATE POLICY "Public read films" ON films FOR SELECT USING (true);
CREATE POLICY "Public read videos" ON videos FOR SELECT USING (true);
CREATE POLICY "Public read photos" ON photos FOR SELECT USING (true);
CREATE POLICY "Public read site_config" ON site_config FOR SELECT USING (true);

-- Only authenticated users (admin) can write
CREATE POLICY "Admin insert films" ON films FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update films" ON films FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin delete films" ON films FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin insert videos" ON videos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update videos" ON videos FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin delete videos" ON videos FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin insert photos" ON photos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update photos" ON photos FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin delete photos" ON photos FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin update site_config" ON site_config FOR UPDATE TO authenticated USING (true);
