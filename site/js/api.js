import { API_URL } from "./config.js";

export class ErreurApi extends Error {
    constructor(statut, erreurs) {
        super(erreurs.join(' '));
        this.statut = statut;
        this.erreurs = erreurs;
    }
}

async function requete(chemin, { methode = 'GET', corps, jeton } = {}) {
    const entetes = {};
    if (corps !== undefined) {
        entetes['Content-Type'] = 'application/json';
    }
    if (jeton) {
        entetes['Authorization'] = `Bearer ${jeton}`;
    }
    let resultat;
    try {
        resultat = await fetch(API_URL + chemin, {
            method: methode, headers: entetes,
            body: corps !== undefined ? JSON.stringify(corps) : undefined
        });
    } catch {
        throw new ErreurApi(0, ['Impossible de joindre le serveur.']);
    }

    if (resultat.status === 204) return null;

    const donnees = await resultat.json().catch(() => null);
    if (!resultat.ok) {
        const erreurs = donnees?.erreurs ?? ['Erreur inattendue.'];
        throw new ErreurApi(resultat.status, erreurs);
    }
    return donnees;
}

export function getCours() {
    return requete('/cours');
}

export function getTravaux(coursId = '') {
    const filtre = coursId ? `?cours=${encodeURIComponent(coursId)}` : '';
    return requete(`/travaux${filtre}`);
}
export function getTravail(id) {
    return requete(`/travaux/${encodeURIComponent(id)}`);
}
export function getDisponibilites(id) {
    return requete(`/travaux/${encodeURIComponent(id)}/disponibilites`);
}
export function enregistrerDispo(id, matricule, nom, creneaux) {
    return requete(`/travaux/${encodeURIComponent(id)}/disponibilites/${encodeURIComponent(matricule)}`,
        { methode: 'PUT', corps: { nom, creneaux } });
}
export function connexion(identifiant, motDePasse) {
    return requete('/connexion', { methode: 'POST', corps: { identifiant, motDePasse } });
}
export function deconnexion(jeton) {
    return requete('/deconnexion', { methode: 'POST', jeton });
}
export function getTravauxAdmin(jeton) {
    return requete(`/admin/travaux`, { jeton });
}
export function ajoutCreneau(jeton, travailId, debut, fin) {
    return requete(`/travaux/${encodeURIComponent(travailId)}/creneaux`,
        { methode: 'POST', corps: { debut, fin }, jeton });
}
export function modifierCreneau(jeton, id, debut, fin) {
    return requete(`/creneaux/${encodeURIComponent(id)}`, { methode: 'PUT', corps: { debut, fin }, jeton });
}
export function supprimerCreneau(jeton, id) {
    return requete(`/creneaux/${encodeURIComponent(id)}`, { methode: 'DELETE', jeton });
}