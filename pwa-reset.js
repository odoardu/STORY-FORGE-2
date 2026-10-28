"use strict";
async function resetStoryForgeCache() {
  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.filter(registration =>
      [registration.active, registration.waiting, registration.installing].some(worker =>
        worker && new URL(worker.scriptURL).pathname === "/service-worker.js"
      )
    ).map(registration => registration.unregister()));
  }
  if ("caches" in window) {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith("story-forge-")).map(key => caches.delete(key)));
  }
  // Warm the fresh icon through HTTP without touching localStorage or IndexedDB.
  const icon = await fetch("/apple-touch-icon-180-20261028.png", { cache: "reload" });
  if (!icon.ok || !icon.headers.get("content-type")?.includes("image/png")) throw new Error("Ícone indisponível");
  location.replace("/?pwa-refresh=20261028-v3");
}
resetStoryForgeCache().catch(() => {
  const status = document.getElementById("status");
  status.textContent = "Não foi possível concluir a atualização. Confira sua conexão e tente novamente.";
  const retry = document.createElement("a"); retry.href = "/atualizar-pwa.html"; retry.textContent = "Tentar novamente";
  status.after(retry);
});
