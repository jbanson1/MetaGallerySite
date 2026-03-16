-- Meta Gallery - Sample seed data for development
-- Run AFTER 001_initial_schema.sql
-- Note: This uses placeholder UUIDs — in production, owner_id should be real auth.users IDs

-- Sample gallery
insert into galleries (id, name, slug, description, address, city, country, logo_url, website_url)
values (
  '00000000-0000-0000-0000-000000000001',
  'The Meridian Gallery',
  'meridian-gallery',
  'A contemporary art space celebrating emerging and established artists from around the world.',
  '12 Gallery Row',
  'London',
  'GB',
  null,
  'https://example.com'
);

-- Sample exhibition
insert into exhibitions (id, gallery_id, title, description, start_date, end_date, is_active)
values (
  '00000000-0000-0000-0000-000000000010',
  '00000000-0000-0000-0000-000000000001',
  'Chromatic Horizons',
  'An exploration of colour, light and perception through the work of five international artists.',
  '2026-03-01',
  '2026-06-30',
  true
);

-- Sample artworks
insert into artworks (id, gallery_id, exhibition_id, title, artist_name, year, medium, dimensions, description, compact_description, is_for_sale, price)
values
(
  '00000000-0000-0000-0000-000000000020',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000010',
  'Cerulean Drift',
  'Marcus Chen',
  2025,
  'Oil on canvas',
  '120 × 90 cm',
  'A sweeping abstraction of ocean memory, rendered in layered cerulean and titanium white. Chen describes the work as "the feeling of forgetting something beautiful."',
  'Sweeping abstraction of ocean memory in cerulean and white. Chen: "the feeling of forgetting something beautiful."',
  true,
  3200.00
),
(
  '00000000-0000-0000-0000-000000000021',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000010',
  'Ember Study No. 3',
  'Sofia Andersson',
  2024,
  'Mixed media on board',
  '60 × 60 cm',
  'The third in Andersson''s ongoing Ember series, this intimate work captures the tension between warmth and dissolution through layers of wax, pigment, and charred paper.',
  'Part of Andersson''s Ember series — wax, pigment and charred paper exploring warmth and dissolution.',
  false,
  null
);

-- Sample markers (MG-XXXXXX format)
insert into markers (marker_id, artwork_id, gallery_id, label)
values
  ('MG-ABC123', '00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000001', 'Cerulean Drift — Room 1'),
  ('MG-XYZ789', '00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000001', 'Ember Study No. 3 — Room 2');

-- Sample artwork assets (using placeholder URLs — replace with real Supabase Storage URLs)
insert into artwork_assets (artwork_id, asset_type, url, is_primary, sort_order)
values
  ('00000000-0000-0000-0000-000000000020', 'image', 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800', true, 0),
  ('00000000-0000-0000-0000-000000000021', 'image', 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800', true, 0);
