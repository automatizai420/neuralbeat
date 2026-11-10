// ════════════════════════════════════════════════════
// Recordatorio diario — Web Push con Cloudflare Pages Functions
//
// Rutas:
//   GET  /api/push/key          → clave pública VAPID (503 si no está configurado)
//   POST /api/push/subscribe    → { subscription, time:"HH:MM", tzOffset, lang }
//   POST /api/push/unsubscribe  → { endpoint }
//   POST /api/push/cron         → envía los recordatorios que tocan (Authorization: Bearer CRON_SECRET)
//
// Configuración en Cloudflare (Pages → Settings):
//   KV binding:  REMINDERS
//   Variables:   VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY (secreta), VAPID_SUBJECT (mailto:…), CRON_SECRET (secreta)
//
// Diseño:
//   · El push va SIN contenido (no hace falta cifrar). El service worker
//     muestra el texto en el idioma de la persona, que guardó al activar.
//   · Cada suscripción se guarda en  slot:HHMM:<id>  (hora UTC redondeada a
//     15 min) con el endpoint en los metadatos → el cron lista solo el slot
//     que toca, sin lecturas extra.
//   · El plan gratuito permite ~50 peticiones salientes por invocación: el
//     cron envía hasta BATCH avisos por llamada y responde {done:false}
//     para que el llamador repita.
// ════════════════════════════════════════════════════

const BATCH = 40;
const SLOT_MIN = 15;
const PUSH_HOSTS = [
  'fcm.googleapis.com',               // Chrome, Edge, Android
  'updates.push.services.mozilla.com',// Firefox
  'push.services.mozilla.com',
  'web.push.apple.com',               // Safari / iOS (app instalada)
];
const PUSH_HOST_SUFFIXES = ['.notify.windows.com', '.push.apple.com'];

const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
});

// ─── utilidades base64url ───────────────────────────────────────────
const b64uToBytes = (s) => {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  return Uint8Array.from(atob(s), c => c.charCodeAt(0));
};
const bytesToB64u = (b) => btoa(String.fromCharCode(...new Uint8Array(b))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const strToB64u = (s) => bytesToB64u(new TextEncoder().encode(s));

async function sha256Hex(s) {
  const h = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(h)].map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
}

// ─── VAPID (RFC 8292): JWT ES256 firmado con WebCrypto ──────────────
let keyCache = null;
async function vapidKey(env) {
  if (keyCache) return keyCache;
  const pub = b64uToBytes(env.VAPID_PUBLIC_KEY);       // 65 bytes: 0x04 | X | Y
  const jwk = {
    kty: 'EC', crv: 'P-256', ext: true,
    x: bytesToB64u(pub.slice(1, 33)),
    y: bytesToB64u(pub.slice(33, 65)),
    d: env.VAPID_PRIVATE_KEY,
  };
  keyCache = await crypto.subtle.importKey('jwk', jwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
  return keyCache;
}

export async function vapidAuth(endpoint, env, now = Date.now()) {
  const aud = new URL(endpoint).origin;
  const header = strToB64u(JSON.stringify({ typ: 'JWT', alg: 'ES256' }));
  const payload = strToB64u(JSON.stringify({
    aud,
    exp: Math.floor(now / 1000) + 12 * 3600,
    sub: env.VAPID_SUBJECT || 'mailto:admin@example.com',
  }));
  const unsigned = `${header}.${payload}`;
  const sig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, await vapidKey(env), new TextEncoder().encode(unsigned));
  return `vapid t=${unsigned}.${bytesToB64u(sig)}, k=${env.VAPID_PUBLIC_KEY}`;
}

async function sendPush(endpoint, env) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: await vapidAuth(endpoint, env),
      TTL: String(4 * 3600),       // si el teléfono está apagado, vale hasta 4 h
      Urgency: 'normal',
      'Content-Length': '0',
    },
  });
  return res.status;
}

// ─── slots horarios ─────────────────────────────────────────────────
// time "HH:MM" local + tzOffset (Date#getTimezoneOffset: UTC − local, en min)
export function slotFor(time, tzOffset) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(time || ''));
  if (!m) return null;
  const h = +m[1], mi = +m[2];
  if (h > 23 || mi > 59) return null;
  const off = Math.max(-840, Math.min(840, Math.round(+tzOffset || 0)));
  let utc = (h * 60 + mi + off) % 1440;
  if (utc < 0) utc += 1440;
  utc = Math.floor(utc / SLOT_MIN) * SLOT_MIN;
  return String(Math.floor(utc / 60)).padStart(2, '0') + String(utc % 60).padStart(2, '0');
}

const slotToMin = (s) => +s.slice(0, 2) * 60 + +s.slice(2);
const minToSlot = (m) => { m = ((m % 1440) + 1440) % 1440; return String(Math.floor(m / 60)).padStart(2, '0') + String(m % 60).padStart(2, '0'); };

