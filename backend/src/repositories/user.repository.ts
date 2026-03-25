import { pool } from '../config/db.js';
import type { User } from '../types/user.types.js';

export async function findByEmail(email: string): Promise<User | null> {
  const result = await pool.query<User>(
    'SELECT * FROM users WHERE email = $1',
    [email],
  );
  return result.rows[0] ?? null;
}

export async function findById(id: number): Promise<User | null> {
  const result = await pool.query<User>(
    'SELECT * FROM users WHERE id = $1',
    [id],
  );
  return result.rows[0] ?? null;
}

export async function findByActivationLink(token: string): Promise<User | null> {
  const result = await pool.query<User>(
    'SELECT * FROM users WHERE activation_link = $1',
    [token],
  );
  return result.rows[0] ?? null;
}

export async function create(
  firstName: string,
  lastName: string,
  email: string,
  passwordHash: string,
  activationLink: string,
  role: string = 'user',
): Promise<User> {
  const result = await pool.query<User>(
    `INSERT INTO users (first_name, last_name, email, password_hash, role, activation_link, is_activated)
     VALUES ($1, $2, $3, $4, $5, $6, false)
     RETURNING *`,
    [firstName, lastName, email, passwordHash, role, activationLink],
  );
  return result.rows[0];
}

export async function activateUser(id: number): Promise<void> {
  await pool.query(
    'UPDATE users SET is_activated = true, activation_link = null WHERE id = $1',
    [id],
  );
}
