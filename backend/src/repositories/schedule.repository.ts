import { pool } from '../config/db.js';
import type { FacilitySchedule } from '../types/schedule.types.js';

export async function findByFacilityId(facilityId: number): Promise<FacilitySchedule[]> {
  const result = await pool.query<FacilitySchedule>(
    'SELECT * FROM facility_schedules WHERE facility_id = $1 ORDER BY day_of_week, open_time',
    [facilityId],
  );
  return result.rows;
}

export async function findByFacilityIdAndDay(
  facilityId: number,
  dayOfWeek: number,
): Promise<FacilitySchedule | null> {
  const result = await pool.query<FacilitySchedule>(
    'SELECT * FROM facility_schedules WHERE facility_id = $1 AND day_of_week = $2',
    [facilityId, dayOfWeek],
  );
  return result.rows[0] ?? null;
}

export async function upsert(
  facilityId: number,
  dayOfWeek: number,
  openTime: string,
  closeTime: string,
): Promise<FacilitySchedule> {
  const result = await pool.query<FacilitySchedule>(
    `INSERT INTO facility_schedules (facility_id, day_of_week, open_time, close_time)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (facility_id, day_of_week)
     DO UPDATE SET open_time = $3, close_time = $4
     RETURNING *`,
    [facilityId, dayOfWeek, openTime, closeTime],
  );
  return result.rows[0];
}

export async function deleteByFacilityId(facilityId: number): Promise<void> {
  await pool.query(
    'DELETE FROM facility_schedules WHERE facility_id = $1',
    [facilityId],
  );
}
