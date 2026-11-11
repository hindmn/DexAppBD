import { Router } from "express";
import pool from "../bd.js";
import { exigerConnexion } from "../middlewares/authentification.js";
import { findCreneau } from "../verifications.js";
import { readDateHour } from "../validation.js";

const creneauRouter = Router();

function erreur(res, code, message) {
    return res.status(code).json({ erreurs: [message] });
}

creneauRouter.put('/:id', exigerConnexion, async (req, res) => {
    const id = req.params.id;
    const creneau = await findCreneau(id);
    if (!creneau) return erreur(res, 404, 'Créneau introuvable.');
    if (creneau.utilisateur_id !== req.utilisateurId) {
        return erreur(res, 403, "Le créneau visé appartient au cours d’un autre enseignant.");
    }
    const corps = req.body ?? {};
    const erreurs = [];
    const debut = readDateHour(corps.debut);
    const fin = readDateHour(corps.fin);

    if (!debut) erreurs.push('La date de début est invalide.');
    if (!fin) erreurs.push('La date de fin est invalide.');
    if (debut && fin && fin <= debut) erreurs.push('La date de fin doit arriver après celle du début.');
    if (erreurs.length > 0) return res.status(400).json({ erreurs });

    await pool.execute('UPDATE creneaux SET debut = ?, fin = ? WHERE id = ?', [debut, fin, id]);
    res.status(204).end();
});

creneauRouter.delete('/:id', exigerConnexion, async (req, res) => {
    const id = req.params.id;
    const creneau = await findCreneau(id);
    if(!creneau) return erreur(res, 404, 'Créneau introuvable.');
    if (creneau.utilisateur_id !== req.utilisateurId) {
        return erreur(res, 403, "Le créneau visé appartient au cours d’un autre enseignant.");
    }
    await pool.execute('DELETE FROM creneaux WHERE id = ?', [id]);
    res.status(204).end();
});

export default creneauRouter;