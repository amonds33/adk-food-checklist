# ADK Food — Cuisine V3 (Android / PWA)

## Fonctions

- **Production** : onglets lundi à dimanche, objectifs journaliers, quantités réalisées, case OK automatiquement cochée si réalisé >= prévu, rapport PDF local avec logo, partage Android ou téléchargement.
- **Programmation** : liste de préparations, activation/désactivation des jours avec cases, quantité propre à chaque jour, possibilité de **nouvelle préparation**, suppression d'une préparation.
- **Rapports** : sauvegarde JSON/restauration JSON, export CSV. Fonctionnement hors ligne après une première installation en HTTPS.
- Les données sont enregistrées **sur cet appareil** uniquement (localStorage). Pas de synchronisation avec d'autres appareils.
- Le bouton email ouvre le client mail et **ne l'expédie pas automatiquement**.

## Planning initial tiré du classeur PDF

- Lundi : Mafé 25, Yassa 20, tomate-piment 1 lot, Base Thieb / Thieb (quantité à définir).
- Mardi : Graine 30, Mafé 25, sauce oignon 1 lot, Thieb (quantité à définir).
- Mercredi : Thieb, épluchage oignons, contrôle des stocks et rotation FIFO.
- Jeudi : Mafé 25, Graine 30, Kedjenou 20, Thieb et préparation réserves week-end.
- Vendredi : sauce oignon 1 lot, Thieb et contrôle des stocks week-end.
- Samedi : Thieb, contrôles et réassort.
- Dimanche : Thieb, inventaire et anticipation de lundi.

**Attention : incohérence du document source.** Ses fiches journalières indiquent Mafé 25 le lundi, mardi et jeudi (= 75), alors que la synthèse annonce 50 hebdomadaires. Pour Graine, les fiches mardi et jeudi indiquent 30 chacune (= 60), contre 30 dans la synthèse. La V2 reprend les chiffres journaliers littéralement : à corriger dans Programmation selon vos objectifs réels.

## Déploiement avec GitHub Pages

1. Téléchargez et décompressez le ZIP. Importez les fichiers **directement à la racine** du dépôt `adk-food-cuisine`, en remplaçant les anciens.
2. GitHub > Settings > Pages : `Deploy from a branch`, branche `main`, dossier `/(root)`.
3. Sur Android, ouvrez l'URL Pages dans Chrome. Vérifiez l'étiquette **V2** dans l'en-tête.
4. Si une ancienne version persiste, testez dans un nouvel onglet Chrome avant de relancer l'icône installée ; une ancienne PWA peut être encore chargée en cache. Ne supprimez aucune donnée de site avant d'avoir sauvegardé le JSON.
5. Chrome > menu ⋮ > Installer l'application ou Ajouter à l'écran d'accueil.

## Important

La fonction de production suit la planification type sur tous les jours et toutes les semaines. Les quantités **réalisées** restent datées dans l'historique. Si vous modifiez le programme hebdomadaire, cette modification s'applique aussi à l'affichage des semaines passées (les saisies ne sont pas supprimées). Cette version n'est pas une application multiutilisateur ni un suivi HACCP complet : appliquez les fiches PMS pour le refroidissement, les températures et les lots.

## Nouveauté V3 — Rapport PDF

- Depuis **Production**, sélectionner le jour, renseigner les quantités et le responsable, puis cliquer **Partager le rapport PDF**.
- Sur Android, sélectionner Gmail dans la feuille de partage. **Vérifier le destinataire `contact@adk-food.fr`** et envoyer.
- Si le partage natif est indisponible, le PDF est téléchargé dans Téléchargements ; le joindre dans Gmail.
- Le bouton **Télécharger le PDF** conserve une copie locale ; aucune connexion Internet n’est requise pour créer le PDF.
- Même logique de planification et les mêmes données locales que la V2 : ne pas effacer les données du site.
- La production reste sauvegardée par date ; les objectifs du PDF suivent le planning type actuellement défini.
