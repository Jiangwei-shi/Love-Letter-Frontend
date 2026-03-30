alter table public.couple_profile
  add column if not exists boy_message_for_girl text,
  add column if not exists girl_message_for_boy text;

update public.couple_profile
set
  boy_message_for_girl = coalesce(boy_message_for_girl, love_message),
  girl_message_for_boy = coalesce(girl_message_for_boy, love_message)
where love_message is not null;

alter table public.couple_profile
  drop column if exists love_message;

insert into storage.buckets (id, name, public)
values ('couple-avatars', 'couple-avatars', true)
on conflict (id) do nothing;

drop policy if exists "couple_avatars_public_read" on storage.objects;
create policy "couple_avatars_public_read" on storage.objects
for select using (bucket_id = 'couple-avatars');

drop policy if exists "couple_avatars_auth_upload" on storage.objects;
create policy "couple_avatars_auth_upload" on storage.objects
for insert to authenticated with check (bucket_id = 'couple-avatars');

drop policy if exists "couple_avatars_auth_update" on storage.objects;
create policy "couple_avatars_auth_update" on storage.objects
for update to authenticated using (bucket_id = 'couple-avatars');

drop policy if exists "couple_avatars_auth_delete" on storage.objects;
create policy "couple_avatars_auth_delete" on storage.objects
for delete to authenticated using (bucket_id = 'couple-avatars');
