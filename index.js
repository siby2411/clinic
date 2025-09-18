const express = require("express");
const app = express();
const port = 3000;
require("dotenv").config();

// Middlewares pour parser JSON et données URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers HTML/CSS/JS depuis le dossier "public"
app.use(express.static("public"));

// Routes API
const medecinsRoutes = require("./routes/medecins");
const patientsRoutes = require("./routes/patients");
const appointmentsRoutes = require("./routes/appointments");
const consultationsRoutes = require("./routes/consultations");
const examensRoutes = require("./routes/examens");
const departementsRoutes = require("./routes/departements");
const natureConsultationRoutes = require("./routes/nature_consultation");

// Utilisation des routes
app.use("/api/medecins", medecinsRoutes);
app.use("/api/patients", patientsRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use("/api/consultations", consultationsRoutes);
app.use("/api/examens", examensRoutes);
app.use("/api/departements", departementsRoutes);
app.use("/api/nature_consultation", natureConsultationRoutes);

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});
