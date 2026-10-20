-- DK FM Supabase starter schema
-- Run this in Supabase SQL Editor. This starter is for published, public/free content.
-- Do NOT use public audio buckets for paid/private episodes.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  cover_url text,
  category text not null default 'Story',
  author text,
  is_published boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.episodes (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references public.stories(id) on delete cascade,
  title text not null,
  episode_number integer not null default 1 check (episode_number > 0),
  audio_source text not null check (audio_source in ('upload', 'url')),
  audio_path text,
  audio_url text,
  duration_seconds integer check (duration_seconds is null or duration_seconds >= 0),
  is_free boolean not null default true,
  price_npr integer not null default 0 check (price_npr >= 0),
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint episode_audio_source_check check (
    (audio_source = 'upload' and audio_path is not null and audio_url is null)
    or
    (audio_source = 'url' and audio_url is not null and audio_path is null)
  ),
  unique (story_id, episode_number)
);

create index if not exists stories_published_created_idx
  on public.stories (is_published, created_at desc);
create index if not exists episodes_story_number_idx
  on public.episodes (story_id, episode_number);

-- Run this in Supabase SQL Editor after deploying DK FM.
-- Admin requires BOTH this exact Google email and role='admin' in profiles.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    lower(coalesce((select auth.jwt() ->> 'email'), '')) = 'onlineking206@gmail.com'
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'admin'
    );
$$;

alter table public.profiles enable row level security;
alter table public.stories enable row level security;
alter table public.episodes enable row level security;

drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile"
on public.profiles for select
to authenticated
using (id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "Admins manage profiles" on public.profiles;
create policy "Admins manage profiles"
on public.profiles for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "Public read published stories" on public.stories;
create policy "Public read published stories"
on public.stories for select
to anon, authenticated
using (is_published = true or (select public.is_admin()));

drop policy if exists "Admins insert stories" on public.stories;
create policy "Admins insert stories"
on public.stories for insert
to authenticated
with check ((select public.is_admin()));

drop policy if exists "Admins update stories" on public.stories;
create policy "Admins update stories"
on public.stories for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "Admins delete stories" on public.stories;
create policy "Admins delete stories"
on public.stories for delete
to authenticated
using ((select public.is_admin()));

drop policy if exists "Public read published episodes of published stories" on public.episodes;
create policy "Public read published episodes of published stories"
on public.episodes for select
to anon, authenticated
using (
  (is_published = true and exists (
    select 1 from public.stories s
    where s.id = episodes.story_id and s.is_published = true
  ))
  or (select public.is_admin())
);

drop policy if exists "Admins insert episodes" on public.episodes;
create policy "Admins insert episodes"
on public.episodes for insert
to authenticated
with check ((select public.is_admin()));

drop policy if exists "Admins update episodes" on public.episodes;
create policy "Admins update episodes"
on public.episodes for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "Admins delete episodes" on public.episodes;
create policy "Admins delete episodes"
on public.episodes for delete
to authenticated
using ((select public.is_admin()));

-- Storage buckets are created in the Supabase Dashboard:
-- audio: public for free/public episodes only (public bucket means URLs are public).
-- covers: public for story cover images.
-- Storage object policies below allow only admins to upload/update/delete.
drop policy if exists "Admins upload audio" on storage.objects;
create policy "Admins upload audio"
on storage.objects for insert
to authenticated
with check (bucket_id = 'audio' and (select public.is_admin()));

drop policy if exists "Admins update audio" on storage.objects;
create policy "Admins update audio"
on storage.objects for update
to authenticated
using (bucket_id = 'audio' and (select public.is_admin()))
with check (bucket_id = 'audio' and (select public.is_admin()));

drop policy if exists "Admins delete audio" on storage.objects;
create policy "Admins delete audio"
on storage.objects for delete
to authenticated
using (bucket_id = 'audio' and (select public.is_admin()));

drop policy if exists "Admins upload covers" on storage.objects;
create policy "Admins upload covers"
on storage.objects for insert
to authenticated
with check (bucket_id = 'covers' and (select public.is_admin()));

drop policy if exists "Admins update covers" on storage.objects;
create policy "Admins update covers"
on storage.objects for update
to authenticated
using (bucket_id = 'covers' and (select public.is_admin()))
with check (bucket_id = 'covers' and (select public.is_admin()));

drop policy if exists "Admins delete covers" on storage.objects;
create policy "Admins delete covers"
on storage.objects for delete
to authenticated
using (bucket_id = 'covers' and (select public.is_admin()));
