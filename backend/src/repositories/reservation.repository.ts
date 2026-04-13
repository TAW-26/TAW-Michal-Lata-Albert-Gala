import { pool } from '../config/db.js';
import type { Reservation, ReservationStatus, ReservationWithDetails } from '../types/reservation.types.js';

export async function findByUserId(userId: number): Promise<ReservationWithDetails[]> {
  const result = await pool.query<ReservationWithDetails>(
    `SELECT r.*, f.name AS facility_name, f.type AS facility_type
     FROM reservations r
     JOIN facilities f ON r.facility_id = f.id
     WHERE r.user_id = $1
     ORDER BY r.start_time DESC`,
    [userId],
  );
  return result.rows;
}

export async function findById(id: number): Promise<ReservationWithDetails | null> {
  const result = await pool.query<ReservationWithDetails>(
    `SELECT r.*, f.name AS facility_name, f.type AS facility_type,
            u.first_name AS user_first_name, u.last_name AS user_last_name, u.email AS user_email
     FROM reservations r
     JOIN facilities f ON r.facility_id = f.id
     JOIN users u ON r.user_id = u.id
     WHERE r.id = $1`,
    [id],
  );
  return result.rows[0] ?? null;
}

export async function findByFacilityId(facilityId: number): Promise<ReservationWithDetails[]> {
  const result = await pool.query<ReservationWithDetails>(
    `SELECT r.*, u.first_name AS user_first_name, u.last_name AS user_last_name, u.email AS user_email
     FROM reservations r
     JOIN users u ON r.user_id = u.id
     WHERE r.facility_id = $1
     ORDER BY r.start_time DESC`,
    [facilityId],
  );
  return result.rows;
}

export async function findConflicting(
  facilityId: number,
  startTime: Date,
  endTime: Date,
): Promise<Reservation[]> {
  const result = await pool.query<Reservation>(
    `SELECT * FROM reservations
     WHERE facility_id = $1
       AND status NOT IN ('cancelled')
       AND start_time < $3
       AND end_time > $2`,
    [facilityId, startTime, endTime],
  );
  return result.rows;
}

export async function findByFacilityIdAndDateRange(
  facilityId: number,
  start: Date,
  end: Date,
): Promise<Reservation[]> {
  const result = await pool.query<Reservation>(
    `SELECT * FROM reservations
     WHERE facility_id = $1
       AND status NOT IN ('cancelled')
       AND start_time >= $2
       AND end_time <= $3
     ORDER BY start_time`,
    [facilityId, start, end],
  );
  return result.rows;
}

export async function create(
  userId: number,
  facilityId: number,
  startTime: Date,
  endTime: Date,
  totalPrice: number,
): Promise<Reservation> {
  const result = await pool.query<Reservation>(
    `INSERT INTO reservations (user_id, facility_id, start_time, end_time, status, total_price)
     VALUES ($1, $2, $3, $4, 'confirmed', $5)
     RETURNING *`,
    [userId, facilityId, startTime, endTime, totalPrice],
  );
  return result.rows[0];
}

export async function updateStatus(id: number, status: ReservationStatus): Promise<Reservation> {
  const result = await pool.query<Reservation>(
    'UPDATE reservations SET status = $1 WHERE id = $2 RETURNING *',
    [status, id],
  );
  return result.rows[0];
}
