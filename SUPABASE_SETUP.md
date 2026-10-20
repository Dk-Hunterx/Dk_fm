# DK FM — Supabase backend setup

This repository is currently deployed as a static GitHub Pages site. Supabase can supply the database, admin login, and audio/image storage without running your own server. The SQL schema is in `supabase/schema.sql`.

## 1. Create the free Supabase project

1. Open https://supabase.com and create a project.
2. Save the database password somewhere private.
3. In **Project Settings → API** (or **Connect**, depending on dashboard version), copy the **Project URL** and the **publishable/anon key**.
4. Never put the `service_role` or secret key in frontend code, GitHub files, screenshots, or a public repository.

Free-plan quotas and inactivity rules can change; check the current Supabase pricing page before relying on it for public traffic.

## 2. Create tables and security policies

1. Open **SQL Editor → New query**.
2. Copy the complete contents of `supabase/schema.sql` into the editor.
3. Run it and check for success.

This creates `profiles`, `stories`, and `episodes` with row-level security. Anonymous visitors can read published stories/episodes; only users whose profile role is `admin` can manage content.

## 3. Create storage buckets

Open **Storage → New bucket** and create:
- `audio` — set **Public bucket ON only for free/public audio** in this starter.
- `covers` — set **Public bucket ON** for cover images.

The SQL policies let admins upload/update/delete objects. Public buckets let anyone with an object URL listen to the file, so do not put paid/private audio in this bucket. For paid episodes, switch to a private bucket and issue short-lived signed URLs only after a server-side entitlement check.

Suggested audio object path: `<story-uuid>/<episode-uuid>/<filename>.mp3`. Use MP3 or another browser-supported format and keep uploads within the current project file-size limit.

## 4. Create your admin login

1. Open **Authentication → Users → Add user** and create your own email/password user.
2. Copy that user's UUID.
3. In **SQL Editor**, run this after replacing the UUID and display name:

```sql
insert into public.profiles (id, display_name, role)
values ('PASTE-AUTH-USER-UUID-HERE', 'DK FM Admin', 'admin')
on conflict (id) do update
set display_name = excluded.display_name, role = 'admin';
```

Do not create a public sign-up form that lets users choose their own role. Do not expose a service key in the browser.

## 5. Configure the React/Vite frontend

Install the SDK in your local project:

```bash
npm install @supabase/supabase-js
```

Create `.env.local` at the project root (do not commit real values):

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY
```

Create `src/lib/supabase.ts`:

```ts
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase = url && key ? createClient(url, key) : null;
```

Add `.env.local` to `.gitignore`. These are public-client settings; security comes from Supabase RLS policies, not from hiding the anon key. Never use the service-role key in Vite.

In **Authentication → URL Configuration**, add your deployed site URL to **Site URL** and **Redirect URLs**, for example:
`https://dk-hunterx.github.io/Dk_fm/`

GitHub Pages only hosts static files; environment variables must be provided at build time by your workflow if building Vite. Do not assume a local `.env.local` automatically exists in GitHub Actions. Add GitHub Actions repository variables named `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, then map them to the build step's environment. These are public values, not secrets, but still configure them carefully.

## 6. Frontend data model and usage

Stories:
- `supabase.from('stories').select('*').eq('is_published', true).order('created_at', { ascending: false })`
- Admin create/update/delete requires a signed-in admin session.

Episodes:
- `supabase.from('episodes').select('*').eq('story_id', storyId).eq('is_published', true).order('episode_number')`
- For `audio_source = 'url'`, save a compatible direct audio URL in `audio_url`.
- For `audio_source = 'upload'`, upload the MP3 to the `audio` bucket, then save the object key in `audio_path`. Resolve its public URL with `supabase.storage.from('audio').getPublicUrl(audio_path)`.

Google Drive: a normal sharing URL usually points to a preview page, not a direct audio stream. Store only a URL that actually works in an HTML `<audio>` element; test it in a private browser tab and on mobile. Drive is not guaranteed to provide reliable streaming or unlimited bandwidth.

## 7. Important limitations before launch

- The current repository contains a standalone `index.html` app and a `static-site/` copy as well as TypeScript source files; confirm which build/deploy path is active before wiring the client into the live UI. The current standalone HTML does not automatically use the React/Vite SDK code above.
- This starter stores a `price_npr` and `is_free` flag for future use, but it does **not** enforce paid access or process payments. Do not advertise paid episodes as secure until private storage, server-side entitlement checks, and verified payment callbacks are implemented.
- A public audio URL can be copied. Public/free audio is appropriate for the first test; paid content needs private objects and a backend function that checks purchases before creating a signed URL.
- Browser favourites/history are still local until the UI is explicitly connected to user accounts and database tables.
- Test with a throwaway story and non-sensitive audio first. Keep backups of SQL and content.

## Suggested implementation order

1. Create Supabase project and run the schema.
2. Create the `audio` and `covers` buckets.
3. Create your admin Auth user and promote that exact UUID using SQL.
4. Add the URL and public key to local Vite env.
5. Wire React story/episode queries, admin login, CRUD, and uploads.
6. Verify an anonymous visitor cannot edit anything and a normal authenticated user cannot publish content.
7. Only then consider private audio and payment integration.
