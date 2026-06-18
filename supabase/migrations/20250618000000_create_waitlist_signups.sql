-- Waitlist signups for Ridely marketing site
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

-- Page visits for analytics
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

-- No public policies: all access goes through the server API using the service role key.
