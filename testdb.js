// testdb.js
// Fichier de test temporaire pour verifier la connexion Supabase
// A supprimer apres verification

require('dotenv').config();
const db = require('./config/db');

const test = async () => {
    try {
        const result = await db.query('SELECT COUNT(*) FROM transactions');
        console.log('Connexion OK - Nombre de transactions :', result.rows[0].count);
    } catch (err) {
        console.error('Erreur connexion :', err.message);
    } finally {
        process.exit();
    }
};

test();