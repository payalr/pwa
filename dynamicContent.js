// dynamicContent.js
const CACHE_NAME_DYNAMIC = 'dynamic-content-cache-v1';

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // If the request is in the cache, return it
        if (response) {
          return response;
        }

        // If the request is not in the cache, fetch it from the network
        return fetch(event.request)
          .then((response) => {
            // Clone the response to save a copy in the cache
            const clonedResponse = response.clone();

            caches.open(CACHE_NAME_DYNAMIC)
              .then((cache) => {
                // Save the response to the cache
                cache.put(event.request, clonedResponse);
              });

            return response;
          })
          .catch((error) => {
            console.error('Error fetching dynamic content:', error);
          });
      })
  );
});
