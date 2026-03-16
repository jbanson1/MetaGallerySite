-- ─── Migration 003: RLS Policies + Artwork Process Media ────────────────────
-- Run this in the Supabase SQL Editor

-- ─── Enable RLS on core tables ──────────────────────────────────────────────

ALTER TABLE galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE exhibitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE artwork_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE markers ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_events ENABLE ROW LEVEL SECURITY;

-- ─── Galleries: public read ──────────────────────────────────────────────────

CREATE POLICY "Public can view galleries"
  ON galleries FOR SELECT USING (true);

-- ─── Exhibitions: public read ────────────────────────────────────────────────

CREATE POLICY "Public can view exhibitions"
  ON exhibitions FOR SELECT USING (true);

-- ─── Artworks: public can read artworks reachable via active markers ─────────

CREATE POLICY "Public can view artworks via active markers"
  ON artworks FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM markers
      WHERE markers.artwork_id = artworks.id
        AND markers.is_active = true
    )
  );

-- ─── Artwork assets: public read if artwork is accessible ────────────────────

CREATE POLICY "Public can view artwork assets"
  ON artwork_assets FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM artworks a
      JOIN markers m ON m.artwork_id = a.id
      WHERE a.id = artwork_assets.artwork_id
        AND m.is_active = true
    )
  );

-- ─── Markers: public read for active markers only ───────────────────────────

CREATE POLICY "Public can view active markers"
  ON markers FOR SELECT USING (is_active = true);

-- ─── Scan events: anyone can insert, no reads for anonymous users ────────────

CREATE POLICY "Anyone can log scans"
  ON scan_events FOR INSERT WITH CHECK (true);

-- Authenticated users can read their own scan events
CREATE POLICY "Users can read own scan events"
  ON scan_events FOR SELECT USING (
    auth.uid() IS NOT NULL AND user_id = auth.uid()
  );

-- ─── Profiles: users can read/update their own profile ──────────────────────
-- (profiles table created in 002_profiles.sql)

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- ─── Artwork Process Media table ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS artwork_process_media (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artwork_id    UUID NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
  media_type    TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  url           TEXT NOT NULL,
  thumbnail_url TEXT,          -- For videos: poster/thumbnail image
  caption       TEXT,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_process_media_artwork ON artwork_process_media(artwork_id);
CREATE INDEX IF NOT EXISTS idx_process_media_sort    ON artwork_process_media(artwork_id, sort_order);

ALTER TABLE artwork_process_media ENABLE ROW LEVEL SECURITY;

-- Public can view process media for artworks reachable via active markers
CREATE POLICY "Public can view process media"
  ON artwork_process_media FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM artworks a
      JOIN markers m ON m.artwork_id = a.id
      WHERE a.id = artwork_process_media.artwork_id
        AND m.is_active = true
    )
  );
