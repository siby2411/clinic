// controllers/patientsController.js
const pool = require("../db"); // connexion PostgreSQL

// Récupérer tous les patients
exports.getAllPatients = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM patients ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Créer un patient
exports.createPatient = async (req, res) => {
  const { nom, prenom, date_naissance, profession, sexe, telephone, antecedents } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO patients (nom, prenom, date_naissance, profession, sexe, telephone, antecedents)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [nom, prenom, date_naissance, profession, sexe, telephone, antecedents]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur insertion patient" });
  }
};

// Mettre à jour un patient
exports.updatePatient = async (req, res) => {
  const { id } = req.params;
  const { nom, prenom, date_naissance, profession, sexe, telephone, antecedents } = req.body;
  try {
    const result = await pool.query(
      `UPDATE patients 
       SET nom=$1, prenom=$2, date_naissance=$3, profession=$4, sexe=$5, telephone=$6, antecedents=$7
       WHERE id=$8 RETURNING *`,
      [nom, prenom, date_naissance, profession, sexe, telephone, antecedents, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur mise à jour patient" });
  }
};

// Supprimer un patient
exports.deletePatient = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM patients WHERE id=$1", [id]);
    res.json({ message: "Patient supprimé avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur suppression patient" });
  }
};
