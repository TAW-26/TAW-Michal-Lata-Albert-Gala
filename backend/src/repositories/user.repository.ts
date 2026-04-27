import { pool } from '../config/db.js';
import type { User } from '../types/user.types.js';

export async function findByEmail(email: string): Promise<User | null> {
  const result = await pool.query<User>(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0] ?? null;
}

export async function findById(id: number): Promise<User | null> {
  const result = await pool.query<User>('SELECT * FROM users WHERE id = $1', [
    id,
  ]);
  return result.rows[0] ?? null;
}

export async function findByActivationLink(
  token: string
): Promise<User | null> {
  const result = await pool.query<User>(
    'SELECT * FROM users WHERE activation_link = $1',
    [token]
  );
  return result.rows[0] ?? null;
}

export async function findByResetToken(token: string): Promise<User | null> {
  const result = await pool.query<User>(
    'SELECT * FROM users WHERE reset_token = $1',
    [token]
  );
  return result.rows[0] ?? null;
}

export async function create(
  firstName: string,
  lastName: string,
  email: string,
  passwordHash: string,
  activationLink: string,
  role: string = 'user'
): Promise<User> {
  const result = await pool.query<User>(
    `INSERT INTO users (first_name, last_name, email, password_hash, role, activation_link, is_activated)
     VALUES ($1, $2, $3, $4, $5, $6, false)
     RETURNING *`,
    [firstName, lastName, email, passwordHash, role, activationLink]
  );
  return result.rows[0];
}

export async function activateUser(id: number): Promise<void> {
  await pool.query(
    'UPDATE users SET is_activated = true, activation_link = null WHERE id = $1',
    [id]
  );
}

export async function setResetToken(id: number, token: string): Promise<void> {
  await pool.query('UPDATE users SET reset_token = $1 WHERE id = $2', [
    token,
    id,
  ]);
}

export async function resetPassword(
  id: number,
  passwordHash: string
): Promise<void> {
  await pool.query(
    'UPDATE users SET password_hash = $1, reset_token = null WHERE id = $2',
    [passwordHash, id]
  );
}

export async function updateProfile(
  id: number,
  data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatarUrl?: string;
  }
): Promise<User> {
  const fields: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  if (data.firstName !== undefined) {
    fields.push(`first_name = $${paramIndex++}`);
    values.push(data.firstName);
  }
  if (data.lastName !== undefined) {
    fields.push(`last_name = $${paramIndex++}`);
    values.push(data.lastName);
  }
  if (data.phone !== undefined) {
    fields.push(`phone = $${paramIndex++}`);
    values.push(data.phone);
  }
  if (data.avatarUrl !== undefined) {
    fields.push(`avatar_url = $${paramIndex++}`);
    values.push(data.avatarUrl);
  }

  if (fields.length === 0) {
    const user = await findById(id);
    if (!user) throw new Error('User not found');
    return user;
  }

  values.push(id);
  const result = await pool.query<User>(
    `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values
  );
  return result.rows[0];
}

export async function changePassword(
  id: number,
  passwordHash: string
): Promise<void> {
  await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [
    passwordHash,
    id,
  ]);
}

export async function deleteById(id: number): Promise<void> {
  await pool.query('DELETE FROM users WHERE id = $1', [id]);
}
