import pg from 'pg';
import { env } from './env.js';

const { Pool } = pg;

const url = new URL(env.DATABASE_URL);

export const pool = new Pool({
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  host: url.hostname,
  port: parseInt(url.port, 10),
  database: url.pathname.slice(1),
});

pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err);
  process.exit(1);
});
