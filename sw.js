const CACHE_NAME = 'portada-digital-v2';
const SHELL_FILES = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL_FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Deja pasar las peticiones a los iframes (FarmaCheck y Cartera)
  if (
    url.hostname === 'marceoviedo1980.github.io' &&
    (url.pathname.startsWith('/FarmaCheck') || url.pathname.startsWith('/cartera-servicios'))
  ) {
    return;
  }

  // Cache-first para los archivos del shell
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
