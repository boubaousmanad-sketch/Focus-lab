# FOCUS LAB Mobile

L'app iOS et Android de FOCUS LAB, l'espace client de Focus & Performance. Elle est construite avec [Capacitor](https://capacitorjs.com) 8.5.3.

## Comment l'app fonctionne

- Au lancement, l'app affiche une page de démarrage livrée avec elle (`www/index.html`) : logo FP, « FOCUS LAB », roue de chargement.
- Elle vérifie que FOCUS LAB répond, puis ouvre la version en ligne : `https://focus-on-performance.bouba-ousmanad.chatgpt.site/`.
- Les comptes, les programmes et les données restent ceux du site. Une mise à jour du site apparaît dans l'app sans republier l'app.
- Sans connexion, la page affiche « Pas de connexion à FOCUS LAB » et réessaie toute seule. Elle réapparaît aussi si une page ne se charge plus en cours d'utilisation.
- Les liens vers d'autres sites (Instagram, YouTube, articles) s'ouvrent dans le navigateur ou l'app du téléphone.
- Android : le bouton retour revient à l'écran précédent. Sur le premier écran, l'app passe en arrière-plan.

## Contenu du dossier

| Élément | Rôle |
| --- | --- |
| `capacitor.config.json` | Identifiant, nom, page de démarrage, site autorisé, couleur de fond |
| `package.json` | Versions de Capacitor et commandes |
| `www/` | Page de démarrage et page hors ligne (un seul fichier) |
| `android/` | Projet Android Studio |
| `ios/` | Projet Xcode (Swift Package Manager) |
| `assets/` | Images sources des icônes et des écrans de démarrage |

## Réglages

| Réglage | Valeur | Où le changer |
| --- | --- | --- |
| Identifiant de l'app | `be.focusperformance.focuslab` | `capacitor.config.json`, `android/app/build.gradle`, projet Xcode (ne plus le changer après la première publication) |
| Nom affiché | FOCUS LAB | `capacitor.config.json`, `android/app/src/main/res/values/strings.xml`, `ios/App/App/Info.plist` |
| Adresse de FOCUS LAB | `focus-on-performance.bouba-ousmanad.chatgpt.site` | `www/index.html` (FOCUS_LAB_URL) **et** `capacitor.config.json` (server.allowNavigation) |
| Couleur de fond | `#090b0d` | `capacitor.config.json`, `android/app/src/main/res/values/colors.xml` |
| Version | 1.0 (build 1) | `android/app/build.gradle` (versionName, versionCode) et Xcode (MARKETING_VERSION, CURRENT_PROJECT_VERSION) |

Si FOCUS LAB change d'adresse (par exemple sur ton propre domaine), modifie les deux fichiers indiqués puis republie l'app.

## Compilation automatique sur GitHub

Le fichier `.github/workflows/mobile.yml` compile l'app à chaque modification de `mobile/`.

- **Android** : un APK de test est produit. Pour l'installer sur un téléphone Android : onglet **Actions** du dépôt → dernière exécution de « FOCUS LAB Mobile » → **Artifacts** → `focus-lab-android-debug`. Décompresse le fichier, ouvre l'APK sur le téléphone et autorise l'installation.
- **iOS** : l'app est compilée pour le simulateur, sans signature. Cela vérifie que le projet est correct. L'installation sur un iPhone passe par Xcode ou TestFlight.

## Compiler sur ton ordinateur

Prérequis : Node.js 22 ou plus, Android Studio Otter (2025.2.1) ou plus récent, et pour iOS un Mac avec Xcode 26 ou plus.

```bash
cd mobile
npm install
npx cap sync
npx cap open android   # ouvre le projet dans Android Studio
npx cap open ios       # ouvre le projet dans Xcode (Mac)
```

Commandes directes :

```bash
npm run build:android  # APK de test : android/app/build/outputs/apk/debug/app-debug.apk
npm run build:ios      # compilation pour le simulateur iOS (Mac)
npm run doctor         # diagnostic Capacitor
```

Après `npm install`, ajoute le fichier `package-lock.json` créé au dépôt : il fige les versions installées.

## Icônes et écrans de démarrage

Ils sont tirés du monogramme FP de `images/logo-focus-on.webp` : or et blanc sur fond noir pour l'icône, sur `#090b0d` pour l'écran de démarrage. Les sources sont dans `assets/`. Pour les régénérer après un changement de logo :

```bash
npx @capacitor/assets generate --iconBackgroundColor '#000000' --splashBackgroundColor '#090b0d'
```

## Avant de publier sur l'App Store et Google Play

1. **Valider l'identifiant** `be.focusperformance.focuslab` : il devient définitif à la première publication.
2. **Ouvrir les comptes développeur** : Apple Developer Program et Google Play Console.
3. **Signer l'app** : clé de signature Android (keystore) et certificats Apple via Xcode. Ces fichiers ne doivent jamais aller dans le dépôt : `mobile/.gitignore` les exclut.
4. **Anticiper la validation Apple** : Apple refuse souvent les apps qui se contentent d'afficher un site (règle 4.2, fonctionnalité minimale). Le plus sûr est d'ajouter des fonctions propres à l'app, par exemple les notifications de séance. Si la connexion et les données de FOCUS LAB peuvent fonctionner en dehors de ChatGPT Sites, intègre aussi ses fichiers dans `www/`.
5. **Préparer les fiches** : politique de confidentialité (`confidentialite.html`), questionnaires de confidentialité des deux stores, captures d'écran, description.
6. **Adapter FOCUS LAB** : masquer les boutons « Installer l'app » quand le site tourne dans l'app (`window.Capacitor` existe alors).
