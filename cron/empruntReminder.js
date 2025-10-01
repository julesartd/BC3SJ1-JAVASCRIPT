const db = require('../services/database');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for production with 465 port
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

cron.schedule('0 8 * * *', () => {
  db.query(
    `SELECT e.id_emprunt, e.date_emprunt, u.email, u.nom, l.titre,
            DATEDIFF(CURDATE(), e.date_emprunt) AS jours_emprunt
         FROM emprunts e
         JOIN utilisateurs u ON e.id_utilisateur = u.id
         JOIN livres l ON e.id_livre = l.id
         WHERE e.date_retour_effective IS NULL
           AND DATEDIFF(CURDATE(), e.date_emprunt) > 30`,
    (err, results) => {
      if (err) return console.error('Erreur SQL : ', err);

      results.forEach((emprunt) => {
        const mailOptions = {
          from: '"Librairie XYZ" <email@example.com>',
          to: emprunt.email,
          subject: 'Rappel : Emprunt en retard',
          text: `Bonjour ${emprunt.nom},\n\nVous avez emprunté le livre "${emprunt.titre}" depuis plus de 30 jours. Merci de le retourner rapidement ou de contacter la librairie.\n\nCordialement,\nLibrairie XYZ`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(`Erreur envoi mail à ${emprunt.email}:`, error);
          } else {
            console.log(`Rappel envoyé à ${emprunt.email}: ${info.response}`);
          }
        });
      });
    }
  );
});
