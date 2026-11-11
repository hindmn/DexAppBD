import { Router } from "express";
import pool from '../bd.js';
import { exigerConnexion } from "../middlewares/authentification.js";
import { findTravail } from "../verifications.js";
import { readDate, readDateHour } from "../validation.js";

const travauxRouter = Router();

function erreur(res, code, message) {
    return res.status(code).json({ erreurs: [message] });
}

//ROUTE 2
travauxRouter.get('/', async (req, res) => {
    const cours = (req.query.cours ?? '').trim();
    let sql = 'SELECT tr.id, tr.cours_id, tr.titre, tr.type, tr.remise, cs.titre AS cours_titre '
        + 'FROM travaux tr JOIN cours cs ON cs.id = tr.cours_id '
        + 'WHERE tr.ouvert = 1';
    const params = [];
    if (cours !== '') {
        sql += ' AND tr.cours_id = ?';
        params.push(cours);
    }
    sql += ' ORDER BY cs.id, tr.remise';
    const [lignes] = await pool.execute(sql, params);
    res.json(lignes);
});


//ROUTE 3
travauxRouter.get('/:id', async (req, res) => {
    const id = req.params.id;
    const [travaux] = await pool.execute('SELECT tr.*, cs.titre AS cours_titre '
        + 'FROM travaux tr JOIN cours cs ON cs.id = tr.cours_id '
        + 'WHERE tr.id = ?', [id]
    );
    if (travaux.length === 0) { return erreur(res, 404, 'Travail introuvable.'); }
    const travail = travaux[0];
    const [creneaux] = await pool.execute('SELECT id, debut, fin FROM creneaux WHERE travail_id = ? ORDER BY debut', [id]);

    res.json({ ...travail, ouvert: Boolean(travail.ouvert), creneaux });
});

//ROUTE 4
travauxRouter.get('/:id/disponibilites', async (req, res) => {
    const id = req.params.id;
    const [travaux] = await pool.execute('SELECT id FROM travaux WHERE id = ?', [id]);
    if (travaux.length === 0) {
        return erreur(res, 404, 'Travail introuvable.');
    }
    const [creneaux] = await pool.execute('SELECT id, debut, fin FROM creneaux WHERE travail_id = ? ORDER BY debut', [id]);
    const [disponibilites] = await pool.execute('SELECT creneau_id, matricule, nom FROM disponibilites WHERE travail_id = ? ORDER BY nom',
        [id]
    );
    const result = creneaux.map((c) => {
        const etudiants = disponibilites.filter((dispo) => dispo.creneau_id === c.id)
            .map((dispo) => ({ matricule: dispo.matricule, nom: dispo.nom }));
        return {
            creneauId: c.id,
            debut: c.debut,
            fin: c.fin,
            nombre: etudiants.length,
            noms: etudiants.map((e) => e.nom),
            etudiants
        };
    });
    res.json(result);
});


//Route 5
travauxRouter.put('/:id/disponibilites/:matricule', async (req, res) => {
    const id = req.params.id;
    const [travaux] = await pool.execute('SELECT id, ouvert FROM travaux WHERE id = ?', [id]);
    if (travaux.length === 0) { return erreur(res, 404, 'Travail introuvable.'); }
    if (!travaux[0].ouvert) { return erreur(res, 409, 'Travail fermé.'); }

    const corps = req.body ?? {};
    const erreurs = [];
    const matricule = (req.params.matricule ?? '').trim();
    const nom = typeof corps.nom === 'string' ? corps.nom.trim() : '';
    let creneaux = corps.creneaux;
    if (matricule === '') {
        erreurs.push('Veuillez inscrire le matricule.')
    } else if (matricule.length > 20) {
        erreurs.push('Le matricule ne doit pas dépasser 20 caractères.');
    }
    if (nom === '') {
        erreurs.push('Veuillez inscrire le nom.')
    } else if (nom.length > 100) {
        erreurs.push('Le nom ne doit pas dépasser 100 caractères.')
    }
    if (!Array.isArray(creneaux)) {
        creneaux = [];
    }
    creneaux = [...new Set(creneaux)];
    if (creneaux.length === 0) {
        erreurs.push('Veuillez sélectionner au moins 1 créneau.');
    }
    const [lignesCreneaux] = await pool.execute('SELECT id FROM creneaux WHERE travail_id = ?', [id]);
    const idCreneaux = lignesCreneaux.map((c) => c.id);
    for (const c of creneaux) {
        if (!idCreneaux.includes(c)) {
            erreurs.push('Un des créneaux sélectionné est invalide.');
            break;
        }
    }
    if (erreurs.length > 0) { return res.status(400).json({ erreurs }); }
    const connect = await pool.getConnection();
    try {
        await connect.beginTransaction();
        await connect.execute('DELETE FROM disponibilites WHERE travail_id = ? AND matricule = ?',
            [id, matricule]
        );
        for (const c of creneaux) {
            await connect.execute('INSERT INTO disponibilites (travail_id, creneau_id, matricule, nom) VALUES (?, ?, ?, ?)',
                [id, c, matricule, nom]
            );
        }
        await connect.commit();
    } catch (err) {
        await connect.rollback();
        throw err;
    } finally {
        connect.release();
    }
    res.status(204).end();
});

