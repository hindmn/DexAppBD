<?php
$titrePage = 'Accueil';
require 'includes/entete.php';
?>

<div id="app" v-cloak>
    <h1>Accueil</h1>
    <p>
        <label for="cours">Cours</label>
        <select id="cours" v-model="coursChoisi">
            <option value="">Tous les cours</option>
            <option v-for="c in cours" :key="c.id" value="c.id">{{c.id}} {{c.titre}}</option>
        </select>
    </p>
    <p v-if="messageErreur" class="message-erreur">{{messageErreur}}</p>
    <p v-if="!messageErreur" class="message-erreur">{{messageErreur}}</p>
    <p v-if="!messageErreur && groupes.length === 0">Aucun travail ouvert n'a été trouvé.</p>
    <section v-for="g in groupes" :key="g.id">
        <h2>{{g.id}} {{g.titre}}</h2>
        <ul>
            <li v-for="t in g.travaux" :key="t.id">
                <h3>{{t.titre}}</h3>
                <p>Type : {{t.type}}</p>
                <p>Remise : {{t.remise}}</p>
                <a href="'travail.php?travail=' + encodeURIComponent(t.id)">Voir le travail</a>
            </li>
        </ul>
    </section>
</div>
<script type="module" src="js/index.js"></script>
<?php require 'includes/pied.php'; ?>