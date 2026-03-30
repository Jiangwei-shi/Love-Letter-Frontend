alter table public.profiles
  add column if not exists intro text,
  add column if not exists hero_image_url text;

create index if not exists idx_profiles_anniversary_date
  on public.profiles (anniversary_date);

