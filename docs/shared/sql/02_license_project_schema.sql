-- ============================================================================
-- LazyBooks — LICENSE project schema (the "postbox")                  v1
-- Run in EVERY per-license (or shared-shard) Supabase project. The admin panel
-- pushes this file via the Management API (see docs/shared/SHARED_CONTRACTS.md).
-- Holds only TRANSIENT sync traffic + small per-license app data. The real
-- accounting data lives in the desktop SQLite (vault) and each device's IndexedDB.
--
-- AUTH MODEL: one Supabase Auth user per login (email+password, created by admin).
--   app_metadata (ONLY settable by service_role — never trust user_metadata):
--     { "license_key": "LB-....", "role": "owner" | "staff" | "connector" }
--   owner     = the customer's main login, used on phones/PWA/desktop UI
--   staff     = extra team users (permissions live in team_users)
--   connector = login used by the desktop connector (may insert sync_chunks)
-- ============================================================================
create extension if not exists pgcrypto;

create or replace function public.jwt_license() returns text
language sql stable as $$ select auth.jwt() -> 'app_metadata' ->> 'license_key' $$;
create or replace function public.jwt_role() returns text
language sql stable as $$ select auth.jwt() -> 'app_metadata' ->> 'role' $$;

create table if not exists public.license_meta (
  license_key    text primary key,
  schema_version int  not null default 1,
  created_at     timestamptz not null default now()
);

-- ------------------------------------------------------------------ devices ---
create table if not exists public.devices (
  device_id    text primary key,
  license_key  text not null,
  device_name  text,
  app          text not null check (app in ('pwa','mobile','desktop')),
  platform     text,
  app_version  text,
  can_write    boolean not null default true,
  is_revoked   boolean not null default false,
  last_seen_at timestamptz,
  last_sync_at timestamptz,
  created_at   timestamptz not null default now()
);
create index if not exists idx_devices_license on public.devices(license_key);

