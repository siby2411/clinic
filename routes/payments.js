// routes/payments.js
const express = require("express");
const router = express.Router();
const paymentsController = require("../controllers/paymentsController");

// CRUD
router.post("/", paymentsController.createPayment);
router.get("/", paymentsController.getPayments);
router.get("/:id", paymentsController.getPaymentById);
router.delete("/:id", paymentsController.deletePayment);

module.exports = router;
