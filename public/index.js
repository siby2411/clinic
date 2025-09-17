// index.js
const express = require("express");
const path = require("path");
const app = express();

app.use(express.static("public")); // sert index.html et les autres pages

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur en cours d'exécution sur le port ${PORT}`));
