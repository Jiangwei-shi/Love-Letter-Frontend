-- Display identity is author_role + couple_profile only.

ALTER TABLE public.posts DROP COLUMN IF EXISTS author;
