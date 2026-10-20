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
