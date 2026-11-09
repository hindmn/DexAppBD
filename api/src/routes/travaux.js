import { Router } from "express";
import pool from '../bd.js';
const travauxRouter = Router();

function erreur(res, code, message) {
    return res.status(code).json({ erreurs: [message] });
}

travauxRouter.get('/', async (req, res) => {
    const cours = (req.query.cours ?? '').trim();
    let sql = 'SELECT tr.id, tr.cours_id, tr.titre, tr.type, tr.remise, cs.titre AS cours_titre '
            + 'FROM travaux tr JOIN cours cs ON cs.id = tr.cours_id '
            + 'WHERE tr.ouvert = 1';
    const params = [];
    if(cours !== ''){
        sql += ' AND tr.cours_id = ?';
        params.push(cours);
    }
    sql += ' ORDER BY cs.id, tr.remise';
    const [lignes] = await pool.execute(sql, params);
    res.json(lignes);
});

export default travauxRouter;