import { API_URL } from "./config.js";

export class ErreurApi extends Error{
    constructor(statut, erreurs){
        super(erreurs.join(' '));
        this.statut = statut;
        this.erreurs = erreurs;
    }
}

async function requete(chemin, {methode = 'GET', corps, jeton} = {}) {
    const entetes = {};
    if(corps !== undefined){
        entetes['Content-Type'] = 'application/json';
    }
    if(jeton){
        entetes['Authorization'] = `Bearer ${jeton}`;
    }
    let resultat;
    try{
        resultat = await fetch(API_URL + chemin, {method: methode, headers: entetes, 
            body: corps !== undefined ? JSON.stringify(corps) : undefined });
    }catch{
        throw new ErreurApi(0, ['Impossible de joindre le serveur.']);
    }

    if(resultat.status === 204) return null;

    const donnees = await resultat.json().catch(() => null);
    if(!resultat.ok){
        const erreurs = donnees?.erreurs ?? ['Erreur inattendue.'];
        throw new ErreurApi(resultat.status, erreurs);
    }
    return donnees;
}