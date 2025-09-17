const express = require("express");
const router = express.Router();
const medecinsController = require("../controllers/medecinsController");

router.get("/", medecinsController.getAllMedecins);
router.post("/", medecinsController.addMedecin);
router.put("/:id", medecinsController.updateMedecin);
router.delete("/:id", medecinsController.deleteMedecin);

module.exports = router;
