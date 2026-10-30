# ADK Food — Version 2 : logo et rapport e-mail

## Ce qui a été ajouté
- Logo officiel Abidjan-Dakar Food dans l’en-tête et sur les icônes Android.
- Bouton **Envoyer le rapport par e-mail**, adressé à contact@adk-food.fr.
- Rapport avec date, service, responsable, produits vérifiés, quantités, objectifs, manques et remarques.
- Les contrôles doivent être enregistrés avant de préparer le message.

**Important :** l’envoi n’est PAS automatique. Le bouton ouvre le client e-mail (Gmail, etc.) avec un brouillon prérempli ; une personne doit confirmer l’envoi. Une application mail configurée est nécessaire, ainsi qu'Internet pour envoyer le message. L'application de check-list continue à fonctionner hors connexion.

## Installation via GitHub Pages
1. Ouvrir https://github.com/new et créer un dépôt PUBLIC nommé `adk-food-checklist` (cocher Add a README si nécessaire pour initialiser).
2. Dans le dépôt, choisir **Add file → Upload files**. Décompresser le ZIP et importer **les fichiers qui se trouvent DANS le dossier**, directement à la racine du dépôt (index.html, app.js, styles.css, logo-adk.png, les icônes, manifest.webmanifest, sw.js, .nojekyll). Ne pas téléverser seulement le ZIP.
3. Cliquer sur **Commit changes** (ou Propose changes selon l'interface ; confirmer le commit).
4. Dans **Settings → Pages**, choisir Source `Deploy from a branch`, Branch `main`, Dossier `/ (root)` puis Save.
5. Ouvrir `https://NOM-UTILISATEUR.github.io/adk-food-checklist/` sur Chrome Android, puis dans le menu ⋮ choisir `Installer l'application` ou `Ajouter à l'écran d'accueil`.
6. Choisir Objectifs, configurer les quantités midi/soir, remplir un contrôle, enregistrer, puis appuyer sur `Envoyer le rapport par e-mail`. Vérifier le brouillon dans Gmail puis l'envoyer.

## Confidentialité et stockage
Les données restent sur le téléphone/la tablette où la check-list est utilisée (localStorage). Un autre téléphone n'a pas le même historique. GitHub Pages héberge seulement le code public de l'application, pas les rapports ni les données locales. Faire une sauvegarde JSON régulièrement. Ne pas mettre de secrets dans le dépôt public.
