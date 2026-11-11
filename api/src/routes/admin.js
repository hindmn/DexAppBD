import { Router } from 'express';
import pool from '../bd.js';
import { exigerConnexion } from '../middlewares/authentification.js';

const adminRouter = Router();

adminRouter.get('/travaux', exigerConnexion, async (req, res) => {
    const [lignes] = await pool.execute('SELECT tr.*, cs.titre AS cours_titre FROM travaux tr ' +
        'JOIN cours cs ON cs.id = tr.cours_id WHERE cs.utilisateur_id = ? ORDER BY cs.id, tr.remise', [req.utilisateurId]
    );
    res.json(lignes.map((t) => ({ ...t, ouvert: Boolean(t.ouvert) })));
});

export default adminRouter;