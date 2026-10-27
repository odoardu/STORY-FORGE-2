if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    // Local previews must use the files being edited, rather than an old PWA shell.
    const localPreview = ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname);
    if (localPreview) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      const ownRegistrations = registrations.filter(registration =>
        [registration.active, registration.waiting, registration.installing].some(worker =>
          worker && new URL(worker.scriptURL).pathname === "/service-worker.js"
        )
      );
      const controlled = navigator.serviceWorker.controller &&
        new URL(navigator.serviceWorker.controller.scriptURL).pathname === "/service-worker.js";
      await Promise.all(ownRegistrations.map(registration => registration.unregister()));
      const keys = await caches.keys();
      await Promise.all(keys.filter(key => key.startsWith("story-forge-")).map(key => caches.delete(key)));
      if (controlled && ownRegistrations.length) location.reload();
      return;
    }
    navigator.serviceWorker.register("/service-worker.js", { scope: "/", updateViaCache: "none" }).catch((error) => {
      console.error("Não foi possível preparar o modo instalado do Story Forge.", error);
    });
  });
}
