-- ALTER TABLE "wedding_config" ALTER COLUMN "background_music_url" SET DATA TYPE jsonb;--> statement-breakpoint
-- ALTER TABLE "wedding_config" ALTER COLUMN "background_music_url" SET DEFAULT '[]'::jsonb;
-- 1. Drop default first
ALTER TABLE "wedding_config"
ALTER COLUMN "background_music_url" DROP DEFAULT;

-- 2. Convert column safely
ALTER TABLE "wedding_config"
ALTER COLUMN "background_music_url"
TYPE jsonb
USING CASE
  WHEN "background_music_url" = '' THEN '[]'::jsonb
  ELSE jsonb_build_array(
         jsonb_build_object(
           'name', '',
           'url', "background_music_url"
         )
       )
END;

-- 3. Set new default
ALTER TABLE "wedding_config"
ALTER COLUMN "background_music_url"
SET DEFAULT '[]'::jsonb;