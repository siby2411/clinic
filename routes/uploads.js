const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Stockage des fichiers
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Upload d’un fichier
router.post('/', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Aucun fichier uploadé' });
    res.json({ message: 'Fichier uploadé avec succès', file: req.file.filename });
});

module.exports = router;
