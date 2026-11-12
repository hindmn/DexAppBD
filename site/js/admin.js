import { createApp, ref } from 'https://unpkg.com/vue@3.5/dist/vue.esm-browser.js';
import {
    connexion, deconnexion, getTravauxAdmin, modifierTravail,
    modifierCreneau, getTravail, getDisponibilites, ajoutCreneau, supprimerCreneau, ErreurApi
} from './api.js';

createApp({
    setup() {
        const jeton = ref(sessionStorage.getItem('jeton') ?? '');
        const nomEnseignant = ref(sessionStorage.getItem('nomEnseignant') ?? '');
        const identifiant = ref('');
        const motDePasse = ref('');
        const travaux = ref([]);
        const travailChoisi = ref(null);
        const creneaux = ref([]);
        const nouveauDebut = ref('');
        const nouveauFin = ref('');
        const erreurs = ref([]);
        const messageSucces = ref('');

        function dateFormat(dateSql) {
            return dateSql.replace(' ', 'T').slice(0, 16);
        }
        function reinitialiserMessages() {
            erreurs.value = [];
            messageSucces.value = '';
        }
        function gererErreur(e) {
            if (!(e instanceof ErreurApi)) throw e;
            if (e.statut === 401) {
                jeton.value = '';
                sessionStorage.removeItem('jeton');
                sessionStorage.removeItem('nomEnseignant');
                travailChoisi.value = null;
            }
            erreurs.value = e.erreurs;
        }
        async function seConnecter() {
            reinitialiserMessages();
            try {
                const resultat = await connexion(identifiant.value, motDePasse.value);
                jeton.value = resultat.jeton;
                nomEnseignant.value = resultat.nom;
                sessionStorage.setItem('jeton', resultat.jeton);
                sessionStorage.setItem('nomEnseignant', resultat.nom);
                motDePasse.value = '';
                await chargerTravaux();
            } catch (e) {
                gererErreur(e);
            }
        }
        async function seDeconnecter() {
            reinitialiserMessages();
            try {
                await deconnexion(jeton.value);
            } catch { }
            jeton.value = '';
            sessionStorage.removeItem('jeton');
            sessionStorage.removeItem('nomEnseignant');
            travailChoisi.value = null;
        }
        async function chargerTravaux() {
            try {
                travaux.value = await getTravauxAdmin(jeton.value);
            } catch (e) {
                gererErreur(e);
            }
        }
        async function chargerCreneaux(id) {
            const travail = await getTravail(id);
            creneaux.value = travail.creneaux.map((c) => ({ id: c.id, debut: dateFormat(c.debut), fin: dateFormat(c.fin) }));
        }
        async function ouvrirTravail(t) {
            reinitialiserMessages();
            try {
                travailChoisi.value = { ...t, remise: dateFormat(t.remise) };
                await chargerCreneaux(t.id);
            } catch (e) {
                gererErreur(e);
            }
        }
        function fermerTravail() {
            reinitialiserMessages();
            travailChoisi.value = null;
        }
        async function enregistrerTravail() {
            reinitialiserMessages();
            try {
                const t = travailChoisi.value;
                await modifierTravail(jeton.value, t.id, {
                    titre: t.titre, description: t.description, type: t.type, disponible: t.disponible,
                    remise: t.remise, ouvert: t.ouvert
                });
                messageSucces.value = 'Travail enregistré.';
                await chargerTravaux();
            } catch (e) {
                gererErreur(e);
            }
        }
        async function enregistrerCreneau(c) {
            reinitialiserMessages();
            try {
                await modifierCreneau(jeton.value, c.id, c.debut, c.fin);
                messageSucces.value = `Créneau ${c.id} enregistré.`;
            } catch (e) {
                gererErreur(e);
            }
        }
        async function ajoutUnCreneau() {
            reinitialiserMessages();
            try {
                await ajoutCreneau(jeton.value, travailChoisi.value.id, nouveauDebut.value, nouveauFin.value);
                nouveauDebut.value = '';
                nouveauFin.value = '';
                messageSucces.value = 'Créneau ajouté.';
                await chargerCreneaux(travailChoisi.value.id);
            } catch (e) {
                gererErreur(e);
            }
        }
        async function supprimerUnCreneau(c) {
            reinitialiserMessages();
            try {
                const dispos = await getDisponibilites(travailChoisi.value.id);
                const infos = dispos.find((d) => d.creneauId === c.id);
                const nombre = infos ? infos.nombre : 0;
                const ok = confirm(`Supprimer le créneau ${c.id} ?\n` +
                    `${nombre} réponse(s) d'étudiants seront supprimées avec lui.`
                );
                if (!ok) return;
                await supprimerCreneau(jeton.value, c.id);
                messageSucces.value = 'Créneau supprimé.';
                await chargerCreneaux(travailChoisi.value.id);
            } catch (e) {
                gererErreur(e);
            }
        }
        if (jeton.value !== '') { chargerTravaux(); }

        return {
            jeton, nomEnseignant, identifiant, motDePasse, travaux, travailChoisi, creneaux, nouveauDebut,
            nouveauFin, erreurs, messageSucces, seConnecter, seDeconnecter, ouvrirTravail, fermerTravail,
            enregistrerTravail, enregistrerCreneau, ajoutUnCreneau, supprimerUnCreneau
        };
    }
}).mount('#app');