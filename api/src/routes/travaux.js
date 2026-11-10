import { Router } from "express";
import pool from '../bd.js';
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
    if(cours !== ''){
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
    if(travaux.length === 0){ return erreur(res, 404, 'Travail introuvable.');  }
    const travail = travaux[0];
    const [creneaux] = await pool.execute('SELECT id, debut, fin FROM creneaux WHERE travail_id = ? ORDER BY debut', [id]);
    
    res.json({...travail, ouvert: Boolean(travail.ouvert), creneaux});
});

//ROUTE 4


export default travauxRouter;