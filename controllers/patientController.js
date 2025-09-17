const pool = require("../db");

const getAllPatients = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM patients ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const addPatient = async (req, res) => {
  const { nom, date_naissance, profession, sexe, telephone, antecedents } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO patients (nom, date_naissance, profession, sexe, telephone, antecedents) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
      [nom, date_naissance, profession, sexe, telephone, antecedents]
    );
    res.json({ message: "Patient ajouté", patient: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const updatePatient = async (req, res) => {
  const { id } = req.params;
  const { nom, date_naissance, profession, sexe, telephone, antecedents } = req.body;
  try {
    const result = await pool.query(
      "UPDATE patients SET nom=$1, date_naissance=$2, profession=$3, sexe=$4, telephone=$5, antecedents=$6 WHERE id=$7 RETURNING *",
      [nom, date_naissance, profession, sexe, telephone, antecedents, id]
    );
    res.json({ message: "Patient mis à jour", patient: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const deletePatient = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM patients WHERE id=$1", [id]);
    res.json({ message: "Patient supprimé" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  getAllPatients,
  addPatient,
  updatePatient,
  deletePatient,
};
