// service-worker.js
const CACHE_NAME_STATIC = 'static-cache-v1';
const CACHE_NAME_DYNAMIC = 'dynamic-content-cache-v1';

const urlsToCache = [
  // List of static assets to cache
  '/',
  '/index.html',
  '/icon-192x192.png',
  '/icon-512x512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME_STATIC)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  // Handle requests for static assets using the cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );

  // Handle requests for dynamic content using the dynamic cache strategy
  if (event.request.url.startsWith('https://api.example.com/weather')) {
    event.respondWith(
      caches.open(CACHE_NAME_DYNAMIC)
        .then((cache) => {
          return cache.match(event.request)
            .then((response) => {
              if (response) {
                return response;
              }

              return fetch(event.request)
                .then((networkResponse) => {
                  const clonedResponse = networkResponse.clone();
                  cache.put(event.request, clonedResponse);
                  return networkResponse;
                })
                .catch((error) => {
                  console.error('Error fetching dynamic content:', error);
                });
            });
        })
    );
  }
});
