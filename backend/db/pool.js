require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

let pool;

if (process.env.DATABASE_URL) {
  // Real Postgres mode
  const useSsl = /sslmode=require/i.test(process.env.DATABASE_URL) ||
    process.env.PGSSL === 'true';
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: useSsl ? { rejectUnauthorized: false } : false,
  });

  pool.on('error', (err) => {
    console.error('Unexpected error on idle PG client', err);
  });

  console.log('[db] using real PostgreSQL via DATABASE_URL');
} else {
  // Demo mode: in-process Postgres via pg-mem so the app runs with no setup.
  // This satisfies the same `pool.query(...)` interface the rest of the
  // backend uses, so no service-layer code has to change.
  const { newDb } = require('pg-mem');
  const db = newDb({ autoCreateForeignKeyIndices: true });

  const schemaPath = path.join(__dirname, 'demo-schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  db.public.none(schemaSql);

  const { Pool: MemPool } = db.adapters.createPg();
  pool = new MemPool();

  console.warn(
    '[db] DATABASE_URL not set — using IN-MEMORY pg-mem database (demo mode).'
  );
  console.warn('[db]   Data will be lost when the server restarts.');
}

module.exports = pool;
