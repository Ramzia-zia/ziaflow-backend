// controllers/transactionController.js
// Adapte pour PostgreSQL (Supabase)
// Differences principales avec MySQL :
// - Les parametres utilisent $1, $2... au lieu de ?
// - DATE_FORMAT devient TO_CHAR
// - insertId devient rows[0].id

const db = require('../config/db');

const getAllTransactions = async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM transactions ORDER BY date DESC'
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

const addTransaction = async (req, res) => {
    try {
        const { type, montant, categorie, date, description } = req.body;

        if (!type || !montant || !categorie || !date) {
            return res.status(400).json({ message: 'Champs obligatoires manquants' });
        }

        // RETURNING id recupere l'id genere automatiquement
        const result = await db.query(
            'INSERT INTO transactions (type, montant, categorie, date, description) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [type, montant, categorie, date, description || null]
        );

        res.status(201).json({
            message: 'Transaction ajoutee avec succes',
            id: result.rows[0].id
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { type, montant, categorie, date, description } = req.body;

        const result = await db.query(
            'UPDATE transactions SET type=$1, montant=$2, categorie=$3, date=$4, description=$5 WHERE id=$6',
            [type, montant, categorie, date, description || null, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Transaction non trouvee' });
        }

        res.json({ message: 'Transaction modifiee avec succes' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            'DELETE FROM transactions WHERE id=$1',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Transaction non trouvee' });
        }

        res.json({ message: 'Transaction supprimee avec succes' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

const getStatsByCategory = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT categorie, SUM(montant) AS total
            FROM transactions
            WHERE type = 'depense'
            GROUP BY categorie
            ORDER BY total DESC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

const getStatsByMonth = async (req, res) => {
    try {
        // TO_CHAR est l'equivalent PostgreSQL de DATE_FORMAT en MySQL
        const result = await db.query(`
            SELECT
                TO_CHAR(date, 'YYYY-MM') AS mois,
                SUM(CASE WHEN type = 'depense' THEN montant ELSE 0 END) AS total_depenses,
                SUM(CASE WHEN type = 'revenu'  THEN montant ELSE 0 END) AS total_revenus
            FROM transactions
            GROUP BY mois
            ORDER BY mois ASC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

const getSolde = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT
                SUM(CASE WHEN type = 'revenu'  THEN montant ELSE 0 END) AS total_revenus,
                SUM(CASE WHEN type = 'depense' THEN montant ELSE 0 END) AS total_depenses,
                SUM(CASE WHEN type = 'revenu'  THEN montant ELSE -montant END) AS solde
            FROM transactions
        `);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

module.exports = {
    getAllTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getStatsByCategory,
    getStatsByMonth,
    getSolde
};