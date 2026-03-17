-- Update wedding config venue
UPDATE wedding_config SET
  venue_name = 'To Be Announced',
  venue_address = '',
  venue_map_url = '';

-- Clear venue details from all events
UPDATE wedding_events SET
  venue_name = '',
  venue_address = '',
  venue_map_url = '',
  how_to_reach = '',
  accommodation = '',
  distance_info = '';

-- Update event times to correct IST values (stored as UTC)
-- Haldi: 3:00 PM - 6:00 PM IST
UPDATE wedding_events SET
  start_time = '2026-12-12 09:30:00+00',
  end_time = '2026-12-12 12:30:00+00'
WHERE title = 'Haldi';

-- Engagement & Sangeet: 6:30 PM - 11:00 PM IST
UPDATE wedding_events SET
  start_time = '2026-12-12 13:00:00+00',
  end_time = '2026-12-12 17:30:00+00'
WHERE title = 'Engagement & Sangeet';

-- Wedding Ceremony: 5:30 AM - 9:00 AM IST
UPDATE wedding_events SET
  start_time = '2026-12-13 00:00:00+00',
  end_time = '2026-12-13 03:30:00+00'
WHERE title = 'Wedding Ceremony';

-- Vidai & Bashi Biye: 10:00 AM - 1:00 PM IST
UPDATE wedding_events SET
  start_time = '2026-12-14 04:30:00+00',
  end_time = '2026-12-14 07:30:00+00'
WHERE title = 'Vidai & Bashi Biye';

-- Wedding Reception: 6:00 PM - 11:00 PM IST
UPDATE wedding_events SET
  start_time = '2026-12-15 12:30:00+00',
  end_time = '2026-12-15 17:30:00+00'
WHERE title = 'Wedding Reception';

