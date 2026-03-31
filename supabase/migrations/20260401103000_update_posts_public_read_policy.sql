drop policy if exists posts_public_read on public.posts;

create policy posts_public_read on public.posts
for select
using ((auth.uid() is not null) or (locked = false));
