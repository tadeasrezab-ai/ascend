-- ===== ASCEND simple-code sync — run once in Supabase -> SQL Editor =====
-- Username + secret code login, no email. The code is bcrypt-hashed server-side.
-- Direct table access is blocked by RLS; clients can only call the two functions
-- below, which run with elevated rights (security definer).

create extension if not exists pgcrypto;

create table if not exists ascend_users (
  username   text primary key,
  code_hash  text not null,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table ascend_users enable row level security;
-- no RLS policies on purpose: no direct row access for anon

-- create account if new, otherwise verify the code; returns the stored data
create or replace function ascend_auth(p_username text, p_code text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  rec ascend_users;
begin
  if length(coalesce(p_username,'')) < 3 or length(coalesce(p_code,'')) < 4 then
    return jsonb_build_object('error','too_short');
  end if;
  select * into rec from ascend_users where username = lower(p_username);
  if not found then
    insert into ascend_users(username, code_hash, data)
      values (lower(p_username), crypt(p_code, gen_salt('bf')), '{}'::jsonb);
    return jsonb_build_object('created', true, 'data', '{}'::jsonb);
  end if;
  if rec.code_hash = crypt(p_code, rec.code_hash) then
    return jsonb_build_object('created', false, 'data', rec.data);
  end if;
  return jsonb_build_object('error','bad_code');
end;
$$;

-- save the whole app state (verifies the code on every write)
create or replace function ascend_save(p_username text, p_code text, p_data jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  rec ascend_users;
begin
  select * into rec from ascend_users where username = lower(p_username);
  if not found then return jsonb_build_object('error','no_user'); end if;
  if rec.code_hash <> crypt(p_code, rec.code_hash) then
    return jsonb_build_object('error','bad_code');
  end if;
  update ascend_users set data = p_data, updated_at = now()
    where username = lower(p_username);
  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function ascend_auth(text,text) from public;
revoke all on function ascend_save(text,text,jsonb) from public;
grant execute on function ascend_auth(text,text) to anon;
grant execute on function ascend_save(text,text,jsonb) to anon;
