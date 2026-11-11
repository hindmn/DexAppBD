<?php
http_response_code(404);
$titrePage = 'Page introuvable';
require_once __DIR__ . '/includes/entete.php';
?>

<h1>Page introuvable</h1>
<p>Le travail demandé ou l'adresse est invalide.</p>
<p><a href="index.php">Retour à l'accueil</a></p>

<?php require_once __DIR__ . '/includes/pied.php'; ?>