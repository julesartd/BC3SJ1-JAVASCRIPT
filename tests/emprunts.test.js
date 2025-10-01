const request = require('supertest');
const express = require('express');
const router = require('../server');
const jwt = require('jsonwebtoken');

const JWT_SECRET = "HelloThereImObiWan";

function getAuthCookie(user = { id: 1, nom: "Smith", role: "utilisateur" }) {
    const token = jwt.sign(user, JWT_SECRET);
    return [`token=${token}`];
}

const app = express();
app.use(router);

describe('Emprunts API', () => {
    it('refuse un emprunt de plus de 30 jours', async () => {
        const res = await request(app)
            .post('/api/emprunts')
            .set('Cookie', getAuthCookie())
            .send({
                id_livre: 4,
                date_retour_prevue: '2099-01-01'
            });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/ne peut pas dépasser 30 jours/);
    });

    it('refuse un emprunt si le livre est indisponible', async () => {
        const res = await request(app)
            .post('/api/emprunts')
            .set('Cookie', getAuthCookie())
            .send({
                id_livre: 1, // livre déjà emprunté
                date_retour_prevue: '2025-10-10'
            });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/non disponible/);
    });

    it('accepte un emprunt valide', async () => {
        const res = await request(app)
            .post('/api/emprunts')
            .set('Cookie', getAuthCookie())
            .send({
                id_livre: 4,
                date_retour_prevue: '2025-10-10'
            });
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/Emprunt enregistré/);
    });

    it('retourne la liste des emprunts', async () => {
        const res = await request(app)
            .get('/api/emprunts')
            .set('Cookie', getAuthCookie());
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('retourne un livre', async () => {
        const res = await request(app)
            .post('/api/emprunts/retour')
            .set('Cookie', getAuthCookie())
            .send({ id_emprunt: 1 });
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/Livre retourné/);
    });
});