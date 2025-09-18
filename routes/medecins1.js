const express = require("express");
const router = express.Router();
const pool = require("../db");

// Ajouter un médecin
router.post("/add", async (req, res) => {
  try {
    const { nom, prenom, date_naissance, profession, diplome, sexe, telephone, user_id } = req.body;

    // Générer un code_medecin simple (ex: ME00001)
    const resultCode = await pool.query(`SELECT COUNT(*) FROM medecins`);
    const count = parseInt(resultCode.rows[0].count) + 1;
    const code_medecin = `ME${count.toString().padStart(5, "0")}`;

    const result = await pool.query(
      `INSERT INTO medecins (nom, prenom, date_naissance, profession, diplome, sexe, telephone, code_medecin, user_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [nom, prenom, date_naissance, profession, diplome, sexe, telephone, code_medecin, user_id]
    );

    res.json({ message: "Médecin ajouté avec succès !", medecin: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Liste des médecins
router.get("/list", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM medecins ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Modifier un médecin
router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, prenom, date_naissance, profession, diplome, sexe, telephone } = req.body;

    const result = await pool.query(
      `UPDATE medecins
       SET nom=$1, prenom=$2, date_naissance=$3, profession=$4, diplome=$5, sexe=$6, telephone=$7
       WHERE id=$8 RETURNING *`,
      [nom, prenom, date_naissance, profession, diplome, sexe, telephone, id]
    );

    res.json({ message: "Médecin mis à jour avec succès !", medecin: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Supprimer un médecin
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM medecins WHERE id=$1", [id]);
    res.json({ message: "Médecin supprimé avec succès !" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
