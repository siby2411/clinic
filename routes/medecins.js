const express = require('express');
const router = express.Router();
const pool = require('../db');

// Ajouter médecin
router.post('/add', async (req, res) => {
  const { nom, prenom, date_naissance, profession, diplome, sexe, telephone, user_id } = req.body;
  const code_medecin = `MED${Date.now()}`;
  await pool.query(
    `INSERT INTO medecins (nom, prenom, date_naissance, profession, diplome, sexe, telephone, code_medecin, user_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
    [nom, prenom, date_naissance, profession, diplome, sexe, telephone, code_medecin, user_id]
  );
  res.json({ message: 'Médecin ajouté avec succès', code_medecin });
});

// Liste médecins
router.get('/list', async (req, res) => {
  const result = await pool.query('SELECT * FROM medecins ORDER BY id DESC');
  res.json(result.rows);
});

// Modifier médecin
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { nom, prenom, date_naissance, profession, diplome, sexe, telephone } = req.body;
  await pool.query(
    `UPDATE medecins SET nom=$1, prenom=$2, date_naissance=$3, profession=$4, diplome=$5, sexe=$6, telephone=$7 WHERE id=$8`,
    [nom, prenom, date_naissance, profession, diplome, sexe, telephone, id]
  );
  res.json({ message: 'Médecin modifié avec succès' });
});

// Supprimer médecin
router.delete('/delete/:id', async (req, res) => {
  await pool.query('DELETE FROM medecins WHERE id=$1', [req.params.id]);
  res.json({ message: 'Médecin supprimé avec succès' });
});

module.exports = router;

