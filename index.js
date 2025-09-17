const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // fichiers statiques (HTML, CSS, JS)

// Import des routes API
const patientsRoutes = require("./routes/patients");
const medecinsRoutes = require("./routes/medecins");
const consultationsRoutes = require("./routes/consultations");
const rendezVousRoutes = require("./routes/rendez_vous");
const paymentsRoutes = require("./routes/payments");

// Routes API
app.use("/api/patients", patientsRoutes);
app.use("/api/medecins", medecinsRoutes);
app.use("/api/consultations", consultationsRoutes);
app.use("/api/rendez_vous", rendezVousRoutes);
app.use("/api/payments", paymentsRoutes);

// Route dashboard / index
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

// Démarrage serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur en cours d'exécution sur le port ${PORT}`));
