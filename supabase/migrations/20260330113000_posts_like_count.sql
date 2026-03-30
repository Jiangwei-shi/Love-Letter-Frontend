alter table public.posts
  add column if not exists like_count int not null default 0;

update public.posts p
set like_count = s.cnt
from (
  select post_id, count(*)::int as cnt
  from public.post_likes
  group by post_id
) s
where p.id = s.post_id;

create or replace function public.increment_post_like_count(p_post_id uuid)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  next_count int;
begin
  update public.posts
  set like_count = like_count + 1
  where id = p_post_id
  returning like_count into next_count;

  return coalesce(next_count, 0);
end;
$$;

grant execute on function public.increment_post_like_count(uuid) to anon, authenticated;
