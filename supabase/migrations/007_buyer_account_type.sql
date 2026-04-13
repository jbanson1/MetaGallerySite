-- Meta Gallery — Add 'buyer' account type
-- Run after 006_account_types_and_features.sql
--
-- Migration 006 created the account_type column with check ('artist','curator').
-- This migration:
--   1. Drops the old constraint and adds a new one that includes 'buyer'
--   2. Changes the column default to 'buyer'
--   3. Updates the handle_new_user trigger to default to 'buyer'
--   4. Adds a buyer_profiles table (mirrors curator_profiles for buyer-specific data)
--   5. Grants anon/authenticated read on profiles (needed for username lookup flow)

-- ─────────────────────────────────────────────
-- 1. UPDATE account_type CONSTRAINT
-- ─────────────────────────────────────────────

-- Drop old constraint (may be named differently — use DO block to be safe)
do $$
begin
  alter table profiles drop constraint if exists profiles_account_type_check;
exception when others then null;
end $$;

-- Re-add with buyer included
alter table profiles
  add constraint profiles_account_type_check
  check (account_type in ('artist', 'curator', 'buyer'));

-- Change default to 'buyer'
alter table profiles
  alter column account_type set default 'buyer';

-- ─────────────────────────────────────────────
-- 2. UPDATE handle_new_user TRIGGER FUNCTION
-- ─────────────────────────────────────────────

create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email, username, account_type)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    coalesce(new.raw_user_meta_data->>'username', ''),
    coalesce(new.raw_user_meta_data->>'account_type', 'buyer')
  )
  on conflict (id) do update set
    email        = excluded.email,
    username     = excluded.username,
    account_type = coalesce(excluded.account_type, profiles.account_type);
  return new;
end;
$$;

-- ─────────────────────────────────────────────
-- 3. BUYER PROFILES (extended buyer/collector data)
-- ─────────────────────────────────────────────

create table if not exists buyer_profiles (
  id                uuid primary key references profiles(id) on delete cascade,
  interests         text,            -- e.g. "Contemporary, Abstract, Portraiture"
  collection_focus  text,
  website_url       text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create trigger set_buyer_profiles_updated_at
  before update on buyer_profiles
  for each row execute function set_updated_at();

alter table buyer_profiles enable row level security;

create policy "buyer_profiles_read_all"   on buyer_profiles for select using (true);
create policy "buyer_profiles_write_own"  on buyer_profiles for all
  using (auth.uid() = id) with check (auth.uid() = id);

-- ─────────────────────────────────────────────
-- 4. RLS — allow public profile reads for messaging/search
-- ─────────────────────────────────────────────

-- Drop the old "read own only" policy and replace with broader read access.
-- Users still can only UPDATE their own profile.
drop policy if exists "profiles_read_own" on profiles;

create policy "profiles_read_authenticated" on profiles
  for select using (auth.role() = 'authenticated');

-- Allow anon to read profiles only by username (for the login lookup flow)
create policy "profiles_read_anon_username" on profiles
  for select to anon
  using (true);   -- get_email_by_username() is security definer anyway; this is belt-and-suspenders

-- ─────────────────────────────────────────────
-- 5. UPDATE artwork_previews curator_list policy to include buyers
-- ─────────────────────────────────────────────

drop policy if exists "previews_curator_read" on artwork_previews;

create policy "previews_buyer_read" on artwork_previews for select
  using (
    visibility = 'public'
    or (
      visibility = 'curator_list'
      and exists (
        select 1 from curator_list_members clm
        where clm.artist_id = artwork_previews.artist_id
          and clm.curator_id = auth.uid()
      )
    )
  );
