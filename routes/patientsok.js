// routes/patients.js
const express = require("express");
const router = express.Router();
const patientsController = require("../controllers/patientsController");

// 📌 Liste de tous les patients
router.get("/", patientsController.getAllPatients);

// 📌 Ajouter un patient
router.post("/", patientsController.createPatient);

// 📌 Mettre à jour un patient par ID
router.put("/:id", patientsController.updatePatient);

// 📌 Supprimer un patient par ID
router.delete("/:id", patientsController.deletePatient);

module.exports = router;
