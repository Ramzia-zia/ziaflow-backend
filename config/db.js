// config/db.js
// On utilise "pg" (node-postgres) pour se connecter a PostgreSQL (Supabase)
// au lieu de mysql2

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host:     process.env.DB_HOST,
    port:     process.env.DB_PORT || 5432,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    // Supabase necessite SSL en production
    ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false
});

module.exports = pool;