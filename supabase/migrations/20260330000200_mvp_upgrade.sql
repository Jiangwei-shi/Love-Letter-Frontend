alter table public.timeline_events
  add column if not exists boy_message text,
  add column if not exists girl_message text,
  add column if not exists updated_at timestamptz not null default now();

alter table public.timeline_events
  alter column created_by drop not null;

alter table public.posts
  add column if not exists record_time timestamptz not null default now(),
  add column if not exists author_type text not null default 'boy',
  add column if not exists updated_at timestamptz not null default now();

alter table public.posts
  add constraint posts_author_type_check check (author_type in ('boy', 'girl'));

alter table public.posts
  add constraint posts_content_len_check check (char_length(content) <= 200);

alter table public.posts
  alter column created_by drop not null;

alter table public.post_images
  add column if not exists created_at timestamptz not null default now();

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

create index if not exists idx_posts_record_time on public.posts(record_time desc);
create index if not exists idx_post_likes_post_id on public.post_likes(post_id);
create index if not exists idx_post_comments_post_id on public.post_comments(post_id);

alter table public.post_likes enable row level security;
alter table public.post_comments enable row level security;
alter table public.couple_profile enable row level security;

drop policy if exists "post_likes_public_read" on public.post_likes;
create policy "post_likes_public_read" on public.post_likes for select using (true);
drop policy if exists "post_likes_public_insert" on public.post_likes;
create policy "post_likes_public_insert" on public.post_likes for insert with check (true);

drop policy if exists "post_comments_public_read" on public.post_comments;
create policy "post_comments_public_read" on public.post_comments for select using (true);
drop policy if exists "post_comments_public_insert" on public.post_comments;
create policy "post_comments_public_insert" on public.post_comments for insert with check (true);
drop policy if exists "post_comments_auth_delete" on public.post_comments;
create policy "post_comments_auth_delete" on public.post_comments for delete to authenticated using (true);

drop policy if exists "couple_profile_public_read" on public.couple_profile;
create policy "couple_profile_public_read" on public.couple_profile for select using (true);
drop policy if exists "couple_profile_auth_write" on public.couple_profile;
create policy "couple_profile_auth_write" on public.couple_profile for all to authenticated using (true) with check (true);

insert into public.couple_profile (id, boy_name, girl_name, anniversary_date, about_text, love_message)
select
  '7c3df88f-18e8-4e2f-9380-3175aab2f020',
  coalesce(
    to_jsonb(p)->>'boy_name',
    to_jsonb(p)->>'nickname',
    'Rock'
  ),
  coalesce(
    to_jsonb(p)->>'girl_name',
    to_jsonb(p)->>'partner_nickname',
    'Luna'
  ),
  coalesce(
    (to_jsonb(p)->>'anniversary_date')::date,
    null
  ),
  coalesce(
    to_jsonb(p)->>'about_text',
    to_jsonb(p)->>'intro',
    to_jsonb(p)->>'bio',
    '我们喜欢在平凡里记录微小幸福。'
  ),
  '谢谢你愿意和我一起，把普通日子过成值得纪念的故事。'
from public.profiles p
limit 1
on conflict (id) do nothing;

