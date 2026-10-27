"use strict";
// Mobile has its own navigation and viewport rules, while sharing document state.
const StudioUI = (() => {
  const mobileQuery = matchMedia("(max-width: 800px), (max-width: 960px) and (pointer: coarse)");
  let api, panelObserver, anchorFrame, artworkTools, expandedMobileBoard;
  const byId = id => document.getElementById(id);
  const panels = () => [byId("mediaPopover"), byId("textEditPopover"), byId("circlePopover"), byId("effectsPopover")];
  function positionEffects() {
    cancelAnimationFrame(anchorFrame);
    anchorFrame = requestAnimationFrame(() => {
      const state = api.getState();
      const host = document.querySelector(".stage-host");
      const hostRect = host.getBoundingClientRect();
      const mobileFlow = mobileQuery.matches && ["informative", "polaroid"].includes(state.format) && !state.artboardFocused;
      const activeBoard = host.querySelector(".informative-artboard.is-active, .polaroid-board.is-active");
      if (mobileQuery.matches && state.artboardFocused) expandedMobileBoard = activeBoard?.dataset.boardMotionKey;
      if (mobileFlow && expandedMobileBoard) {
        if (activeBoard?.dataset.boardMotionKey === expandedMobileBoard) host.scrollTo({ top: Math.max(0, host.scrollTop + activeBoard.getBoundingClientRect().top - hostRect.top - 48), behavior: "instant" });
        expandedMobileBoard = null;
      }
      host.querySelectorAll(".artboard-back").forEach(button => {
        const label = mobileQuery.matches ? "Voltar às páginas" : "Voltar à grade";
        if (button.hasAttribute("title")) button.removeAttribute("title");
        if (button.getAttribute("aria-label") !== label) button.setAttribute("aria-label", label);
      });
      const target = state.format === "polaroid"
        ? document.querySelector(".polaroid-board.is-active") : byId("stageFrame");
      const tools = artworkTools;
      const count = state.format === "informative" ? state.informativePages.length : state.format === "polaroid" ? PolaroidStudio.count() : 1;
      const visible = Boolean(target) && (count === 1 || state.artboardFocused);
      if (tools.hidden === visible) tools.hidden = !visible;
      if (!visible && !byId("effectsPopover").hidden) byId("effectsPopover").hidden = true;
      if (target && tools.parentElement !== target) target.append(tools);
      const rect = tools.getBoundingClientRect();
      const x = rect.left, y = rect.top, size = rect.width;
      const panel = byId("effectsPopover"), width = Math.min(340, innerWidth - 24);
      panel.style.setProperty("--effects-x", `${Math.max(12, Math.min(innerWidth - width - 12, x + size - width))}px`);
      panel.style.setProperty("--effects-y", `${Math.max(70, y - (panel.hidden ? 112 : panel.offsetHeight) - 12)}px`);
      const media = byId("mediaPopover");
      const dock = document.querySelector(".glass-dock").getBoundingClientRect();
      const selected = document.querySelector('.glass-dock .format-option[aria-pressed="true"]')?.getBoundingClientRect();
      media.style.setProperty("--media-x", `${dock.right + 12}px`);
      media.style.setProperty("--media-y", `${Math.max(16, Math.min(innerHeight - media.offsetHeight - 16, selected?.top - 8 || dock.top))}px`);
    });
  }
  function closeOtherPanels(except) {
    if (except !== "media") api.closeMedia();
    if (except !== "text") api.closeText();
    if (except !== "circle") byId("circlePopover").hidden = true;
    if (except !== "effects") byId("effectsPopover").hidden = true;
    sync();
  }
  function paintRange(input) {
    if (!input?.matches('.studio-panel input[type="range"]')) return;
    const min = Number(input.min) || 0, max = Number(input.max) || 100;
    input.style.setProperty("--range-fill", `${Math.max(0, Math.min(100, (Number(input.value) - min) / (max - min) * 100))}%`);
  }
  function sync() {
    if (!api) return;
    const s = api.getState();
    document.querySelectorAll(".mobile-format").forEach(button => {
      const selected = button.dataset.format === s.format;
      button.classList.toggle("is-active", selected); button.setAttribute("aria-pressed", String(selected));
    });
    const names = { polaroid: "Polaroid", feed: "Feed", stories: "Stories", informative: "Informativo", closing: "Encerramento" };
    byId("mobileFormatName").textContent = names[s.format] || "Feed";
    byId("effectBlur").value = s.format === "closing" ? s.closingBlur : s.format === "informative" ? s.infoBackgroundBlur : s.maskBlur;
    byId("effectShade").value = s.format === "closing" ? s.closingShade : s.format === "informative" ? s.infoShade : s.blurGradientOpacity;
    if (s.format === "polaroid") { const effects = PolaroidStudio.getEffects(); byId("effectBlur").value = effects.blur; byId("effectShade").value = effects.shade; }
    byId("effectBlurValue").textContent = byId("effectBlur").value;
    byId("effectShadeValue").textContent = byId("effectShade").value + "%";
    byId("effectBlurLabel").textContent = ["closing", "informative", "polaroid"].includes(s.format) ? "Desfoque do fundo" : "Desfoque inferior";
    byId("effectShadeField").hidden = false;
    byId("mobileMedia").setAttribute("aria-expanded", String(document.body.classList.contains("mobile-controls-open")));
    const mediaOpen = document.body.classList.contains("mobile-controls-open");
    const mediaPanel = byId("mediaPopover");
    if (mediaPanel.hidden === mediaOpen) mediaPanel.hidden = !mediaOpen;
    if (mediaPanel.inert === mediaOpen) mediaPanel.inert = !mediaOpen;
    if (mediaPanel.getAttribute("aria-hidden") !== String(!mediaOpen)) mediaPanel.setAttribute("aria-hidden", String(!mediaOpen));
    if (!mediaOpen) mediaPanel.getAnimations().forEach(animation => animation.cancel());
    document.querySelectorAll('.glass-dock .format-option').forEach(button => {
      if (["feed", "stories"].includes(button.dataset.format)) {
        button.setAttribute("aria-controls", "mediaPopover");
        button.setAttribute("aria-expanded", String(mediaOpen && button.dataset.format === s.format));
      }
    });
    document.body.classList.toggle("workbench-text-open", !byId("textEditPopover").hidden);
    document.body.classList.toggle("workbench-circle-open", !byId("circlePopover").hidden);
    const effectsOpen = !byId("effectsPopover").hidden;
    byId("mobileEffects").setAttribute("aria-expanded", String(effectsOpen));
    artworkTools.querySelector("#dockEffects").setAttribute("aria-expanded", String(effectsOpen));
    const openPanel = panels().find(panel => panel.id === "mediaPopover" ? document.body.classList.contains("mobile-controls-open") : !panel.hidden);
    document.body.classList.toggle("studio-panel-open", Boolean(openPanel));
    document.documentElement.style.setProperty("--panel-reserve", openPanel ? `${Math.ceil(openPanel.getBoundingClientRect().height) + 14}px` : "0px");
    document.querySelectorAll('.studio-panel input[type="range"]').forEach(paintRange);
    const busy = s.exportingVideo || api.exportBusy();
    byId("mobileExport").disabled = busy;
    byId("mobileExport").setAttribute("aria-busy", String(busy));
    positionEffects();
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
    if (api) { if (changed) api.refresh(); api.resize(); sync(); }
  }
  function header(panel, title, close) {
    panel.classList.add("studio-panel");
    const heading = document.createElement("header"); heading.className = "studio-panel-header";
    const name = document.createElement("strong"); name.textContent = title;
    heading.append(name, close); panel.prepend(heading);
  }
  function init(callbacks) {
    api = callbacks;
    document.body.classList.add("studio-workbench");
    const tools = document.createElement("div"); tools.className = "art-tools"; artworkTools = tools;
    tools.setAttribute("role", "toolbar"); tools.setAttribute("aria-label", "Ferramentas da arte");
    tools.append(byId("dockEffects"));
    tools.querySelector("svg").innerHTML = '<path d="m9.5 3-.6 2a7.5 7.5 0 0 0-1.5.9l-2-.5-2.5 4.2 1.5 1.5a8 8 0 0 0 0 1.8l-1.5 1.5 2.5 4.2 2-.5a7.5 7.5 0 0 0 1.5.9l.6 2h5l.6-2a7.5 7.5 0 0 0 1.5-.9l2 .5 2.5-4.2-1.5-1.5a8 8 0 0 0 0-1.8l1.5-1.5-2.5-4.2-2 .5a7.5 7.5 0 0 0-1.5-.9l-.6-2z"/><circle cx="12" cy="12" r="3"/>';
    document.querySelector(".experience-shell").append(tools);
    const haze = document.createElement("div"); haze.className = "mobile-board-haze"; haze.setAttribute("aria-hidden", "true");
    for (let layer = 0; layer < 3; layer++) haze.append(document.createElement("span"));
    document.querySelector(".experience-shell").append(haze);
    byId("exportButton").classList.add("header-export");
    document.querySelector(".app-header").append(byId("exportButton"));
    header(byId("mediaPopover"), "Mídia", byId("mobilePanelClose"));
    header(byId("circlePopover"), "Foto circular", byId("circleClose"));
    byId("textEditPopover").classList.add("studio-panel");
    byId("textEditPopover").querySelector("header").classList.add("studio-panel-header");
    byId("popoverTitleHighlightGroup").append(byId("mobileTitleHighlight"));
    document.querySelectorAll(".media-upload-actions .studio-action, .closing-controls .studio-action, .circle-popover > .studio-action").forEach(action => {
      const caption = document.createElement("span"); caption.className = "action-caption";
      const names = { circleBehind: "Camadas", circleFrameMode: "Enquadrar", circleZoomIn: "Ampliar", circleZoomOut: "Reduzir", circleRemove: "Remover", closingUseFeed: "Usar Feed" };
      caption.textContent = names[action.id] || (action.matches(".video-upload") ? "Vídeo" : action.matches(".circle-upload-action") ? "Círculo" : "Imagem"); action.append(caption);
      action.dataset.tooltip = action.matches(".circle-upload-action") ? "Foto circular" : caption.textContent;
    });
    document.querySelector(".circle-upload-action svg").innerHTML = '<circle cx="12" cy="12" r="9" stroke-dasharray="2 2"/><path d="m6 15 4-4 3 3 2-2 3 3"/><circle cx="14" cy="8" r="1"/>';
    const range = byId("circleSize"), field = document.createElement("label"); field.className = "circle-size-field";
    const name = document.createElement("span"); name.textContent = "Tamanho"; field.append(name); range.before(field); field.append(range);
    // Own preview navigation: the media palette is the attachment itself.
    document.querySelectorAll('.glass-dock .format-option[data-format]').forEach(button => {
      button.addEventListener("click", event => {
        event.stopImmediatePropagation();
        if (api.getState().exportingVideo || api.exportBusy()) return;
        const format = button.dataset.format;
        const wasOpen = api.getState().format === format && document.body.classList.contains("mobile-controls-open");
        closeOtherPanels();
        api.format(format);
        if (["feed", "stories"].includes(format) && !wasOpen) api.toggleMedia();
        sync();
      }, true);
    });
    byId("mobileMedia").addEventListener("click", () => api.toggleMedia());
    byId("mobileExport").addEventListener("click", () => api.export());
    document.querySelectorAll(".mobile-format").forEach(button => button.addEventListener("click", () => { closeOtherPanels(); api.format(button.dataset.format); sync(); }));
    function toggleEffects() { const wasOpen = !byId("effectsPopover").hidden; closeOtherPanels("effects"); byId("effectsPopover").hidden = wasOpen; sync(); }
    byId("mobileEffects").addEventListener("click", toggleEffects); byId("dockEffects").addEventListener("click", toggleEffects);
    byId("closeEffects").addEventListener("click", () => { byId("effectsPopover").hidden = true; sync(); artworkTools.querySelector("#dockEffects").focus({ preventScroll: true }); });
    for (const id of ["effectBlur", "effectShade"]) byId(id).addEventListener("input", event => { api.effects(id, Number(event.target.value)); sync(); });
    document.addEventListener("keydown", event => {
      if (event.key !== "Escape" || document.querySelector("dialog[open]")) return;
      const effectsOpen = !byId("effectsPopover").hidden;
      closeOtherPanels();
      const target = effectsOpen && !artworkTools.hidden ? artworkTools.querySelector("#dockEffects") : document.querySelector('.glass-dock .format-option[aria-pressed="true"]');
      target?.focus({ preventScroll: true });
    });
    document.addEventListener("pointerdown", event => {
      if (event.target.closest("#fullHighlightWarning, #imageResolutionWarning, .studio-panel, .glass-dock, .art-tools, .header-export, .mobile-navigation, .mobile-actionbar, .preview-audio-control, .circle-inset, .feed-title-layer, .feed-subtitle, .feed-kicker, .informative-title, .informative-body")) return;
      closeOtherPanels();
    });
    panelObserver = new ResizeObserver(sync); panels().forEach(panel => panelObserver.observe(panel));
    const changes = new MutationObserver(sync); panels().forEach(panel => changes.observe(panel, { attributes: true, attributeFilter: ["hidden"] }));
    changes.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    new MutationObserver(sync).observe(byId("exportButton"), { attributes: true, attributeFilter: ["disabled"] });
    window.visualViewport?.addEventListener("resize", syncViewport); window.visualViewport?.addEventListener("scroll", syncViewport);
    window.addEventListener("resize", syncViewport); mobileQuery.addEventListener("change", syncViewport);
    document.addEventListener("scroll", positionEffects, true);
    document.addEventListener("transitionend", positionEffects);
    document.addEventListener("animationend", positionEffects);
    new MutationObserver(positionEffects).observe(document.querySelector(".experience-shell"), { attributes: true, attributeFilter: ["class", "data-format"] });
    const artworkObserver = new ResizeObserver(positionEffects);
    artworkObserver.observe(byId("stageFrame"));
    artworkObserver.observe(document.querySelector(".stage-host"));
    new MutationObserver(positionEffects).observe(document.querySelector(".stage-host"), { childList: true, subtree: true });
    document.addEventListener("focusin", syncViewport); document.addEventListener("focusout", () => requestAnimationFrame(syncViewport));
    document.addEventListener("input", event => paintRange(event.target));
    syncViewport();
    document.body.classList.remove("workbench-loading");
  }
  return { init, sync, closeOtherPanels };
})();
