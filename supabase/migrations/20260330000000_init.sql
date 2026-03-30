create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text,
  partner_nickname text,
  anniversary_date date,
  avatar_url text,
  bio text,
  created_at timestamptz not null default now()
);

create table if not exists public.timeline_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_date date not null,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  happened_on date,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.post_images (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  image_url text not null,
  sort_order int not null default 0
);

create table if not exists public.albums (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  cover_url text,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.album_photos (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.albums(id) on delete cascade,
  image_url text not null,
  caption text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.timeline_events enable row level security;
alter table public.posts enable row level security;
alter table public.post_images enable row level security;
alter table public.albums enable row level security;
alter table public.album_photos enable row level security;

create policy "profiles_select_all" on public.profiles for select using (true);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

create policy "timeline_public_read" on public.timeline_events for select using (true);
create policy "timeline_owner_write" on public.timeline_events for all using (auth.uid() = created_by) with check (auth.uid() = created_by);

create policy "posts_public_read" on public.posts for select using (true);
create policy "posts_owner_write" on public.posts for all using (auth.uid() = created_by) with check (auth.uid() = created_by);

create policy "post_images_public_read" on public.post_images for select using (true);
create policy "post_images_write_by_post_owner" on public.post_images
for all using (
  exists (
    select 1 from public.posts p
    where p.id = post_id and p.created_by = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.posts p
    where p.id = post_id and p.created_by = auth.uid()
  )
);

create policy "albums_public_read" on public.albums for select using (true);
create policy "albums_owner_write" on public.albums for all using (auth.uid() = created_by) with check (auth.uid() = created_by);

create policy "album_photos_public_read" on public.album_photos for select using (true);
create policy "album_photos_write_by_album_owner" on public.album_photos
for all using (
  exists (
    select 1 from public.albums a
    where a.id = album_id and a.created_by = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.albums a
    where a.id = album_id and a.created_by = auth.uid()
  )
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

insert into storage.buckets (id, name, public)
values ('album-photos', 'album-photos', true)
on conflict (id) do nothing;

create policy "album_photos_bucket_public_read" on storage.objects
for select using (bucket_id = 'album-photos');

create policy "album_photos_bucket_auth_upload" on storage.objects
for insert to authenticated with check (bucket_id = 'album-photos');

create policy "album_photos_bucket_auth_update" on storage.objects
for update to authenticated using (bucket_id = 'album-photos');

create policy "album_photos_bucket_auth_delete" on storage.objects
for delete to authenticated using (bucket_id = 'album-photos');
