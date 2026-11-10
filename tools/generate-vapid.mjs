// Genera un par de claves VAPID para el recordatorio diario (Web Push).
// Uso:  node tools/generate-vapid.mjs
// Copia los valores a Cloudflare → Pages → tu proyecto → Settings →
// Variables and Secrets. La clave privada es SECRETA: no la subas al repo.
const { publicKey, privateKey } = await crypto.subtle.generateKey(
  { name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']);
const raw = new Uint8Array(await crypto.subtle.exportKey('raw', publicKey));
const jwk = await crypto.subtle.exportKey('jwk', privateKey);
const b64u = (b) => Buffer.from(b).toString('base64url');
const secret = b64u(crypto.getRandomValues(new Uint8Array(24)));
console.log('VAPID_PUBLIC_KEY  =', b64u(raw));
console.log('VAPID_PRIVATE_KEY =', jwk.d, '   (secreta)');
console.log('CRON_SECRET       =', secret, '   (secreta, también va en GitHub)');
console.log('VAPID_SUBJECT     = mailto:tu-correo@ejemplo.com');
