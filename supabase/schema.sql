-- Run this in Supabase SQL Editor.
-- The server uses the service-role key; never expose that key to the browser.

create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  guest_name text not null,
  email text not null,
  phone text,
  attendance text not null check (attendance in ('accept', 'decline')),
  message text,
  allergies text[] not null default '{}',
  dietary_requirements text
);

alter table public.rsvps enable row level security;

-- No anon/authenticated policies are created intentionally.
-- Browser clients cannot read or write this table directly.
-- The Next.js server route writes using SUPABASE_SERVICE_ROLE_KEY.

create index if not exists rsvps_created_at_idx on public.rsvps (created_at desc);
create index if not exists rsvps_email_idx on public.rsvps (lower(email));
