// server.js
// dotenv doit etre charge en premier
// En production sur Render, PORT est injecte automatiquement a 10000
// process.env.PORT prend toujours la priorite sur la valeur par defaut

require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const transactionRoutes = require('./routes/transactions');

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api/transactions', transactionRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'ZiaFlow API est en ligne' });
});

app.listen(PORT, () => {
    console.log(`Serveur ZiaFlow demarre sur le port ${PORT}`);
});


// Route de diagnostic temporaire
// A supprimer apres resolution du probleme
app.get('/debug', async (req, res) => {
    try {
        const db = require('./config/db');
        const result = await db.query('SELECT COUNT(*) FROM transactions');
        res.json({
            status: 'OK',
            count: result.rows[0].count,
            host: process.env.DB_HOST,
            db: process.env.DB_NAME
        });
    } catch (err) {
        res.json({
            status: 'ERREUR',
            message: err.message,
            host: process.env.DB_HOST
        });
    }
});