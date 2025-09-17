const pool = require("../db");

// Récupérer tous les médecins
const getAllMedecins = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM medecins ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Ajouter un médecin
const addMedecin = async (req, res) => {
  const { nom, date_naissance, profession, diplome, sexe, telephone } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO medecins (nom, date_naissance, profession, diplome, sexe, telephone) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
      [nom, date_naissance, profession, diplome, sexe, telephone]
    );
    res.json({ message: "Médecin ajouté", medecin: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Mettre à jour un médecin
const updateMedecin = async (req, res) => {
  const { id } = req.params;
  const { nom, date_naissance, profession, diplome, sexe, telephone } = req.body;
  try {
    const result = await pool.query(
      "UPDATE medecins SET nom=$1, date_naissance=$2, profession=$3, diplome=$4, sexe=$5, telephone=$6 WHERE id=$7 RETURNING *",
      [nom, date_naissance, profession, diplome, sexe, telephone, id]
    );
    res.json({ message: "Médecin mis à jour", medecin: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Supprimer un médecin
const deleteMedecin = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM medecins WHERE id=$1", [id]);
    res.json({ message: "Médecin supprimé" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  getAllMedecins,
  addMedecin,
  updateMedecin,
  deleteMedecin,
};