travauxRouter.put('/:id', exigerConnexion, async (req, res) => {
    const id = req.params.id;
    const travail = await findTravail(id);
    if (!travail) return erreur(res, 404, 'Travail introuvable.');
    if (travail.utilisateur_id !== req.utilisateurId) {
        return erreur(res, 403, "Le travail visé appartient au cours d’un autre enseignant.");
    }

    const corps = req.body ?? {};
    const erreurs = [];
    const titre = typeof corps.titre === 'string' ? corps.titre.trim() : '';
    if (titre === '') {
        erreurs.push('Veuillez inscrire le titre.');
    } else if (titre.length > 150) {
        erreurs.push('Le titre ne doit pas dépasser 150 caractères');
    }

    const description = typeof corps.description === 'string' ? corps.description.trim() : '';
    if (description === '') {
        erreurs.push('Veuillez inscrire la description.');
    }
    if (corps.type !== 'individuel' && corps.type !== 'equipe') {
        erreurs.push('Le type doit être soit individuel ou equipe.');
    }

    const dispo = readDate(corps.disponible);
    if (!dispo) {
        erreurs.push('La date de disponibilité est invalide.');
    }

    const remise = readDateHour(corps.remise);
    if (!remise) {
        erreurs.push('La date de remise est invalide.');
    } else if (dispo && remise <= `${dispo} 00:00:00`) {
        erreurs.push('La date de remise doit être après celle de disponibilité.');
    }
    if (typeof corps.ouvert !== 'boolean') {
        erreurs.push("L'état 'ouvert' doit être soit vrai ou faux.");
    }
    if (erreurs.length > 0) return res.status(400).json({ erreurs });

    await pool.execute('UPDATE travaux SET titre = ?, description = ?, type = ?, disponible = ?, remise = ?, ouvert = ? ' +
        'WHERE id = ?', [titre, description, corps.type, dispo, remise, corps.ouvert ? 1 : 0, id]
    );
    res.status(204).end();
});

travauxRouter.post('/:id/creneaux', exigerConnexion, async (req, res) => {
    const id = req.params.id;
    const travail = await findTravail(id);
    if (!travail) return erreur(res, 404, 'Travail introuvable.');
    if (travail.utilisateur_id !== req.utilisateurId) {
        return erreur(res, 403, "Le travail visé appartient au cours d’un autre enseignant.");
    }

    const corps = req.body ?? {};
    const erreurs = [];
    const debut = readDateHour(corps.debut);
    const fin = readDateHour(corps.fin);

    if (!debut) erreurs.push('La date de début est invalide.');
    if (!fin) erreurs.push('La date de fin est invalide.');
    if (debut && fin && fin <= debut) erreurs.push('La fin doit être postérieure au début.');
    if (erreurs.length > 0) { return res.status(400).json({ erreurs }); }

    const [lignes] = await pool.execute('SELECT id FROM creneaux WHERE travail_id = ?', [id]);
    const prefixe = `${id}-`;
    const numExistants = lignes.map((l) => l.id).filter((lId) => lId.startsWith(prefixe))
        .map((lId) => Number(lId.slice(prefixe.length)));

    let numero = 1;
    while (numExistants.includes(numero)) { numero++; }
    const newId = prefixe + String(numero).padStart(2, '0');

    await pool.execute('INSERT INTO creneaux (id, travail_id, debut, fin) VALUES (?, ?, ?, ?)', [newId, id, debut, fin]);

    res.status(201).json({id: newId, travail_id: id, debut, fin});
});

export default travauxRouter;