const express = require('express');
const router = express.Router();
const pool = require('../db');

// Ajouter un examen
router.post('/add', async (req, res) => {
  try {
    const { patient_id, medecin_id, type_examen, resultat, date_examen, statut } = req.body;

    // Vérifier les champs obligatoires
    if (!patient_id || !medecin_id || !type_examen || !date_examen) {
      return res.status(400).json({ error: 'Champs obligatoires manquants' });
    }

    const code_patient = await pool.query(
      'SELECT code_patient FROM patients WHERE id=$1', [patient_id]
    );
    const code_medecin = await pool.query(
      'SELECT code_medecin FROM medecins WHERE id=$1', [medecin_id]
    );

    const result = await pool.query(
      `INSERT INTO examens 
       (patient_id, medecin_id, code_patient, code_medecin, type_examen, resultat, date_examen, statut, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW(),NOW())
       RETURNING *`,
      [
        patient_id,
        medecin_id,
        code_patient.rows[0].code_patient,
        code_medecin.rows[0].code_medecin,
        type_examen,
        resultat || '',
        date_examen,
        statut || 'en attente'
      ]
    );

    res.json({ message: 'Examen ajouté avec succès', examen: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'examen' });
  }
});

// Liste des examens
router.get('/list', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.*, p.name AS patient_name, m.nom || ' ' || m.prenom AS medecin_name
       FROM examens e
       JOIN patients p ON e.patient_id = p.id
       JOIN medecins m ON e.medecin_id = m.id
       ORDER BY e.id DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erreur lors de la récupération des examens' });
  }
});

// Modifier un examen
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { patient_id, medecin_id, type_examen, resultat, date_examen, statut } = req.body;

    // Récupérer les codes patient et médecin
    const code_patient = await pool.query(
      'SELECT code_patient FROM patients WHERE id=$1', [patient_id]
    );
    const code_medecin = await pool.query(
      'SELECT code_medecin FROM medecins WHERE id=$1', [medecin_id]
    );

    await pool.query(
      `UPDATE examens SET
        patient_id=$1,
        medecin_id=$2,
        code_patient=$3,
        code_medecin=$4,
        type_examen=$5,
        resultat=$6,
        date_examen=$7,
        statut=$8,
        updated_at=NOW()
       WHERE id=$9`,
      [
        patient_id,
        medecin_id,
        code_patient.rows[0].code_patient,
        code_medecin.rows[0].code_medecin,
        type_examen,
        resultat || '',
        date_examen,
        statut || 'en attente',
        id
      ]
    );

    res.json({ message: 'Examen modifié avec succès' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erreur lors de la modification de l\'examen' });
  }
});

// Supprimer un examen
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM examens WHERE id=$1', [id]);
    res.json({ message: 'Examen supprimé avec succès' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'examen' });
  }
});

module.exports = router;
