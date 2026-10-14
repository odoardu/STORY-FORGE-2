"use strict";
// Mobile has its own navigation and viewport rules, while sharing document state.
const StudioUI = (() => {
  const mobileQuery = matchMedia("(max-width: 800px), (max-width: 960px) and (pointer: coarse)");
  let api, panelObserver;
  const byId = id => document.getElementById(id);
  const panels = () => [byId("mediaPopover"), byId("textEditPopover"), byId("circlePopover"), byId("effectsPopover"), byId("videoOptionsPanel")];
  function closeOtherPanels(except) {
    if (except !== "media") api.closeMedia();
    if (except !== "text") api.closeText();
    if (except !== "circle") byId("circlePopover").hidden = true;
    if (except !== "effects") byId("effectsPopover").hidden = true;
    if (except !== "video") byId("videoOptions").open = false;
    sync();
  }
  function sync() {
    if (!api) return;
    const s = api.getState();
    const videoPanel = byId("videoOptionsPanel");
    if (videoPanel.hidden !== !byId("videoOptions").open) videoPanel.hidden = !byId("videoOptions").open;
    document.querySelectorAll(".mobile-format").forEach(button => {
      const selected = button.dataset.format === s.format;
      button.classList.toggle("is-active", selected); button.setAttribute("aria-pressed", String(selected));
    });
    const names = { feed: "Feed", stories: "Stories", informative: "Informativo", closing: "Encerramento" };
    byId("mobileFormatName").textContent = names[s.format] || "Feed";
    byId("effectBlur").value = s.format === "closing" ? s.closingBlur : s.format === "informative" ? s.infoBackgroundBlur : s.maskBlur;
    byId("effectShade").value = s.format === "closing" ? s.closingShade : s.format === "informative" ? s.infoShade : s.blurGradientOpacity;
    byId("effectBlurValue").textContent = byId("effectBlur").value;
    byId("effectShadeValue").textContent = byId("effectShade").value + "%";
    byId("effectBlurLabel").textContent = ["closing", "informative"].includes(s.format) ? "Desfoque do fundo" : "Desfoque inferior";
    byId("effectShadeField").hidden = false;
    byId("mobileMedia").setAttribute("aria-expanded", String(document.body.classList.contains("mobile-controls-open")));
    const effectsOpen = !byId("effectsPopover").hidden;
    for (const id of ["mobileEffects", "dockEffects"]) byId(id).setAttribute("aria-expanded", String(effectsOpen));
    const openPanel = panels().find(panel => panel.id === "mediaPopover" ? document.body.classList.contains("mobile-controls-open") : panel.id === "videoOptionsPanel" ? byId("videoOptions").open : !panel.hidden);
    document.body.classList.toggle("studio-panel-open", Boolean(openPanel));
    document.documentElement.style.setProperty("--panel-reserve", openPanel ? `${Math.ceil(openPanel.getBoundingClientRect().height) + 14}px` : "0px");
    const busy = s.exportingVideo || api.exportBusy();
    byId("mobileExport").disabled = busy;
    byId("mobileExport").setAttribute("aria-busy", String(busy));
  }
  function syncViewport() {
    const view = window.visualViewport, height = view?.height || innerHeight, top = view?.offsetTop || 0;
    const inset = Math.max(0, innerHeight - height - top);
    const keyboard = inset > 120 && Boolean(document.activeElement?.matches("input, textarea, [contenteditable=true]"));
    document.documentElement.style.setProperty("--viewport-height", `${height}px`);
    document.documentElement.style.setProperty("--viewport-top", `${top}px`);
    document.documentElement.style.setProperty("--keyboard-inset", `${inset}px`);
    document.body.classList.toggle("keyboard-open", keyboard);
    const mobile = mobileQuery.matches;
    const changed = document.body.classList.contains("is-mobile-studio") !== mobile;
    document.body.classList.toggle("is-mobile-studio", mobile);
    if (api) { sync(); if (changed) api.refresh(); api.resize(); }
  }
  function header(panel, title, close) {
    panel.classList.add("studio-panel");
    const heading = document.createElement("header"); heading.className = "studio-panel-header";
    const name = document.createElement("strong"); name.textContent = title;
    heading.append(name, close); panel.prepend(heading);
  }
  function init(callbacks) {
    api = callbacks;
    header(byId("mediaPopover"), "Mídia", byId("mobilePanelClose"));
    header(byId("circlePopover"), "Foto circular", byId("circleClose"));
    const closeVideo = document.createElement("button"); closeVideo.type = "button"; closeVideo.className = "studio-action"; closeVideo.setAttribute("aria-label", "Fechar opções do vídeo"); closeVideo.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>';
    closeVideo.addEventListener("click", () => { byId("videoOptions").open = false; sync(); });
    document.body.append(byId("videoOptionsPanel"));
    byId("videoOptionsPanel").hidden = true;
    header(byId("videoOptionsPanel"), "Vídeo", closeVideo);
    const videoNames = { videoFileInfo: "Arquivo", videoAudioControl: "Áudio", panelMuteButton: "Ouvir", resetVideoTrim: "Corte", removeVideo: "Imagem" };
    Object.entries(videoNames).forEach(([id, text]) => { const caption = document.createElement("span"); caption.className = "action-caption"; caption.textContent = text; byId(id).append(caption); });
    byId("textEditPopover").classList.add("studio-panel");
    byId("textEditPopover").querySelector("header").classList.add("studio-panel-header");
    document.querySelectorAll(".media-upload-actions .studio-action, .closing-controls .studio-action, .circle-popover > .studio-action").forEach(action => {
      const caption = document.createElement("span"); caption.className = "action-caption";
      const names = { circleBehind: "Camadas", circleFrameMode: "Enquadrar", circleZoomIn: "Ampliar", circleZoomOut: "Reduzir", circleRemove: "Remover", closingUseFeed: "Usar Feed" };
      caption.textContent = names[action.id] || (action.matches(".video-upload") ? "Vídeo" : action.matches(".circle-upload-action") ? "Círculo" : "Imagem"); action.append(caption);
    });
    const range = byId("circleSize"), field = document.createElement("label"); field.className = "circle-size-field";
    const name = document.createElement("span"); name.textContent = "Tamanho"; field.append(name); range.before(field); field.append(range);
    byId("mobileMedia").addEventListener("click", () => api.toggleMedia());
    byId("mobileExport").addEventListener("click", () => api.export());
    document.querySelectorAll(".mobile-format").forEach(button => button.addEventListener("click", () => { closeOtherPanels(); api.format(button.dataset.format); sync(); }));
    function toggleEffects() { const wasOpen = !byId("effectsPopover").hidden; closeOtherPanels("effects"); byId("effectsPopover").hidden = wasOpen; sync(); }
    byId("mobileEffects").addEventListener("click", toggleEffects); byId("dockEffects").addEventListener("click", toggleEffects);
    byId("closeEffects").addEventListener("click", () => { byId("effectsPopover").hidden = true; sync(); byId("dockEffects").focus({ preventScroll: true }); });
    for (const id of ["effectBlur", "effectShade"]) byId(id).addEventListener("input", event => { api.effects(id, Number(event.target.value)); sync(); });
    document.addEventListener("keydown", event => { if (event.key === "Escape") closeOtherPanels(); });
    document.addEventListener("pointerdown", event => {
      if (event.target.closest(".studio-panel, .glass-dock, .mobile-navigation, .mobile-actionbar, .video-options, .circle-inset, .feed-title-layer, .feed-subtitle, .feed-kicker, .informative-title, .informative-body")) return;
      closeOtherPanels();
    });
    panelObserver = new ResizeObserver(sync); panels().forEach(panel => panelObserver.observe(panel));
    const changes = new MutationObserver(sync); panels().forEach(panel => changes.observe(panel, { attributes: true, attributeFilter: ["hidden"] }));
    changes.observe(byId("videoOptions"), { attributes: true, attributeFilter: ["open"] });
    changes.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    new MutationObserver(sync).observe(byId("exportButton"), { attributes: true, attributeFilter: ["disabled"] });
    window.visualViewport?.addEventListener("resize", syncViewport); window.visualViewport?.addEventListener("scroll", syncViewport);
    window.addEventListener("resize", syncViewport); mobileQuery.addEventListener("change", syncViewport);
    document.addEventListener("focusin", syncViewport); document.addEventListener("focusout", () => requestAnimationFrame(syncViewport));
    syncViewport();
  }
  return { init, sync, closeOtherPanels };
})();
