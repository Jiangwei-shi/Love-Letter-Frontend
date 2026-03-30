alter table public.posts
  add column if not exists author text;

update public.posts p
set author = coalesce(
  p.author,
  case
    when p.author_type = 'boy' then cp.boy_name
    when p.author_type = 'girl' then cp.girl_name
    else null
  end,
  '未设置'
)
from (
  select boy_name, girl_name
  from public.couple_profile
  order by created_at asc
  limit 1
) cp
where p.author is null;

alter table public.posts
  alter column author set default '未设置';

update public.posts
set author = '未设置'
where author is null;

alter table public.posts
  alter column author set not null;

alter table public.posts
  drop constraint if exists posts_author_type_check;

alter table public.posts
  drop column if exists author_type;

insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

drop policy if exists "post_images_bucket_public_read" on storage.objects;
create policy "post_images_bucket_public_read" on storage.objects
for select using (bucket_id = 'post-images');

drop policy if exists "post_images_bucket_auth_upload" on storage.objects;
create policy "post_images_bucket_auth_upload" on storage.objects
for insert to authenticated with check (bucket_id = 'post-images');

drop policy if exists "post_images_bucket_auth_update" on storage.objects;
create policy "post_images_bucket_auth_update" on storage.objects
for update to authenticated using (bucket_id = 'post-images');

drop policy if exists "post_images_bucket_auth_delete" on storage.objects;
create policy "post_images_bucket_auth_delete" on storage.objects
for delete to authenticated using (bucket_id = 'post-images');
