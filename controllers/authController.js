// controllers/authController.js
const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ---- LOGIN ----
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis." });
    }

    // Vérifier si l'utilisateur existe
    const result = await pool.query(
      "SELECT u.id, u.email, u.password_hash, u.role_id, r.name AS role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Utilisateur non trouvé." });
    }

    const user = result.rows[0];

    // Vérifier mot de passe
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: "Mot de passe incorrect." });
    }

    // Générer un token JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Connexion réussie",
      token,
      role: user.role_id,
      roleName: user.role_name,
    });
  } catch (err) {
    console.error("Erreur login:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
