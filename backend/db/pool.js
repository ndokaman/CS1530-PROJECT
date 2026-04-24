require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PG client', err);
});

console.log('pool type:', typeof pool, 'has query:', typeof pool.query);

module.exports = pool;