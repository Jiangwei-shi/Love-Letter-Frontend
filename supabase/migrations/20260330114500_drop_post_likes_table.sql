drop policy if exists "post_likes_public_read" on public.post_likes;
drop policy if exists "post_likes_public_insert" on public.post_likes;

drop index if exists public.idx_post_likes_post_id;

drop table if exists public.post_likes;
