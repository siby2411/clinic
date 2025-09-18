const express = require('express');
const router = express.Router();

// Exemple route GET pour tester
router.get('/', (req, res) => {
    res.send('Gestion des rendez-vous');
});

module.exports = router;
