const CACHE_NAME = "story-forge-shell-v47-vinyl";
const LOCAL_PREVIEW = ["localhost", "127.0.0.1", "[::1]"].includes(self.location.hostname);
const APP_SHELL = [
  "/vinyl-shell.js?v=20261028-vinyl",
  "/vinyl-workbench.css?v=20261028-vinyl",
  "/vinyl-timeline.css?v=20261028-vinyl",
  "/vinyl-test.html",
  "/vinyl-test.js",
  "/vinyl-timeline.js",
  "/vinyl-video-export.js",
  "/",
  "/index.html",
  "/collage-layout.js?v=20261028-collage",
  "/collage-shell.js?v=20261028-collage",
  "/collage-test.js?v=20261028-collage",
  "/collage-workbench.css?v=20261028-collage",
  "/assets/collage-test/photos.json",
  "/apple-touch-icon-ed148eba-v2.png",
  "/apple-touch-icon-precomposed.png",
  "/assets/pwa/ambient-band.webp",
  "/styles.css?v=20261028-collage",
  "/studio-ui.css?v=20261028-collage",
  "/studio-refinement.css?v=20261028-collage",
  "/workbench-preview-ui.js?v=20261028-collage",
  "/studio-motion.js?v=20261028-collage",
  "/media-loading-border.js?v=20261028-collage",
  "/content-ideas.js?v=20261028-collage",
  "/catalog/content-ideas.json",
  "/artwork-effects.js?v=20261028-collage",
  "/editor-core.js?v=20261028-collage",
  "/export-review.js?v=20261028-collage",
  "/export-review.css?v=20261028-collage",
  "/editor-history.js?v=20261028-collage",
  "/polaroid.js?v=20261028-collage",
  "/app.js?v=20261028-collage",
  "/assets/vendor/video-export.js?v=20261028-collage",
  "/pwa.js?v=20261028-collage",
  "/manifest.webmanifest?v=ed148eba-v2",
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
  "/assets/pwa/icon-192-ed148eba-v2.png",
  "/assets/pwa/icon-512-ed148eba-v2.png",
  "/assets/pwa/icon-maskable.svg",
  "/assets/pwa/icon-maskable-512-ed148eba-v2.png",
  "/apple-touch-icon-ed148eba-v2.png"
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

  const installationAsset = url.pathname === "/manifest.webmanifest" || /\/apple-touch-icon[^/]*\.png$/.test(url.pathname) || url.pathname.startsWith("/assets/pwa/");
  if (request.mode === "navigate" || url.pathname === "/catalog/content-ideas.json" || installationAsset) {
    event.respondWith(
      fetch(installationAsset ? new Request(request, { cache: "no-store" }) : request)
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
