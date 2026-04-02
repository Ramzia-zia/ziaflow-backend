// config/db.js
// En production sur Render, Supabase exige SSL obligatoirement.
// On force rejectUnauthorized a false pour eviter les erreurs de certificat.

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host:     process.env.DB_HOST,
    port:     process.env.DB_PORT || 5432,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    // SSL force en toutes circonstances pour Supabase
    ssl: { rejectUnauthorized: false }
});

module.exports = pool;