import { trouverJeton } from "../jetons.js";

export function exigerConnexion(req, res, next){
    const header = req.get('Authorization') ?? '';
    if(!header.startsWith('Bearer ')) { return res.status(401).json({erreurs: ['Veuillez entrer votre authentification.'] }); }
    const jeton = header.slice(7);
    const info = trouverJeton(jeton);
    if(!info) { return res.status(401).json({erreurs: ['Votre session est invalide ou expirée.']}); }

    req.utilisateutId = info.utilisateutId;
    req.jeton = jeton;
    next();
}