if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js", { scope: "/" }).catch((error) => {
      console.error("Não foi possível preparar o modo instalado do Story Forge.", error);
    });
  });
}
