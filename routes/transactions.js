// routes/transactions.js
// Ce fichier definit uniquement les URL et les methodes HTTP.
// La logique est dans le controller, pas ici.
// Principe : les routes sont le "menu", le controller est la "cuisine".

const express = require('express');
const router  = express.Router();
const {
    getAllTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getStatsByCategory,
    getStatsByMonth,
    getSolde
} = require('../controllers/transactionController');

// Routes CRUD
router.get('/',       getAllTransactions);
router.post('/',      addTransaction);
router.put('/:id',    updateTransaction);
router.delete('/:id', deleteTransaction);

// Routes statistiques et solde
// Ces routes doivent etre definies AVANT /:id
// sinon Express interpreterait "solde" comme un id
router.get('/solde',            getSolde);
router.get('/stats/categories', getStatsByCategory);
router.get('/stats/mois',       getStatsByMonth);

module.exports = router;