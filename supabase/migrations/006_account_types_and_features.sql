-- Meta Gallery — Account Types, Previews, Curator Lists & Messaging
-- Run after 005_add_username.sql

-- ─────────────────────────────────────────────
-- 1. ACCOUNT TYPE ON PROFILES
-- ─────────────────────────────────────────────
alter table profiles
  add column if not exists account_type text not null default 'curator'
  check (account_type in ('artist', 'curator'));

-- ─────────────────────────────────────────────
-- 2. ARTIST PROFILES (extended artist data)
-- ─────────────────────────────────────────────
create table if not exists artist_profiles (
  id            uuid primary key references profiles(id) on delete cascade,
  specialty     text,                         -- e.g. "Oil Painting", "Sculpture"
  website_url   text,
  instagram_url text,
  portfolio_url text,
  years_active  int,
  is_available_for_commission bool not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger set_artist_profiles_updated_at
  before update on artist_profiles
  for each row execute function set_updated_at();

alter table artist_profiles enable row level security;

create policy "artist_profiles_read_all"   on artist_profiles for select using (true);
create policy "artist_profiles_write_own"  on artist_profiles for all
  using (auth.uid() = id) with check (auth.uid() = id);

-- ─────────────────────────────────────────────
-- 3. CURATOR PROFILES (extended curator data)
-- ─────────────────────────────────────────────
create table if not exists curator_profiles (
  id                uuid primary key references profiles(id) on delete cascade,
  interests         text,                    -- free-text: "Contemporary, Abstract, Portraiture"
  collection_focus  text,
  institution       text,
  website_url       text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create trigger set_curator_profiles_updated_at
  before update on curator_profiles
  for each row execute function set_updated_at();

alter table curator_profiles enable row level security;

create policy "curator_profiles_read_all"   on curator_profiles for select using (true);
create policy "curator_profiles_write_own"  on curator_profiles for all
  using (auth.uid() = id) with check (auth.uid() = id);

-- ─────────────────────────────────────────────
-- 4. ARTWORK PREVIEWS (WIP / private previews)
-- ─────────────────────────────────────────────
create table if not exists artwork_previews (
  id            uuid primary key default gen_random_uuid(),
  artist_id     uuid not null references profiles(id) on delete cascade,
  title         text not null,
  description   text,
  medium        text,
  image_url     text,
  status        text not null default 'wip'
    check (status in ('wip', 'nearly_complete', 'complete')),
  visibility    text not null default 'curator_list'
    check (visibility in ('private', 'curator_list', 'public')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger set_artwork_previews_updated_at
  before update on artwork_previews
  for each row execute function set_updated_at();

alter table artwork_previews enable row level security;

-- Artists can manage their own previews
create policy "previews_artist_all" on artwork_previews for all
  using (auth.uid() = artist_id) with check (auth.uid() = artist_id);

-- Curators on the artist's list can see curator_list previews
create policy "previews_curator_read" on artwork_previews for select
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

-- ─────────────────────────────────────────────
-- 5. CURATOR LISTS (per-artist list of trusted curators)
-- ─────────────────────────────────────────────
create table if not exists curator_list_members (
  id          uuid primary key default gen_random_uuid(),
  artist_id   uuid not null references profiles(id) on delete cascade,
  curator_id  uuid not null references profiles(id) on delete cascade,
  added_at    timestamptz not null default now(),
  unique (artist_id, curator_id)
);

alter table curator_list_members enable row level security;

create policy "curatorlist_artist_manage" on curator_list_members for all
  using (auth.uid() = artist_id) with check (auth.uid() = artist_id);

create policy "curatorlist_curator_read_own" on curator_list_members for select
  using (auth.uid() = curator_id);

-- ─────────────────────────────────────────────
-- 6. CONVERSATIONS (DM threads between 2 users)
-- ─────────────────────────────────────────────
create table if not exists conversations (
  id              uuid primary key default gen_random_uuid(),
  participant_a   uuid not null references profiles(id) on delete cascade,
  participant_b   uuid not null references profiles(id) on delete cascade,
  last_message_at timestamptz,
  created_at      timestamptz not null default now(),
  unique (participant_a, participant_b)
);

alter table conversations enable row level security;

create policy "conversations_read_participant" on conversations for select
  using (auth.uid() = participant_a or auth.uid() = participant_b);

create policy "conversations_insert_participant" on conversations for insert
  with check (auth.uid() = participant_a or auth.uid() = participant_b);

-- ─────────────────────────────────────────────
-- 7. MESSAGES (individual DMs)
-- ─────────────────────────────────────────────
create table if not exists messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id       uuid not null references profiles(id) on delete cascade,
  body            text not null,
  read_at         timestamptz,
  created_at      timestamptz not null default now()
);

create index if not exists messages_conversation_idx on messages (conversation_id, created_at);

alter table messages enable row level security;

-- Only conversation participants can read/send messages
create policy "messages_read_participant" on messages for select
  using (
    exists (
      select 1 from conversations c
      where c.id = messages.conversation_id
        and (c.participant_a = auth.uid() or c.participant_b = auth.uid())
    )
  );

create policy "messages_insert_sender" on messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from conversations c
      where c.id = messages.conversation_id
        and (c.participant_a = auth.uid() or c.participant_b = auth.uid())
    )
  );

-- Update conversation.last_message_at on new message
create or replace function update_conversation_last_message()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update conversations
  set last_message_at = new.created_at
  where id = new.conversation_id;
  return new;
end;
$$;

create trigger on_message_inserted
  after insert on messages
  for each row execute function update_conversation_last_message();

-- ─────────────────────────────────────────────
-- 8. UPDATE handle_new_user to store account_type
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
    coalesce(new.raw_user_meta_data->>'account_type', 'curator')
  )
  on conflict (id) do update set
    email        = excluded.email,
    username     = excluded.username,
    account_type = excluded.account_type;
  return new;
end;
$$;
