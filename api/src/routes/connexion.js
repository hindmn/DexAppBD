import {Router} from 'express';
import bcrypt from 'bcryptjs';
import pool from '../bd.js';
import { creerJeton, supprimerJeton } from '../jetons.js';
import {exigerConnexion} from '../middlewares/authentification.js';

const connexRouter = Router();
connexRouter.post('/connexion', async (req, res) => {
    const corps = req.body ?? {};
    const id = typeof corps.identifiant === 'string' ? corps.identifiant.trim() : '';
    const mdp = typeof corps.motDePasse === 'string' ? corps.motDePasse : '';

    const erreurs = [];
    if(id === '') erreurs.push("Veuillez inscrire votre identifiant.");
    if(mdp === '') erreurs.push('Veuillez inscrire votre mot de passe.');
    if(erreurs.length > 0) return res.status(400).json({erreurs});
    
    const [lignes] = await pool.execute('SELECT id, nom, mot_de_passe_hache FROM utilisateurs WHERE identifiant = ?', [id]);
    const utilisateur = lignes[0];
    const valide = utilisateur && await bcrypt.compare(mdp, utilisateur.mot_de_passe_hache);
    if(!valide) { return res.status(401).json({ erreurs: ["L'identifiant ou le mot de passe est incorrect."]}); }
    const jeton = creerJeton(utilisateur.id);
    res.json({jeton, nom: utilisateur.nom});
});

connexRouter.post('/deconnexion', exigerConnexion, (req, res) => {
    supprimerJeton(req.jeton);
    res.status(204).end();
});
export default connexRouter;