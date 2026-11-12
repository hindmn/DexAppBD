<?php
$titrePage = 'Administration';
require 'includes/entete.php';
?>

<div id="app" v-cloak>
    <h1>Administration</h1>
    <div v-if="erreurs.length > 0" class="message-erreur">
        <ul>
            <li v-for="e in erreurs">{{ e }}</li>
        </ul>
    </div>
    <p v-if="messageSucces" class="message-succes">{{ messageSucces }}</p>

    <form v-if="!jeton" @submit.prevent="seConnecter">
        <p>
            <label for="identifiant">Identifiant</label>
            <input type="text" id="identifiant" v-model="identifiant">
        </p>
        <p>
            <label for="motDePasse">Mot de passe</label>
            <input type="password" id="motDePasse" v-model="motDePasse">
        </p>
        <button type="submit">Se connecter</button>
    </form>

    <template v-else>
        <p>
            Bonjour, {{ nomEnseignant }}.
            <button @click="seDeconnecter">Se déconnecter</button>
        </p>
        <table v-if="!travailChoisi">
            <thead>
                <tr>
                    <th>Cours</th>
                    <th>Titre</th>
                    <th>Type</th>
                    <th>Remise</th>
                    <th>État</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="t in travaux" :key="t.id">
                    <td>{{ t.cours_titre }}</td>
                    <td>{{ t.titre }}</td>
                    <td>{{ t.type }}</td>
                    <td>{{ t.remise }}</td>
                    <td>{{ t.ouvert ? 'Ouvert' : 'Fermé' }}</td>
                    <td><button @click="ouvrirTravail(t)">Modifier</button></td>
                </tr>
            </tbody>
        </table>

        <template v-else>
            <p> <button @click="fermerTravail">← Retour à la liste</button> </p>
            <h2>{{ travailChoisi.id }}</h2>
            <form @submit.prevent="enregistrerTravail">
                <p>
                    <label for="titre">Titre</label>
                    <input type="text" id="titre" maxlength="150" v-model="travailChoisi.titre">
                </p>
                <p>
                    <label for="description">Description</label>
                    <textarea id="description" v-model="travailChoisi.description"></textarea>
                </p>
                <p>
                    <label for="type">Type</label>
                    <select id="type" v-model="travailChoisi.type">
                        <option value="individuel">individuel</option>
                        <option value="equipe">equipe</option>
                    </select>
                </p>
                <p>
                    <label for="disponible">Disponible le</label>
                    <input type="date" id="disponible" v-model="travailChoisi.disponible">
                </p>
                <p>
                    <label for="remise">Remise</label>
                    <input type="datetime-local" id="remise" v-model="travailChoisi.remise">
                </p>
                <p>
                    <label>
                        <input type="checkbox" v-model="travailChoisi.ouvert"> Travail ouvert
                    </label>
                </p>
                <button type="submit">Enregistrer le travail</button>
            </form>

            <h3>Créneaux</h3>
            <ul>
                <li v-for="c in creneaux" :key="c.id">
                    {{ c.id }}
                    <input type="datetime-local" v-model="c.debut"> 
                    à
                    <input type="datetime-local" v-model="c.fin">
                    <button @click="enregistrerCreneau(c)">Enregistrer</button>
                    <button @click="supprimerUnCreneau(c)">Supprimer</button>
                </li>
            </ul>

            <h4>Ajouter un créneau</h4>
            <form @submit.prevent="ajoutUnCreneau">
                <input type="datetime-local" v-model="nouveauDebut">
                à
                <input type="datetime-local" v-model="nouveauFin">
                <button type="submit">Ajouter</button>
            </form>
        </template>
    </template>
</div>
<script type="module" src="js/admin.js"></script>

<?php require 'includes/pied.php'; ?>