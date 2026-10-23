const CACHE_NAME = "story-forge-shell-v32-feed-video-frames";
const LOCAL_PREVIEW = ["localhost", "127.0.0.1", "[::1]"].includes(self.location.hostname);
const APP_SHELL = [
  "/",
  "/index.html",
  "/styles.css",
  "/studio-ui.css",
  "/studio-ui.js",
  "/studio-motion.js",
  "/media-loading-border.js",
  "/content-ideas.js",
  "/catalog/content-ideas.json",
  "/artwork-effects.js",
  "/editor-core.js",
  "/editor-history.js",
  "/polaroid.js",
  "/app.js",
  "/assets/vendor/video-export.js",
  "/pwa.js",
  "/manifest.webmanifest",
  "/assets/TuskerGrotesk-4600Semibold.otf",
  "/assets/Gotham-Book.otf",
  "/assets/Gotham-Bold.otf",
  "/assets/black-texture.jpg",
  "/assets/black-texture-small.jpg",
  "/assets/mundo-soldier-v2.svg",
  "/assets/mundo-soldier-alternativa.svg",
  "/assets/informative-linkin-park-logos.png",
  "/assets/logos/LOGO%201%20MONO.png",
  "/assets/textures/ECLUS%C3%83O%2038.png",
  "/assets/textures/LUZ%20INDIRETA%2049.png",
  "/assets/linkin-park/photos.json",
  "/assets/linkin-park/152259918.jpg",
  "/assets/pwa/icon.svg",
  "/assets/pwa/icon-192.png",
  "/assets/pwa/icon-512.png",
  "/assets/pwa/icon-maskable.svg",
  "/assets/pwa/icon-maskable-512.png",
  "/assets/pwa/apple-touch-icon.png"
];

self.addEventListener("install", (event) => {
  if (LOCAL_PREVIEW) {
    event.waitUntil(self.skipWaiting());
    return;
  }
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith("story-forge-") && (LOCAL_PREVIEW || key !== CACHE_NAME)).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;

  if (LOCAL_PREVIEW) {
    event.respondWith(fetch(request));
    return;
  }

  if (request.mode === "navigate" || url.pathname === "/catalog/content-ideas.json") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.put(request.mode === "navigate" ? "/index.html" : request, response.clone())));
          return response;
        })
        .catch(async () => (await caches.match(request)) || (request.mode === "navigate" ? await caches.match("/index.html") : new Response('{"cards":[]}', { headers: { "Content-Type": "application/json" } })))
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
