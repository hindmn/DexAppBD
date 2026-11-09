import { Router } from "express";
import pool from '../bd.js';
const coursRouter = Router();

coursRouter.get('/', async(req, res) => {
    const [lignes] = await pool.execute('SELECT id, titre FROM cours ORDER BY id');
    res.json(lignes);
});

export default coursRouter;