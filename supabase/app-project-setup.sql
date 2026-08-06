-- ============================================================================
-- Run this ONCE in the MOBILE APP's Supabase project (SQL Editor).
--
-- Purpose: the Ridely web app (waitlist + admin dashboard) is being pointed at
-- the SAME Supabase project the mobile app uses, so admins can approve rider
-- verifications submitted in the app. The app's project already has `riders`,
-- `rider_verification_documents`, and the `rider-verification-docs` storage
-- bucket. It does NOT have the web's two tables — this script adds them.
--
-- Safe to run more than once (idempotent: `if not exists`). It only ADDS the
-- web tables; it never touches the app's existing rider tables.
-- Mirrors: supabase/migrations/20250618000000_create_waitlist_signups.sql
-- ============================================================================

-- ── Web table 1: waitlist signups ──────────────────────────────────────────
create table if not exists public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  role text not null check (role in ('customer', 'rider')),
  name text not null,
  email text not null,
  city text not null,
  sex text check (sex is null or sex in ('male', 'female')),
  age integer check (age is null or age >= 18),
  phone text,
  created_at timestamptz not null default now(),
  constraint waitlist_signups_email_role_unique unique (email, role)
);

create index if not exists waitlist_signups_created_at_idx
  on public.waitlist_signups (created_at desc);

create index if not exists waitlist_signups_role_idx
  on public.waitlist_signups (role);

alter table public.waitlist_signups enable row level security;

-- ── Web table 2: page visit analytics ──────────────────────────────────────
create table if not exists public.page_visits (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  referrer text,
  session_id text not null,
  created_at timestamptz not null default now()
);

create index if not exists page_visits_created_at_idx
  on public.page_visits (created_at desc);

create index if not exists page_visits_path_idx
  on public.page_visits (path);

create index if not exists page_visits_session_id_idx
  on public.page_visits (session_id);

alter table public.page_visits enable row level security;

-- No public RLS policies: the web reaches these tables only through its server
-- API using the service_role key, which bypasses RLS. Same model the app uses.

-- ============================================================================
-- VERIFY (optional) — run these SELECTs after the script to confirm the app's
-- rider objects exist in THIS project, so admin approvals will work:
--
--   select count(*) from public.riders;
--   select count(*) from public.rider_verification_documents;
--   select id, name from storage.buckets where id = 'rider-verification-docs';
--
-- All three should succeed. If any errors with "relation does not exist", you
-- are connected to the wrong project — switch to the app's project and re-run.
-- ============================================================================
