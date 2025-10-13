const CACHE_NAME = "codequest-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/assets/css/main.css",
  "/assets/css/themes.css",
  "/assets/js/app.js",
  "/assets/js/challenges.js",
  "/assets/js/progress.js",
  "/assets/js/gamification.js",
  "/assets/js/editor.js",
  "/assets/js/obsidian.js",
];

// Install event - cache resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch event - serve from cache when possible
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return response || fetch(event.request);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
