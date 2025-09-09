// utils/db.js
import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

// Hard fail if the URL is missing (prevents the "searchParams" error)
const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) {
  console.error('❌ Missing DATABASE_URL in .env (use the Transaction pooler URL from Supabase).');
  process.exit(1);
}

// (optional) pool tuning via env, with sensible defaults for a small app
const POOL_MAX = Number(process.env.PGPOOL_MAX ?? 10);          // max clients in pool
const POOL_IDLE = Number(process.env.PGPOOL_IDLE_MS ?? 30000);  // close idle clients after 30s
const POOL_CONN_TIMEOUT = Number(process.env.PGPOOL_CONN_TIMEOUT_MS ?? 10000); // 10s

// Log target host:port (password masked)
try {
  const masked = DB_URL.replace(/:\/\/.*@/, '://***@');
  const m = masked.match(/^.+@([^:/]+):(\d+)\//);
  console.log('DB target =>', m ? `${m[1]}:${m[2]}` : '(unparsed)');
} catch { /* noop */ }

// Create the pool (Supabase requires SSL)
const pool = new Pool({
  connectionString: DB_URL,
  ssl: { rejectUnauthorized: false },
  max: POOL_MAX,
  idleTimeoutMillis: POOL_IDLE,
  connectionTimeoutMillis: POOL_CONN_TIMEOUT,
});

// --- Helpers ---------------------------------------------------------------

// Simple query helper
export const query = (text, params) => pool.query(text, params);

// Run a function inside a transaction
export async function withTransaction(fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    try { await client.query('ROLLBACK'); } catch {}
    throw err;
  } finally {
    client.release();
  }
}

// Quick ping you can call if needed
export async function ping() {
  const { rows } = await pool.query('select now() as now');
  return rows[0].now;
}

// Startup check (prints a clear success/failure message)
(async () => {
  try {
    const now = await ping();
    console.log('✅ Connected to Supabase Postgres @', now);
  } catch (e) {
    console.error('❌ DB connection failed:\n', e?.stack || e?.message || e);
  }
})();

// Graceful shutdown
for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, async () => {
    try { await pool.end(); } catch {}
    process.exit(0);
  });
}

export default pool;
