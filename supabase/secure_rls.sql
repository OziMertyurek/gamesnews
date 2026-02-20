-- Run in Supabase SQL Editor
-- Security baseline for profiles + admin tables

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null default '',
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_audit_logs (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  admin_email text not null,
  action text not null,
  target text not null default '',
  detail text not null default ''
);

create table if not exists public.review_approvals (
  slug text primary key,
  approved_by text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.admin_audit_logs enable row level security;
alter table public.review_approvals enable row level security;

-- Profiles: users can read/update only their own profile
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own
on public.profiles
for select
to authenticated
using ((auth.jwt() ->> 'email') = email);

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own
on public.profiles
for insert
to authenticated
with check ((auth.jwt() ->> 'email') = email and role = 'user');

drop policy if exists profiles_update_own_no_role on public.profiles;
create policy profiles_update_own_no_role
on public.profiles
for update
to authenticated
using ((auth.jwt() ->> 'email') = email)
with check ((auth.jwt() ->> 'email') = email and role = 'user');

-- Admin-only read for admin tables
drop policy if exists admin_audit_select_admin on public.admin_audit_logs;
create policy admin_audit_select_admin
on public.admin_audit_logs
for select
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.email = (auth.jwt() ->> 'email')
      and p.role = 'admin'
  )
);

drop policy if exists review_approvals_select_admin on public.review_approvals;
create policy review_approvals_select_admin
on public.review_approvals
for select
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.email = (auth.jwt() ->> 'email')
      and p.role = 'admin'
  )
);

-- Block direct client writes; writes should happen via service_role API
drop policy if exists admin_audit_insert_none on public.admin_audit_logs;
create policy admin_audit_insert_none
on public.admin_audit_logs
for insert
to authenticated
with check (false);

drop policy if exists review_approvals_insert_none on public.review_approvals;
create policy review_approvals_insert_none
on public.review_approvals
for insert
to authenticated
with check (false);

drop policy if exists review_approvals_update_none on public.review_approvals;
create policy review_approvals_update_none
on public.review_approvals
for update
to authenticated
using (false)
with check (false);

-- Immutable audit log
drop policy if exists admin_audit_update_none on public.admin_audit_logs;
create policy admin_audit_update_none
on public.admin_audit_logs
for update
to authenticated
using (false)
with check (false);

drop policy if exists admin_audit_delete_none on public.admin_audit_logs;
create policy admin_audit_delete_none
on public.admin_audit_logs
for delete
to authenticated
using (false);
