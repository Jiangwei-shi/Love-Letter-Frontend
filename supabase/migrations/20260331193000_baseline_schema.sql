


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE OR REPLACE FUNCTION "public"."enforce_post_images_limit"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
declare
  c int;
begin
  select count(*) into c from public.post_images where post_id = new.post_id;
  if c >= 9 then
    raise exception '每条生活记录最多9张图片';
  end if;
  return new;
end;
$$;


ALTER FUNCTION "public"."enforce_post_images_limit"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."increment_post_like_count"("p_post_id" "uuid") RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
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


ALTER FUNCTION "public"."increment_post_like_count"("p_post_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."set_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."timeline_events_fill_created_by"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  if new.created_by is null then
    new.created_by = auth.uid();
  end if;
  return new;
end;
$$;


ALTER FUNCTION "public"."timeline_events_fill_created_by"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."couple_profile" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "boy_name" "text",
    "boy_avatar" "text",
    "girl_name" "text",
    "girl_avatar" "text",
    "anniversary_date" "date",
    "about_text" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "boy_message_for_girl" "text",
    "girl_message_for_boy" "text"
);


ALTER TABLE "public"."couple_profile" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."post_comments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "post_id" "uuid" NOT NULL,
    "visitor_name" "text" NOT NULL,
    "message" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "ip_address" "inet",
    "user_agent" "text"
);


ALTER TABLE "public"."post_comments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."post_images" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "post_id" "uuid" NOT NULL,
    "image_url" "text" NOT NULL,
    "sort_order" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."post_images" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."posts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "content" "text" NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "record_time" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "author" "text" DEFAULT '未设置'::"text" NOT NULL,
    "like_count" integer DEFAULT 0 NOT NULL,
    CONSTRAINT "posts_content_len_check" CHECK (("char_length"("content") <= 200))
);


ALTER TABLE "public"."posts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."timeline_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "event_date" "date" NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "boy_message" "text",
    "girl_message" "text",
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."timeline_events" OWNER TO "postgres";


ALTER TABLE ONLY "public"."couple_profile"
    ADD CONSTRAINT "couple_profile_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."post_comments"
    ADD CONSTRAINT "post_comments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."post_images"
    ADD CONSTRAINT "post_images_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."timeline_events"
    ADD CONSTRAINT "timeline_events_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_post_comments_post_id" ON "public"."post_comments" USING "btree" ("post_id");



CREATE INDEX "idx_post_images_post_id" ON "public"."post_images" USING "btree" ("post_id");



CREATE INDEX "idx_posts_record_time" ON "public"."posts" USING "btree" ("record_time" DESC);



CREATE INDEX "idx_timeline_event_date" ON "public"."timeline_events" USING "btree" ("event_date");



CREATE OR REPLACE TRIGGER "trg_couple_profile_updated_at" BEFORE UPDATE ON "public"."couple_profile" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_enforce_post_images_limit" BEFORE INSERT ON "public"."post_images" FOR EACH ROW EXECUTE FUNCTION "public"."enforce_post_images_limit"();



CREATE OR REPLACE TRIGGER "trg_posts_updated_at" BEFORE UPDATE ON "public"."posts" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_timeline_events_fill_created_by" BEFORE INSERT ON "public"."timeline_events" FOR EACH ROW EXECUTE FUNCTION "public"."timeline_events_fill_created_by"();



CREATE OR REPLACE TRIGGER "trg_timeline_updated_at" BEFORE UPDATE ON "public"."timeline_events" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



ALTER TABLE ONLY "public"."post_comments"
    ADD CONSTRAINT "post_comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."post_images"
    ADD CONSTRAINT "post_images_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."timeline_events"
    ADD CONSTRAINT "timeline_events_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE "public"."couple_profile" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "couple_profile_auth_write" ON "public"."couple_profile" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "couple_profile_public_read" ON "public"."couple_profile" FOR SELECT USING (true);



ALTER TABLE "public"."post_comments" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "post_comments_auth_delete" ON "public"."post_comments" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "post_comments_public_insert" ON "public"."post_comments" FOR INSERT WITH CHECK (true);



CREATE POLICY "post_comments_public_read" ON "public"."post_comments" FOR SELECT USING (true);



ALTER TABLE "public"."post_images" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "post_images_auth_write" ON "public"."post_images" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "post_images_public_read" ON "public"."post_images" FOR SELECT USING (true);



CREATE POLICY "post_images_write_by_post_owner" ON "public"."post_images" USING ((EXISTS ( SELECT 1
   FROM "public"."posts" "p"
  WHERE (("p"."id" = "post_images"."post_id") AND ("p"."created_by" = "auth"."uid"()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."posts" "p"
  WHERE (("p"."id" = "post_images"."post_id") AND ("p"."created_by" = "auth"."uid"())))));



ALTER TABLE "public"."posts" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "posts_auth_write" ON "public"."posts" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "posts_owner_write" ON "public"."posts" USING (("auth"."uid"() = "created_by")) WITH CHECK (("auth"."uid"() = "created_by"));



CREATE POLICY "posts_public_read" ON "public"."posts" FOR SELECT USING (true);



CREATE POLICY "timeline_auth_write" ON "public"."timeline_events" TO "authenticated" USING (true) WITH CHECK (true);



ALTER TABLE "public"."timeline_events" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "timeline_owner_write" ON "public"."timeline_events" USING (("auth"."uid"() = "created_by")) WITH CHECK (("auth"."uid"() = "created_by"));



CREATE POLICY "timeline_public_read" ON "public"."timeline_events" FOR SELECT USING (true);



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."enforce_post_images_limit"() TO "anon";
GRANT ALL ON FUNCTION "public"."enforce_post_images_limit"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."enforce_post_images_limit"() TO "service_role";



GRANT ALL ON FUNCTION "public"."increment_post_like_count"("p_post_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."increment_post_like_count"("p_post_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment_post_like_count"("p_post_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."timeline_events_fill_created_by"() TO "anon";
GRANT ALL ON FUNCTION "public"."timeline_events_fill_created_by"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."timeline_events_fill_created_by"() TO "service_role";



GRANT ALL ON TABLE "public"."couple_profile" TO "anon";
GRANT ALL ON TABLE "public"."couple_profile" TO "authenticated";
GRANT ALL ON TABLE "public"."couple_profile" TO "service_role";



GRANT ALL ON TABLE "public"."post_comments" TO "anon";
GRANT ALL ON TABLE "public"."post_comments" TO "authenticated";
GRANT ALL ON TABLE "public"."post_comments" TO "service_role";



GRANT ALL ON TABLE "public"."post_images" TO "anon";
GRANT ALL ON TABLE "public"."post_images" TO "authenticated";
GRANT ALL ON TABLE "public"."post_images" TO "service_role";



GRANT ALL ON TABLE "public"."posts" TO "anon";
GRANT ALL ON TABLE "public"."posts" TO "authenticated";
GRANT ALL ON TABLE "public"."posts" TO "service_role";



GRANT ALL ON TABLE "public"."timeline_events" TO "anon";
GRANT ALL ON TABLE "public"."timeline_events" TO "authenticated";
GRANT ALL ON TABLE "public"."timeline_events" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";







