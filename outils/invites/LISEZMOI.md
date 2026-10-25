# Invités : accès au seul calculateur nutrition

Un invité reçoit une page à lui, `/invite-<prénom>/`, qui ne contient que l’outil nutrition. Il se connecte avec son e-mail et son mot de passe, ou avec son lien d’accès direct. L’outil y est chiffré avec une clé propre à l’invité (AES-256-GCM, clé tirée de son e-mail et de son mot de passe par PBKDF2-SHA-256, 600 000 itérations) : il n’a jamais la clé ni le mot de passe du coach, et rien de ce qu’il fait n’est enregistré chez le coach.

## Ajouter un invité

```
node outils/invites/invite.mjs <lien coach ou fichier-mot-de-passe-coach> <prénom> <e-mail> [fichier-mot-de-passe-invité]
```

Le script ouvre l’outil publié dans `espace-coach/index.html`, le chiffre pour l’invité et écrit `invite-<prénom>/index.html`. Il affiche le lien d’accès direct, l’e-mail et le mot de passe de l’invité, qui ne vont jamais dans ce dépôt. Sa copie a sa propre session et ses propres données sur l’appareil, et son lien de retour mène au site. Sans fichier de mot de passe, il en crée un solide.

Pour mettre la page en ligne, pousser sur `feat/focus-lab-mobile`, la branche publiée par GitHub Pages (et sur `main`).

## Changer son mot de passe ou mettre son outil à jour

Relancer la même commande (avec le nouveau mot de passe s’il en change). Le sel de sa page est repris : avec le même e-mail et le même mot de passe, son lien reste valable.

## Retirer l’accès

Supprimer le dossier `invite-<prénom>/`. Son lien et son mot de passe ne servent plus à rien, et l’adresse renvoie vers l’accueil du site.

## Invités actuels

- Kenny : `invite-kenny/`
