/* Despacho PT · copia local de la app para que abra sin internet.
   Cambia el número de versión cuando quieras forzar la actualización en todas las tablets. */
const CACHE = 'despacho-pt-v3';
const ASSETS = [
  './',
  './index.html',
  './logo.png',
  'https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(ASSETS.map(u => c.add(u).catch(() => {})))));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;                       // los envíos a Google Sheets nunca se guardan aquí
  const url = new URL(req.url);
  if (url.hostname.endsWith('google.com') || url.hostname.endsWith('googleusercontent.com')) return;

  if (url.origin === self.location.origin) {
    // La app: primero internet (para recibir actualizaciones), si no hay señal usa la copia
    e.respondWith(
      fetch(req).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put(req, cp)); return res; })
        .catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
    );
  } else if (url.hostname === 'unpkg.com') {
    // Librería de la cámara: primero la copia
    e.respondWith(
      caches.match(req).then(r => r || fetch(req).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put(req, cp)); return res; }))
    );
  }
});
