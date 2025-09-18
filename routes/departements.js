const express = require('express');
const router = express.Router();
const pool = require('../db');

// Ajouter département
router.post('/add', async (req,res)=>{
  const {nom, description} = req.body;
  const result = await pool.query(
    'INSERT INTO departements (nom, description) VALUES ($1,$2) RETURNING *',
    [nom, description]
  );
  await pool.query(
    'INSERT INTO audit_tracking (user_id, action_type, table_name, record_id, new_data) VALUES ($1,$2,$3,$4,$5)',
    [1, 'ajout departement', 'departements', result.rows[0].id, JSON.stringify(result.rows[0])]
  );
  res.json(result.rows[0]);
});

// Liste départements
router.get('/list', async (req,res)=>{
  const result = await pool.query('SELECT * FROM departements ORDER BY id DESC');
  res.json(result.rows);
});

// Supprimer
router.delete('/delete/:id', async (req,res)=>{
  const {id} = req.params;
  await pool.query('DELETE FROM departements WHERE id=$1',[id]);
  await pool.query(
    'INSERT INTO audit_tracking (user_id, action_type, table_name, record_id) VALUES ($1,$2,$3,$4)',
    [1,'suppression departement','departements',id]
  );
  res.json({message:'Supprimé'});
});

module.exports = router;
