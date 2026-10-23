# Focus & Performance

Site du coaching Focus & Performance : préparation physique sur mesure par Bouba Ousmana, à Namur et en ligne.

## Contenu

- `coach.html` : la page vitrine. Elle présente les profils, la méthode et l'app FOCUS LAB. Elle contient le questionnaire « Trouve ton programme » et les programmes VERSUS, BUILD, PERFORMANCE et Préparation d'objectif. Viennent ensuite la rubrique Nutrition, le Running Club, le coach, les questions fréquentes et le formulaire de demande.
- La rubrique Nutrition (`#nutrition`, dans `coach.html`) présente l’outil nutrition de FOCUS LAB sans le calcul : l’outil complet est réservé au coach et n’est pas publié dans ce dépôt.
- `images/` : les photos de séance, les couvertures des programmes, le logo, l'image de partage et l'icône du site. Les fichiers suffixés par une largeur (`-640.avif`, `-480.webp`…) sont les versions allégées servies par la page.
- `outils/optimiser-images.py` : recrée ces versions allégées (AVIF et WebP, plusieurs largeurs) à partir des images d'origine. Relance-le après avoir remplacé une photo : `python3 outils/optimiser-images.py`.
- `fonts/` : la police Archivo, sous licence SIL Open Font License (voir `fonts/OFL-Archivo.txt`).

## Pas encore dans le dépôt

L'app FOCUS LAB (`index.html`), `journal.html`, `confidentialite.html` et `focus-performance-brand.png` sont publiés sur ChatGPT Sites, et `coach.html` y renvoie par leur adresse complète. Pour réunir tout le site ici, ajoute ces fichiers et remets des liens relatifs (`index.html`…).

## Réglages

L'objet `CONFIG`, en bas de `coach.html`, contient l'e-mail de contact et le compte Instagram. Il accepte aussi des options facultatives : WhatsApp, une vidéo pour la section coach et une adresse qui reçoit les demandes du formulaire.

## Mise en ligne

Publie `coach.html` avec les dossiers `images/` et `fonts/` à la racine du site.

Avec GitHub Pages (Settings, Pages, « Deploy from a branch », branche `main`, dossier racine), la vitrine est publiée à https://boubaousmanad-sketch.github.io/Focus-lab/coach.html et se met à jour à chaque modification de la branche `main`. `404.html` renvoie les adresses inconnues, et la racine du site, vers la vitrine. L’app FOCUS LAB, le fil du coach et la confidentialité restent sur ChatGPT Sites : les liens de `coach.html` pointent vers ces pages.

## Version haut de gamme (octobre 2026)

- Styles et script communs : `assets/site.css` et `assets/site.js` (mis en cache d’une page à l’autre).
- Accueil : ouverture plein écran, défilé de mots, cartes VERSUS / BUILD / PERFORMANCE, tuiles, bandeau photo, pied de page complet.
- Pages intérieures : ouverture photo avec grand titre, page suivante en bas.
- En-tête transparent sur la photo, menu plein écran sur téléphone, transitions entre les pages.
- `outils/construire-site-premium.py` : script qui a produit cette version à partir de l’ancienne.
- Accueil : les photos d’ouverture se relaient en fondu (chargées après la page, arrêtées si « réduire les animations »).
- Nutrition : anneau protéines / glucides / lipides au lieu d’une photo, bloc « Ton plan, partout ».
- Partage et Google : titres et descriptions par page, fil d’Ariane et FAQ en données structurées, page 404 « Hors piste ».
