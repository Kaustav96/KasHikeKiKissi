-- ===================================================================
-- CLEANUP BASE64 AUDIO DATA FROM DATABASE
-- ===================================================================
-- This will clear all the large base64 audio strings that are
-- causing browser crashes and replace them with empty arrays.
-- After running this, add proper URL-based links through admin UI.
-- ===================================================================

-- Clear all music URLs (sets them to empty arrays)
UPDATE wedding_config
SET
  background_music_url = '[]'::jsonb,
  groom_music_urls = '[]'::jsonb,
  bride_music_urls = '[]'::jsonb,
  updated_at = NOW();

-- Verify the cleanup (should show empty arrays)
SELECT
  id,
  background_music_url,
  groom_music_urls,
  bride_music_urls,
  pg_column_size(background_music_url) as bg_size_bytes,
  pg_column_size(groom_music_urls) as groom_size_bytes,
  pg_column_size(bride_music_urls) as bride_size_bytes
FROM wedding_config;

-- ===================================================================
-- EXPECTED OUTPUT AFTER CLEANUP:
-- All music fields should show: []
-- All size fields should show: ~4-10 bytes (not 50MB+)
-- ===================================================================

-- ===================================================================
-- NEXT STEPS:
-- 1. Upload your audio to Cloudinary (https://cloudinary.com/users/register/free)
-- 2. Get the direct URL (e.g., https://res.cloudinary.com/xxx/audio.mp3)
-- 3. Add it through Admin Dashboard Config tab
-- 4. Recommended: Convert to MP3 128kbps, 3-5MB max
-- ===================================================================
