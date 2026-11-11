<?php
$idTravail = $_GET['travail'] ?? '';

if(!is_string($idTravail) || !preg_match('/^[a-z0-9-]{1,30}$/', $idTravail)) {
    http_response_code(404);
    require '404.php';
    exit;
}
$titrePage = 'Travail';
require 'includes/entete.php';
?>

<p><a href="index.php">Retour à l'accueil</a></p>
<div id="app" data-travail="<?= htmlspecialchars($idTravail, ENT_QUOTES, 'UTF_8') ?>">
    <p>Chargement...</p>
</div>

<script type="module" src="js/travail.js"></script>
<?php require 'includes/pied.php'; ?>