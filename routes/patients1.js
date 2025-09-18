const express = require('express');
const router = express.Router();
const pool = require('../db');

// ➕ Ajouter patient
router.post('/add', async (req, res) => {
  try {
    const { name, dob, profession, sexe, telephone, user_id } = req.body;
    const code_patient = `PAT${Date.now()}`;
    await pool.query(
      `INSERT INTO patients (name, dob, profession, sexe, telephone, code_patient, user_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [name, dob, profession, sexe, telephone, code_patient, user_id]
    );
    res.json({ message: 'Patient ajouté avec succès', code_patient });
  } catch (err) {
    console.error("Erreur insertion patient:", err);
    res.status(500).json({ error: "Erreur lors de l'ajout du patient" });
  }
});

// 📋 Liste patients
router.get('/list', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM patients ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Erreur récupération patients" });
  }
});

// ✏️ Modifier patient
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, dob, profession, sexe, telephone } = req.body;
    await pool.query(
      `UPDATE patients SET name=$1, dob=$2, profession=$3, sexe=$4, telephone=$5, updated_at=NOW() WHERE id=$6`,
      [name, dob, profession, sexe, telephone, id]
    );
    res.json({ message: 'Patient modifié avec succès' });
  } catch (err) {
    res.status(500).json({ error: "Erreur mise à jour patient" });
  }
});

// ❌ Supprimer patient
router.delete('/delete/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM patients WHERE id=$1', [req.params.id]);
    res.json({ message: 'Patient supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ error: "Erreur suppression patient" });
  }
});

module.exports = router;
