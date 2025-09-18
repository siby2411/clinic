const express = require("express");
const router = express.Router();
const pool = require("../db");

// Ajouter un rendez-vous
router.post("/add", async (req, res) => {
  try {
    const { patient_id, doctor_id, date_time, status } = req.body;
    await pool.query(
      `INSERT INTO appointments (patient_id, doctor_id, date_time, status)
       VALUES ($1,$2,$3,$4)`,
      [patient_id, doctor_id, date_time, status]
    );
    res.json({ message: "Rendez-vous ajouté avec succès" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Erreur lors de l'ajout" });
  }
});

// Liste des rendez-vous avec codes
router.get("/list", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.id, a.date_time, a.status,
             p.code_patient, p.name,
             m.code_medecin, m.nom, m.prenom
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN medecins m ON a.doctor_id = m.id
      ORDER BY a.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Erreur lors de la récupération" });
  }
});

// Modifier statut d’un rendez-vous
router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await pool.query(
      `UPDATE appointments SET status=$1 WHERE id=$2`,
      [status, id]
    );
    res.json({ message: "Rendez-vous mis à jour" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Erreur lors de la mise à jour" });
  }
});

// Supprimer un rendez-vous
router.delete("/delete/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM appointments WHERE id=$1", [req.params.id]);
    res.json({ message: "Rendez-vous supprimé" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
});

module.exports = router;
