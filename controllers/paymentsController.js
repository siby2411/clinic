// controllers/paymentsController.js
const pool = require("../db");

exports.createPayment = async (req, res) => {
  try {
    const { code_patient, montant } = req.body;

    if (!code_patient || !montant) {
      return res.status(400).json({ error: "Champs manquants" });
    }

    // Vérifier que le patient existe
    const patientCheck = await pool.query(
      "SELECT * FROM patients WHERE code_patient = $1",
      [code_patient]
    );

    if (patientCheck.rows.length === 0) {
      return res.status(404).json({ error: "Patient introuvable" });
    }

    // Insérer paiement
    const result = await pool.query(
      "INSERT INTO payments (code_patient, montant) VALUES ($1, $2) RETURNING *",
      [code_patient, montant]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erreur createPayment:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT p.id, p.code_patient, pa.nom, pa.prenom, p.date_paiement, p.montant " +
      "FROM payments p JOIN patients pa ON p.code_patient = pa.code_patient ORDER BY p.date_paiement DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Erreur getPayments:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM payments WHERE id = $1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Paiement non trouvé" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erreur getPaymentById:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM payments WHERE id = $1", [id]);
    res.json({ message: "Paiement supprimé" });
  } catch (err) {
    console.error("Erreur deletePayment:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
