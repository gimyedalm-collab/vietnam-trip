const CACHE_NAME = 'vt-trip-v1';
const ASSETS = [
  '/vietnam-trip/',
  '/vietnam-trip/index.html',
  '/vietnam-trip/manifest.json',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Caveat:wght@400;700&display=swap',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const fetched = fetch(e.request)
        .then((res) => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(e.request, clone));
          }
          return res;
        })
        .catch(() => cached);
      return cached || fetched;
    }),
  );
});
