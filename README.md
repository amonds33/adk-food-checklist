# ADK Food — V3 : validation automatique des objectifs

## Nouveauté
- Dès qu’une quantité saisie est **supérieure ou égale à l’objectif** défini pour le service, la case **OK** du produit se coche automatiquement.
- Si la quantité est inférieure à l’objectif, la case est décochée et le manque exact est indiqué.
- Si la quantité est effacée, la case OK se décoche.
- Sans objectif défini, la case reste à cocher manuellement.
- Les manques figurent dans le rapport e-mail **même lorsque la case OK est décochée**.
- Les objectifs restent modifiables dans l’onglet « Objectifs ».

## Mettre à jour GitHub Pages
1. Décompresser ce ZIP.
2. Ouvrir le dépôt GitHub `adk-food-checklist`.
3. Importer tous les fichiers décompressés à la racine (remplacer les fichiers existants).
4. Valider avec « Commit changes ».
5. Recharger le site sur Android connecté à Internet ; si l’ancienne version persiste, fermer puis rouvrir l’application ou vider uniquement le cache du site (ne pas supprimer les données du site).

## Envoi de rapport
Le bouton ouvre une application mail avec le rapport prérempli pour contact@adk-food.fr ; le responsable confirme l’envoi.

## Données
Les contrôles demeurent stockés sur chaque appareil (localStorage). Exporter régulièrement la sauvegarde JSON.
