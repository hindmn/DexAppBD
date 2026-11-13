# Dex : TP2
Cours : Programmation web 2 (420-248-AH gr : 42051)
Fait par : Hind Manouzi (2262749)

## Présentation du projet
- **API** (Express, Node.js): C'est la seule couche qui lit et écrit dans la base `DexAppBD`, sur http://localhost:3000/api ;
- **Site Web** (PHP):  Seulement le HTML et le routage, il n'a aucun accès à la base. Son URL: http://localhost/dex-tp2/site/ .
- **Interface** (Vue): Elle appelle l'API avec fetch et met les pages à jour sans rechargement.

## Fonctionnalités
1. Page Accueil : Affiche la liste des travaux ouverts, filtrables par cours sans rechargement.
2. Page Travail : Affiche un tableau avec le nombre de disponibilités, les noms et le meilleur créneau. Le nom et le matricule sont enregistrés dans localStorage et les créneaux choisis sont recochés lorsqu'on recharge la page.
3. Administration : Permet la connexion par jeton et la connexion reste dans sessionStorage donc elle est effacée lorsqu'on ferme la page. Cette page permet de modifier les informations d'un travail du professeur connecté: modification du titre, de la description, l'ajout/suppression de créneaux, etc. Avec une confirmation qui affiche le nombre de réponses supprimées.

## L'installation
1. Il faut d'abord démarrer **Apache** et **MySQL** dans le panneau XAMPP.
2. Ensuite, on ouvre phpMyAdmin, http://localhost/phpmyadmin, on clique sur le nom du serveur, puis sur l'onglet **Importer**.
3. On choisit le fichier fourni par l'enseignant `init.sql` et on clique sur **Importer**. On devrait voir une base de données `DexAppBD` avec 5 tables. Aussi, le script `init.sql` peut être réimporté sans erreur ni doublon. 
4. Pour l'**API**, on écrit sur le terminal VS Code de notre projet ces commandes : 
```bash
cd api 
npm install
npm run dev
```
Ensuite, l'API démarre sur http://localhost:3000.

5. Pour le **Site Web**, cloner le dépôt github dans le dossier `\xampp\htdocs\` en le nommant `dex-tp2`
``` bash
git clone https://github.com/hindmn/DexAppBD.git dex-tp2
```
6. Ensuite, avec **Apache** démarré on ouvre http://localhost/dex-tp2/site/.

## Les comptes de démonstration
| Identifiant | Mot de passe | Enseignant | Cours |
|---|---|---|---|
| prof | dex2026 | Claire Dubois | 420-245-AH, 420-248-AH |
| prof2 | web2026 | Marc Tremblay | 420-244-AH, 420-253-AH |