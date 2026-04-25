require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function migrate() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await client.query(sql);
    console.log('✅ Migration successful!');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
  } finally {
    await client.end();
  }
}

migrate();