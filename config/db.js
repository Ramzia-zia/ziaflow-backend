// config/db.js
// Ce fichier gère la connexion à la base de données MySQL.
// On utilise un "pool" de connexions plutôt qu'une connexion unique
// car le pool gère plusieurs requêtes simultanées sans saturer MySQL.

const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host:     process.env.DB_HOST,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    // Nombre maximum de connexions simultanées dans le pool
    connectionLimit: 10
});

// On exporte la version "promise" du pool pour pouvoir utiliser
// async/await dans les controllers au lieu des callbacks
module.exports = pool.promise();