function validEndpoint(endpoint) {
  try {
    const u = new URL(endpoint);
    if (u.protocol !== 'https:') return false;
    return PUSH_HOSTS.includes(u.hostname) || PUSH_HOST_SUFFIXES.some(s => u.hostname.endsWith(s));
  } catch (e) { return false; }
}

// ─── handlers ───────────────────────────────────────────────────────
async function subscribe(request, env) {
  let body;
  try { body = await request.json(); } catch (e) { return json({ error: 'bad json' }, 400); }
  const endpoint = body?.subscription?.endpoint;
  if (!validEndpoint(endpoint)) return json({ error: 'invalid endpoint' }, 400);
  const slot = slotFor(body.time, body.tzOffset);
  if (!slot) return json({ error: 'invalid time' }, 400);
  const lang = /^[a-z]{2}$/.test(body.lang || '') ? body.lang : 'es';

  const id = await sha256Hex(endpoint);
  const prev = await env.REMINDERS.get(`sub:${id}`, 'json');
  if (prev && prev.slot && prev.slot !== slot) await env.REMINDERS.delete(`slot:${prev.slot}:${id}`);
  if (!prev || prev.slot !== slot) {
    await env.REMINDERS.put(`slot:${slot}:${id}`, '', { metadata: { e: endpoint } });
  }
  await env.REMINDERS.put(`sub:${id}`, JSON.stringify({ slot, lang, time: body.time, updated: Date.now() }));
  return json({ ok: true, slot });
}

async function unsubscribe(request, env) {
  let body;
  try { body = await request.json(); } catch (e) { return json({ error: 'bad json' }, 400); }
  if (!body?.endpoint) return json({ error: 'missing endpoint' }, 400);
  const id = await sha256Hex(body.endpoint);
  const prev = await env.REMINDERS.get(`sub:${id}`, 'json');
  if (prev?.slot) await env.REMINDERS.delete(`slot:${prev.slot}:${id}`);
  await env.REMINDERS.delete(`sub:${id}`);
  return json({ ok: true });
}

// Procesa un lote del slot pendiente más antiguo. Repetir mientras done=false.
export async function runCron(env, now = Date.now()) {
  const nowMin = Math.floor((now % 86400000) / 60000);
  const currentSlot = minToSlot(Math.floor(nowMin / SLOT_MIN) * SLOT_MIN);
  const state = (await env.REMINDERS.get('cron:state', 'json')) || {};

  // Primer uso o caída larga (> 2 h): no mandar recordatorios viejos
  let lastDone = state.lastDone;
  const behind = lastDone ? (slotToMin(currentSlot) - slotToMin(lastDone) + 1440) % 1440 : null;
  if (!lastDone || behind > 120) lastDone = minToSlot(slotToMin(currentSlot) - SLOT_MIN);
  if (lastDone === currentSlot) return { done: true, sent: 0, slot: currentSlot };

  const slot = state.slot && state.cursor ? state.slot : minToSlot(slotToMin(lastDone) + SLOT_MIN);
  const list = await env.REMINDERS.list({ prefix: `slot:${slot}:`, limit: BATCH, cursor: state.cursor || undefined });

  let sent = 0, removed = 0;
  await Promise.all(list.keys.map(async (k) => {
    const endpoint = k.metadata && k.metadata.e;
    if (!endpoint) return;
    try {
      const status = await sendPush(endpoint, env);
      if (status === 404 || status === 410) {           // suscripción vencida
        const id = k.name.split(':')[2];
        await env.REMINDERS.delete(k.name);
        await env.REMINDERS.delete(`sub:${id}`);
        removed++;
      } else if (status < 300) sent++;
    } catch (e) { /* red: se reintenta mañana */ }
  }));

  const next = list.list_complete
    ? { lastDone: slot, slot: null, cursor: null }
    : { lastDone, slot, cursor: list.cursor };
  await env.REMINDERS.put('cron:state', JSON.stringify(next));
  const done = list.list_complete && slot === currentSlot;
  return { done, sent, removed, slot };
}

export async function onRequest(context) {
  const { request, env, params } = context;
  const route = (params.path || []).join('/');
  const configured = env.REMINDERS && env.VAPID_PUBLIC_KEY && env.VAPID_PRIVATE_KEY;

  if (route === 'key' && request.method === 'GET') {
    if (!configured) return json({ error: 'not configured' }, 503);
    return json({ publicKey: env.VAPID_PUBLIC_KEY });
  }
  if (!configured) return json({ error: 'not configured' }, 503);

  if (route === 'subscribe' && request.method === 'POST') return subscribe(request, env);
  if (route === 'unsubscribe' && request.method === 'POST') return unsubscribe(request, env);
  if (route === 'cron' && request.method === 'POST') {
    const auth = request.headers.get('Authorization') || '';
    if (!env.CRON_SECRET || auth !== `Bearer ${env.CRON_SECRET}`) return json({ error: 'unauthorized' }, 401);
    return json(await runCron(env));
  }
  return json({ error: 'not found' }, 404);
}
