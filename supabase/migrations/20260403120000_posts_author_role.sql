-- Author display: use author_role (boy | girl); name and avatar resolved from couple_profile in the app.
-- Legacy column posts.author is optional historical text; no longer used for public UI.

CREATE TYPE public.post_author_role AS ENUM ('boy', 'girl');

ALTER TABLE public.posts
  ADD COLUMN author_role public.post_author_role;

-- Backfill from sole couple_profile row: match trimmed author to boy_name / girl_name; default boy.
WITH cp AS (
  SELECT boy_name, girl_name
  FROM public.couple_profile
  LIMIT 1
)
UPDATE public.posts p
SET author_role = CASE
  WHEN EXISTS (
    SELECT 1 FROM cp
    WHERE TRIM(COALESCE(p.author, '')) = TRIM(COALESCE(cp.boy_name, ''))
      AND TRIM(COALESCE(cp.boy_name, '')) <> ''
  )
    THEN 'boy'::public.post_author_role
  WHEN EXISTS (
    SELECT 1 FROM cp
    WHERE TRIM(COALESCE(p.author, '')) = TRIM(COALESCE(cp.girl_name, ''))
      AND TRIM(COALESCE(cp.girl_name, '')) <> ''
  )
    THEN 'girl'::public.post_author_role
  ELSE 'boy'::public.post_author_role
END;

ALTER TABLE public.posts
  ALTER COLUMN author_role SET NOT NULL;

ALTER TABLE public.posts
  ALTER COLUMN author DROP NOT NULL;

ALTER TABLE public.posts
  ALTER COLUMN author DROP DEFAULT;

COMMENT ON COLUMN public.posts.author IS 'Legacy snapshot; UI uses author_role + couple_profile.';
COMMENT ON COLUMN public.posts.author_role IS 'boy or girl; display name and avatar from couple_profile.';
