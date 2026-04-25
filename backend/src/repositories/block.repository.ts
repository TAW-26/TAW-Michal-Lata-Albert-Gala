import { pool } from '../config/db.js';
import type { FacilityBlock } from '../types/schedule.types.js';

export async function findByFacilityIdAndDateRange(
  facilityId: number,
  start: Date,
  end: Date
): Promise<FacilityBlock[]> {
  const result = await pool.query<FacilityBlock>(
    `SELECT * FROM facility_blocks
     WHERE facility_id = $1
       AND start_time < $3
       AND end_time > $2
     ORDER BY start_time`,
    [facilityId, start, end]
  );
  return result.rows;
}

export async function create(
  facilityId: number,
  startTime: Date,
  endTime: Date,
  reason?: string
): Promise<FacilityBlock> {
  const result = await pool.query<FacilityBlock>(
    `INSERT INTO facility_blocks (facility_id, start_time, end_time, reason)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [facilityId, startTime, endTime, reason ?? null]
  );
  return result.rows[0];
}

export async function remove(id: number): Promise<void> {
  await pool.query('DELETE FROM facility_blocks WHERE id = $1', [id]);
}
