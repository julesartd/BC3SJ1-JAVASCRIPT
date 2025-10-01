const express = require('express');
const bodyParser = require('body-parser');
const booksrouter = require('./router/books');
const usersRouter = require('./router/users');
const empruntsRouter = require('./router/emprunts');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const db = require('./services/database');
require('./cron/empruntReminder');
require('dotenv').config();

const { authenticateToken } = require('./middlewares/auth.middleware');
const corsOptions = require('./middlewares/cors.middleware');
const {
  generateCsrfToken,
  verifyCsrfToken,
} = require('./middlewares/csrf.middleware');
const router = express.Router();
router.use(bodyParser.json());
router.use(corsOptions);
router.use(cookieParser());
router.use('/api/books', booksrouter);
router.use('/api/users', usersRouter);
router.use('/api/emprunts', empruntsRouter);

router.post('/api/logout', (req, res) => {
  // req.session.destroy();
  res.clearCookie('token');
  res.json({ message: 'Déconnexion réussie' });
});

router.get('/api/session', authenticateToken, (req, res) => {
  if (req?.user) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: 'Non authentifié' });
  }
});

router.get('/api/csrf-token', generateCsrfToken, (req, res) => {
  res.json({ csrfToken: req.cookies.csrfToken });
});

router.get('/api/statistics', (req, res) => {
  const totalBooksQuery = 'SELECT COUNT(*) AS total_books FROM livres';
  const totalUsersQuery = 'SELECT COUNT(*) AS total_users FROM utilisateurs';

  db.query(totalBooksQuery, (err, booksResult) => {
    if (err) throw err;
    db.query(totalUsersQuery, (err, usersResult) => {
      if (err) throw err;
      res.json({
        total_books: booksResult[0].total_books,
        total_users: usersResult[0].total_users,
      });
    });
  });
});

router.use('/', express.static(path.join(__dirname, './webpub')));
router.use(express.static(path.join(__dirname, './webpub')));
router.use('/*', (_, res) => {
  res.sendFile(path.join(__dirname, './webpub/index.html'));
});
router.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, './webpub/index.html'));
});

module.exports = router;