-- ------------------------------------------------------------ sync_requests ---
-- device -> connector: "please send me data"
create table if not exists public.sync_requests (
  id            uuid primary key default gen_random_uuid(),
  license_key   text not null,
  device_id     text not null,
  kind          text not null check (kind in ('initial','delta','snapshot_refresh','ping')),
  company_guid  text,
  from_date     date, to_date date,
  last_sync_at  timestamptz,
  lookback_days int,
  status        text not null default 'pending' check (status in ('pending','processing','done','failed')),
  error         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create unique index if not exists uq_sync_requests_inflight
  on public.sync_requests(device_id, kind) where status in ('pending','processing');
create index if not exists idx_sync_requests_license_status on public.sync_requests(license_key, status);

-- -------------------------------------------------------------- sync_chunks ---
-- connector -> device: transient. ACK = the device DELETEs the row.
create table if not exists public.sync_chunks (
  id          bigserial primary key,
  license_key text not null,
  device_id   text not null,
  request_id  uuid,
  seq         int  not null default 0,
  table_name  text not null,           -- real table: tm_*, tx_*, ref_*
  op          text not null default 'upsert' check (op in ('upsert','delete','clear','replace_scope','delete_children')),
  payload     jsonb not null,          -- rows[] OR {enc:true, iv:"..", ct:".."} when E2E encrypted
  enc         boolean not null default false,
  is_last     boolean not null default false,
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null default now() + interval '24 hours'
);
create index if not exists idx_sync_chunks_device on public.sync_chunks(license_key, device_id, id);

-- -------------------------------------------------------------- entry_queue ---
-- device -> connector: vouchers/masters to be posted into Tally. Idempotent.
create table if not exists public.entry_queue (
  id                uuid primary key default gen_random_uuid(),
  client_request_id text not null unique,          -- idempotency key generated on the device
  license_key       text not null,
  device_id         text not null,
  kind              text not null,                  -- invoice|receipt|payment|contra|journal|inventory_voucher|order|quotation|ledger|stock_item|...
  payload           jsonb not null,
  status            text not null default 'queued' check (status in ('queued','posting','posted','failed','needs_review','cancelled')),
  result            jsonb,
  attempts          int not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  posted_at         timestamptz
);
create index if not exists idx_entry_queue_status on public.entry_queue(license_key, status);

-- ---------------------------------------------------------------- snapshots ---
-- Only used when feature flag cloud_copy = true. Objects live in Storage bucket 'snapshots'
-- under  {license_key}/{company_guid}/...   (encrypted client-side, each object < 50 MB)
create table if not exists public.snapshots (
  id             uuid primary key default gen_random_uuid(),
  license_key    text not null,
  company_guid   text not null,
  kind           text not null check (kind in ('full','delta')),
  seq            bigint not null,
  storage_path   text not null,
  bytes          bigint,
  sha256         text,
  enc            boolean not null default true,
  from_alter_id  bigint, to_alter_id bigint,
  created_at     timestamptz not null default now(),
  unique (license_key, company_guid, kind, seq)
);

-- ------------------------------------------------- small per-license data ---
create table if not exists public.app_settings (
  license_key text not null, key text not null, value jsonb not null,
  updated_by uuid, updated_at timestamptz not null default now(),
  primary key (license_key, key)
);
create table if not exists public.team_users (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  license_key  text not null,
  display_name text,
  role         text not null default 'staff',       -- staff | salesperson | accountant | viewer
  permissions  jsonb not null default '{}'::jsonb,  -- screen-wise + data-entry permissions
  is_active    boolean not null default true,
  created_at   timestamptz not null default now()
);
create table if not exists public.followups (
  id uuid primary key default gen_random_uuid(), license_key text not null,
  ledger_guid text, ledger_name text, due_at timestamptz, note text,
  status text not null default 'open' check (status in ('open','done','snoozed','cancelled')),
  created_by uuid, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.reminder_jobs (
  id uuid primary key default gen_random_uuid(), license_key text not null,
  ledger_guid text not null, mode text not null check (mode in ('whatsapp_link','sms_link','email_link','local_notification')),
  frequency jsonb not null,           -- {every_days: 7, at: "10:00", until_cleared: true}
  message_template text, is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create table if not exists public.reminder_log (
  id bigserial primary key, license_key text not null, ledger_guid text, job_id uuid,
  channel text, outcome text, at timestamptz not null default now(), detail jsonb
);
create table if not exists public.punch_logs (
  id uuid primary key default gen_random_uuid(), license_key text not null, user_id uuid,
  kind text not null check (kind in ('in','out','meeting_in','meeting_out')),
  ledger_guid text, lat double precision, lng double precision, accuracy real, note text,
  at timestamptz not null default now()
);
create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(), license_key text not null, device_id text not null,
  endpoint text not null, p256dh text, auth text, created_at timestamptz not null default now(),
  unique (device_id, endpoint)
);

-- Explicit grants (Supabase grants these by default; stated here so the file is self-contained).
revoke all on all tables in schema public from anon;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;

-- --------------------------------------------------------------------- RLS ---
do $$
declare t text;
begin
  foreach t in array array['license_meta','devices','sync_requests','sync_chunks','entry_queue','snapshots',
     'app_settings','team_users','followups','reminder_jobs','reminder_log','punch_logs','push_subscriptions']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists lic_all on public.%I', t);
  end loop;
end $$;

-- license_meta / devices: any login of the license can read; owner+connector may write
create policy lic_all on public.license_meta for select to authenticated using (license_key = public.jwt_license());
create policy lic_all on public.devices for all to authenticated
  using (license_key = public.jwt_license())
  with check (license_key = public.jwt_license() and public.jwt_role() in ('owner','connector'));

-- sync_requests: devices (owner/staff) insert+read; connector reads+updates status
create policy lic_all on public.sync_requests for all to authenticated
  using (license_key = public.jwt_license())
  with check (license_key = public.jwt_license());

-- sync_chunks: connector inserts; devices read + delete (ack). Devices cannot insert.
create policy lic_all on public.sync_chunks for select to authenticated using (license_key = public.jwt_license());
drop policy if exists chunks_insert on public.sync_chunks;
create policy chunks_insert on public.sync_chunks for insert to authenticated
  with check (license_key = public.jwt_license() and public.jwt_role() = 'connector');
drop policy if exists chunks_delete on public.sync_chunks;
create policy chunks_delete on public.sync_chunks for delete to authenticated using (license_key = public.jwt_license());

-- entry_queue: owner/staff insert; connector updates status/result; all read own license
create policy lic_all on public.entry_queue for all to authenticated
  using (license_key = public.jwt_license()) with check (license_key = public.jwt_license());

-- snapshots (manifest): connector writes, devices read
create policy lic_all on public.snapshots for select to authenticated using (license_key = public.jwt_license());
drop policy if exists snapshots_write on public.snapshots;
create policy snapshots_write on public.snapshots for insert to authenticated
  with check (license_key = public.jwt_license() and public.jwt_role() = 'connector');
drop policy if exists snapshots_del on public.snapshots;
create policy snapshots_del on public.snapshots for delete to authenticated
  using (license_key = public.jwt_license() and public.jwt_role() = 'connector');

-- small per-license tables: everyone in the license (app logic + team_users.permissions gate screens)
do $$
declare t text;
begin
  foreach t in array array['app_settings','followups','reminder_jobs','reminder_log','punch_logs','push_subscriptions']
  loop
    execute format('create policy lic_all on public.%I for all to authenticated using (license_key = public.jwt_license()) with check (license_key = public.jwt_license())', t);
  end loop;
end $$;
-- team_users: only owner manages; staff can read own row
create policy lic_all on public.team_users for select to authenticated
  using (license_key = public.jwt_license() and (public.jwt_role() = 'owner' or user_id = auth.uid()));
drop policy if exists team_owner_write on public.team_users;
create policy team_owner_write on public.team_users for all to authenticated
  using (license_key = public.jwt_license() and public.jwt_role() = 'owner')
  with check (license_key = public.jwt_license() and public.jwt_role() = 'owner');

-- ------------------------------------------------------------ Storage: snapshots ---
insert into storage.buckets (id, name, public, file_size_limit)
values ('snapshots','snapshots', false, 52428800) on conflict (id) do nothing;   -- 50 MB = free-plan max
drop policy if exists snapshots_obj_read on storage.objects;
create policy snapshots_obj_read on storage.objects for select to authenticated
  using (bucket_id = 'snapshots' and (storage.foldername(name))[1] = public.jwt_license());
drop policy if exists snapshots_obj_write on storage.objects;
create policy snapshots_obj_write on storage.objects for insert to authenticated
  with check (bucket_id = 'snapshots' and (storage.foldername(name))[1] = public.jwt_license() and public.jwt_role() = 'connector');
drop policy if exists snapshots_obj_del on storage.objects;
create policy snapshots_obj_del on storage.objects for delete to authenticated
  using (bucket_id = 'snapshots' and (storage.foldername(name))[1] = public.jwt_license() and public.jwt_role() = 'connector');

-- -------------------------------------------------------------- housekeeping ---
create or replace function public.lb_cleanup() returns void language sql security definer set search_path = public as $$
  delete from public.sync_chunks   where expires_at < now();
  delete from public.sync_requests where updated_at < now() - interval '7 days'  and status in ('done','failed');
  delete from public.entry_queue   where updated_at < now() - interval '30 days' and status in ('posted','cancelled');
  delete from public.reminder_log  where at < now() - interval '90 days';
$$;
revoke all on function public.lb_cleanup() from public, anon, authenticated;

do $$ begin
  if exists (select 1 from pg_available_extensions where name = 'pg_cron') then
    create extension if not exists pg_cron;
    perform cron.schedule('lb_cleanup_hourly', '17 * * * *', 'select public.lb_cleanup()');
  else
    raise notice 'pg_cron not available: schedule public.lb_cleanup() from the admin panel keepalive job instead.';
  end if;
exception when others then raise notice 'pg_cron scheduling skipped: %', sqlerrm;
end $$;

-- Realtime nudges (optional; polling is the fallback). Only the tiny control tables.
do $$ begin
  begin alter publication supabase_realtime add table public.sync_requests; exception when others then null; end;
  begin alter publication supabase_realtime add table public.entry_queue;   exception when others then null; end;
end $$;

insert into public.license_meta(license_key, schema_version) values ('__template__', 1) on conflict do nothing;
-- ============================== end of license project schema ================
