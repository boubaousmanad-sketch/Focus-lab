import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { webcrypto as c } from 'node:crypto';
/* Chiffre l’outil coach (AES-256-GCM, clé tirée du mot de passe par PBKDF2).
   Le sel reste le même d’une version à l’autre : la clé ne change pas tant que le mot de passe ne change pas,
   donc le lien d’accès direct du coach reste valable après chaque mise à jour. */
const [src, pwFile, out] = process.argv.slice(2);
const dir = new URL('./', import.meta.url).pathname;
const pw = readFileSync(pwFile, 'utf8').trim();
const html = readFileSync(src);
const selFile = dir + 'coach_sel.txt';
if (!existsSync(selFile)) {
  /* Le sel n’est pas secret : s’il manque, on reprend celui de la page déjà publiée, sinon on en crée un. */
  const ancien = existsSync(out) ? /var SEL = '([A-Za-z0-9+/=]+)'/.exec(readFileSync(out, 'utf8')) : null;
  writeFileSync(selFile, ancien ? ancien[1] : Buffer.from(c.getRandomValues(new Uint8Array(16))).toString('base64'));
}
const salt = new Uint8Array(Buffer.from(readFileSync(selFile, 'utf8').trim(), 'base64'));
const iv = c.getRandomValues(new Uint8Array(12)), iter = 600000;
const base = await c.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveKey']);
const key = await c.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: iter, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, true, ['encrypt']);
const ct = new Uint8Array(await c.subtle.encrypt({ name: 'AES-GCM', iv }, key, html));
const raw = Buffer.from(await c.subtle.exportKey('raw', key)).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const b64 = (u) => Buffer.from(u).toString('base64');
const page = readFileSync(dir + 'espace-coach.tpl.html', 'utf8')
  .replace('__SEL__', b64(salt)).replace('__IV__', b64(iv)).replace('__ITER__', String(iter)).replace('__DATA__', b64(ct));
writeFileSync(out, page);
writeFileSync(dir + 'coach_lien.txt', 'https://focusandperformance.com/espace-coach/#k=' + raw + '\n');
console.log('ok', page.length);
