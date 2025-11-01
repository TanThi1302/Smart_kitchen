const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
<<<<<<< HEAD
<<<<<<< HEAD
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.on('connect', () => {
  console.log(' Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error(' Database connection error:', err);
});

module.exports = pool;
=======
=======
>>>>>>> 675b4aab2c42009b23c0b163ad6af8de73116818
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
<<<<<<< HEAD
>>>>>>> product-admin
=======

>>>>>>> 675b4aab2c42009b23c0b163ad6af8de73116818
