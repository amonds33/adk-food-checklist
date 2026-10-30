# ADK Food V4 — Mise à jour et validation automatique

- Même adresse web GitHub Pages, aucune nouvelle URL requise.
- En haut de la page le numéro **V4** confirme que la mise à jour est chargée.
- La case OK se coche lorsque quantité >= objectif du service; elle se décoche si la quantité devient insuffisante.
- La case reste décochée si aucune quantité n’est renseignée; sans objectif, elle est manuelle.
- Nouveau service worker *network-first* : met à jour les fichiers en ligne tout en permettant une utilisation hors connexion.

## Déploiement GitHub
1. Décompresser le ZIP.
2. Importer **les fichiers à la racine** du dépôt GitHub (écraser les mêmes noms), valider le commit.
3. Dans GitHub, vérifier Actions/Pages que le déploiement est terminé.
4. Sur Android ouvrir l'URL du site dans Chrome (pas l'icône de l'application), puis actualiser; le haut doit indiquer V4.
5. Une fois V4 visible, ouvrir l'application depuis l'icône. Si l'ancienne version reste, fermer l'application et la relancer tout en étant connecté à Internet.

**Important :** Ne supprimez pas les données du site ni l'application sans exporter une sauvegarde JSON, sinon l'historique peut être perdu.
