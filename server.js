// server.js
// Point d'entree de l'application backend.
// C'est ce fichier que Node.js execute en premier.

// server.js
const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const transactionRoutes = require('./routes/transactions');

const app  = express();
const PORT = process.env.PORT || 5000;

// En production, Render injecte automatiquement le PORT
// On autorise toutes les origines pour que Vercel puisse appeler Render
app.use(cors({
    origin: '*'
}));

app.use(express.json());

app.use('/api/transactions', transactionRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'ZiaFlow API est en ligne' });
});

app.listen(PORT, () => {
    console.log(`Serveur ZiaFlow demarre sur le port ${PORT}`);
});
