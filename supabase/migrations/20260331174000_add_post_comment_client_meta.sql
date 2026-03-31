alter table public.post_comments
  add column if not exists ip_address inet,
  add column if not exists source text,
  add column if not exists user_agent text;
