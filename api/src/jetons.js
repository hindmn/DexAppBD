import crypto from 'node:crypto';

const DUREE_JETON = 2 * 60 * 60 * 1000;
const jetons = new Map();

export function creerJeton(userId){
    const jeton = crypto.randomBytes(32).toString('hex');
    jetons.set(jeton, {
        userId, expiration: Date.now() + DUREE_JETON
    });
    return jeton;
}
export function trouverJeton(jeton){
    const info = jetons.get(jeton);
    if(!info) { return null; }
    if(Date.now() > info.expiration){
        jetons.delete(jeton);
        return null;
    }
    return info;
}
export function supprimerJeton(jeton){
    jetons.delete(jeton);
}
