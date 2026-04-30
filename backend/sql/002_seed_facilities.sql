-- ============================================
-- Seed: Insert 3 facilities + schedules
-- Execute in Supabase SQL Editor
-- ============================================

-- Ensure we have an owner (use admin user id or first user)
-- We'll use owner_id = 1 (adjust if your admin user has a different id)

-- 1. Insert facilities (skip if they already exist)
INSERT INTO facilities (id, name, type, description, city, address, hourly_rate, is_active, owner_id)
VALUES
  (1, 'Boisko do piłki nożnej', 'football', 'Pełnowymiarowe boisko z sztuczną nawierzchnią przeznaczone do profesjonalnych treningów jak i do amatorskich rozgrywek', 'Kraków', 'ul. Sportowa 1', 150.00, true, 1),
  (2, 'Kort do tenisa', 'tennis', 'Pełnowymiarowy kort do tenisa z wysokiej jakości sztuczną nawierzchnią, przystosowany zarówno do profesjonalnych treningów, jak i rekreacyjnych rozgrywek amatorskich', 'Kraków', 'ul. Sportowa 2', 80.00, true, 1),
  (3, 'Sala do squasha', 'squash', 'Sala przeznaczona do gry w squasha w zamkniętej przestrzeni z czterema ścianami, umożliwiająca szybkie i dynamiczne zagrywki', 'Kraków', 'ul. Sportowa 3', 60.00, true, 1)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  description = EXCLUDED.description,
  hourly_rate = EXCLUDED.hourly_rate,
  is_active = EXCLUDED.is_active;

-- Reset sequence so next auto-id starts after 3
SELECT setval('facilities_id_seq', (SELECT MAX(id) FROM facilities));

-- 2. Insert schedules for facility 1 (Boisko) – Weekdays 9-21, Weekends 11-21
INSERT INTO facility_schedules (facility_id, day_of_week, open_time, close_time)
VALUES
  (1, 0, '09:00', '21:00'),  -- Monday
  (1, 1, '09:00', '21:00'),  -- Tuesday
  (1, 2, '09:00', '21:00'),  -- Wednesday
  (1, 3, '09:00', '21:00'),  -- Thursday
  (1, 4, '09:00', '21:00'),  -- Friday
  (1, 5, '11:00', '21:00'),  -- Saturday
  (1, 6, '11:00', '21:00')   -- Sunday
ON CONFLICT (facility_id, day_of_week) DO UPDATE SET
  open_time = EXCLUDED.open_time,
  close_time = EXCLUDED.close_time;

-- 3. Insert schedules for facility 2 (Kort) – Weekdays 8-22, Weekends 10-20
INSERT INTO facility_schedules (facility_id, day_of_week, open_time, close_time)
VALUES
  (2, 0, '08:00', '22:00'),
  (2, 1, '08:00', '22:00'),
  (2, 2, '08:00', '22:00'),
  (2, 3, '08:00', '22:00'),
  (2, 4, '08:00', '22:00'),
  (2, 5, '10:00', '20:00'),
  (2, 6, '10:00', '20:00')
ON CONFLICT (facility_id, day_of_week) DO UPDATE SET
  open_time = EXCLUDED.open_time,
  close_time = EXCLUDED.close_time;

-- 4. Insert schedules for facility 3 (Squash) – Weekdays 7-22, Weekends 9-21
INSERT INTO facility_schedules (facility_id, day_of_week, open_time, close_time)
VALUES
  (3, 0, '07:00', '22:00'),
  (3, 1, '07:00', '22:00'),
  (3, 2, '07:00', '22:00'),
  (3, 3, '07:00', '22:00'),
  (3, 4, '07:00', '22:00'),
  (3, 5, '09:00', '21:00'),
  (3, 6, '09:00', '21:00')
ON CONFLICT (facility_id, day_of_week) DO UPDATE SET
  open_time = EXCLUDED.open_time,
  close_time = EXCLUDED.close_time;
