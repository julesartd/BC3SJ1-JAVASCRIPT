const express = require('express');
const router = express.Router();
const db = require('../services/database');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { verifyCsrfToken } = require('../middlewares/csrf.middleware');

router.post('/', verifyCsrfToken, authenticateToken, (req, res) => {
  const { id_livre, date_retour_prevue } = req.body;
  const id_utilisateur = req.user.id;

  const dateEmprunt = new Date();
  const dateRetour = new Date(date_retour_prevue);
  const diffDays = Math.ceil(
    (dateRetour - dateEmprunt) / (1000 * 60 * 60 * 24)
  );
  if (diffDays > 30) {
    return res
      .status(400)
      .json({ message: "La durée d'emprunt ne peut pas dépasser 30 jours." });
  }

  db.query(
    'SELECT statut FROM livres WHERE id = ?',
    [id_livre],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (!results.length || results[0].statut !== 'disponible') {
        return res.status(400).json({ message: 'Livre non disponible.' });
      }

      db.query(
        'INSERT INTO emprunts (id_utilisateur, id_livre, date_emprunt, date_retour_prevue) VALUES (?, ?, CURDATE(), ?)',
        [id_utilisateur, id_livre, date_retour_prevue],
        (err) => {
          if (err) return res.status(500).json({ error: err });

          db.query('UPDATE livres SET statut = "emprunté" WHERE id = ?', [
            id_livre,
          ]);
          res.json({ message: 'Emprunt enregistré.' });
        }
      );
    }
  );
});

// POST /api/emprunts/retour
router.post('/retour', authenticateToken, (req, res) => {
  const { id_emprunt } = req.body;
  const id_utilisateur = req.user.id;

  db.query(
    'SELECT id_livre FROM emprunts WHERE id_emprunt = ? AND id_utilisateur = ?',
    [id_emprunt, id_utilisateur],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (!results.length)
        return res.status(404).json({ message: 'Emprunt non trouvé.' });

      const id_livre = results[0].id_livre;

      db.query(
        'UPDATE emprunts SET date_retour_effective = CURDATE() WHERE id_emprunt = ?',
        [id_emprunt],
        (err) => {
          if (err) return res.status(500).json({ error: err });

          db.query('UPDATE livres SET statut = "disponible" WHERE id = ?', [
            id_livre,
          ]);
          res.json({ message: 'Livre retourné.' });
        }
      );
    }
  );
});

router.get('/', authenticateToken, (req, res) => {
  const id_utilisateur = req.user.id;
  db.query(
    `SELECT e.*, l.titre, l.auteur, l.photo_url,
            DATEDIFF(CURDATE(), e.date_emprunt) AS jours_emprunt
         FROM emprunts e
         JOIN livres l ON e.id_livre = l.id
         WHERE e.id_utilisateur = ?
         ORDER BY e.date_emprunt DESC`,
    [id_utilisateur],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });

      results.forEach((emprunt) => {
        if (!emprunt.date_retour_effective && emprunt.jours_emprunt > 30) {
          emprunt.message = 'Attention : emprunt dépassé (plus de 30 jours) !';
        }
      });
      res.json(results);
    }
  );
});

module.exports = router;
