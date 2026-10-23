# Focus & Performance

Site du coaching Focus & Performance : préparation physique sur mesure par Bouba Ousmana, à Namur et en ligne.

## Contenu

- `coach.html` : la page vitrine. Elle présente les profils, la méthode et l'app FOCUS LAB. Elle contient le questionnaire « Trouve ton programme » et les programmes VERSUS, BUILD, PERFORMANCE et Préparation d'objectif. Viennent ensuite la rubrique Nutrition, le Running Club, le coach, les questions fréquentes et le formulaire de demande.
- La rubrique Nutrition (`#nutrition`, dans `coach.html`) reprend le calculateur de plan alimentaire en quatre onglets : besoins (métabolisme, objectif, macros, cyclage des calories), timing autour de l’entraînement, plan repas de la semaine et semaine type. Les chiffres du visiteur restent dans son navigateur.
- `images/` : les photos de séance, les couvertures des programmes, le logo, l'image de partage et l'icône du site.
- `fonts/` : la police Archivo, sous licence SIL Open Font License (voir `fonts/OFL-Archivo.txt`).

## Pas encore dans le dépôt

L'app FOCUS LAB (`index.html`), `journal.html`, `confidentialite.html` et `focus-performance-brand.png` sont publiés sur ChatGPT Sites. `coach.html` contient des liens vers ces pages : ajoute-les ici pour réunir tout le site au même endroit.

## Réglages

L'objet `CONFIG`, en bas de `coach.html`, contient l'e-mail de contact et le compte Instagram. Il accepte aussi des options facultatives : WhatsApp, une vidéo pour la section coach et une adresse qui reçoit les demandes du formulaire.

## Liste des aliments

La liste `ALIMENTS`, dans le script en bas de `coach.html`, contient les aliments du calculateur nutrition : `['Nom', 'Catégorie', protéines, glucides, lipides]` pour 100 g, ou avec une 6e valeur pour une unité (`'pièce'`, `'tranche'`…). Les calories se calculent seules. La semaine type se trouve juste en dessous, dans `SEMAINE_TYPE`.

## Mise en ligne

Publie `coach.html` avec les dossiers `images/` et `fonts/` à la racine du site.
