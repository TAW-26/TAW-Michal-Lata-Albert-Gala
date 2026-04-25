import { pool } from '../config/db.js';
import type { Facility, FacilityQuery } from '../types/facility.types.js';

export async function findAll(filters: FacilityQuery): Promise<Facility[]> {
  const conditions: string[] = ['is_active = true'];
  const values: unknown[] = [];
  let paramIndex = 1;

  if (filters.city) {
    conditions.push(`LOWER(city) = LOWER($${paramIndex++})`);
    values.push(filters.city);
  }

  if (filters.type) {
    conditions.push(`LOWER(type) = LOWER($${paramIndex++})`);
    values.push(filters.type);
  }

  if (filters.maxPrice !== undefined) {
    conditions.push(`hourly_rate <= $${paramIndex++}`);
    values.push(filters.maxPrice);
  }

  if (filters.minPrice !== undefined) {
    conditions.push(`hourly_rate >= $${paramIndex++}`);
    values.push(filters.minPrice);
  }

  if (filters.search) {
    conditions.push(
      `(LOWER(name) LIKE $${paramIndex} OR LOWER(description) LIKE $${paramIndex})`
    );
    values.push(`%${filters.search.toLowerCase()}%`);
    paramIndex++;
  }

  const where =
    conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const result = await pool.query<Facility>(
    `SELECT * FROM facilities ${where} ORDER BY created_at DESC`,
    values
  );
  return result.rows;
}

export async function findById(id: number): Promise<Facility | null> {
  const result = await pool.query<Facility>(
    'SELECT * FROM facilities WHERE id = $1',
    [id]
  );
  return result.rows[0] ?? null;
}

export async function findByOwnerId(ownerId: number): Promise<Facility[]> {
  const result = await pool.query<Facility>(
    'SELECT * FROM facilities WHERE owner_id = $1 ORDER BY created_at DESC',
    [ownerId]
  );
  return result.rows;
}

export async function create(
  ownerId: number,
  data: {
    name: string;
    type: string;
    description?: string;
    city?: string;
    address?: string;
    hourlyRate: number;
  }
): Promise<Facility> {
  const result = await pool.query<Facility>(
    `INSERT INTO facilities (owner_id, name, type, description, city, address, hourly_rate, is_active)
     VALUES ($1, $2, $3, $4, $5, $6, $7, true)
     RETURNING *`,
    [
      ownerId,
      data.name,
      data.type,
      data.description ?? null,
      data.city ?? null,
      data.address ?? null,
      data.hourlyRate,
    ]
  );
  return result.rows[0];
}

export async function update(
  id: number,
  data: {
    name?: string;
    type?: string;
    description?: string;
    city?: string;
    address?: string;
    hourlyRate?: number;
    isActive?: boolean;
  }
): Promise<Facility> {
  const fields: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  if (data.name !== undefined) {
    fields.push(`name = $${paramIndex++}`);
    values.push(data.name);
  }
  if (data.type !== undefined) {
    fields.push(`type = $${paramIndex++}`);
    values.push(data.type);
  }
  if (data.description !== undefined) {
    fields.push(`description = $${paramIndex++}`);
    values.push(data.description);
  }
  if (data.city !== undefined) {
    fields.push(`city = $${paramIndex++}`);
    values.push(data.city);
  }
  if (data.address !== undefined) {
    fields.push(`address = $${paramIndex++}`);
    values.push(data.address);
  }
  if (data.hourlyRate !== undefined) {
    fields.push(`hourly_rate = $${paramIndex++}`);
    values.push(data.hourlyRate);
  }
  if (data.isActive !== undefined) {
    fields.push(`is_active = $${paramIndex++}`);
    values.push(data.isActive);
  }

  if (fields.length === 0) {
    const facility = await findById(id);
    if (!facility) throw new Error('Facility not found');
    return facility;
  }

  values.push(id);
  const result = await pool.query<Facility>(
    `UPDATE facilities SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values
  );
  return result.rows[0];
}

export async function remove(id: number): Promise<void> {
  await pool.query('UPDATE facilities SET is_active = false WHERE id = $1', [
    id,
  ]);
}
