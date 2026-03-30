alter table public.profiles
  drop column if exists style_one_data,
  drop column if exists style_two_data,
  drop column if exists updated_at;

alter table public.posts
  drop column if exists happened_on;

alter table public.timeline_events
  drop column if exists description;
