<!DOCTYPE html>
<html lang="fr-CA">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/style.css">
    <title><?= htmlspecialchars($titrePage ?? 'Accueil', ENT_QUOTES, 'UTF-8') ?> | Dex</title>
</head>

<body>
    <header>
        <a href="index.php" class="logo">Dex</a>

        <nav>
            <a href="index.php">Accueil</a>
            <a href="admin.php"></a>
        </nav>
    </header>
    <main>