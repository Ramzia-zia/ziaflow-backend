// controllers/transactionController.js
// Ce fichier contient toute la logique metier.
// Chaque fonction correspond a une action precise sur les donnees.

const db = require('../config/db');

// Recuperer toutes les transactions
// Tri par date decroissante pour voir les plus recentes en premier
const getAllTransactions = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM transactions ORDER BY date DESC'
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

// Ajouter une nouvelle transaction
// Les donnees arrivent dans req.body (envoyees par le formulaire React)
const addTransaction = async (req, res) => {
    try {
        const { type, montant, categorie, date, description } = req.body;

        // Validation basique : ces champs sont obligatoires
        if (!type || !montant || !categorie || !date) {
            return res.status(400).json({ message: 'Champs obligatoires manquants' });
        }

        const [result] = await db.query(
            'INSERT INTO transactions (type, montant, categorie, date, description) VALUES (?, ?, ?, ?, ?)',
            [type, montant, categorie, date, description || null]
        );

        // On retourne l'id genere par MySQL pour que le frontend
        // puisse mettre a jour sa liste sans recharger toutes les donnees
        res.status(201).json({
            message: 'Transaction ajoutee avec succes',
            id: result.insertId
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

// Modifier une transaction existante
// L'id de la transaction a modifier est dans l'URL : /transactions/:id
const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { type, montant, categorie, date, description } = req.body;

        const [result] = await db.query(
            'UPDATE transactions SET type = ?, montant = ?, categorie = ?, date = ?, description = ? WHERE id = ?',
            [type, montant, categorie, date, description || null, id]
        );

        // affectedRows = 0 signifie qu'aucune ligne n'a ete trouvee avec cet id
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Transaction non trouvee' });
        }

        res.json({ message: 'Transaction modifiee avec succes' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

// Supprimer une transaction
const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            'DELETE FROM transactions WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Transaction non trouvee' });
        }

        res.json({ message: 'Transaction supprimee avec succes' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

// Statistiques : total des depenses par categorie
// GROUP BY regroupe les lignes par categorie
// SUM additionne les montants de chaque groupe
const getStatsByCategory = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT categorie, SUM(montant) AS total
            FROM transactions
            WHERE type = 'depense'
            GROUP BY categorie
            ORDER BY total DESC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

// Statistiques : depenses et revenus totaux par mois
// DATE_FORMAT formate la date en "2025-01" pour grouper par mois
const getStatsByMonth = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                DATE_FORMAT(date, '%Y-%m') AS mois,
                SUM(CASE WHEN type = 'depense' THEN montant ELSE 0 END) AS total_depenses,
                SUM(CASE WHEN type = 'revenu'  THEN montant ELSE 0 END) AS total_revenus
            FROM transactions
            GROUP BY mois
            ORDER BY mois ASC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

// Calcul du solde : total revenus - total depenses
const getSolde = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                SUM(CASE WHEN type = 'revenu'  THEN montant ELSE 0 END) AS total_revenus,
                SUM(CASE WHEN type = 'depense' THEN montant ELSE 0 END) AS total_depenses,
                SUM(CASE WHEN type = 'revenu'  THEN montant ELSE -montant END) AS solde
            FROM transactions
        `);
        res.json(rows[0]);
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