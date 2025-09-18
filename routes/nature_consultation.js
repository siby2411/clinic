const express = require('express');
const router = express.Router();
const pool = require('../db');

// Ajouter une nature de consultation
router.post('/add', async (req, res) => {
  try {
    const { nom, montant, description } = req.body;
    const result = await pool.query(
      'INSERT INTO nature_consultation (nom, montant, description) VALUES ($1,$2,$3) RETURNING *',
      [nom, montant, description]
    );

    // Audit tracking
    await pool.query(
      'INSERT INTO audit_tracking (user_id, action_type, table_name, record_id, new_data) VALUES ($1,$2,$3,$4,$5)',
      [1, 'ajout nature', 'nature_consultation', result.rows[0].id, JSON.stringify(result.rows[0])]
    );

    res.json({ message: 'Nature ajoutée avec succès', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de l\'ajout' });
  }
});

// Liste des natures
router.get('/list', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM nature_consultation ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération' });
  }
});

// Supprimer une nature
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM nature_consultation WHERE id=$1', [id]);
    
    // Audit tracking
    await pool.query(
      'INSERT INTO audit_tracking (user_id, action_type, table_name, record_id) VALUES ($1,$2,$3,$4)',
      [1, 'suppression nature', 'nature_consultation', id]
    );

    res.json({ message: 'Nature supprimée avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});

// Modifier une nature
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, montant, description } = req.body;

    const result = await pool.query(
      'UPDATE nature_consultation SET nom=$1, montant=$2, description=$3, updated_at=NOW() WHERE id=$4 RETURNING *',
      [nom, montant, description, id]
    );

    // Audit tracking
    await pool.query(
      'INSERT INTO audit_tracking (user_id, action_type, table_name, record_id, new_data) VALUES ($1,$2,$3,$4,$5)',
      [1, 'modification nature', 'nature_consultation', id, JSON.stringify(result.rows[0])]
    );

    res.json({ message: 'Nature modifiée avec succès', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la modification' });
  }
});

module.exports = router;
