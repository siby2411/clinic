// routes/medecins.js
const express = require('express');
const router = express.Router();
const pool = require('../db'); // ta connexion PostgreSQL

router.post('/add', async (req, res) => {
    try {
        const { user_id, nom, prenom, date_naissance, profession, diplome, sexe, telephone } = req.body;

        // Vérifie que tous les champs obligatoires sont présents
        if (!user_id || !nom || !prenom) {
            return res.status(400).json({ message: "user_id, nom et prenom sont requis" });
        }

        const result = await pool.query(
            `INSERT INTO medecins (user_id, nom, prenom, date_naissance, profession, diplome, sexe, telephone)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [user_id, nom, prenom, date_naissance, profession, diplome, sexe, telephone]
        );

        res.json({ message: "Médecin ajouté", medecin: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

module.exports = router;
