const express = require('express')
const bodyParser = require('body-parser')
const booksrouter = require('./router/books')
const usersRouter = require('./router/users')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const db = require('./services/database')

const JWT_SECRET = "HelloThereImObiWan"
function authenticateToken(req, res, next) {
    const token = req.cookies.token
    if (!token) return res.sendStatus(401)

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}
const corsOptions = {
    origin: 'https://exam.andragogy.fr',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
}

const router = express.Router()
router.use(bodyParser.json());
router.use(cors(corsOptions));
router.use(cookieParser());
router.use('/api/books', booksrouter);
router.use('/api/users', usersRouter);

router.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Déconnexion réussie' });
});

router.get('/api/session', authenticateToken, (req, res) => {
    if (req?.user) {
        res.json({ user: req.user });
    } else {
        res.status(401).json({ message: 'Non authentifié' });
    }
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
                total_users: usersResult[0].total_users
            });
        });
    });
});


router.post('/api/emprunts', authenticateToken, (req, res) => {
    const { id_livre, date_retour_prevue } = req.body;
    const id_utilisateur = req.user.id;


    const dateEmprunt = new Date();
    const dateRetour = new Date(date_retour_prevue);
    const diffDays = Math.ceil((dateRetour - dateEmprunt) / (1000 * 60 * 60 * 24));
    if (diffDays > 30) {
        return res.status(400).json({ message: "La durée d'emprunt ne peut pas dépasser 30 jours." });
    }

    db.query('SELECT statut FROM livres WHERE id = ?', [id_livre], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (!results.length || results[0].statut !== 'disponible') {
            return res.status(400).json({ message: "Livre non disponible." });
        }


        db.query(
            'INSERT INTO emprunts (id_utilisateur, id_livre, date_emprunt, date_retour_prevue) VALUES (?, ?, CURDATE(), ?)',
            [id_utilisateur, id_livre, date_retour_prevue],
            (err) => {
                if (err) return res.status(500).json({ error: err });

                db.query('UPDATE livres SET statut = "emprunté" WHERE id = ?', [id_livre]);
                res.json({ message: "Emprunt enregistré." });
            }
        );
    });
});

router.post('/api/emprunts/retour', authenticateToken, (req, res) => {
    const { id_emprunt } = req.body;
    const id_utilisateur = req.user.id;

    db.query('SELECT id_livre FROM emprunts WHERE id_emprunt = ? AND id_utilisateur = ?', [id_emprunt, id_utilisateur], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (!results.length) return res.status(404).json({ message: "Emprunt non trouvé." });

        const id_livre = results[0].id_livre;

        db.query('UPDATE emprunts SET date_retour_effective = CURDATE() WHERE id_emprunt = ?', [id_emprunt], (err) => {
            if (err) return res.status(500).json({ error: err });

            db.query('UPDATE livres SET statut = "disponible" WHERE id = ?', [id_livre]);
            res.json({ message: "Livre retourné." });
        });
    });
});

router.get('/api/emprunts', authenticateToken, (req, res) => {
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

            results.forEach(emprunt => {
                if (!emprunt.date_retour_effective && emprunt.jours_emprunt > 30) {
                    emprunt.message = "Attention : emprunt dépassé (plus de 30 jours) !";
                }
            });
            res.json(results);
        }
    );
});



router.use('/', express.static(path.join(__dirname, "./webpub")))
router.use(express.static(path.join(__dirname, "./webpub")))
router.use('/*', (_, res) => {
    res.sendFile(
        path.join(__dirname, "./webpub/index.html")
    );
})
router.get("*", (_, res) => {
    res.sendFile(
        path.join(__dirname, "./webpub/index.html")
    );
});

module.exports = router;