const CACHE_NAME = "story-forge-shell-v40-workbench-pwa";
const LOCAL_PREVIEW = ["localhost", "127.0.0.1", "[::1]"].includes(self.location.hostname);
const APP_SHELL = [
  "/",
  "/index.html",
  "/styles.css?v=20261027-workbench-pwa",
  "/studio-ui.css?v=20261027-workbench-pwa",
  "/studio-refinement.css?v=20261027-workbench-pwa",
  "/workbench-preview-ui.js?v=20261027-workbench-pwa",
  "/studio-motion.js?v=20261027-workbench-pwa",
  "/media-loading-border.js?v=20261027-workbench-pwa",
  "/content-ideas.js?v=20261027-workbench-pwa",
  "/catalog/content-ideas.json",
  "/artwork-effects.js?v=20261027-workbench-pwa",
  "/editor-core.js?v=20261027-workbench-pwa",
  "/export-review.js?v=20261027-workbench-pwa",
  "/export-review.css?v=20261027-workbench-pwa",
  "/editor-history.js?v=20261027-workbench-pwa",
  "/polaroid.js?v=20261027-workbench-pwa",
  "/app.js?v=20261027-workbench-pwa",
  "/assets/vendor/video-export.js?v=20261027-workbench-pwa",
  "/pwa.js?v=20261027-workbench-pwa",
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
  "/assets/pwa/icon-20261027.svg",
  "/assets/pwa/icon-192-20261027.png",
  "/assets/pwa/icon-512-20261027.png",
  "/assets/pwa/icon-maskable.svg",
  "/assets/pwa/icon-maskable-512-20261027.png",
  "/assets/pwa/apple-touch-icon-20261027.png"
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
