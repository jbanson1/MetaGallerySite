-- Meta Gallery — Dedicated username field
-- Adds a unique username column to profiles, used for login

alter table profiles add column if not exists username text unique;

-- Update trigger so new users have their username stored from metadata
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    coalesce(new.raw_user_meta_data->>'username', '')
  )
  on conflict (id) do update set
    email    = excluded.email,
    username = excluded.username;
  return new;
end;
$$;

-- Update RPC to look up by username column instead of full_name
create or replace function get_email_by_username(p_username text)
returns text language plpgsql security definer set search_path = public as $$
declare
  v_email text;
begin
  select email into v_email
  from profiles
  where username = p_username
  limit 1;
  return v_email;
end;
$$;

grant execute on function get_email_by_username(text) to anon, authenticated;

-- Index for fast username lookups
create index if not exists profiles_username_idx on profiles (username);
