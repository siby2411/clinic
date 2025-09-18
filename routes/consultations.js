const express = require('express');
const router = express.Router();
const pool = require('../db');

// Ajouter une consultation
router.post('/add', async (req, res) => {
  try {
    const { medecin_id, patient_id, date_consultation, heure, motif, notes, statut } = req.body;

    const medecin = await pool.query('SELECT code_medecin FROM medecins WHERE id=$1', [medecin_id]);
    const patient = await pool.query('SELECT code_patient FROM patients WHERE id=$1', [patient_id]);

    const code_medecin_instance = medecin.rows[0]?.code_medecin || 'en instance';
    const code_patient_instance = patient.rows[0]?.code_patient || 'en instance';

    await pool.query(
      `INSERT INTO consultations (medecin_id, patient_id, date_consultation, heure, motif, notes, statut, code_medecin_instance, code_patient_instance)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [medecin_id, patient_id, date_consultation, heure, motif, notes, statut || 'en instance', code_medecin_instance, code_patient_instance]
    );

    res.json({ message: 'Consultation ajoutée avec succès' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erreur lors de l\'ajout de la consultation' });
  }
});

// Liste des consultations
router.get('/list', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, m.nom AS medecin_nom, m.prenom AS medecin_prenom,
             p.name AS patient_name
      FROM consultations c
      LEFT JOIN medecins m ON c.medecin_id = m.id
      LEFT JOIN patients p ON c.patient_id = p.id
      ORDER BY c.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erreur lors de la récupération des consultations' });
  }
});

// Modifier une consultation
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { medecin_id, patient_id, date_consultation, heure, motif, notes, statut } = req.body;

    const medecin = await pool.query('SELECT code_medecin FROM medecins WHERE id=$1', [medecin_id]);
    const patient = await pool.query('SELECT code_patient FROM patients WHERE id=$1', [patient_id]);

    const code_medecin_instance = medecin.rows[0]?.code_medecin || 'en instance';
    const code_patient_instance = patient.rows[0]?.code_patient || 'en instance';

    await pool.query(
      `UPDATE consultations SET medecin_id=$1, patient_id=$2, date_consultation=$3, heure=$4,
       motif=$5, notes=$6, statut=$7, code_medecin_instance=$8, code_patient_instance=$9
       WHERE id=$10`,
      [medecin_id, patient_id, date_consultation, heure, motif, notes, statut, code_medecin_instance, code_patient_instance, id]
    );

    res.json({ message: 'Consultation modifiée avec succès' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erreur lors de la modification de la consultation' });
  }
});

// Supprimer une consultation
router.delete('/delete/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM consultations WHERE id=$1', [req.params.id]);
    res.json({ message: 'Consultation supprimée avec succès' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erreur lors de la suppression de la consultation' });
  }
});

module.exports = router;
