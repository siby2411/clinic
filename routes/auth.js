const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../config/db');

// Clé secrète pour les JWT (à stocker dans.env en production)
const JWT_SECRET = 'votre_cle_secrete';

// Route de connexion pour tous les utilisateurs
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1. Trouver l'utilisateur par son email
    const userResult = await db.query(
      'SELECT u.id, u.email, u.password_hash, r.name AS role FROM users u JOIN roles r ON u.role_id = r.id WHERE u.email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    const user = userResult.rows;

    // 2. Comparer le mot de passe soumis avec le hash stocké
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    // 3. Si le mot de passe correspond, générer un JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur de serveur.' });
  }
});

// Route pour l'enregistrement de personnel (accessible uniquement par un admin si besoin)
router.post('/register_staff', [
  body('email').isEmail().normalizeEmail().withMessage('Email invalide.'),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit avoir au moins 6 caractères.'),
  body('name').notEmpty().withMessage('Le nom ne peut pas être vide.'),
  body('role').isIn(['doctor', 'nurse', 'secretary']).withMessage('Rôle invalide.'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, role, name,...rest } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insérer dans la table users
    const userResult = await db.query(
      'INSERT INTO users (email, password_hash, role_id) VALUES ($1, $2, (SELECT id FROM roles WHERE name = $3)) RETURNING id',
      [email, hashedPassword, role]
    );
    const userId = userResult.rows.id;

    // Si le rôle est 'doctor', 'nurse', ou 'secretary', la gestion des profils est séparée
    // Pour l'instant, on peut simplement confirmer la création de l'utilisateur.
    // L'ajout d'informations spécifiques à chaque profil (nom, etc.) sera géré séparément ou directement dans le formulaire.

    res.status(201).json({ message: `Utilisateur avec le rôle '${role}' créé avec succès.`, userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la création du compte.' });
  }
});

module.exports = router;
