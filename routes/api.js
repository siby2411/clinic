const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const patientController = require("../controllers/patientController");
const { authenticateToken, authorize } = require("../middlewares/authMiddleware");

// Auth
router.post("/login", authController.login);
router.post("/register", authController.register);

// Patients protégés par JWT et rôle admin/doctor
router.get("/patients", authenticateToken, authorize(["doctor", "admin"]), patientController.getAll);
router.post("/patients", authenticateToken, authorize(["doctor", "admin"]), patientController.create);

module.exports = router;
