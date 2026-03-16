-- Meta Gallery — Username-based login
-- Adds email column to profiles and a secure lookup function

-- Add email column to profiles (populated by trigger on sign-up)
alter table profiles add column if not exists email text;

-- Update the trigger function to also store the user's email
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email
  )
  on conflict (id) do update set
    email = excluded.email;
  return new;
end;
$$;

-- RPC: look up a user's email by their full_name (username).
-- Runs as security definer so unauthenticated callers can use it
-- without needing direct table access.
create or replace function get_email_by_username(p_username text)
returns text language plpgsql security definer set search_path = public as $$
declare
  v_email text;
begin
  select email into v_email
  from profiles
  where full_name = p_username
  limit 1;
  return v_email;
end;
$$;

grant execute on function get_email_by_username(text) to anon, authenticated;
