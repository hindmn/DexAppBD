import { createApp, ref, computed } from 'https://unpkg.com/vue@3.5/dist/vue.esm-browser.js';
import { getTravail, getDisponibilites, enregistrerDispo, ErreurApi } from './api.js';

const idTravail = document.getElementById('app').dataset.travail;

createApp({
    setup() {
        const travail = ref(null);
        const disponibilites = ref([]);
        const matricule = ref(localStorage.getItem('matricule') ?? '');
        const nom = ref(localStorage.getItem('nom') ?? '');
        const creneauxCoches = ref([]);
        const erreurs = ref([]);
        const succes = ref(false);
        const messageErreur = ref('');

        const meilleurs = computed(() => {
            const max = Math.max(0, ...disponibilites.value.map((d) => d.nombre));
            if (max === 0) return [];
            return disponibilites.value.filter((d) => d.nombre === max).map((d) => d.creneauId);
        });
        function estMeilleur(creneauId) { return meilleurs.value.includes(creneauId); }

        function cocherCreneaux() {
            if (matricule.value === '') return;
            creneauxCoches.value = disponibilites.value
                .filter((d) => d.etudiants.some((e) => e.matricule === matricule.value)).map((d) => d.creneauId);
        }
        async function chargerDisponibilites() {
            disponibilites.value = await getDisponibilites(idTravail);
        }
        async function charger() {
            try {
                travail.value = await getTravail(idTravail);
                document.title = travail.value.titre + ' | Dex';
                await chargerDisponibilites();
                cocherCreneaux();
            } catch (e) {
                messageErreur.value = e.erreurs.join(' ');
            }
        }
        async function enregistrer() {
            erreurs.value = [];
            succes.value = false;
            try {
                await enregistrerDispo(idTravail, matricule.value, nom.value, creneauxCoches.value);
                localStorage.setItem('matricule', matricule.value);
                localStorage.setItem('nom', nom.value);
                succes.value = true;
                await chargerDisponibilites();
            } catch (e) {
                if (e instanceof ErreurApi) {
                    erreurs.value = e.erreurs;
                } else {
                    throw e;
                }
            }
        }
        charger();
        return {
            travail, disponibilites, matricule, nom, creneauxCoches,
            erreurs, succes, messageErreur, estMeilleur, enregistrer
        };
    }
}).mount('#app');