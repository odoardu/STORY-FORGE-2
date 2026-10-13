const CACHE_NAME = "story-forge-shell-v1";
const APP_SHELL = [
  "/",
  "/index.html",
  "/styles.css",
  "/editor-core.js",
  "/app.js",
  "/pwa.js",
  "/manifest.webmanifest",
  "/assets/TuskerGrotesk-4600Semibold.otf",
  "/assets/Gotham-Book.otf",
  "/assets/Gotham-Bold.otf",
  "/assets/black-texture.jpg",
  "/assets/black-texture-small.jpg",
  "/assets/mundo-soldier-branca.png",
  "/assets/informative-linkin-park-logos.png",
  "/assets/linkin-park/photos.json",
  "/assets/pwa/icon.svg",
  "/assets/pwa/icon-192.png",
  "/assets/pwa/icon-512.png",
  "/assets/pwa/icon-maskable.svg",
  "/assets/pwa/icon-maskable-512.png",
  "/assets/pwa/apple-touch-icon.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith("story-forge-") && key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.put("/index.html", response.clone())));
          return response;
        })
        .catch(async () => (await caches.match(request)) || (await caches.match("/index.html")))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok && response.type === "basic" && !response.headers.get("content-type")?.includes("text/html")) {
          event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone())));
        }
        return response;
      });
    })
  );
});
