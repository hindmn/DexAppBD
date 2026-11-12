import { createApp, ref, computed } from 'https://unpkg.com/vue@3.5/dist/vue.esm-browser.js';
import { getCours, getTravaux } from './api.js';

createApp({
    setup() {
        const cours = ref([]);
        const travaux = ref([]);
        const coursChoisi = ref('');
        const messageErreur = ref('');

        const groupes = computed(() => {
            const grpCours = [];
            for (const t of travaux.value) {
                let groupe = grpCours.find((g) => g.id === t.cours_id);
                if (!groupe) {
                    groupe = { id: t.cours_id, titre: t.cours_titre, travaux: [] };
                    grpCours.push(groupe);
                }
                groupe.travaux.push(t);
            }
            return grpCours;
        });
        async function chargerTravaux() {
            messageErreur.value = '';
            try {
                travaux.value = await getTravaux(coursChoisi.value);
            } catch (e) {
                travaux.value = [];
                messageErreur.value = e.erreurs.join(' ');
            }
        }
        async function chargerCours() {
            try {
                cours.value = await getCours();
            } catch (e) {
                messageErreur.value = e.erreurs.join(' ');
            }
        }

        chargerCours();
        chargerTravaux();
        return { cours, coursChoisi, groupes, messageErreur, chargerTravaux, encodeURIComponent };
    }
}).mount('#app');