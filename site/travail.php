<?php
$idTravail = $_GET['travail'] ?? '';

if (!is_string($idTravail) || !preg_match('/^[a-z0-9-]{1,30}$/', $idTravail)) {
    http_response_code(404);
    require '404.php';
    exit;
}
$titrePage = 'Travail';
require 'includes/entete.php';
?>

<p><a href="index.php">Retour à l'accueil</a></p>
<div id="app" data-travail="<?= htmlspecialchars($idTravail, ENT_QUOTES, 'UTF-8') ?>" v-cloak>
    <p v-if="messageErreur" class="message-erreur">{{ messageErreur }}</p>
    <template v-if="travail">
        <p>{{ travail.cours_id }} - {{ travail.cours_titre }}</p>
        <h1>{{ travail.titre }}</h1>
        <p>{{ travail.description }}</p>
        <p>Type : {{ travail.type }}</p>
        <p>Remise : {{ travail.remise }}</p>
        <h2>Vos disponibilités</h2>
        <div v-if="erreurs.length > 0" class="message-erreur">
            <p>Veuillez corriger ces erreurs:</p>
            <ul>
                <li v-for="e in erreurs">{{ e }}</li>
            </ul>
        </div>
        <p v-if="succes" class="message-succes">Vos disponibilités ont été enregistrées!</p>

        <form @submit.prevent="enregistrer">
            <p>
                <label for="matricule">Matricule</label>
                <input type="text" id="matricule" maxlength="20" v-model="matricule">
            </p>
            <p>
                <label for="nom">Nom</label>
                <input type="text" id="nom" maxlength="100" v-model="nom">
            </p>

            <table>
                <thead>
                    <tr>
                        <th>Libre</th>
                        <th>Créneau</th>
                        <th>Disponibles</th>
                        <th>Noms</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="d in disponibilites" :key="d.creneauId">
                        <td>
                            <input type="checkbox" :id="'cr-' + d.creneauId" :value="d.creneauId"
                                v-model="creneauxCoches">
                        </td>
                        <td>
                            <label :for="'cr-' + d.creneauId">{{ d.debut }} à {{ d.fin }}</label>
                            <strong v-if="estMeilleur(d.creneauId)">Meilleur créneau</strong>
                        </td>
                        <td>{{ d.nombre }}</td>
                        <td>{{ d.noms.length === 0 ? 'Aucun' : d.noms.join(', ') }}</td>
                    </tr>
                </tbody>
            </table>
            <button type="submit">Soumettre</button>
        </form>
    </template>
</div>

<script type="module" src="js/travail.js"></script>
<?php require 'includes/pied.php'; ?>