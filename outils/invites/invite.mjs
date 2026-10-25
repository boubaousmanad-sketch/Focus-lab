import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { webcrypto as c } from 'node:crypto';
/* Crée (ou met à jour) la page d’un invité qui n’a accès qu’à l’outil nutrition.

   node outils/invites/invite.mjs <coach> <prénom> <e-mail> [fichier-mot-de-passe-invité]

   <coach> : le lien d’accès direct du coach (…/espace-coach/#k=…) ou un fichier qui contient le mot de passe coach.
   L’invité se connecte avec son e-mail et son mot de passe : la clé est tirée des deux, donc un mot de passe court
   ne suffit pas sans l’e-mail, qui n’est écrit nulle part dans le dépôt.
   Sans fichier de mot de passe invité, un mot de passe solide est créé.

   La page est écrite dans /invite-<prénom>/ (même profondeur que /espace-coach/, donc les liens relatifs de l’outil restent bons).
   L’outil y est chiffré avec une clé propre à l’invité : il ne reçoit jamais la clé du coach.
   L’e-mail, le mot de passe et le lien de l’invité sont seulement affichés ici, jamais écrits dans le dépôt.
   Pour retirer l’accès : supprimer le dossier /invite-<prénom>/. */

const [coachArg, prenom, email, mdpFile] = process.argv.slice(2);
if (!coachArg || !prenom || !email || !email.includes('@')) { console.error('usage : node invite.mjs <lien-coach | fichier-mot-de-passe-coach> <prénom> <e-mail> [fichier-mot-de-passe-invité]'); process.exit(1); }
const mail = email.trim().toLowerCase();

const racine = new URL('../../', import.meta.url).pathname;
const ici = new URL('./', import.meta.url).pathname;
const slug = prenom.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const dossier = racine + 'invite-' + slug + '/';
const sortie = dossier + 'index.html';
const b64 = (u) => Buffer.from(u).toString('base64');
const deB64 = (s) => new Uint8Array(Buffer.from(s, 'base64'));
const b64url = (u) => b64(u).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

/* 1. Ouvrir l’outil du coach publié. */
const coachPage = readFileSync(racine + 'espace-coach/index.html', 'utf8');
const m = /var SEL = '([A-Za-z0-9+/=]+)', IV = '([A-Za-z0-9+/=]+)', ITER = (\d+), DATA = '([A-Za-z0-9+/=]+)'/.exec(coachPage);
if (!m) { console.error('Page coach illisible : format inattendu.'); process.exit(1); }
const [, cSel, cIv, cIter, cData] = m;
let coachKey;
const lien = /[#&]k=([A-Za-z0-9_-]{40,})/.exec(coachArg);
if (lien) {
  coachKey = await c.subtle.importKey('raw', new Uint8Array(Buffer.from(lien[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64')), { name: 'AES-GCM' }, false, ['decrypt']);
} else {
  const pw = readFileSync(coachArg, 'utf8').trim();
  const base = await c.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveKey']);
  coachKey = await c.subtle.deriveKey({ name: 'PBKDF2', salt: deB64(cSel), iterations: Number(cIter), hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
}
let outil;
try { outil = new TextDecoder().decode(await c.subtle.decrypt({ name: 'AES-GCM', iv: deB64(cIv) }, coachKey, deB64(cData))); }
catch (e) { console.error('Lien ou mot de passe coach incorrect.'); process.exit(2); }

/* 2. Adapter la copie : sa propre session, ses propres données sur l’appareil et sa propre adresse,
      pour ne jamais toucher à l’espace coach. Le lien « Retour à FOCUS LAB » renvoie vers le site : l’app est réservée aux clients. */
const cle = 'fl-invite-' + slug + '-cle';
const remplacements = [
  ['fl-espace-coach-cle', cle],
  ['/espace-coach/', '/invite-' + slug + '/'],
  ['fl-nutrition-coach', 'fl-nutrition-invite-' + slug],
  ['<small>Espace coach</small>', '<small>Accès invité</small>'],
  ['href="https://focus-on-performance.bouba-ousmanad.chatgpt.site/index.html" data-app-back>← Retour à FOCUS&nbsp;LAB', 'href="/" data-app-back>← Retour au site'],
];
for (const [a, n] of remplacements) {
  const nb = outil.split(a).length - 1;
  if (nb) { outil = outil.split(a).join(n); console.log(`remplacé ${nb}× « ${a} »`); }
}

/* 3. Chiffrer pour l’invité. Le sel est repris de sa page s’il en a déjà une : même mot de passe, même lien. */
let sel;
if (existsSync(sortie)) { const s = /var SEL = '([A-Za-z0-9+/=]+)'/.exec(readFileSync(sortie, 'utf8')); if (s) sel = deB64(s[1]); }
if (!sel) sel = c.getRandomValues(new Uint8Array(16));
let mdp;
if (mdpFile) mdp = readFileSync(mdpFile, 'utf8').trim();
else {
  const alpha = 'abcdefghjkmnpqrstuvwxyz23456789', r = c.getRandomValues(new Uint8Array(12));
  mdp = Array.from(r, (x) => alpha[x % alpha.length]).join('').replace(/(.{4})(?!$)/g, '$1-');
}
const iv = c.getRandomValues(new Uint8Array(12)), iter = 600000;
const base = await c.subtle.importKey('raw', new TextEncoder().encode(mail + '\n' + mdp), 'PBKDF2', false, ['deriveKey']);
const key = await c.subtle.deriveKey({ name: 'PBKDF2', salt: sel, iterations: iter, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, true, ['encrypt']);
const ct = new Uint8Array(await c.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(outil)));
const raw = b64url(new Uint8Array(await c.subtle.exportKey('raw', key)));
const nom = prenom.charAt(0).toUpperCase() + prenom.slice(1);
const page = readFileSync(ici + 'invite.tpl.html', 'utf8')
  .replace('__PRENOM__', nom).replace('__CLE__', cle)
  .replace('__SEL__', b64(sel)).replace('__IV__', b64(iv)).replace('__ITER__', String(iter)).replace('__DATA__', b64(ct));
mkdirSync(dossier, { recursive: true });
writeFileSync(sortie, page);
console.log('page :', sortie.replace(racine, '/'), page.length, 'octets');
console.log('lien :', 'https://focusandperformance.com/invite-' + slug + '/#k=' + raw);
console.log('e-mail :', mail);
console.log('mot de passe :', mdp);
