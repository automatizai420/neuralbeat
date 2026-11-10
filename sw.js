// ════════════════════════════════════════════════════
// sw.js — Service worker · uso sin conexión
// Estrategia: red primero (siempre la versión más nueva si hay
// conexión) con respaldo en caché cuando no hay red. Así se evitan
// los problemas de "versión vieja pegada" y la app abre offline.
// Sube CACHE_VERSION si cambia la lista de archivos precargados.
// ════════════════════════════════════════════════════
const CACHE_VERSION = 'coherencia-v9-4';
const PREFS_CACHE = 'coherencia-prefs';   // textos del recordatorio (no se borra al actualizar)
const SHELL = [
  './',
  './index.html',
  './app.js',
  './audio.js',
  './breath.js',
  './presets.js',
  './viz.js',
  './i18n.js',
  './bib.js',
  './intent.js',
  './welcome.js',
  './reminders.js',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
];
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION && k !== PREFS_CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Fuentes de Google: caché primero (no cambian), red de respaldo
  if (FONT_HOSTS.includes(url.hostname)) {
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
        return res;
      }))
    );
    return;
  }

  if (url.origin !== self.location.origin) return;
  if (url.pathname.includes('/api/')) return;   // API: siempre red, nunca caché

  // Mismo origen: red primero, caché si no hay conexión
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() =>
        caches.match(req, { ignoreSearch: true }).then((hit) =>
          hit || (req.mode === 'navigate' ? caches.match('./index.html') : Response.error())
        )
      )
  );
});

// ════════════════════════════════════════════════════
// Recordatorio diario (Web Push)
// El push llega sin contenido; el texto, en el idioma de la persona,
// lo guarda la página con postMessage al activar el recordatorio.
// ════════════════════════════════════════════════════
self.addEventListener('message', (event) => {
  const d = event.data;
  if (!d || d.type !== 'reminder-texts') return;
  event.waitUntil(
    caches.open(PREFS_CACHE).then((c) => c.put('./__reminder', new Response(JSON.stringify(d), { headers: { 'Content-Type': 'application/json' } })))
  );
});

self.addEventListener('push', (event) => {
  event.waitUntil((async () => {
    let d = { title: 'Coherencia', bodies: ['Tu momento de respirar 🌬'], url: './?from=reminder' };
    try {
      const r = await (await caches.open(PREFS_CACHE)).match('./__reminder');
      if (r) d = { ...d, ...(await r.json()) };
    } catch (e) {}
    const body = d.bodies[Math.floor(Math.random() * d.bodies.length)] || '';
    // Siempre mostrar una notificación (Safari revoca el permiso si no)
    await self.registration.showNotification(d.title, {
      body,
      icon: './icons/icon-192.png',
      tag: 'daily-reminder',
      renotify: true,
      data: { url: d.url },
    });
  })());
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = new URL((event.notification.data && event.notification.data.url) || './?from=reminder', self.registration.scope).href;
  event.waitUntil((async () => {
    const wins = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const w of wins) {
      if ('focus' in w) {
        if ('navigate' in w) await w.navigate(url).catch(() => {});
        return w.focus();
      }
    }
    return self.clients.openWindow(url);
  })());
});
