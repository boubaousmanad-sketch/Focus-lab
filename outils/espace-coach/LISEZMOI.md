# Espace coach : chiffrement

`espace-coach/index.html` contient l’outil nutrition du coach **chiffré** (AES-256-GCM, clé tirée du mot de passe par PBKDF2-SHA-256, 600 000 itérations). Sans le mot de passe ou le lien d’accès du coach, son contenu est illisible.

- `espace-coach.tpl.html` : la page de connexion (mot de passe, lien d’accès direct `#k=…`, « Rester connecté »).
- `chiffre.mjs` : chiffre l’outil. `node chiffre.mjs outil.html fichier-mot-de-passe.txt ../../espace-coach/index.html`

Le sel reste le même d’une version à l’autre (il est repris de la page publiée), donc le lien d’accès direct du coach reste valable tant que le mot de passe ne change pas. L’outil en clair et le mot de passe ne sont jamais mis dans ce dépôt.
