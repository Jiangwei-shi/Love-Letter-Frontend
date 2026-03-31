alter table public.posts
add column if not exists locked boolean not null default false;
