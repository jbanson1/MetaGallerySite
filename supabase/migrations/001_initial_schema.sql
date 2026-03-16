-- Meta Gallery - Initial Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────
-- GALLERIES
-- ─────────────────────────────────────────────
create table if not exists galleries (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  slug        text not null unique,
  description text,
  address     text,
  city        text,
  country     text,
  logo_url    text,
  website_url text,
  owner_id    uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- EXHIBITIONS
-- ─────────────────────────────────────────────
create table if not exists exhibitions (
  id              uuid primary key default uuid_generate_v4(),
  gallery_id      uuid not null references galleries(id) on delete cascade,
  title           text not null,
  description     text,
  start_date      date,
  end_date        date,
  cover_image_url text,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- ARTWORKS
-- ─────────────────────────────────────────────
create table if not exists artworks (
  id                  uuid primary key default uuid_generate_v4(),
  gallery_id          uuid not null references galleries(id) on delete cascade,
  exhibition_id       uuid references exhibitions(id) on delete set null,
  title               text not null,
  artist_name         text not null,
  year                integer,
  medium              text,
  dimensions          text,
  description         text,
  compact_description text check (char_length(compact_description) <= 140),
  price               numeric(10, 2),
  currency            char(3) not null default 'GBP',
  is_for_sale         boolean not null default false,
  is_active           boolean not null default true,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- ARTWORK ASSETS (images, audio, video, 3D)
-- ─────────────────────────────────────────────
create table if not exists artwork_assets (
  id               uuid primary key default uuid_generate_v4(),
  artwork_id       uuid not null references artworks(id) on delete cascade,
  asset_type       text not null check (asset_type in ('image', 'audio', 'video', '3d_model')),
  url              text not null,
  filename         text,
  mime_type        text,
  size_bytes       bigint,
  duration_seconds numeric(8, 2),
  is_primary       boolean not null default false,
  sort_order       integer not null default 0,
  created_at       timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- MARKERS (QR codes / NFC tags)
-- ─────────────────────────────────────────────
create table if not exists markers (
  id         uuid primary key default uuid_generate_v4(),
  marker_id  text not null unique,  -- format: MG-XXXXXX (nanoid)
  artwork_id uuid not null references artworks(id) on delete cascade,
  gallery_id uuid not null references galleries(id) on delete cascade,
  label      text,
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint marker_id_format check (marker_id ~ '^MG-[A-Za-z0-9]{6}$')
);

-- ─────────────────────────────────────────────
-- ADMIN USERS (gallery staff with roles)
-- ─────────────────────────────────────────────
create table if not exists admin_users (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  gallery_id uuid not null references galleries(id) on delete cascade,
  role       text not null default 'viewer' check (role in ('owner', 'editor', 'viewer')),
  created_at timestamptz not null default now(),
  unique(user_id, gallery_id)
);

-- ─────────────────────────────────────────────
-- SCAN EVENTS (analytics)
-- ─────────────────────────────────────────────
create table if not exists scan_events (
  id         uuid primary key default uuid_generate_v4(),
  marker_id  text not null,  -- denormalized for speed
  artwork_id uuid not null references artworks(id) on delete cascade,
  gallery_id uuid not null references galleries(id) on delete cascade,
  scanned_at timestamptz not null default now(),
  user_agent text,
  ip_hash    text,    -- hashed for privacy (SHA-256)
  session_id text,    -- anonymous session tracking
  referrer   text
);

-- ─────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────
create index if not exists idx_markers_marker_id     on markers(marker_id);
create index if not exists idx_artworks_gallery_id   on artworks(gallery_id);
create index if not exists idx_artworks_exhibition   on artworks(exhibition_id);
create index if not exists idx_artwork_assets_artwork on artwork_assets(artwork_id);
create index if not exists idx_scan_events_artwork   on scan_events(artwork_id);
create index if not exists idx_scan_events_gallery   on scan_events(gallery_id);
create index if not exists idx_scan_events_scanned   on scan_events(scanned_at);
create index if not exists idx_admin_users_user      on admin_users(user_id);
create index if not exists idx_admin_users_gallery   on admin_users(gallery_id);

-- ─────────────────────────────────────────────
-- UPDATED_AT TRIGGER
-- ─────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_galleries_updated_at   before update on galleries   for each row execute function set_updated_at();
create trigger set_exhibitions_updated_at before update on exhibitions  for each row execute function set_updated_at();
create trigger set_artworks_updated_at    before update on artworks     for each row execute function set_updated_at();
create trigger set_markers_updated_at     before update on markers      for each row execute function set_updated_at();

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────

-- Galleries: public read, owners write
alter table galleries enable row level security;
create policy "galleries_public_read"  on galleries for select using (true);
create policy "galleries_owner_write"  on galleries for all    using (auth.uid() = owner_id);

-- Exhibitions: public read, gallery admins write
alter table exhibitions enable row level security;
create policy "exhibitions_public_read" on exhibitions for select using (true);
create policy "exhibitions_admin_write" on exhibitions for all
  using (exists (
    select 1 from admin_users
    where user_id = auth.uid()
      and gallery_id = exhibitions.gallery_id
      and role in ('owner', 'editor')
  ));

-- Artworks: public read of active, gallery admins write
alter table artworks enable row level security;
create policy "artworks_public_read" on artworks for select using (is_active = true);
create policy "artworks_admin_all"   on artworks for all
  using (exists (
    select 1 from admin_users
    where user_id = auth.uid()
      and gallery_id = artworks.gallery_id
      and role in ('owner', 'editor')
  ));

-- Artwork assets: public read
alter table artwork_assets enable row level security;
create policy "artwork_assets_public_read" on artwork_assets for select using (true);
create policy "artwork_assets_admin_write" on artwork_assets for all
  using (exists (
    select 1 from artworks a
    join admin_users au on au.gallery_id = a.gallery_id
    where a.id = artwork_assets.artwork_id
      and au.user_id = auth.uid()
      and au.role in ('owner', 'editor')
  ));

-- Markers: public read of active markers
alter table markers enable row level security;
create policy "markers_public_read" on markers for select using (is_active = true);
create policy "markers_admin_write" on markers for all
  using (exists (
    select 1 from admin_users
    where user_id = auth.uid()
      and gallery_id = markers.gallery_id
      and role in ('owner', 'editor')
  ));

-- Admin users: owners manage their gallery's admins
alter table admin_users enable row level security;
create policy "admin_users_self_read" on admin_users for select using (user_id = auth.uid());
create policy "admin_users_owner_all" on admin_users for all
  using (exists (
    select 1 from admin_users au2
    where au2.user_id = auth.uid()
      and au2.gallery_id = admin_users.gallery_id
      and au2.role = 'owner'
  ));

-- Scan events: public insert (anyone can log a scan), admins can read
alter table scan_events enable row level security;
create policy "scan_events_public_insert" on scan_events for insert with check (true);
create policy "scan_events_admin_read"    on scan_events for select
  using (exists (
    select 1 from admin_users
    where user_id = auth.uid()
      and gallery_id = scan_events.gallery_id
  ));

-- ─────────────────────────────────────────────
-- STORAGE BUCKETS
-- ─────────────────────────────────────────────
-- Run these in the Supabase dashboard Storage section or via CLI:
--
-- supabase storage create artwork-images  --public
-- supabase storage create artwork-audio   --public
-- supabase storage create gallery-logos   --public
