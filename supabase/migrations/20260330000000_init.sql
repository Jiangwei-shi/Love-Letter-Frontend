create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text,
  partner_nickname text,
  anniversary_date date,
  avatar_url text,
  bio text,
  intro text,
  hero_image_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.couple_profile (
  id uuid primary key default gen_random_uuid(),
  boy_name text,
  boy_avatar text,
  girl_name text,
  girl_avatar text,
  anniversary_date date,
  about_text text,
  love_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.timeline_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_date date not null,
  boy_message text,
  girl_message text,
  created_by uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null check (char_length(content) <= 200),
  record_time timestamptz not null default now(),
  author_type text not null check (author_type in ('boy', 'girl')),
  created_by uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.post_images (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  image_url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.post_likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  visitor_name text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.albums (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  cover_url text,
  created_by uuid references auth.users(id) on delete set null default auth.uid(),
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

create index if not exists idx_timeline_event_date on public.timeline_events(event_date);
create index if not exists idx_posts_record_time on public.posts(record_time desc);
create index if not exists idx_post_images_post_id on public.post_images(post_id);
create index if not exists idx_post_likes_post_id on public.post_likes(post_id);
create index if not exists idx_post_comments_post_id on public.post_comments(post_id);
create index if not exists idx_album_photos_album_id on public.album_photos(album_id);

create or replace function public.enforce_post_images_limit()
returns trigger
language plpgsql
as $$
declare
  c int;
begin
  select count(*) into c from public.post_images where post_id = new.post_id;
  if c >= 9 then
    raise exception '每条生活记录最多9张图片';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_enforce_post_images_limit on public.post_images;
create trigger trg_enforce_post_images_limit
before insert on public.post_images
for each row execute function public.enforce_post_images_limit();

drop trigger if exists trg_timeline_updated_at on public.timeline_events;
create trigger trg_timeline_updated_at before update on public.timeline_events
for each row execute function public.set_updated_at();

drop trigger if exists trg_posts_updated_at on public.posts;
create trigger trg_posts_updated_at before update on public.posts
for each row execute function public.set_updated_at();

drop trigger if exists trg_couple_profile_updated_at on public.couple_profile;
create trigger trg_couple_profile_updated_at before update on public.couple_profile
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.couple_profile enable row level security;
alter table public.timeline_events enable row level security;
alter table public.posts enable row level security;
alter table public.post_images enable row level security;
alter table public.post_likes enable row level security;
alter table public.post_comments enable row level security;
alter table public.albums enable row level security;
alter table public.album_photos enable row level security;

create policy "profiles_select_all" on public.profiles for select using (true);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

create policy "couple_profile_public_read" on public.couple_profile for select using (true);
create policy "couple_profile_auth_write" on public.couple_profile for all to authenticated using (true) with check (true);

create policy "timeline_public_read" on public.timeline_events for select using (true);
create policy "timeline_auth_write" on public.timeline_events for all to authenticated using (true) with check (true);

create policy "posts_public_read" on public.posts for select using (true);
create policy "posts_auth_write" on public.posts for all to authenticated using (true) with check (true);

create policy "post_images_public_read" on public.post_images for select using (true);
create policy "post_images_auth_write" on public.post_images for all to authenticated using (true) with check (true);

create policy "post_likes_public_read" on public.post_likes for select using (true);
create policy "post_likes_public_insert" on public.post_likes for insert with check (true);

create policy "post_comments_public_read" on public.post_comments for select using (true);
create policy "post_comments_public_insert" on public.post_comments for insert with check (true);
create policy "post_comments_auth_delete" on public.post_comments for delete to authenticated using (true);

create policy "albums_public_read" on public.albums for select using (true);
create policy "albums_auth_write" on public.albums for all to authenticated using (true) with check (true);

create policy "album_photos_public_read" on public.album_photos for select using (true);
create policy "album_photos_auth_write" on public.album_photos for all to authenticated using (true) with check (true);

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

insert into public.couple_profile (id, boy_name, girl_name, anniversary_date, about_text, love_message)
values (
  '7c3df88f-18e8-4e2f-9380-3175aab2f020',
  'Rock',
  'Luna',
  '2024-05-20',
  '我们喜欢在平凡里记录微小幸福，希望很多年后回看，依然会被这些瞬间打动。',
  '谢谢你愿意和我一起，把普通日子过成值得纪念的故事。'
)
on conflict (id) do nothing;

insert into public.timeline_events (id, title, event_date, boy_message, girl_message)
values
  ('f2de78c3-80f2-4f88-aef3-693f59f8bb01', '第一次见面', '2024-05-20', '那天起我开始期待每一次聊天。', '原来真的会有人让我一眼就觉得安心。'),
  ('f2de78c3-80f2-4f88-aef3-693f59f8bb02', '第一次旅行', '2024-08-11', '一起看过的风景，会成为以后想起就会笑的记忆。', '原来和你在一起，去哪儿都很好。')
on conflict (id) do nothing;

insert into public.posts (id, title, content, record_time, author_type)
values
  ('98d6f20f-411b-4934-91c6-1f8d1e64d111', '周末小约会', '今天一起去了公园，拍了很多照片，晚饭是你最喜欢的火锅。', '2026-03-30 18:30:00+08', 'boy'),
  ('98d6f20f-411b-4934-91c6-1f8d1e64d112', '下雨天也很开心', '虽然下雨，但一起听歌散步还是很浪漫。', '2026-03-29 20:10:00+08', 'girl')
on conflict (id) do nothing;

insert into public.post_images (post_id, image_url, sort_order)
values
  ('98d6f20f-411b-4934-91c6-1f8d1e64d111', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop', 0),
  ('98d6f20f-411b-4934-91c6-1f8d1e64d112', 'https://images.unsplash.com/photo-1516589091380-5d8e87df6999?q=80&w=1200&auto=format&fit=crop', 0)
on conflict do nothing;

insert into public.post_likes (post_id) values
  ('98d6f20f-411b-4934-91c6-1f8d1e64d111'),
  ('98d6f20f-411b-4934-91c6-1f8d1e64d111'),
  ('98d6f20f-411b-4934-91c6-1f8d1e64d112');

insert into public.post_comments (post_id, visitor_name, message) values
  ('98d6f20f-411b-4934-91c6-1f8d1e64d111', '小明', '祝你们一直甜甜蜜蜜！'),
  ('98d6f20f-411b-4934-91c6-1f8d1e64d112', '匿名访客', '这条记录好温暖。');

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
