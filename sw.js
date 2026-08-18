const CACHE_NAME = 'misrfone-shell-v1';
const SHELL_FILES = [
  './index.html',
  './manifest.json',
  './logo.jpg',
  './banner.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Only cache the app shell (logo, banner, html, manifest).
// Never cache the live audio stream or the now-playing API — those must always be live.
self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  if (url.includes(':8000/radio.mp3') || url.includes('/api/nowplaying')) {
    return; // let it go straight to network
  }
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
