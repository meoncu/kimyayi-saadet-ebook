const CACHE_NAME = 'kimyayi-saadet-752-pages-v5-final';
const ASSETS_TO_CACHE = [
  './index.html?v=752_v5_final',
  './styles.css?v=752_v5_final',
  './app.js?v=752_v5_final',
  './book_database.js?v=752_v5_final',
  './manifest.json'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(k => {
          if (k !== CACHE_NAME) {
            console.log('Purging obsolete cache:', k);
            return caches.delete(k);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Always fetch latest from network first
  event.respondWith(
    fetch(event.request, { cache: 'no-cache' }).then(response => {
      if (response && response.status === 200) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      }
      return response;
    }).catch(() => {
      return caches.match(event.request);
    })
  );
});
