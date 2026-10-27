"use strict";

const STORY = {
  width: 1080,
  height: 1920,
  video: { x: 0, y: 634, width: 1080, height: 653 },
  title: {
    maxRows: 4,
    rowGap: 8,
    templates: [
      { y: 274, height: 75, fontSize: 69, minFontSize: 38, maxWidth: 1048 },
      { y: 357, height: 75, fontSize: 69, minFontSize: 36, maxWidth: 1048 },
      { y: 440, height: 75, fontSize: 69, minFontSize: 36, maxWidth: 1048 },
      { y: 523, height: 63, fontSize: 58, minFontSize: 32, maxWidth: 1048 },
    ],
    paddingLeft: 11,
    paddingRight: 11,
    paddingTop: 3,
    paddingBottom: 3,
    baseFontSize: 69,
    tracking: 2.15,
    baselineShift: 6,
  },
  logo: {
    width: 220,
    x: 0,
    y: 1710,
    opacity: 100,
  },
};

const FEED = {
  width: 1080,
  height: 1350,
  title: {
    maxRows: 2,
    rowGap: 10,
    top: 761.8,
    maxBottom: 1035,
    minTop: 400,
    lineHeight: 89.9223,
    highlightHeight: 85.3255,
    baseFontSize: 70,
    minFontSize: 46,
    maxWidth: 923.4,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 4,
    paddingBottom: 4,
    tracking: 1.4,
    baselineShift: 3,
  },
  logo: {
    width: 160,
    x: 0,
    y: 1190,
    opacity: 100,
  },
  copy: { top: 764, bottom: 1122, imageKickerGap: 12, textKickerGap: 1.242, subtitleGap: 24 },
  subtitle: {
    safeLeft: 70,
    safeRight: 70,
    safeTop: 950,
    safeBottom: 1138,
  },
};

const INFORMATIVE = {
  width: 1080,
  height: 1350,
  ratio: "4:5",
  // Gabarito 1080 × 1350 medido na arte informativa do Canva.
  image: { x: 110, y: 155, width: 862, height: 488 },
  title: { x: 110, y: 697, width: 862, fontSize: 42, lineHeight: 50 },
  body: { x: 110, y: 766, width: 835, fontSize: 28, lineHeight: 36 },
  logo: { width: 160, x: 0, y: 1194, opacity: 100 },
};

// Canva displays point sizes and letter spacing in thousandths of an em.
// Keep the reference values fixed; convert once for preview and PNG.
const CANVA_TYPE_DEFAULTS = {
  title: { size: 52.8, tracking: 60, leading: 1.29 },
  subtitle: { size: 15.4, tracking: 60, leading: 1.29 },
  kicker: { size: 14.4, tracking: 464, leading: 1.73 },
};
const feedTypography = Object.freeze(Object.fromEntries(Object.entries(CANVA_TYPE_DEFAULTS).map(([role, values]) => [role, Object.freeze({ ...values })])));
// Shared highlight insets in output pixels for Feed and Closing.
// Vertical insets are reduced equally; color never affects geometry.
const TITLE_LINE_GAP = FEED.title.rowGap;
const TITLE_HIGHLIGHT_PADDING = Object.freeze({ left: 10, right: 10, top: 5.46, bottom: 5.46 });

function getFeedTypography(role) {
  const value = feedTypography[role];
  const fontSize = value.size * 4 / 3;
  return { fontSize, tracking: fontSize * value.tracking / 1000, lineHeight: fontSize * value.leading };
}

const FORMATS = {
  polaroid: { width: 1080, height: 1350, ratio: "4:5", name: "Polaroid", size: "1080 x 1350" },
  stories: { width: 1080, height: 1920, ratio: "9:16", name: "Stories vertical", size: "1080 x 1920" },
  closing: { width: 1080, height: 1350, ratio: "4:5", name: "Encerramento", size: "1080 x 1350" },
  story: {
    width: STORY.width,
    height: STORY.height,
    ratio: "9:16",
    name: "Story vertical",
    size: "1080 x 1920",
  },
  feed: {
    width: FEED.width,
    height: FEED.height,
    ratio: "4:5",
    name: "Feed vertical",
    size: "1080 x 1350",
  },
  informative: {
    width: INFORMATIVE.width,
    height: INFORMATIVE.height,
    ratio: INFORMATIVE.ratio,
    name: "Modelo informativo",
    size: "1080 x 1350",
  },
};

const FALLBACK_FEED_TEXTURES = [
  { name: "ECLUSAO 38.png", path: "/assets/textures/ECLUS%C3%83O%2038.png" },
  { name: "LUZ INDIRETA 49.png", path: "/assets/textures/LUZ%20INDIRETA%2049.png" },
];

const SUBTITLE_PRESETS = {
  clean: {
    subtitleFontSize: 22,
    subtitleLetterSpacing: 12,
    subtitleLineHeight: 30,
    subtitleWordSpacing: 0,
    subtitleScaleX: 100,
    subtitleScaleY: 100,
    subtitleTextAlign: "center",
    subtitleTextTransform: "uppercase",
    subtitleRotation: 0,
    subtitlePositionX: 540,
    subtitlePositionY: 1020,
    subtitleMaxWidth: 980,
  },
  editorial: {
    subtitleFontSize: 24,
    subtitleLetterSpacing: 14,
    subtitleLineHeight: 34,
    subtitleWordSpacing: 8,
    subtitleScaleX: 100,
    subtitleScaleY: 100,
    subtitleTextAlign: "center",
    subtitleTextTransform: "uppercase",
    subtitleRotation: 0,
    subtitlePositionX: 540,
    subtitlePositionY: 1008,
    subtitleMaxWidth: 900,
  },
  poster: {
    subtitleFontSize: 28,
    subtitleLetterSpacing: 8,
    subtitleLineHeight: 34,
    subtitleWordSpacing: 6,
    subtitleScaleX: 108,
    subtitleScaleY: 100,
    subtitleTextAlign: "center",
    subtitleTextTransform: "uppercase",
    subtitleRotation: 0,
    subtitlePositionX: 540,
    subtitlePositionY: 1016,
    subtitleMaxWidth: 940,
  },
  caption: {
    subtitleFontSize: 18,
    subtitleLetterSpacing: 6,
    subtitleLineHeight: 25,
    subtitleWordSpacing: 4,
    subtitleScaleX: 100,
    subtitleScaleY: 100,
    subtitleTextAlign: "center",
    subtitleTextTransform: "none",
    subtitleRotation: 0,
    subtitlePositionX: 540,
    subtitlePositionY: 1038,
    subtitleMaxWidth: 820,
  },
  impact: {
    subtitleFontSize: 26,
    subtitleLetterSpacing: 16,
    subtitleLineHeight: 34,
    subtitleWordSpacing: 12,
    subtitleScaleX: 112,
    subtitleScaleY: 104,
    subtitleTextAlign: "center",
    subtitleTextTransform: "uppercase",
    subtitleRotation: 0,
    subtitlePositionX: 540,
    subtitlePositionY: 1018,
    subtitleMaxWidth: 1000,
  },
};

const elements = {
  shell: document.querySelector(".experience-shell"),
  frame: document.getElementById("stageFrame"),
  stage: document.getElementById("storyStage"),
  previewModeLabel: document.getElementById("previewModeLabel"),
  previewRatioLabel: document.getElementById("previewRatioLabel"),
  formatNameLabel: document.getElementById("formatNameLabel"),
  formatSizeLabel: document.getElementById("formatSizeLabel"),
  formatButtons: Array.from(document.querySelectorAll(".format-option[data-format]")),
  slot: document.getElementById("videoSlot"),
  video: document.getElementById("previewVideo"),
  emptyMedia: document.getElementById("emptyMedia"),
  videoInput: document.getElementById("videoInput"),
  fileMain: document.getElementById("fileMain"),
  fileSub: document.getElementById("fileSub"),
  feedLayer: document.getElementById("feedLayer"),
  feedImage: document.getElementById("feedImage"),
  feedBlurImage: document.getElementById("feedBlurImage"),
  feedTextureExclusion: document.getElementById("feedTextureExclusion"),
  feedTextureSoftLight: document.getElementById("feedTextureSoftLight"),
  feedEmpty: document.getElementById("feedEmpty"),
  feedImageInput: document.getElementById("feedImageInput"),
  informativeImageInput: document.getElementById("informativeImageInput"),
  randomFeedImageButton: document.getElementById("randomFeedImageButton"),
  feedImageMain: document.getElementById("feedImageMain"),
  feedImageSub: document.getElementById("feedImageSub"),
  informativeImageMain: document.getElementById("informativeImageMain"),
  informativeImageSub: document.getElementById("informativeImageSub"),
  feedKickerInput: document.getElementById("feedKickerInput"),
  feedSubtitleInput: document.getElementById("feedSubtitleInput"),
  feedSubtitleWeightButtons: Array.from(document.querySelectorAll(".weight-option")),
  subtitleNumberInputs: Array.from(document.querySelectorAll("[data-subtitle-number]")),
  subtitleRangeInputs: Array.from(document.querySelectorAll("[data-subtitle-range]")),
  subtitleAlignButtons: Array.from(document.querySelectorAll("[data-subtitle-align]")),
  subtitleToggleButtons: Array.from(document.querySelectorAll("[data-subtitle-toggle]")),
  subtitleSelects: Array.from(document.querySelectorAll("[data-subtitle-select]")),
  subtitlePresetButtons: Array.from(document.querySelectorAll("[data-subtitle-preset]")),
  feedKickerPreview: document.getElementById("feedKickerPreview"),
  feedTitleLayer: document.getElementById("feedTitleLayer"),
  feedSubtitlePreview: document.getElementById("feedSubtitlePreview"),
  informativeImage: document.getElementById("informativeImage"),
  informativeTitlePreview: document.getElementById("informativeTitlePreview"),
  informativeBodyPreview: document.getElementById("informativeBodyPreview"),
  infoTitleInput: document.getElementById("infoTitleInput"),
  infoBodyInput: document.getElementById("infoBodyInput"),
  titleInput: document.getElementById("titleInput"),
  titleLayer: document.getElementById("titleLayer"),
  titleFontSizeInput: document.getElementById("titleFontSizeInput"),
  titleFontSizeValue: document.getElementById("titleFontSizeValue"),
  zoomInput: document.getElementById("zoomInput"),
  panXInput: document.getElementById("panXInput"),
  panYInput: document.getElementById("panYInput"),
  zoomValue: document.getElementById("zoomValue"),
  panXValue: document.getElementById("panXValue"),
  panYValue: document.getElementById("panYValue"),
  maskBlurInput: document.getElementById("maskBlurInput"),
  maskBlurValue: document.getElementById("maskBlurValue"),
  blurGradientInput: document.getElementById("blurGradientInput"),
  blurGradientValue: document.getElementById("blurGradientValue"),
  maskEffectSection: document.getElementById("maskEffectSection"),
  maskLockButton: document.getElementById("maskLockButton"),
  maskLockLabel: document.getElementById("maskLockLabel"),
  logoLayer: document.getElementById("logoLayer"),
  logoPreview: document.getElementById("logoPreview"),
  logoCatalog: document.getElementById("logoCatalog"),
  logoWidthInput: document.getElementById("logoWidthInput"),
  logoXInput: document.getElementById("logoXInput"),
  logoYInput: document.getElementById("logoYInput"),
  logoOpacityInput: document.getElementById("logoOpacityInput"),
  logoWidthValue: document.getElementById("logoWidthValue"),
  logoXValue: document.getElementById("logoXValue"),
  logoYValue: document.getElementById("logoYValue"),
  logoOpacityValue: document.getElementById("logoOpacityValue"),
  togglePlayback: document.getElementById("togglePlayback"),
  toggleMute: document.getElementById("toggleMute"),
  panelPlayButton: document.getElementById("panelPlayButton"),
  panelMuteButton: document.getElementById("panelMuteButton"),
  trackTitle: document.querySelector(".track-title"),
  trackSub: document.querySelector(".track-sub"),
  exportButton: document.getElementById("exportButton"),
  pngExportButton: document.getElementById("pngExportButton"),
  exportLabel: document.getElementById("exportLabel"),
  statusLine: document.getElementById("statusLine"),
  progress: document.getElementById("exportProgress"),
  canvas: document.getElementById("renderCanvas"),
  controlPanelShell: document.querySelector(".control-panel-shell"),
  dockPanelStack: document.querySelector(".dock-panel-stack"),
  dockButtons: Array.from(document.querySelectorAll(".dock-button")),
  panelTriggers: Array.from(document.querySelectorAll("button[data-panel]")),
  dockPanels: Array.from(document.querySelectorAll(".dock-panel")),
  rangeInputs: Array.from(document.querySelectorAll('input[type="range"]:not([data-direct-range])')),
};

const state = {
  circle: { behind: true, mask: null, maskSource: null, maskToken: 0, maskBusy: false, maskTask: null, image: null, url: "", token: 0, x: .78, y: .28, size: 360, zoom: 1, panX: 0, panY: 0, framing: false },
  closingBlur: 34, closingShade: 12, infoBackgroundBlur: 19, infoShade: 28,
  format: "feed",
  videoUrl: "",
  videoName: "",
  mediaKind: "image",
  videoTrimStart: 0,
  videoTrimEnd: 0,
  videoDuration: 0,
  videoLoadingToken: 0,
  exportingVideo: false,
  feedImageUrl: "",
  feedImageName: "",
  feedImageObjectUrl: "",
  feedImage: null,
  infoImageUrl: "",
  infoImageName: "",
  infoImageObjectUrl: "",
  infoImage: null,
  infoVideo: null,
  infoUploadToken: 0,
  infoVideoTrimStart: 0, infoVideoTrimEnd: 0,
  infoZoom: 1,
  infoPanX: 0,
  infoPanY: 0,
  feedTextureExclusionUrl: "",
  feedTextureExclusionImage: null,
  feedTextureSoftLightUrl: "",
  feedTextureSoftLightImage: null,
  feedTitleStrips: [],
  infoTitle: "TÍTULO DO POST AQUI",
  infoBody: "Cada detalhe faz a diferença quando o objetivo é criar algo verdadeiramente especial, capaz de transmitir personalidade e identidade. Unimos criatividade, inovação e dedicação para desenvolver projetos que valorizam cada ideia e transformam conceitos em experiências visuais.",
  zoom: 1,
  panX: 0,
  panY: 0,
  maskBlur: 19,
  blurGradientOpacity: 86,
  maskControlsLocked: true,
  background: null,
  exportMime: "",
  exportExt: "mp4",
  titleStrips: [],
  titleHighlights: [],
  infoBodyBold: [],
  previousTitleText: "",
  titleFontSize: 69,
  subtitleFontSize: 22,
  subtitleLetterSpacing: 5,
  subtitleLineHeight: 30,
  subtitleWordSpacing: 4,
  subtitleScaleX: 100,
  subtitleScaleY: 100,
  subtitleTextAlign: "center",
  subtitleTextTransform: "uppercase",
  subtitleRotation: 0,
  subtitlePositionX: 540,
  subtitlePositionY: 1038,
  subtitleMaxWidth: 780,
  subtitleMarks: [],
  logoUrl: "",
  logoName: "",
  logoObjectUrl: "",
  logoImage: null,
  logoWidth: FEED.logo.width,
  logoX: 0,
  logoY: FEED.logo.y,
  logoOpacity: 100,
  logoSettings: {
    stories: { width: 210, x: 0, y: 1700, opacity: 100 },
    story: { width: 220, x: 0, y: 1710, opacity: 100 },
    feed: { width: FEED.logo.width, x: FEED.logo.x, y: FEED.logo.y, opacity: FEED.logo.opacity },
    informative: { width: INFORMATIVE.logo.width, x: INFORMATIVE.logo.x, y: INFORMATIVE.logo.y, opacity: INFORMATIVE.logo.opacity },
  },
  titleHighlightColor: "pink",
  dockAttachmentFormat: null,
  activeDockPanel: "media",
};

const MAX_INFORMATIVE_PAGES = 6;
const informativePageKeys = ["infoTitle", "infoBody", "infoBodyBold", "infoImageUrl", "infoImageName", "infoImageObjectUrl", "infoImage", "infoVideo", "infoUploadToken", "infoVideoTrimStart", "infoVideoTrimEnd", "infoZoom", "infoPanX", "infoPanY"];
const informativePageDefaults = Object.fromEntries(informativePageKeys.map(key => [key, state[key]]));
function createInformativePage() {
  const page = { ...informativePageDefaults, infoBodyBold: [] };
  Object.defineProperties(page, {
    videoTrimStart: { get: () => page.infoVideoTrimStart, set: value => { page.infoVideoTrimStart = value; } },
    videoTrimEnd: { get: () => page.infoVideoTrimEnd, set: value => { page.infoVideoTrimEnd = value; } },
    videoDuration: { get: () => page.infoVideo?.duration || 0 },
  });
  return page;
}
state.informativePages = [createInformativePage()];
state.activeInformativePage = 0;
state.artboardFocused = false;

function syncArtboardFocus() {
  const count = state.format === "informative" ? state.informativePages.length : state.format === "polaroid" ? PolaroidStudio.count() : 1;
  if (count < 2) state.artboardFocused = false;
  elements.shell.classList.toggle("is-artboard-focused", state.artboardFocused);
}
function leaveArtboardFocus() {
  StudioMotion.captureBoards();
  state.artboardFocused = false;
  closeTextEditPopover();
  syncArtboardFocus();
  if (state.format === "polaroid") PolaroidStudio.refresh();
  else renderInformativePageTabs();
  updateStageScale();
  document.querySelector(".informative-artboard.is-active .artboard-expand, .polaroid-board.is-active .polaroid-photo")?.focus({ preventScroll: true });
}
function setArtboardActionIcon(button, back = false) {
  button.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${back ? "m12 6-6 6 6 6M6 12h12" : "m7 7 10 10M17 7 7 17"}"/></svg>`;
}
function createArtboardBackButton() {
  const button = document.createElement("button");
  button.type = "button"; button.className = "artboard-back";
  button.setAttribute("aria-label", "Voltar à grade"); button.title = "Voltar à grade";
  setArtboardActionIcon(button, true);
  button.addEventListener("click", leaveArtboardFocus);
  return button;
}
// Existing text, image and export controls always work on the selected page.
for (const key of informativePageKeys) {
  Object.defineProperty(state, key, {
    enumerable: true,
    get() { return state.informativePages[state.activeInformativePage][key]; },
    set(value) { state.informativePages[state.activeInformativePage][key] = value; },
  });
}

function renderInformativePageTabs() {
  StudioMotion.captureBoards();
  syncArtboardFocus();
  elements.frame.inert = state.format === "informative" && state.informativePages.length > 1 && !state.artboardFocused;
  const host = elements.frame.closest(".stage-host");
  const boards = document.getElementById("informativeArtboards");
  const add = document.getElementById("addInformativePage");
  host.append(elements.frame);
  boards.replaceChildren();
  if (state.format === "informative") {
    const activeIndex = state.activeInformativePage;
    state.informativePages.forEach((page, index) => {
      const board = document.createElement("section");
      board.className = `informative-artboard${index === activeIndex ? " is-active" : ""}`;
      board.dataset.boardMotionKey = StudioMotion.key(page);
      const label = document.createElement("button");
      label.type = "button";
      label.className = "artboard-label";
      label.textContent = `Informativo ${index + 1}`;
      label.setAttribute("aria-pressed", String(index === activeIndex));
      label.addEventListener("click", () => selectInformativePage(index));
      board.append(label);
      board.setAttribute("aria-label", `Informativo ${index + 1}`);
      if (state.artboardFocused && index === activeIndex) board.append(createArtboardBackButton());
      if (index > 0) {
        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "informative-remove";
        setArtboardActionIcon(remove);
        remove.setAttribute("aria-label", `Remover informativo ${index + 1}`);
        remove.addEventListener("click", () => removeInformativePage(index));
        board.append(remove);
      }
      if (index === activeIndex) {
        board.append(elements.frame);
      } else {
        const preview = document.createElement("button");
        preview.type = "button";
        preview.className = "artboard-preview";
        if (!state.artboardFocused) preview.tabIndex = -1;
        preview.setAttribute("aria-label", `Editar informativo ${index + 1}`);
        const snapshot = document.createElement("canvas"); snapshot.width = 1080; snapshot.height = 1350;
        try { state.activeInformativePage = index; drawInformativeFrame(snapshot.getContext("2d")); }
        finally { state.activeInformativePage = activeIndex; }
        preview.append(snapshot);
        preview.addEventListener("click", () => selectInformativePage(index));
        board.append(preview);
      }
      if (state.informativePages.length > 1 && !state.artboardFocused) {
        const expand = document.createElement("button");
        expand.type = "button"; expand.className = "artboard-expand";
        expand.setAttribute("aria-label", `Ampliar informativo ${index + 1}`);
        expand.addEventListener("click", () => {
          StudioMotion.captureBoards();
          state.artboardFocused = true; selectInformativePage(index);
          boards.querySelector(".is-active .artboard-back")?.focus({ preventScroll: true });
        });
        board.append(expand);
      }
      boards.append(board);
    });
    boards.append(add);
  } else {
    boards.append(add);
  }
  StudioMotion.settleBoards();
  add.disabled = state.informativePages.length >= MAX_INFORMATIVE_PAGES;
  add.title = add.disabled ? "Limite de 6 páginas atingido" : "Adicionar página informativa (máximo 6)";
  MediaLoadingBorder.sync();
}

function selectInformativePage(index) {
  if (state.exportingVideo || !state.informativePages[index]) return;
  closeTextEditPopover();
  state.activeInformativePage = index;
  elements.infoTitleInput.value = state.infoTitle;
  elements.infoBodyInput.value = state.infoBody;
  elements.informativeImageInput.value = "";
  if (state.infoImage && state.infoImageUrl) elements.informativeImage.src = state.infoImageUrl;
  else elements.informativeImage.removeAttribute("src");
  elements.feedLayer.classList.toggle("has-informative-image", Boolean(getInformativeMedia()));
  if (elements.informativeImageMain) elements.informativeImageMain.textContent = state.infoImageName || "Enviar imagem";
  if (elements.informativeImageSub) elements.informativeImageSub.textContent = state.infoImage ? "Imagem independente aplicada" : "Envie a imagem do bloco";
  applyFormat("informative", { keepPanel: true });

}

const HIGHLIGHT_COLORS = {
  pink: "#e981be",
  black: "#111111",
  none: "transparent",
};

function parseTitleSource(source) {
  const lines = (source || "").split(/\r?\n/).map(normalizeLine).filter(Boolean);
  return (lines.length ? lines : [" "]).map(text => ({ text, hasHighlight: false }));
}

const measureCanvas = document.createElement("canvas");
const measureContext = measureCanvas.getContext("2d", { willReadFrequently: true });
const renderContext = elements.canvas.getContext("2d", { alpha: false, willReadFrequently: true });
const feedEffectCanvas = document.createElement("canvas");
const feedEffectContext = feedEffectCanvas.getContext("2d", { willReadFrequently: true });

const activeMediaLoads = new Set();
let mediaLoadingHideTimer;
function beginMediaLoading(message = "Preparando mídia…", target = {}) {
  const editFormat = state.format;
  const format = target.format || state.format;
  const page = target.page || (format === "informative" ? state.informativePages[state.activeInformativePage] : null);
  const finishBorder = MediaLoadingBorder.begin(() => {
    if (["feed", "stories"].includes(format)) return ["feed", "stories"].includes(state.format) ? elements.frame : null;
    if (format !== state.format) return null;
    if (page) return document.querySelector(`[data-board-motion-key="${StudioMotion.key(page)}"]`);
    return elements.frame;
  });
  const job = Symbol("media");
  const host = document.getElementById("mediaLoading");
  const label = document.getElementById("mediaLoadingLabel");
  const bar = document.getElementById("mediaLoadingBar");
  clearTimeout(mediaLoadingHideTimer);
  activeMediaLoads.add(job);
  host.hidden = false;
  host.classList.add("uses-border-loading");
  host.classList.remove("is-complete", "is-error");
  host.setAttribute("aria-busy", "true");
  bar.removeAttribute("aria-valuenow");
  label.textContent = message;
  return (success, message = null) => {
    if (!activeMediaLoads.delete(job)) return;
    if (success && typeof ExportReview !== "undefined") ExportReview.touch(editFormat);
    finishBorder(success);
    if (activeMediaLoads.size) return;
    host.setAttribute("aria-busy", "false");
    host.classList.add(success ? "is-complete" : "is-error");
    label.textContent = message || (success ? "Mídia pronta" : "Não foi possível abrir a mídia");
    if (success) bar.setAttribute("aria-valuenow", "100");
    mediaLoadingHideTimer = setTimeout(() => { host.hidden = true; }, success ? 850 : 3500);
  };
}

init();

async function init() {
  elements.exportLabel.textContent = "Exportar PNG";

  elements.background = await loadImage("./assets/black-texture.jpg");
  state.background = elements.background;
  state.kickerImage = await loadImage("./assets/mundo-soldier-v2.svg");
  state.kickerImages = [state.kickerImage, await loadImage("./assets/mundo-soldier-alternativa.svg")];
  state.kickerLogoIndex = 0;
  state.informativeSymbols = await loadImage("./assets/informative-linkin-park-logos.png");
  state.kickerMode = "text";

  if (document.fonts) {
    await Promise.all([
      document.fonts.load('400 70px "Tusker Story"'),
      document.fonts.load('400 22px Gotham'),
      document.fonts.load('800 22px Gotham'),
    ]);
    await document.fonts.ready;
  }

  setupRangeControls();
  syncTitleBorderControls();
  syncLogoControls();
  syncFeedEffectControls();
  syncSubtitleFormatControls();
  updateMaskLockState();
  state.previousTitleText = elements.titleInput.value;
  bindEvents();
  bindVideoControls();
  applyFormat("feed", { keepPanel: true });
  closeMediaPopover();
  await applyLogo("/assets/logos/LOGO%201%20MONO.png", "Linkin Park Zero Brasil", "Logo padrão");
  await loadFeedTextures();
  await loadRandomFeedImage({ silent: true });
  updateStageScale();
  updateText();
  updateFeedText();
  updateMediaTransform();
  updateLogoTransform();
  updateStoriesPreview();
  if (state.format === "polaroid") PolaroidStudio.refresh();
  requestAnimationFrame(updateControlPanelFade);
  initExportReview();
}

function syncTitleBorderControls() {
  state.titleFontSize = readRangeRealValue(elements.titleFontSizeInput);
  updateRangeOutput(elements.titleFontSizeInput, elements.titleFontSizeValue);
}

function syncFeedEffectControls() {
  if (!elements.maskBlurInput) return;

  state.maskBlur = readRangeRealValue(elements.maskBlurInput);
  state.blurGradientOpacity = elements.blurGradientInput ? readRangeRealValue(elements.blurGradientInput) : state.blurGradientOpacity;
  updateEffectRangeOutput(elements.maskBlurInput, elements.maskBlurValue, "px");
  updateEffectRangeOutput(elements.blurGradientInput, elements.blurGradientValue, "%");
  updateFeedEffectStyles();
  updateStoriesPreview();
  refreshVideoArtwork();
}

function updateMaskLockState() {
  const locked = Boolean(state.maskControlsLocked);
  [elements.maskBlurInput, elements.blurGradientInput].forEach((input) => {
    if (!input) return;
    input.disabled = locked;
    input.setAttribute("aria-disabled", String(locked));
  });

  elements.maskEffectSection?.classList.toggle("is-locked", locked);
  elements.maskLockButton?.classList.toggle("is-locked", locked);
  elements.maskLockButton?.classList.toggle("is-unlocked", !locked);
  elements.maskLockButton?.setAttribute("aria-pressed", String(!locked));
  elements.maskLockButton?.setAttribute(
    "aria-label",
    locked ? "Desbloquear ajustes da mascara" : "Bloquear ajustes da mascara",
  );
  if (elements.maskLockLabel) {
    elements.maskLockLabel.textContent = locked ? "Travado" : "Manual";
  }
}

function setupRangeControls() {
  elements.rangeInputs.forEach((input) => {
    const realMin = Number(input.min);
    const realMax = Number(input.max);
    const realDefault = Number(input.value);
    const realStep = Number(input.step || 1);
    setRealRangeConfig(input, {
      min: realMin,
      max: realMax,
      defaultValue: realDefault,
      step: realStep,
    });
    input.min = "-100";
    input.max = "100";
    input.step = "1";
    input.value = "0";

    const field = input.closest(".range-field");
    if (field && !field.querySelector(".range-scale")) {
      const scale = document.createElement("div");
      scale.className = "range-scale";
      scale.innerHTML = "<span>-100</span><span>0</span><span>100</span>";
      field.append(scale);
    }

    input.addEventListener("dblclick", () => resetRangeToDefault(input));
  });
}

function setRealRangeConfig(input, config) {
  if (!input) return;
  input.dataset.realMin = String(config.min);
  input.dataset.realMax = String(config.max);
  input.dataset.realDefault = String(config.defaultValue);
  input.dataset.realStep = String(config.step ?? 1);
  input.min = "-100";
  input.max = "100";
  input.step = "1";
}

function setRangeConfig(input, config) {
  if (!input) return;
  setRealRangeConfig(input, config);
  writeRangeRealValue(input, config.defaultValue);
}

function resetRangeToDefault(input) {
  if (!input) return;
  input.value = "0";
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

function getDisplayRangeValue(input) {
  const value = Number(input.value);
  if (!Number.isFinite(value)) return "0";
  return String(Math.round(value));
}

function updateRangeOutput(input, output) {
  if (!input || !output) return;
  output.textContent = getDisplayRangeValue(input);
}

function updateEffectRangeOutput(input, output, unit) {
  if (!input || !output) return;
  output.textContent = `${Math.round(readRangeRealValue(input))}${unit}`;
}

function readRangeRealValue(input) {
  const visualValue = Number(input.value);
  const min = Number(input.dataset.realMin);
  const max = Number(input.dataset.realMax);
  const defaultValue = Number(input.dataset.realDefault);
  const step = Number(input.dataset.realStep || 1);

  if (![visualValue, min, max, defaultValue].every(Number.isFinite)) {
    return Number(input.value);
  }

  const clampedVisual = clamp(visualValue, -100, 100);
  const realValue =
    clampedVisual >= 0
      ? defaultValue + (max - defaultValue) * (clampedVisual / 100)
      : defaultValue + (defaultValue - min) * (clampedVisual / 100);

  return roundToStep(realValue, step);
}

function writeRangeRealValue(input, realValue, output) {
  const min = Number(input.dataset.realMin);
  const max = Number(input.dataset.realMax);
  const defaultValue = Number(input.dataset.realDefault);
  const value = Number(realValue);
  let visualValue = 0;

  if ([min, max, defaultValue, value].every(Number.isFinite)) {
    if (value > defaultValue) {
      const range = max - defaultValue;
      visualValue = range ? ((value - defaultValue) / range) * 100 : 0;
    } else if (value < defaultValue) {
      const range = defaultValue - min;
      visualValue = range ? -((defaultValue - value) / range) * 100 : 0;
    }
  }

  input.value = String(clamp(Math.round(visualValue), -100, 100));
  updateRangeOutput(input, output);
}

function roundToStep(value, step) {
  if (!Number.isFinite(step) || step <= 0) return value;
  const decimals = String(step).includes(".") ? String(step).split(".")[1].length : 0;
  return Number((Math.round(value / step) * step).toFixed(decimals));
}

function syncLogoControls() {
  if (!elements.logoWidthInput) return;

  configureLogoRange();
  updateLogoControlValues();
  saveLogoSettingsForCurrentFormat();
  updateLogoControlOutputs();
}

function saveLogoSettingsForCurrentFormat() {
  state.logoSettings[state.format] = {
    width: state.logoWidth,
    x: state.logoX,
    y: state.logoY,
    opacity: state.logoOpacity,
  };
}

function applyLogoSettingsForFormat(format) {
  const settings = state.logoSettings[format === "informative" ? "feed" : format] || FEED.logo;
  state.logoWidth = settings.width;
  state.logoX = settings.x;
  state.logoY = settings.y;
  state.logoOpacity = settings.opacity;
  configureLogoRange(format);
  updateLogoControlValues();
}

function configureLogoRange(format = state.format) {
  if (!elements.logoYInput) return;

  if (format === "feed" || format === "informative") {
    const logo = format === "informative" ? INFORMATIVE.logo : FEED.logo;
    setRangeConfig(elements.logoWidthInput, { min: 120, max: 420, defaultValue: logo.width, step: 1 });
    setRangeConfig(elements.logoXInput, { min: -280, max: 280, defaultValue: logo.x, step: 1 });
    setRangeConfig(elements.logoYInput, { min: 1040, max: 1280, defaultValue: logo.y, step: 1 });
    setRangeConfig(elements.logoOpacityInput, { min: 10, max: 100, defaultValue: logo.opacity, step: 1 });
  } else {
    setRangeConfig(elements.logoWidthInput, { min: 120, max: 420, defaultValue: STORY.logo.width, step: 1 });
    setRangeConfig(elements.logoXInput, { min: -280, max: 280, defaultValue: STORY.logo.x, step: 1 });
    setRangeConfig(elements.logoYInput, { min: 1500, max: 1820, defaultValue: STORY.logo.y, step: 1 });
    setRangeConfig(elements.logoOpacityInput, { min: 10, max: 100, defaultValue: STORY.logo.opacity, step: 1 });
  }
}

function updateLogoControlValues() {
  if (!elements.logoWidthInput) return;

  writeRangeRealValue(elements.logoWidthInput, state.logoWidth, elements.logoWidthValue);
  writeRangeRealValue(elements.logoXInput, state.logoX, elements.logoXValue);
  writeRangeRealValue(elements.logoYInput, state.logoY, elements.logoYValue);
  writeRangeRealValue(elements.logoOpacityInput, state.logoOpacity, elements.logoOpacityValue);
  updateLogoControlOutputs();
}

function updateLogoControlOutputs() {
  updateRangeOutput(elements.logoWidthInput, elements.logoWidthValue);
  updateRangeOutput(elements.logoXInput, elements.logoXValue);
  updateRangeOutput(elements.logoYInput, elements.logoYValue);
  updateRangeOutput(elements.logoOpacityInput, elements.logoOpacityValue);
}

function syncSubtitleFormatControls() {
  elements.subtitleNumberInputs.forEach((input) => {
    input.value = String(state[input.dataset.subtitleNumber]);
  });
  elements.subtitleRangeInputs.forEach((input) => {
    input.value = String(state[input.dataset.subtitleRange]);
  });
  elements.subtitleSelects.forEach((select) => {
    select.value = state[select.dataset.subtitleSelect];
  });
  updateSubtitleControlButtons();
}

function bindSubtitleFormatControls() {
  elements.subtitleNumberInputs.forEach((input) => {
    input.addEventListener("input", () => {
      updateSubtitleNumberState(input.dataset.subtitleNumber, input.value, input);
    });
  });

  elements.subtitleRangeInputs.forEach((input) => {
    input.addEventListener("input", () => {
      updateSubtitleNumberState(input.dataset.subtitleRange, input.value, input);
    });
  });

  elements.subtitleSelects.forEach((select) => {
    select.addEventListener("change", () => {
      state[select.dataset.subtitleSelect] = select.value;
      updateFeedText();
    });
  });

  elements.subtitleAlignButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.subtitleTextAlign = button.dataset.subtitleAlign;
      updateSubtitleControlButtons();
      updateFeedText();
    });
  });

  elements.subtitleToggleButtons.forEach((button) => {
    button.addEventListener("mousedown", (event) => event.preventDefault());
    button.addEventListener("click", () => {
      const property = getSubtitleToggleMark(button.dataset.subtitleToggle);
      if (!property) return;
      const nextValue = !getSubtitleSelectionStyle()[property];
      applySubtitleSelectionMark(property, nextValue);
      updateSubtitleControlButtons();
      updateFeedText();
    });
  });

  elements.subtitlePresetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applySubtitlePreset(button.dataset.subtitlePreset);
    });
  });
}

function updateSubtitleNumberState(property, rawValue, sourceInput) {
  const value = clampSubtitleNumber(sourceInput, rawValue);
  state[property] = value;
  syncSubtitleNumberControls(property, value, sourceInput);
  updateFeedText();
}

function clampSubtitleNumber(input, rawValue) {
  const min = Number(input.min);
  const max = Number(input.max);
  const value = Number(rawValue);
  const fallback = Number(input.value) || 0;
  return clamp(Number.isFinite(value) ? value : fallback, min, max);
}

function syncSubtitleNumberControls(property, value, sourceInput) {
  elements.subtitleNumberInputs.forEach((input) => {
    if (input !== sourceInput && input.dataset.subtitleNumber === property) {
      input.value = String(value);
    }
  });
  elements.subtitleRangeInputs.forEach((input) => {
    if (input !== sourceInput && input.dataset.subtitleRange === property) {
      input.value = String(value);
    }
  });
}

function updateSubtitleControlButtons() {
  elements.subtitleAlignButtons.forEach((button) => {
    const isActive = button.dataset.subtitleAlign === state.subtitleTextAlign;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  elements.subtitleToggleButtons.forEach((button) => {
    const mark = getSubtitleToggleMark(button.dataset.subtitleToggle);
    const isActive = Boolean(mark && getSubtitleSelectionStyle()[mark]);
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function applySubtitlePreset(name) {
  const preset = SUBTITLE_PRESETS[name];
  if (!preset) return;

  Object.assign(state, preset);
  syncSubtitleFormatControls();
  updateFeedText();
}

function getSubtitleToggleMark(toggle) {
  const map = {
    underline: "underline",
    strike: "strike",
    superscript: "superscript",
    subscript: "subscript",
    subtitleUnderline: "underline",
    subtitleStrike: "strike",
    subtitleSuperscript: "superscript",
    subtitleSubscript: "subscript",
  };
  return map[toggle] || "";
}

function bindEvents() {
  bindCircleInset();
  StudioUI.init({
    getState: () => state, exportBusy: () => elements.exportButton.disabled,
    closeMedia: closeMediaPopover, closeText: closeTextEditPopover, toggleMedia: toggleMediaPopover,
    export: exportPrimary, resize: updateStageScale,
    refresh: () => { updateMediaTransform(); updateStoriesPreview(); updateClosingPreview(); },
    format: format => { if (state.exportingVideo) return; format === "informative" ? selectInformativePage(state.activeInformativePage) : applyFormat(format); },
    effects: (id, value) => {
      if (state.format === "polaroid") { PolaroidStudio.setEffect(id, value); StudioUI.sync(); return; }
      const format = state.format;
      const property = id === "effectBlur"
        ? format === "closing" ? "closingBlur" : format === "informative" ? "infoBackgroundBlur" : "maskBlur"
        : format === "closing" ? "closingShade" : format === "informative" ? "infoShade" : "blurGradientOpacity";
      const before = state[property];
      if (id === "effectBlur") { if (state.format === "closing") state.closingBlur = value; else if (state.format === "informative") state.infoBackgroundBlur = value; else state.maskBlur = value; }
      else if (state.format === "closing") state.closingShade = value; else if (state.format === "informative") state.infoShade = value; else state.blurGradientOpacity = value;
      updateFeedEffectStyles(); updateClosingPreview(); updateStoriesPreview(); updateInformativePreview();
      EditorHistory.record(before, value, saved => {
        state[property] = saved; applyFormat(format, { keepPanel: true });
        updateFeedEffectStyles(); updateClosingPreview(); updateStoriesPreview(); updateInformativePreview(); StudioUI.sync();
      }, "Ajustar efeito", `${format}:${property}`);
    },
  });
  document.getElementById("mobileSheetBackdrop").addEventListener("click", () => closeMediaPopover());
  document.querySelectorAll("[data-canvas-zoom]").forEach(button => button.addEventListener("click", () => {
    const factor = button.dataset.canvasZoom === "in" ? 1.15 : 1 / 1.15;
    if (state.format === "informative") state.infoZoom *= factor;
    else if (["feed", "stories"].includes(state.format)) state.zoom *= factor;
    updateMediaTransform();
  }));
  const infoBoldButton = document.getElementById("mobileInfoBold");
  const rememberInfoSelection = () => {
    const input = elements.infoBodyInput;
    if (input.selectionEnd > input.selectionStart) state.infoEditSelection = { start: input.selectionStart, end: input.selectionEnd, text: input.value, page: state.activeInformativePage };
  };
  elements.infoBodyInput.addEventListener("select", rememberInfoSelection);
  infoBoldButton.addEventListener("pointerdown", event => { rememberInfoSelection(); if (event.pointerType !== "touch") event.preventDefault(); });
  infoBoldButton.addEventListener("click", () => {
    let { selectionStart: start, selectionEnd: end } = elements.infoBodyInput;
    if (start === end && state.infoEditSelection?.text === elements.infoBodyInput.value && state.infoEditSelection.page === state.activeInformativePage) ({ start, end } = state.infoEditSelection);
    if (start === end) { setStatus("Selecione um trecho para aplicar negrito"); return; }
    state.infoBodyBold = EditorCore.toggleRange(state.infoBodyBold, start, end);
    updateInformativeText();
  });
  document.addEventListener("pointerdown", event => {
    if (event.target.closest(".glass-dock, .editor-inspector, .editor-export, #inspectorToggle, .mobile-navigation, .mobile-actionbar, .studio-panel, .control-panel-shell, .preview-audio-control")) return;
    if (state.dockAttachmentFormat) {
      state.dockAttachmentFormat = null;
      closeMediaPopover();
    }
  });
  elements.stage.addEventListener("keydown", event => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const selections = { feedTitleLayer: "title", feedSubtitlePreview: "subtitle", feedKickerPreview: "kicker", informativeTitlePreview: "infoTitle", informativeBodyPreview: "infoBody" };
    const selection = selections[event.target.id];
    if (!selection) return;
    event.preventDefault();
    selectPreviewElement(selection);
    openTextEditPopover(selection, event);
  });
  document.getElementById("workspaceImageButton").addEventListener("click", toggleMediaPopover);
  document.getElementById("dockImage").addEventListener("click", toggleMediaPopover);
  document.querySelector(".informative-upload-action").addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); elements.informativeImageInput.click(); }
  });
  document.getElementById("closingImageInput").addEventListener("change", event => {
    void importClosingImageFile(event.target.files[0]); event.target.value = "";
  });
  document.addEventListener("paste", event => {
    if (state.exportingVideo || document.querySelector("dialog[open]") || event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
    const item = [...(event.clipboardData?.items || [])].find(item => item.kind === "file" && item.type.startsWith("image/"));
    const file = item?.getAsFile();
    if (!file) return;
    event.preventDefault();
    const upload = { target: { files: [file], value: "" } };
    if (state.format === "polaroid") void PolaroidStudio.paste(file);
    else if (state.format === "informative") void handleInformativeImageUpload(upload);
    else if (state.format === "closing") void importClosingImageFile(file);
    else void handleFeedImageUpload(upload);
  });
  document.getElementById("closingUseFeed").addEventListener("click", () => {
    state.closingImage = null;
    closeMediaPopover();
    updateClosingPreview();
    updateStoriesPreview();
    setStatus("Encerramento vinculado à imagem do Feed");
  });
  bindDirectImageControls();
  bindSubtitleContextBold();
  bindTextEditPopover();
  elements.stage.addEventListener("click", (event) => {
    if (state.format === "closing") { toggleMediaPopover(); return; }
    const target = (state.previewClickTarget || event.target).closest(".logo-layer, .headline-strip, .feed-title-layer, .feed-subtitle, .feed-kicker, .informative-title, .informative-body");
    state.previewClickTarget = null;
    const selection = target?.matches(".logo-layer") ? "logo" : target?.matches(".feed-subtitle") ? "subtitle" : target?.matches(".feed-kicker") ? "kicker" : target?.matches(".informative-title") ? "infoTitle" : target?.matches(".informative-body") ? "infoBody" : target ? "title" : "media";
    if (selection === "logo") return;
    if (selection === "kicker" && state.kickerMode === "image") {
      closeTextEditPopover();
      selectKickerLogo(1 - state.kickerLogoIndex);
      return;
    }
    if (["title", "subtitle", "kicker", "infoTitle", "infoBody"].includes(selection)) {
      selectPreviewElement(selection);
      openTextEditPopover(selection, event);
    } else {
      closeTextEditPopover();
      setActiveDockPanel(selection);
      selectPreviewElement(selection);
    }
  });
  function debounce(fn, wait = 60) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  const debouncedUpdateStageScale = debounce(updateStageScale, 60);
  const debouncedUpdateControlPanelFade = debounce(updateControlPanelFade, 60);

  window.addEventListener("resize", debouncedUpdateStageScale);
  window.addEventListener("resize", debouncedUpdateControlPanelFade);
  if ("MutationObserver" in window && elements.feedSubtitleInput) {
    new MutationObserver(() => {
      updateSubtitleToolbarState();
      updateFeedText();
    }).observe(elements.feedSubtitleInput, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true,
    });
  }

  if ("ResizeObserver" in window) {
    new ResizeObserver(updateStageScale).observe(elements.frame);
    const stageHost = elements.frame.closest(".stage-host");
    if (stageHost) {
      new ResizeObserver(updateStageScale).observe(stageHost);
    }
    const panelObserver = new ResizeObserver(updateControlPanelFade);
    panelObserver.observe(elements.dockPanelStack);
    panelObserver.observe(elements.controlPanelShell);
  }

  elements.formatButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (state.exportingVideo) return;
      const next = button.dataset.format;
      const showAttachment = ["feed", "stories"].includes(next) && state.dockAttachmentFormat !== next;
      closeMediaPopover();
      closeTextEditPopover();
      document.body.classList.remove("mobile-dock-expanded");
      document.getElementById("dockMore")?.setAttribute("aria-expanded", "false");
      button.dataset.format === "informative" ? selectInformativePage(0) : applyFormat(button.dataset.format);
      state.dockAttachmentFormat = showAttachment ? next : null;
      syncDockAffordances();
      if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const host = document.querySelector(".stage-host");
        host.getAnimations().forEach(animation => animation.cancel());
        host.animate([{ opacity: .5, transform: "scale(.985)" }, { opacity: 1, transform: "scale(1)" }], { duration: 280, easing: "cubic-bezier(.16,1,.3,1)" });
      }
    });
  });
  document.getElementById("addInformativePage").addEventListener("click", addInformativePage);
  bindEditorShortcuts();
  renderInformativePageTabs();

  elements.videoInput.addEventListener("change", handleVideoUpload);
  elements.feedImageInput?.addEventListener("change", handleFeedImageUpload);
  elements.informativeImageInput?.addEventListener("change", handleInformativeImageUpload);
  document.getElementById("informativeUploadButton").addEventListener("click", event => {
    event.stopPropagation();
    elements.informativeImageInput.value = "";
    elements.informativeImageInput.click();
  });
  elements.randomFeedImageButton?.addEventListener("click", () => loadRandomFeedImage());
  elements.feedKickerInput?.addEventListener("input", updateFeedText);
  elements.infoTitleInput?.addEventListener("input", () => { state.infoTitle = elements.infoTitleInput.value; updateInformativeText(); });
  elements.infoBodyInput?.addEventListener("input", () => {
    state.infoBodyBold = EditorCore.remapRanges(state.infoBody, elements.infoBodyInput.value, state.infoBodyBold);
    updateInformativeText();
  });
  let infoSelection = null;
  elements.infoBodyInput?.addEventListener("pointerdown", event => {
    const editor = elements.infoBodyInput;
    infoSelection = event.button === 2 && editor.selectionEnd > editor.selectionStart
      ? [editor.selectionStart, editor.selectionEnd] : null;
  });
  elements.infoBodyInput?.addEventListener("contextmenu", event => {
    const editor = elements.infoBodyInput;
    const [start, end] = infoSelection || [editor.selectionStart, editor.selectionEnd];
    infoSelection = null;
    if (start === end) return;
    event.preventDefault();
    state.infoBodyBold = EditorCore.toggleRange(state.infoBodyBold, start, end);
    editor.setSelectionRange(start, end);
    updateInformativeText();
    setStatus("Negrito atualizado no trecho selecionado");
  });
  document.querySelectorAll("[data-edit-text]").forEach(button => {
    button.addEventListener("click", () => {
      document.body.classList.remove("mobile-dock-expanded");
      document.getElementById("dockMore")?.setAttribute("aria-expanded", "false");
      const selection = state.format === "informative"
        ? ({ title: "infoTitle", subtitle: "infoBody" }[button.dataset.editText] || button.dataset.editText)
        : button.dataset.editText;
      const bounds = button.getBoundingClientRect();
      selectPreviewElement(selection);
      openTextEditPopover(selection, { clientX: bounds.right, clientY: bounds.top });
    });
  });
  document.getElementById("kickerModeInput")?.addEventListener("change", event => {
    state.kickerMode = event.target.value;
    updateFeedText();
  });
  document.getElementById("kickerLogoInput").addEventListener("change", event => selectKickerLogo(Number(event.target.value)));
  elements.feedKickerPreview.addEventListener("contextmenu", event => {
    event.preventDefault(); openTextEditPopover("kicker", event);
  });
  elements.feedSubtitleInput?.addEventListener("input", () => {
    cleanSubtitleMarks();
    updateSubtitleToolbarState();
    updateFeedText();
  });
  elements.feedSubtitleInput?.addEventListener("paste", pastePlainTextIntoFeedSubtitle);
  elements.feedSubtitleInput?.addEventListener("keyup", () => { updateSubtitleToolbarState(); });
  elements.feedSubtitleInput?.addEventListener("mouseup", updateSubtitleToolbarState);
  elements.feedSubtitleWeightButtons.forEach((button) => {
    button.addEventListener("mousedown", (event) => event.preventDefault());
    button.addEventListener("click", () => applyFeedSubtitleWeight(button.dataset.weight));
  });
  bindSubtitleFormatControls();
  document.addEventListener("selectionchange", updateSubtitleToolbarState);
  let titleContextSelection = null;
  elements.titleInput.addEventListener("pointerdown", (event) => {
    titleContextSelection = event.button === 2 && elements.titleInput.selectionStart !== elements.titleInput.selectionEnd
      ? { start: elements.titleInput.selectionStart, end: elements.titleInput.selectionEnd } : null;
  });
  elements.titleInput.addEventListener("contextmenu", (event) => {
    const { start, end } = titleContextSelection || { start: elements.titleInput.selectionStart, end: elements.titleInput.selectionEnd };
    titleContextSelection = null;
    if (start === end) return;
    event.preventDefault();
    elements.titleInput.setSelectionRange(start, end);
    void applyTitleHighlight(start, end);
  });
  elements.titleInput.addEventListener("input", () => {
    state.titleHighlights = EditorCore.remapRanges(state.previousTitleText, elements.titleInput.value, state.titleHighlights);
    state.previousTitleText = elements.titleInput.value;
    updateText();
    updateFeedText();
  });
  bindTitleBorderControl("titleFontSize", elements.titleFontSizeInput, elements.titleFontSizeValue);

  elements.zoomInput.addEventListener("input", () => {
    state.zoom = readRangeRealValue(elements.zoomInput);
    updateMediaTransform();
  });

  elements.panXInput.addEventListener("input", () => {
    state.panX = readRangeRealValue(elements.panXInput);
    updateMediaTransform();
  });

  elements.panYInput.addEventListener("input", () => {
    state.panY = readRangeRealValue(elements.panYInput);
    updateMediaTransform();
  });

  elements.maskBlurInput?.addEventListener("input", () => {
    state.maskBlur = readRangeRealValue(elements.maskBlurInput);
    updateEffectRangeOutput(elements.maskBlurInput, elements.maskBlurValue, "px");
    updateFeedEffectStyles();
  });

  elements.blurGradientInput?.addEventListener("input", () => {
    state.blurGradientOpacity = readRangeRealValue(elements.blurGradientInput);
    updateEffectRangeOutput(elements.blurGradientInput, elements.blurGradientValue, "%");
    updateFeedEffectStyles();
  });

  elements.maskLockButton?.addEventListener("click", () => {
    state.maskControlsLocked = !state.maskControlsLocked;
    updateMaskLockState();
  });

  bindLogoControl("logoWidth", elements.logoWidthInput, elements.logoWidthValue);
  bindLogoControl("logoX", elements.logoXInput, elements.logoXValue);
  bindLogoControl("logoY", elements.logoYInput, elements.logoYValue);
  bindLogoControl("logoOpacity", elements.logoOpacityInput, elements.logoOpacityValue);
  bindTitleHighlightControls();

  elements.togglePlayback.addEventListener("click", togglePreviewPlayback);
  elements.panelPlayButton?.addEventListener("click", togglePreviewPlayback);
  elements.toggleMute.addEventListener("click", togglePreviewMute);
  elements.panelMuteButton?.addEventListener("click", togglePreviewMute);

  elements.video.addEventListener("play", updatePlaybackIcons);
  elements.video.addEventListener("pause", updatePlaybackIcons);
  elements.panelTriggers.forEach((button) => {
    button.addEventListener("click", () => {
      setActiveDockPanel(button.dataset.panel);
      selectPreviewElement(button.dataset.selection || button.dataset.panel);
    });
  });
  elements.dockPanels.forEach((panel) => {
    panel.addEventListener("scroll", updateControlPanelFade);
  });
  elements.exportButton.addEventListener("click", exportPrimary);
  elements.pngExportButton.addEventListener("click", exportCurrentPng);
}

function bindTitleHighlightControls() {
  const chips = document.querySelectorAll("#popoverTitleHighlightGroup .color-chip, #panelTitleHighlightGroup .color-chip");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      state.titleHighlightColor = chip.dataset.color || "pink";
      chips.forEach((btn) => {
        btn.classList.toggle("is-active", btn.dataset.color === state.titleHighlightColor);
        btn.setAttribute("aria-pressed", String(btn.dataset.color === state.titleHighlightColor));
      });
      updateText();
      updateFeedText();
    });
  });
}

function bindTitleBorderControl(stateKey, input, output) {
  input.addEventListener("input", () => {
    state[stateKey] = readRangeRealValue(input);
    updateRangeOutput(input, output);
    updateText();
    updateFeedText();
  });
}

function bindLogoControl(stateKey, input, output) {
  if (!input || !output) return;

  input.addEventListener("input", () => {
    state[stateKey] = readRangeRealValue(input);
    updateRangeOutput(input, output);
    saveLogoSettingsForCurrentFormat();
    updateLogoTransform();
  });
}

function getTimelineVideo() { return state.format === "informative" ? state.infoVideo : elements.video; }
function getTimelineState() { return state.format === "informative" ? state.informativePages[state.activeInformativePage] : state; }
function getTimelineUrl() { return state.format === "informative" ? state.infoVideo?.src || "" : state.videoUrl; }
function hasTimelineVideo() { return hasArtworkVideo() || hasInformativeVideo(); }

async function togglePreviewPlayback() {
  const video = getTimelineVideo(), timeline = getTimelineState();
  if (!video || !getTimelineUrl()) return;
  if (video.currentTime < timeline.videoTrimStart || video.currentTime >= timeline.videoTrimEnd) video.currentTime = timeline.videoTrimStart;
  if (video.paused) await video.play(); else video.pause();
  updatePlaybackIcons();
}

function togglePreviewMute() {
  const video = getTimelineVideo(); if (!video || state.exportingVideo) return;
  video.muted = !video.muted;
  if (!video.muted && video.paused) togglePreviewPlayback().catch(() => setStatus("Toque em reproduzir para ouvir o vídeo."));
  updatePlaybackIcons();
}

function applyFormat(format, options = {}) {
  if (state.exportingVideo) return;
  if (!FORMATS[format]) return;

  if (format === state.format && !options.keepPanel) {
    elements.formatButtons.forEach((button) => {
      const isActive = button.dataset.format === format;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
    renderInformativePageTabs();
    return;
  }

  const formatChanged = format !== state.format;
  if (formatChanged) state.artboardFocused = false;
  saveLogoSettingsForCurrentFormat();
  state.format = format;
  PolaroidStudio.show(format === "polaroid");
  StudioUI.closeOtherPanels();
  StudioUI.sync();
  document.getElementById("circlePopover").hidden = true;
  syncCircleInset();
  document.getElementById("workspaceImageButton").textContent = format === "informative" ? "Imagem do vetor" : "Imagem de fundo";
  closeMediaPopover();
  closeTextEditPopover();
  applyLogoSettingsForFormat(format);

  const spec = getCurrentFormatSpec();
  elements.shell.dataset.format = format;
  elements.stage.dataset.format = format;
  elements.stage.style.setProperty("--stage-width", `${spec.width}px`);
  elements.stage.style.setProperty("--stage-height", `${spec.height}px`);
  elements.canvas.width = spec.width;
  elements.canvas.height = spec.height;

  elements.formatButtons.forEach((button) => {
    const isActive = button.dataset.format === format;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  elements.formatSizeLabel.textContent = spec.size;
  renderInformativePageTabs();
  elements.formatNameLabel.textContent = spec.name;
  elements.previewRatioLabel.textContent = spec.ratio;
  elements.previewModeLabel.textContent = "";
  selectPreviewElement(state.activeDockPanel || "media");

  elements.exportLabel.textContent = format === "story" ? (state.exportExt === "mp4" ? "Salvar MP4" : "Salvar WEBM") : "Exportar PNG";
  elements.pngExportButton.querySelector("span").textContent = format === "story" ? "Exportar PNG" : "Salvar PNG";

  if (format === "feed") {
    elements.trackTitle.textContent = state.feedImageName || "Feed 1080 x 1350";
    elements.trackSub.textContent = state.feedImage ? "Imagem pronta" : "Imagem aleatoria temporaria";
  } else if (format === "informative") {
    elements.trackTitle.textContent = "Modelo informativo";
    elements.trackSub.textContent = state.infoImage ? "Bloco pronto" : "Envie a imagem do bloco";
  } else {
    elements.trackTitle.textContent = state.videoName || "Sem arquivo";
    elements.trackSub.textContent = state.videoName ? "MP4 do story" : "Aguardando MP4";
  }

  updateStageScale();
  updateText();
  updateFeedText();
  updateInformativeText();
  updateMediaTransform();
  updateLogoTransform();
  updateStoriesPreview();
  syncVideoControls();
  syncCircleInset();
  ensureCircleForeground();
  refreshVideoArtwork();
  syncInformativeVideoPlayback();
  if (format === "polaroid") PolaroidStudio.refresh();
  if (formatChanged) StudioMotion.formatChanged();
  requestAnimationFrame(updateControlPanelFade);
}

function getCurrentFormatSpec() {
  return FORMATS[state.format] || FORMATS.story;
}

function updateStageScale() {
  const stageHost = elements.frame.closest(".stage-host");
  const spec = getCurrentFormatSpec();
  const hostStyle = getComputedStyle(stageHost);
  // Every 4:5 artwork shares the same space reservation, including board headers.
  const isPortraitPost = spec.width === 1080 && spec.height === 1350;
  const availableWidth = Math.max(24, stageHost.offsetWidth - parseFloat(hostStyle.paddingLeft) - parseFloat(hostStyle.paddingRight) - (isPortraitPost ? 32 : 0));
  const workbench = document.body.classList.contains("studio-workbench");
  const boardGrid = ["informative", "polaroid"].includes(state.format);
  // Mobile uses full-size pages in a vertical flow; desktop keeps the fitted grid.
  const mobileBoardFlow = workbench && document.body.classList.contains("is-mobile-studio") && boardGrid;
  stageHost.classList.toggle("mobile-board-flow", mobileBoardFlow);
  const boardCount = state.artboardFocused || mobileBoardFlow ? 1 : state.format === "informative" ? state.informativePages.length : state.format === "polaroid" ? PolaroidStudio.count() : 1;
  const heightReserve = workbench && boardCount > 1 ? 0 : isPortraitPost || hasTimelineVideo() ? 76 : 0;
  const availableHeight = Math.max(24, stageHost.offsetHeight - parseFloat(hostStyle.paddingTop) - parseFloat(hostStyle.paddingBottom) - heightReserve);
  const columns = Math.min(boardCount, stageHost.offsetWidth < 600 ? 2 : 3);
  const rows = Math.ceil(boardCount / columns);
  const gap = stageHost.offsetWidth < 600 ? 12 : 28;
  const gridHeight = workbench
    ? availableHeight - (boardCount > 1 ? 112 + 44 * (rows - 1) : 0)
    : availableHeight + (state.artboardFocused ? 8 : -48) - 64 * (rows - 1);
  const scale = boardGrid
    ? Math.min(Math.max(24, availableWidth - gap * (columns - 1)) / columns / spec.width, Math.max(24, gridHeight) / rows / spec.height, .72)
    : Math.min(availableWidth / spec.width, availableHeight / spec.height, .72);
  stageHost.style.setProperty("--board-columns", columns);
  stageHost.style.setProperty("--board-gap", `${gap}px`);
  const width = Math.ceil(spec.width * scale);
  const height = Math.ceil(spec.height * scale);
  stageHost.style.justifyContent = width > availableWidth ? "flex-start" : "center";
  stageHost.style.alignItems = height > availableHeight ? "flex-start" : "center";
  elements.stage.style.transform = `scale(${scale})`;
  elements.stage.style.left = "0";
  elements.stage.style.marginLeft = "0";
  elements.frame.style.width = `${width}px`;
  elements.frame.style.height = `${height}px`;
  stageHost.style.setProperty("--artboard-width", `${width}px`);
  stageHost.style.setProperty("--artboard-height", `${height}px`);
  stageHost.style.setProperty("--board-center-x", `${Math.max(0, (stageHost.clientWidth - parseFloat(hostStyle.paddingLeft) - parseFloat(hostStyle.paddingRight) - width) / 2)}px`);
  stageHost.style.setProperty("--board-center-y", `${Math.max(0, (stageHost.offsetHeight - parseFloat(hostStyle.paddingTop) - parseFloat(hostStyle.paddingBottom) - height) / 2)}px`);

  document.querySelectorAll(".artboard-static").forEach(frame => {
    frame.style.width = `${width}px`;
    frame.style.height = `${height}px`;
    frame.querySelector(".story-stage").style.transform = `scale(${scale})`;
  });
  positionPreviewAudioControl();
  MediaLoadingBorder.sync();
}

function positionPreviewAudioControl() {
  const button = elements.panelMuteButton;
  if (!button || button.hidden) return;
  const actions = Array.from(elements.frame.parentElement.children).filter(node => node.matches(".artboard-back, .informative-remove"));
  const occupied = actions.length * 40;
  button.style.left = `${elements.frame.offsetLeft + elements.frame.offsetWidth - 44 - occupied}px`;
  button.style.top = `${elements.frame.offsetTop - 46}px`;
}

async function handleVideoUpload(event) {
  const file = event.target.files[0];
  if (!file || state.exportingVideo) return;
  if (file.type && !file.type.startsWith("video/")) { setStatus("Selecione um arquivo de vídeo."); return; }
  const finishLoading = beginMediaLoading("Preparando vídeo…", { format: "feed" });
  let mediaReady = false;
  const token = ++state.videoLoadingToken;
  const url = URL.createObjectURL(file);
  const candidate = document.createElement("video");
  candidate.src = url;
  candidate.muted = true;
  candidate.playsInline = true;
  setStatus("Abrindo vídeo…");
  try {
    await waitForVideo(candidate);
    if (!Number.isFinite(candidate.duration) || candidate.duration <= 0) throw new Error("Duração inválida");
    if (token !== state.videoLoadingToken) { URL.revokeObjectURL(url); return; }
    elements.video.pause();
    if (state.videoUrl) URL.revokeObjectURL(state.videoUrl);
    state.videoUrl = url;
    state.videoName = file.name;
    state.mediaKind = "video";
    document.getElementById("photoCredit").hidden = true;
    state.videoDuration = candidate.duration;
    state.videoTrimStart = 0;
    state.videoTrimEnd = candidate.duration;
    state.zoom = 1;
    state.panX = state.panY = 0;
    elements.video.src = url;
    elements.video.muted = false;
    elements.video.loop = false;
    await waitForVideo(elements.video);
    elements.fileMain.textContent = file.name;
    elements.fileSub.textContent = `${formatFileSize(file.size)} · ${candidate.videoWidth} × ${candidate.videoHeight}`;
    if (!["feed", "stories"].includes(state.format)) applyFormat("stories");
    syncVideoControls();
    closeMediaPopover();
    updateMediaTransform();
    refreshVideoArtwork();
    buildVideoFilmstrip(url).catch(() => {});
    mediaReady = true;
    setStatus("Vídeo pronto. Ajuste o trecho e exporte.");
    elements.video.play().catch(() => setStatus("Toque em reproduzir para ouvir o vídeo."));
  } catch {
    if (state.videoUrl !== url) URL.revokeObjectURL(url);
    setStatus("Não foi possível abrir esse vídeo. Tente MP4 (H.264) ou WebM.");
  } finally {
    finishLoading(mediaReady);
    candidate.removeAttribute("src");
    candidate.load();
    event.target.value = "";
  }
}

function hasArtworkVideo() {
  return state.mediaKind === "video" && Boolean(state.videoUrl) && ["feed", "stories"].includes(state.format);
}

function getArtworkMedia() {
  if (state.renderVideo) return state.renderVideo;
  const video = elements.video;
  return state.mediaKind === "video" && video.readyState >= 2 ? video : state.feedImage;
}

function syncVideoControls() {
  const active = hasTimelineVideo();
  const timeline = getTimelineState();
  const visibilityChanged = elements.shell.classList.contains("has-artwork-video") !== active;
  document.getElementById("videoTimeline").hidden = !active;
  elements.panelMuteButton.hidden = !active;
  elements.frame.parentElement.append(elements.panelMuteButton);
  positionPreviewAudioControl();
  elements.shell.classList.toggle("has-artwork-video", active);
  document.body.classList.toggle("has-artwork-video", active);
  for (const id of ["videoTrimStart", "videoTrimEnd"]) document.getElementById(id).max = timeline.videoDuration;
  document.getElementById("videoTrimStart").value = String(timeline.videoTrimStart);
  document.getElementById("videoTrimEnd").value = String(timeline.videoTrimEnd);
  const seek = document.getElementById("videoSeek");
  seek.min = 0;
  seek.max = timeline.videoDuration || 1;
  const selection = document.getElementById("videoClipSelection");
  selection.style.left = `${timeline.videoDuration ? timeline.videoTrimStart / timeline.videoDuration * 100 : 0}%`;
  selection.style.right = `${timeline.videoDuration ? 100 - timeline.videoTrimEnd / timeline.videoDuration * 100 : 0}%`;
  document.getElementById("videoTrimDuration").textContent = `${(timeline.videoTrimEnd - timeline.videoTrimStart).toFixed(1).replace(".", ",")} s`;
  const label = active || hasInformativeVideo() ? "Exportar vídeo" : "Exportar PNG";
  elements.exportLabel.textContent = label;
  elements.exportButton.setAttribute("aria-label", label);
  elements.exportButton.dataset.tooltip = label;
  if (active) {
    const video = getTimelineVideo(), name = hasInformativeVideo() ? state.infoImageName : state.videoName;
    elements.trackTitle.textContent = name; elements.fileMain.textContent = name;
    elements.fileSub.textContent = `${video.videoWidth} × ${video.videoHeight}`;
  }
  updatePlaybackIcons();
  syncDockAffordances();
  if (visibilityChanged) updateStageScale();
}

async function buildVideoFilmstrip(url) {
  const probe = document.createElement("video");
  probe.src = url;
  probe.muted = true;
  probe.playsInline = true;
  try {
    await waitForVideo(probe);
    const canvas = document.getElementById("videoTimelineFrames");
    const ctx = canvas.getContext("2d");
    const count = 10;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let index = 0; index < count; index++) {
      if (getTimelineUrl() !== url) return;
      await seekVideo(probe, Math.min(probe.duration - 0.04, probe.duration * (index + 0.5) / count));
      if (getTimelineUrl() !== url) return;
      drawImageCover(ctx, probe, index * canvas.width / count, 0, canvas.width / count, canvas.height);
    }
  } finally { probe.removeAttribute("src"); probe.load(); }
}

function refreshVideoArtwork() {
  if (state.format === "informative") { updateInformativePreview(); return; }
  if (state.format === "feed" && (state.circle.image || document.body.classList.contains("is-mobile-studio")) && state.mediaKind === "image") {
    drawFeedFrame(document.getElementById("videoArtworkPreview").getContext("2d"));
    return;
  }
  if (!hasArtworkVideo() || state.exportingVideo || elements.video.readyState < 2) return;
  if (state.format === "stories") updateStoriesPreview();
  else drawFeedFrame(document.getElementById("videoArtworkPreview").getContext("2d"));
}

function bindVideoControls() {
  document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    const mediaOpen = document.body.classList.contains("mobile-controls-open");
    state.dockAttachmentFormat = null;
    closeMediaPopover(mediaOpen);
    document.body.classList.remove("mobile-dock-expanded");
    document.getElementById("dockMore")?.setAttribute("aria-expanded", "false");
    syncDockAffordances();
  });
  bindTimelineVideo(elements.video);
  for (const id of ["videoTrimStart", "videoTrimEnd"]) for (const eventName of ["input", "change"]) document.getElementById(id).addEventListener(eventName, event => {
    const timeline = getTimelineState(), video = getTimelineVideo();
    if (!timeline.videoDuration || !video) return;
    const startChanged = id === "videoTrimStart";
    const value = Number(event.target.value);
    const range = EditorCore.videoTrim(timeline.videoDuration, startChanged ? value : timeline.videoTrimStart, startChanged ? timeline.videoTrimEnd : value, startChanged ? "start" : "end");
    timeline.videoTrimStart = range.start;
    timeline.videoTrimEnd = range.end;
    video.pause();
    video.currentTime = startChanged ? range.start : Math.max(range.start, range.end - 1 / 30);
    syncVideoControls();
    refreshVideoArtwork();
  });
  document.getElementById("videoSeek").addEventListener("input", event => {
    const timeline = getTimelineState(), video = getTimelineVideo(); if (!video) return;
    video.pause();
    video.currentTime = clamp(Number(event.target.value), timeline.videoTrimStart, timeline.videoTrimEnd);
  });
  // Repaint paused video when artwork controls change.
  document.addEventListener("input", () => requestAnimationFrame(refreshVideoArtwork));
  document.addEventListener("click", () => requestAnimationFrame(refreshVideoArtwork));
}

function bindTimelineVideo(video) {
  let frame = 0, lastPaint = 0;
  const current = () => video === getTimelineVideo() && hasTimelineVideo();
  const animate = timestamp => {
    frame = 0;
    if (!current() || video.paused || state.exportingVideo) return;
    if (timestamp - lastPaint >= 1000 / 30) { refreshVideoArtwork(); lastPaint = timestamp; }
    frame = requestAnimationFrame(animate);
  };
  video.addEventListener("play", () => { if (current() && !frame) frame = requestAnimationFrame(animate); updatePlaybackIcons(); });
  for (const name of ["pause", "seeked", "loadeddata"]) video.addEventListener(name, () => { if (current()) { refreshVideoArtwork(); updatePlaybackIcons(); } });
  video.addEventListener("timeupdate", () => {
    if (!current()) return;
    const timeline = getTimelineState();
    if (!state.exportingVideo && !video.paused && video.currentTime >= timeline.videoTrimEnd) video.currentTime = timeline.videoTrimStart;
    document.getElementById("videoSeek").value = video.currentTime;
    document.getElementById("videoCurrentTime").textContent = `${video.currentTime.toFixed(1).replace(".", ",")} s`;
  });
  video.addEventListener("ended", () => {
    if (current() && !state.exportingVideo) { video.currentTime = getTimelineState().videoTrimStart; video.play().catch(() => setStatus("Toque em Play para continuar.")); }
  });
}

let imageResolutionDecision = Promise.resolve();
function confirmImageResolution(image, targetWidth, targetHeight) {
  const quality = EditorCore.imageResolution(image.naturalWidth, image.naturalHeight, targetWidth, targetHeight);
  if (!quality.low) return Promise.resolve(true);
  const decision = imageResolutionDecision.then(() => new Promise(resolve => {
    const dialog = document.getElementById("imageResolutionWarning");
    document.getElementById("imageResolutionDescription").textContent = `A imagem tem ${image.naturalWidth} × ${image.naturalHeight} px, abaixo do recomendado para esta área (${Math.round(targetWidth)} × ${Math.round(targetHeight)} px). Ao continuar, ela pode ficar pixelada.`;
    dialog.returnValue = "correct";
    dialog.addEventListener("close", () => resolve(dialog.returnValue === "continue"), { once: true });
    dialog.showModal();
  }));
  imageResolutionDecision = decision.catch(() => false);
  return decision;
}

async function importClosingImageFile(file) {
  if (!file || state.exportingVideo) return;
  const url = URL.createObjectURL(file), finish = beginMediaLoading();
  let ready = false;
  try {
    const image = await loadImage(url); ready = true; finish(true, "Imagem carregada");
    if (!await confirmImageResolution(image, 1080, 1350)) return;
    state.closingImage = image;
    closeMediaPopover(); updateClosingPreview(); updateStoriesPreview();
    setStatus("Imagem do encerramento atualizada");
  } catch { setStatus("Não foi possível abrir essa imagem"); }
  finally { finish(ready); URL.revokeObjectURL(url); }
}

function handleFeedImageUpload(event) {
  const [file] = event.target.files;
  if (!file) return;

  const url = URL.createObjectURL(file);
  const operation = applyFeedImage(url, file.name, formatFileSize(file.size), true).catch(() => setStatus("Não foi possível abrir essa imagem. Tente outro arquivo.")).finally(() => { event.target.value = ""; });
  if (state.format !== "stories") applyFormat("feed");
  return operation;
}

async function loadRandomFeedImage(options = {}) {
  if (!elements.feedImage || state.randomPhotoLoading) return;
  state.randomPhotoLoading = true;
  try {
    const response = await fetch("/assets/linkin-park/photos.json");
    if (!response.ok) throw new Error("Acervo local indisponível");
    const photos = await response.json();
    const candidates = photos.filter(photo => photo.id !== state.randomPhotoId);
    const pool = candidates.length ? candidates : photos;
    const photo = pool[Math.floor(Math.random() * pool.length)];
    if (!photo) throw new Error("Acervo vazio");
    if (options.silent && (state.mediaKind === "video" || state.videoLoadingToken)) return;
    await applyFeedImage(photo.path, "Linkin Park — " + photo.id, `${photo.width} × ${photo.height} · ${photo.author}`, false);
    state.randomPhotoId = photo.id;
    state.zoom = 0;
    state.panX = 0;
    state.panY = 0;
    updateMediaTransform();
    updateStoriesPreview();
    const credit = document.getElementById("photoCredit");
    credit.hidden = false;
    credit.href = photo.source;
    credit.textContent = `Foto: ${photo.author} · ${photo.license}`;
    credit.title = `${photo.title} — ${photo.width} × ${photo.height}. Foto sujeita a recorte e efeitos na arte.`;
    if (!options.silent) setStatus("Foto do Linkin Park aplicada");
  } catch (error) {
    console.warn("Não consegui carregar a foto do Linkin Park", error);
    if (!options.silent) setStatus("Não foi possível carregar a foto. Tente novamente ou envie uma imagem.");
  } finally { state.randomPhotoLoading = false; }
}

async function applyFeedImage(url, name, meta, isObjectUrl = false) {
  const uploadId = state.feedImageLoadId = (state.feedImageLoadId || 0) + 1;
  const target = state.format === "stories" ? FORMATS.stories : FORMATS.feed;
  const finishLoading = isObjectUrl ? beginMediaLoading("Abrindo imagem…", { format: "feed" }) : null;
  let mediaReady = false;
  try {
    const image = await loadImage(url);
    mediaReady = true;
    if (isObjectUrl) {
      finishLoading?.(true, "Imagem carregada");
      if (!await confirmImageResolution(image, target.width, target.height)) { URL.revokeObjectURL(url); return; }
    }
    if (uploadId !== state.feedImageLoadId) { if (isObjectUrl) URL.revokeObjectURL(url); return; }

    if (state.feedImageObjectUrl && state.feedImageObjectUrl !== url) {
      URL.revokeObjectURL(state.feedImageObjectUrl);
    }

    document.getElementById("photoCredit").hidden = true;
    state.mediaKind = "image";
    elements.video.pause();
    syncVideoControls();
    state.feedImageUrl = url;
    state.feedImageName = name || "Imagem do feed";
    state.feedImageObjectUrl = isObjectUrl ? url : "";
    state.feedImage = image;
    state.circle.mask = null; state.circle.maskSource = null; state.circle.tileKey = null;
    ensureCircleForeground();
    if (isObjectUrl) closeMediaPopover();
    updateClosingPreview();
    updateStoriesPreview();
    state.zoom = 1;
    state.panX = 0;
    state.panY = 0;
    updateMediaTransform();
    elements.feedImage.src = url;
    if (elements.feedBlurImage) {
      elements.feedBlurImage.src = url;
    }
    elements.feedLayer.classList.add("has-image");
    elements.feedImageMain.textContent = state.feedImageName;
    elements.feedImageSub.textContent = meta || "Imagem do feed";
    if (state.format === "informative") {
      renderInformativePageTabs();
      updateStageScale();
    }
    if (state.format === "feed" || state.format === "informative") {
      elements.trackTitle.textContent = state.feedImageName;
      elements.trackSub.textContent = meta || "Feed 1080 x 1350";
    }
  } catch (error) {
    if (isObjectUrl) {
      URL.revokeObjectURL(url);
    }
    throw error;
  } finally {
    finishLoading?.(mediaReady);
  }
}

function updateText() {
  const layouts = getTitleLayouts();
  const highlightColor = HIGHLIGHT_COLORS[state.titleHighlightColor] || HIGHLIGHT_COLORS.pink;

  layouts.forEach((layout, index) => {
    const strip = getOrCreateTitleStrip(index);
    const preview = strip.querySelector("span");
    const shouldAnimateIn = strip.dataset.fresh === "true";

    preview.textContent = layout.text || " ";
    preview.style.fontSize = `${layout.fontSize}px`;
    preview.style.letterSpacing = `${layout.tracking}px`;
    preview.style.left = `${layout.textLeft}px`;
    preview.style.top = `${layout.textTop}px`;
    preview.style.transform = `translateY(calc(-50% + 4px)) scaleX(${layout.scaleX})`;
    strip.style.setProperty("--line-delay", `${Math.min(index * 34, 120)}ms`);
    strip.style.left = `${layout.x}px`;
    strip.style.top = `${layout.y}px`;
    strip.style.width = `${layout.width}px`;
    strip.style.height = `${layout.height}px`;

    if (layout.hasHighlight && state.titleHighlightColor !== "none") {
      strip.style.background = highlightColor;
    } else {
      strip.style.background = "transparent";
    }

    strip.classList.add("is-visible");
    if (shouldAnimateIn) {
      delete strip.dataset.fresh;
      requestAnimationFrame(() => animateTitleStripIn(strip));
    }
  });

  trimTitleStrips(layouts.length);
}

function selectKickerLogo(index, record = true) {
  if (!state.kickerImages?.[index]) return;
  const before = state.kickerLogoIndex;
  state.kickerLogoIndex = index;
  state.kickerImage = state.kickerImages[index];
  document.getElementById("kickerLogoInput").value = String(index);
  updateFeedText();
  if (record && before !== index) EditorHistory.record(before, index, saved => selectKickerLogo(saved, false), "Trocar logo Mundo Soldier");
}

function updateFeedText() {
  // Text edits and history restores must also respect the partial-highlight rule.
  if (EditorCore.isFullyHighlighted(elements.titleInput.value, state.titleHighlights)) {
    state.titleHighlights = [];
    setStatus("Tarja removida: destaque apenas palavras ou trechos do título.");
  }
  if (!elements.feedTitleLayer) return;

  elements.feedKickerPreview.textContent = normalizeLine(elements.feedKickerInput.value || "CHAPEU");
  const kicker = getFeedTypography("kicker");
  Object.assign(elements.feedKickerPreview.style, {
    fontSize: `${kicker.fontSize}px`, letterSpacing: `${kicker.tracking}px`,
    lineHeight: `${kicker.lineHeight}px`,
  });
  const imageKicker = state.kickerMode === "image" && state.kickerImage;
  elements.feedKickerPreview.classList.toggle("is-image", Boolean(imageKicker));
  document.getElementById("kickerTextField").hidden = Boolean(imageKicker);
  document.getElementById("kickerLogoField").hidden = !imageKicker;
  elements.feedKickerPreview.title = imageKicker ? "Clique para alternar as logos. Botão direito ou Enter para opções do chapéu." : "Editar chapéu";
  elements.feedKickerPreview.setAttribute("aria-label", imageKicker ? `Logo Mundo Soldier ${state.kickerLogoIndex + 1}: clique para alternar; Enter para opções` : "Editar chapéu");
  if (imageKicker) {
    const image = document.createElement("img");
    image.src = state.kickerImage.src;
    image.alt = "Mundo Soldier";
    image.draggable = false;
    elements.feedKickerPreview.replaceChildren(image);
  }
  const layouts = getFeedTitleLayouts();
  const titleTop = layouts[0].y;
  elements.feedTitleLayer.style.top = `${titleTop}px`;
  elements.feedTitleLayer.style.height = `${getFeedTitleBlockMetrics(layouts).bottom - titleTop}px`;
  elements.feedKickerPreview.style.top = `${getFeedKickerPosition(layouts)}px`;
  renderFeedSubtitlePreview(layouts);

  const highlightColor = HIGHLIGHT_COLORS[state.titleHighlightColor] || HIGHLIGHT_COLORS.pink;

  layouts.forEach((layout, index) => {
    const strip = getOrCreateFeedTitleStrip(index);
    const preview = strip.querySelector("span");
    const shouldAnimateIn = strip.dataset.fresh === "true";

    preview.textContent = layout.text || " ";
    preview.style.fontSize = `${layout.fontSize}px`;
    preview.style.width = `${measureTrackedText(layout.text, layout.fontSize, layout.tracking)}px`;
    preview.style.textAlign = "left";
    preview.style.letterSpacing = `${layout.tracking}px`;
    const textCanvas = document.createElement("canvas");
    const textWidth = measureTrackedText(layout.text, layout.fontSize, layout.tracking);
    textCanvas.width = Math.ceil(textWidth);
    textCanvas.height = Math.ceil(layout.height);
    const textContext = textCanvas.getContext("2d");
    textContext.font = `${layout.fontSize}px "Tusker Story", Impact, sans-serif`;
    textContext.textBaseline = "alphabetic";
    textContext.textAlign = "left";
    textContext.fillStyle = "#fff";
    if (supportsCanvasLetterSpacing(textContext)) {
      textContext.letterSpacing = `${layout.tracking}px`;
      textContext.fillText(layout.text, 0, layout.baselineY - layout.y);
    } else {
      drawTrackedText(textContext, layout.text, textWidth / 2, layout.baselineY - layout.y, layout.tracking);
    }
    preview.style.height = `${layout.height}px`;
    preview.style.color = "transparent";
    preview.style.backgroundImage = `url("${textCanvas.toDataURL()}")`;
    preview.style.backgroundSize = "100% 100%";
    preview.style.backgroundRepeat = "no-repeat";
    preview.style.transform = `translate(-50%, -50%) scaleX(${layout.scaleX})`;
    strip.style.top = `${layout.y - titleTop}px`;
    strip.style.width = `${layout.width}px`;
    strip.style.height = `${layout.height}px`;

    strip.style.background = "transparent";
    strip.querySelectorAll(".feed-highlight-rect").forEach(rect => rect.remove());
    if (state.titleHighlightColor !== "none") {
      for (const rect of layout.highlightRects) {
        const background = document.createElement("div");
        background.className = "feed-highlight-rect";
        Object.assign(background.style, { left: `${rect.x - layout.x}px`, top: `${rect.y - layout.y}px`, width: `${rect.width}px`, height: `${rect.height}px`, background: highlightColor });
        strip.insertBefore(background, preview);
      }
    }

    if (shouldAnimateIn) {
      delete strip.dataset.fresh;
      requestAnimationFrame(() => animateTitleStripIn(strip));
    }
  });

  trimFeedTitleStrips(layouts.length);
  updateStoriesPreview();
}

function renderFeedSubtitlePreview(titleLayouts = getFeedTitleLayouts()) {
  if (!elements.feedSubtitlePreview) return;
  applyAutoSubtitleState(titleLayouts);
  const lines = layoutSubtitleLines(measureContext, getSubtitleDisplaySegments(), titleLayouts);
  const html = lines.map((line) => subtitleTokensToHtml(line)).join("<br>");
  elements.feedSubtitlePreview.innerHTML = html || " ";
  applySubtitlePreviewStyles(lines.length, titleLayouts);
}

function applyAutoSubtitleState(titleLayouts = getFeedTitleLayouts()) {
  const settings = getAutoSubtitleSettings(titleLayouts);
  state.subtitleFontSize = settings.fontSize;
  state.subtitleLetterSpacing = settings.letterSpacing;
  state.subtitleLineHeight = settings.lineHeight;
  state.subtitleWordSpacing = settings.wordSpacing;
  state.subtitleScaleX = 100;
  state.subtitleScaleY = 100;
  state.subtitleTextAlign = "center";
  state.subtitleTextTransform = "uppercase";
  state.subtitleRotation = 0;
  state.subtitlePositionX = FEED.width / 2;
  state.subtitleMaxWidth = settings.maxWidth;
}

function getAutoSubtitleSettings(titleLayouts = getFeedTitleLayouts()) {
  const metrics = getFeedTitleBlockMetrics(titleLayouts);
  const typography = getFeedTypography("subtitle");
  const fontSize = typography.fontSize;
  const maxWidth = 647.5;

  return {
    titleBottom: metrics.bottom,
    maxWidth,
    fontSize,
    letterSpacing: typography.tracking,
    lineHeight: typography.lineHeight,
    wordSpacing: 0,
  };
}

function getFeedTitleBlockMetrics(titleLayouts = getFeedTitleLayouts()) {
  const layouts = titleLayouts.length ? titleLayouts : [getFeedLineLayout(" ", 0, FEED.title.baseFontSize, FEED.title.minFontSize)];
  const left = Math.min(...layouts.map((layout) => layout.x));
  const right = Math.max(...layouts.map((layout) => layout.x + layout.width));
  const bottom = Math.max(...layouts.map((layout) => layout.y + layout.height));
  const maxFontSize = Math.max(...layouts.map((layout) => layout.fontSize));

  return {
    left,
    right,
    bottom,
    width: Math.max(1, right - left),
    maxFontSize,
  };
}

function getSubtitleSegmentClasses(segment) {
  return [
    "subtitle-segment",
    segment.bold ? "is-bold" : "",
    segment.underline ? "is-underline" : "",
    segment.strike ? "is-strike" : "",
    segment.superscript ? "is-superscript" : "",
    segment.subscript ? "is-subscript" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function subtitleTokensToHtml(tokens) {
  const chunks = [];
  let current = null;

  tokens.forEach((token) => {
    token.chars.forEach((charSpec) => {
      if (!current || !hasSameSubtitleStyle(current, charSpec)) {
        current = { text: "", ...getEmptySubtitleStyle(), ...charSpec };
        chunks.push(current);
      }
      current.text += charSpec.char;
    });
  });

  return chunks
    .map((segment) => {
      const text = escapeHtml(segment.text);
      const classes = getSubtitleSegmentClasses(segment);
      return `<span class="${classes}">${text}</span>`;
    })
    .join("");
}

function applySubtitlePreviewStyles(lineCount = 1, titleLayouts = getFeedTitleLayouts()) {
  const preview = elements.feedSubtitlePreview;
  if (!preview) return;

  const layout = getSubtitleBlockLayout(lineCount, titleLayouts);
  preview.style.left = `${layout.x}px`;
  preview.style.top = `${layout.y}px`;
  preview.style.width = `${layout.maxWidth}px`;
  preview.style.fontSize = `${state.subtitleFontSize}px`;
  preview.style.letterSpacing = `${state.subtitleLetterSpacing}px`;
  preview.style.wordSpacing = `${state.subtitleWordSpacing}px`;
  preview.style.lineHeight = `${state.subtitleLineHeight}px`;
  preview.style.textAlign = state.subtitleTextAlign;
  preview.style.textDecoration = "none";
  preview.style.transform = `translate(-50%, -50%) rotate(${state.subtitleRotation}deg) scale(${state.subtitleScaleX / 100}, ${layout.scaleY})`;
}

function applyFeedSubtitleWeight(weight, selection = null) {
  applySubtitleSelectionMark("bold", weight === "bold", selection);
  updateSubtitleToolbarState();
  updateFeedText();
  requestAnimationFrame(updateFeedText);
}

function pastePlainTextIntoFeedSubtitle(event) {
  event.preventDefault();
  const text = event.clipboardData?.getData("text/plain") || "";
  try {
    if (document.queryCommandSupported && document.queryCommandSupported("insertText")) {
      document.execCommand("insertText", false, text);
    } else {
      const selection = window.getSelection();
      if (selection && selection.rangeCount) {
        selection.deleteFromDocument();
        selection.getRangeAt(0).insertNode(document.createTextNode(text));
        selection.collapseToEnd();
      }
    }
  } catch {
    const selection = window.getSelection();
    if (selection && selection.rangeCount) {
      selection.deleteFromDocument();
      selection.getRangeAt(0).insertNode(document.createTextNode(text));
      selection.collapseToEnd();
    }
  }
  updateFeedText();
}

function updateSubtitleToolbarState() {
  if (!elements.feedSubtitleInput) return;
  const selectionStyle = getSubtitleSelectionStyle();
  const isBold = Boolean(selectionStyle.bold);

  elements.feedSubtitleWeightButtons.forEach((button) => {
    const isActive = isBold ? button.dataset.weight === "bold" : button.dataset.weight === "regular";
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  elements.subtitleToggleButtons.forEach((button) => {
    const mark = getSubtitleToggleMark(button.dataset.subtitleToggle);
    const isActive = Boolean(mark && selectionStyle[mark]);
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function getFeedSubtitleSegments() {
  return getSubtitleMarkedSegments();
}

function getSubtitleMarkedSegments() {
  const text = getSubtitlePlainText();
  if (!text.trim()) return [{ text: " ", ...getEmptySubtitleStyle() }];

  cleanSubtitleMarks();
  const segments = [];
  let current = null;

  Array.from(text).forEach((char, index) => {
    const style = getSubtitleStyleAt(index);
    if (current && hasSameSubtitleStyle(current, style)) {
      current.text += char;
      return;
    }

    current = { text: char, ...style };
    segments.push(current);
  });

  return normalizeSubtitleSegments(segments);
}

function readSubtitleNodes(parent) {
  let text = "";
  for (const node of parent.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) { text += node.textContent; continue; }
    if (node.nodeType !== Node.ELEMENT_NODE) continue;
    if (node.tagName === "BR") { text += "\n"; continue; }
    const block = /^(DIV|P|LI)$/.test(node.tagName);
    if (block && text && !text.endsWith("\n")) text += "\n";
    text += readSubtitleNodes(node);
    if (block && node.nextSibling && !text.endsWith("\n")) text += "\n";
  }
  return text;
}

function getSubtitlePlainText() {
  const raw = elements.feedSubtitleInput ? readSubtitleNodes(elements.feedSubtitleInput) : "";
  return raw.replace(/\u00a0/g, " ").replace(/\r/g, "").replace(/\n{3,}/g, "\n\n");
}

function getEmptySubtitleStyle() {
  return {
    bold: false,
    underline: false,
    strike: false,
    superscript: false,
    subscript: false,
  };
}

function getSubtitleStyleAt(index) {
  return state.subtitleMarks.reduce((style, mark) => {
    if (index >= mark.start && index < mark.end) {
      style[mark.property] = mark.value;
    }
    return style;
  }, getEmptySubtitleStyle());
}

function hasSameSubtitleStyle(segment, style) {
  return (
    segment.bold === style.bold &&
    segment.underline === style.underline &&
    segment.strike === style.strike &&
    segment.superscript === style.superscript &&
    segment.subscript === style.subscript
  );
}

function applySubtitleSelectionMark(property, value, selectedRange = null) {
  const selection = selectedRange || getSubtitleSelectionOffsets();
  if (!selection || selection.start === selection.end) {
    setStatus("Selecione um trecho do subtitulo primeiro");
    return;
  }

  const mark = {
    start: selection.start,
    end: selection.end,
    property,
    value,
  };

  if (property === "superscript" && value) {
    state.subtitleMarks.push({ ...mark, property: "subscript", value: false });
  }
  if (property === "subscript" && value) {
    state.subtitleMarks.push({ ...mark, property: "superscript", value: false });
  }

  state.subtitleMarks.push(mark);
  cleanSubtitleMarks();
}

function getSubtitleSelectionStyle() {
  const selection = getSubtitleSelectionOffsets();
  if (!selection) return getEmptySubtitleStyle();

  const index = Math.max(0, Math.min(selection.start, getSubtitlePlainText().length - 1));
  return getSubtitleStyleAt(index);
}

function getSubtitleSelectionOffsets() {
  const root = elements.feedSubtitleInput;
  const selection = window.getSelection();
  if (!root || !selection || !selection.rangeCount) return null;

  const range = selection.getRangeAt(0);
  if (!root.contains(range.startContainer) || !root.contains(range.endContainer)) return null;

  const startRange = document.createRange();
  startRange.selectNodeContents(root);
  startRange.setEnd(range.startContainer, range.startOffset);

  const endRange = document.createRange();
  endRange.selectNodeContents(root);
  endRange.setEnd(range.endContainer, range.endOffset);

  const start = readSubtitleNodes(startRange.cloneContents()).length;
  const end = readSubtitleNodes(endRange.cloneContents()).length;
  return {
    start: Math.min(start, end),
    end: Math.max(start, end),
  };
}

function cleanSubtitleMarks() {
  const length = getSubtitlePlainText().length;
  state.subtitleMarks = state.subtitleMarks
    .map((mark) => ({
      ...mark,
      start: clamp(mark.start, 0, length),
      end: clamp(mark.end, 0, length),
    }))
    .filter((mark) => mark.start < mark.end && mark.property);
}

function getSubtitleDisplaySegments() {
  return applySubtitleTextTransform(getFeedSubtitleSegments());
}

function applySubtitleTextTransform(segments) {
  const transform = state.subtitleTextTransform;
  if (transform === "none") {
    return segments.map((segment) => ({ ...segment }));
  }

  return segments.map((segment) => ({
    ...segment,
    text: transformSubtitleCase(segment.text, transform),
  }));
}

function transformSubtitleCase(text, transform) {
  if (transform === "uppercase") return text.toUpperCase();
  if (transform === "lowercase") return text.toLowerCase();
  if (transform === "capitalize") {
    return text.toLowerCase().replace(/(^|\s)(\S)/g, (_, space, letter) => `${space}${letter.toUpperCase()}`);
  }
  return text;
}

function normalizeSubtitleSegments(segments) {
  const result = [];
  let hasText = false;

  segments.forEach((segment) => {
    let text = (segment.text || "").replace(/[^\S\n]+/g, " ");
    if (!hasText) {
      text = text.replace(/^[^\S\n]+/, "");
    }
    if (!text) return;
    hasText = true;

    const previous = result[result.length - 1];
    if (previous && hasSameSubtitleStyle(previous, segment)) {
      previous.text += text;
    } else {
      result.push({
        text,
        bold: Boolean(segment.bold),
        underline: Boolean(segment.underline),
        strike: Boolean(segment.strike),
        superscript: Boolean(segment.superscript),
        subscript: Boolean(segment.subscript),
      });
    }
  });

  if (!result.length) return [{ text: " ", bold: false }];
  result[result.length - 1].text = result[result.length - 1].text.replace(/[^\S\n]+$/, "");
  return result.filter((segment) => segment.text);
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return entities[char];
  });
}

function normalizeLine(value) {
  return value.trim().replace(/\s+/g, " ").toUpperCase();
}

function getFeedKickerMetrics() {
  const isImage = state.kickerMode === "image" && state.kickerImage;
  return {
    isImage,
    height: isImage ? 320 * state.kickerImage.naturalHeight / state.kickerImage.naturalWidth : getFeedTypography("kicker").lineHeight,
    gap: isImage ? FEED.copy.imageKickerGap : FEED.copy.textKickerGap,
  };
}

function getFeedKickerPosition(titleLayouts) {
  const metrics = getFeedKickerMetrics();
  if (state.format === "stories") {
    const offset = titleLayouts[0].y - (FEED.title.top - 6.6);
    return (metrics.isImage ? 735 : 737.35) + offset;
  }
  return titleLayouts[0].y - metrics.gap - (metrics.isImage ? 0 : metrics.height / 2);
}

function getFeedTitleLayouts(fittedFontSize) {
  const items = EditorCore.titleLines(elements.titleInput.value, state.titleHighlights);
  const fontSize = fittedFontSize || getFeedTypography("title").fontSize;
  const fontScale = fontSize / FEED.title.baseFontSize;
  const layouts = [];
  items.forEach(item => {
    let offset = 0;
    splitSingleFeedLineIntoWrapped(item.text, fontScale).forEach(text => {
      const start = item.text.indexOf(text, offset);
      const layout = getFeedLineLayout(text, layouts.length, fontSize, FEED.title.minFontSize * fontScale);
      layout.highlightMarks = item.marks.slice(start, start + text.length);
      layouts.push(layout);
      offset = start + text.length;
    });
  });
  if (!layouts.length) layouts.push({ ...getFeedLineLayout(" ", 0, fontSize, FEED.title.minFontSize), highlightMarks: [] });
  // A multiline title must share one font size. If only the longest line
  // shrinks, its glyph box changes and the perceived line spacing breaks.
  const uniformFontSize = Math.min(...layouts.map(layout => layout.fontSize));
  if (layouts.length > 1 && uniformFontSize < fontSize) {
    return getFeedTitleLayouts(uniformFontSize);
  }
  const padding = getTitlePadding();
  const referenceMetrics = getTitleGlyphMetrics("ÁÉÍÓÚÂÊÔÃÕÇ", fontSize);
  const commonHeight = referenceMetrics.ascent + referenceMetrics.descent + padding.top + padding.bottom;
  const gap = TITLE_LINE_GAP;
  const blockHeight = layouts.length * commonHeight + Math.max(0, layouts.length - 1) * gap;
  if ((layouts.length > 4 && fontSize > 46) || (blockHeight > FEED.title.maxBottom - FEED.title.minTop && fontSize > 28)) {
    return getFeedTitleLayouts(fontSize - 1);
  }
  const kicker = getFeedKickerMetrics();
  const top = state.format === "stories"
    ? Math.min(FEED.title.top - 6.6, FEED.title.maxBottom - blockHeight)
    : FEED.copy.top + kicker.height + kicker.gap;
  layouts.forEach((layout, index) => {
    // Keep the CONHECA alignment for every line. Accents and cedillas must
    // not move the text inside the highlight or change its perceived padding.
    const metrics = getTitleGlyphMetrics("CONHECA", layout.fontSize);
    layout.y = top + index * (commonHeight + gap);
    layout.height = commonHeight;
    layout.baselineY = layout.y + commonHeight / 2 + (metrics.ascent - metrics.descent) / 2;
    layout.highlightRects = getTitleHighlightRects(layout, layout.highlightMarks);
  });
  if (state.format !== "stories") {
    // Measure the entire block before moving it: short copy stays at its anchor.
    applyAutoSubtitleState(layouts);
    const subtitleLines = layoutSubtitleLines(measureContext, getSubtitleDisplaySegments(), layouts);
    const bottom = getFeedTitleBlockMetrics(layouts).bottom + FEED.copy.subtitleGap + subtitleLines.length * state.subtitleLineHeight;
    const requiredShift = Math.max(0, bottom - FEED.copy.bottom);
    const maxShift = FEED.copy.top - FEED.title.minTop;
    if (requiredShift > maxShift && fontSize > 28 && blockHeight > 200) return getFeedTitleLayouts(fontSize - 1);
    const shift = Math.min(requiredShift, maxShift);
    layouts.forEach(layout => {
      layout.y -= shift;
      layout.baselineY -= shift;
      layout.highlightRects = getTitleHighlightRects(layout, layout.highlightMarks);
    });
  }
  return layouts;
}

function getTitleHighlightRects(layout, marks) {
  const rectangles = [];
  const textWidth = measureTrackedText(layout.text, layout.fontSize, layout.tracking) * layout.scaleX;
  const left = FEED.width / 2 - textWidth / 2;
  const padding = getTitlePadding();
  for (let start = 0; start < marks.length;) {
    if (!marks[start]) { start++; continue; }
    let end = start + 1;
    while (end < marks.length && marks[end]) end++;
    const prefix = layout.text.slice(0, start);
    const offset = prefix ? measureTrackedText(prefix, layout.fontSize, layout.tracking) + layout.tracking : 0;
    const selectedText = layout.text.slice(start, end);
    const width = measureTrackedText(selectedText, layout.fontSize, layout.tracking) * layout.scaleX;
    rectangles.push({
      // Round every edge so each highlight keeps the exact same bleed in
      // preview and export instead of accumulating fractional-pixel drift.
      x: Math.round(left + offset * layout.scaleX - padding.left),
      y: Math.round(layout.y),
      width: Math.round(width + padding.left + padding.right),
      height: Math.round(layout.height),
    });
    start = end;
  }
  return rectangles;
}

function handleInformativeImageUpload(event) {
  const [file] = event.target.files;
  event.target.value = "";
  if (!file || state.exportingVideo) return;
  const page = state.informativePages[state.activeInformativePage], token = ++page.infoUploadToken;
  const url = URL.createObjectURL(file);
  const video = file.type.startsWith("video/") || /\.(mp4|mov|m4v|webm)$/i.test(file.name);
  const operation = video ? applyInformativeVideo(url, file.name, page, token) : applyInformativeImage(url, file.name, formatFileSize(file.size), true, page, token);
  return operation.catch(() => { URL.revokeObjectURL(url); setStatus("Não foi possível carregar a mídia do informativo."); });
}

function hasInformativeVideo() {
  return state.format === "informative" && Boolean(state.infoVideo);
}

function getInformativeMedia() {
  const page = state.informativePages[state.activeInformativePage];
  if (state.renderVideo && state.renderInformativePage === page) return state.renderVideo;
  return page.infoVideo?.readyState >= 2 ? page.infoVideo : page.infoImage;
}

function disposeInformativeVideo(page) {
  if (!page.infoVideo) return;
  page.infoVideo.pause(); page.infoVideo.removeAttribute("src"); page.infoVideo.load(); page.infoVideo.remove(); page.infoVideo = null;
}

function syncInformativeVideoPlayback() {
  const active = state.format === "informative" && !state.exportingVideo ? state.infoVideo : null;
  for (const page of state.informativePages) if (page.infoVideo && page.infoVideo !== active) page.infoVideo.pause();
  if (!hasArtworkVideo()) elements.video.pause();
  if (!active) return;
  elements.video.pause();
  const timeline = getTimelineState();
  if (active.currentTime < timeline.videoTrimStart || active.currentTime >= timeline.videoTrimEnd) active.currentTime = timeline.videoTrimStart;
  elements.fileMain.textContent = state.infoImageName;
  elements.fileSub.textContent = `${active.videoWidth} × ${active.videoHeight}`;
  buildVideoFilmstrip(active.src).catch(() => {});
  active.play().then(() => { if (active !== state.infoVideo || state.format !== "informative" || state.exportingVideo) active.pause(); }).catch(() => setStatus("Não foi possível reproduzir a prévia deste vídeo."));
}

async function applyInformativeVideo(url, name, page, token) {
  const finish = beginMediaLoading("Preparando vídeo…", { format: "informative", page }), video = document.createElement("video");
  video.src = url; video.muted = false; video.loop = false; video.playsInline = true; video.preload = "auto";
  video.setAttribute("aria-hidden", "true"); video.tabIndex = -1;
  video.style.cssText = "position:fixed;left:0;top:0;width:1px;height:1px;opacity:0;pointer-events:none";
  document.body.append(video);
  let ready = false, committed = false;
  try {
    await waitForVideo(video);
    if (!Number.isFinite(video.duration) || video.duration <= 0) throw new Error("Duração inválida");
    if (page.infoUploadToken !== token) return;
    disposeInformativeVideo(page);
    if (page.infoImageObjectUrl) URL.revokeObjectURL(page.infoImageObjectUrl);
    Object.assign(page, { infoVideo: video, infoImage: null, infoImageUrl: url, infoImageObjectUrl: url, infoImageName: name, infoVideoTrimStart: 0, infoVideoTrimEnd: video.duration, infoZoom: 1, infoPanX: 0, infoPanY: 0 });
    bindTimelineVideo(video);
    ready = committed = true;
    if (page === state.informativePages[state.activeInformativePage] && state.format === "informative") {
      elements.informativeImage.removeAttribute("src"); elements.feedLayer.classList.add("has-informative-image");
      closeMediaPopover(); updateMediaTransform(); syncVideoControls(); syncInformativeVideoPlayback();
    } else if (state.format === "informative") { renderInformativePageTabs(); updateStageScale(); }
    setStatus("Vídeo aplicado na máscara do informativo");
  } catch (error) { finish(false, "Não foi possível abrir o vídeo. Tente MP4 (H.264)."); throw error; }
  finally {
    if (!committed) { video.pause(); video.removeAttribute("src"); video.load(); video.remove(); URL.revokeObjectURL(url); }
    finish(ready);
  }
}

async function applyInformativeImage(url, name, meta, isObjectUrl = false, targetPage = null, token = null) {
  const finishLoading = isObjectUrl ? beginMediaLoading("Abrindo imagem…", { format: "informative", page: targetPage || state.informativePages[state.activeInformativePage] }) : null;
  let mediaReady = false;
  const page = targetPage || state.informativePages[state.activeInformativePage];
  const uploadToken = token ?? ++page.infoUploadToken;
  try {
    const image = await loadImage(url);
    if (page.infoUploadToken !== uploadToken) { if (isObjectUrl) URL.revokeObjectURL(url); return; }
    mediaReady = true;
    if (isObjectUrl) {
      finishLoading?.(true, "Imagem carregada");
      if (!await confirmImageResolution(image, INFORMATIVE.image.width, INFORMATIVE.image.height)) { URL.revokeObjectURL(url); return; }
      if (page.infoUploadToken !== uploadToken || !state.informativePages.includes(page)) { URL.revokeObjectURL(url); return; }
    }
    disposeInformativeVideo(page);
    if (page.infoImageObjectUrl && page.infoImageObjectUrl !== url) URL.revokeObjectURL(page.infoImageObjectUrl);
    page.infoImageUrl = url;
    page.infoImageName = name || "Imagem do bloco";
    page.infoImageObjectUrl = isObjectUrl ? url : "";
    page.infoImage = image;
    page.infoZoom = 1;
    page.infoPanX = 0;
    page.infoPanY = 0;
    if (page !== state.informativePages[state.activeInformativePage]) {
      if (state.format === "informative") {
        renderInformativePageTabs();
        updateStageScale();
      }
      return;
    }
    if (isObjectUrl) closeMediaPopover();
    if (elements.informativeImage) elements.informativeImage.src = url;
    elements.feedLayer?.classList.add("has-informative-image");
    if (elements.informativeImageMain) elements.informativeImageMain.textContent = state.infoImageName;
    if (elements.informativeImageSub) elements.informativeImageSub.textContent = meta || "Imagem independente aplicada";
    if (state.format === "informative" && elements.trackSub) {
      elements.trackTitle.textContent = state.infoImageName;
      elements.trackSub.textContent = "Bloco pronto";
    }
    updateMediaTransform();
    syncVideoControls(); syncInformativeVideoPlayback();
    setStatus("Imagem do bloco aplicada na máscara");
  } catch (error) {
    if (isObjectUrl) URL.revokeObjectURL(url);
    throw error;
  } finally {
    finishLoading?.(mediaReady);
  }
}

function updateInformativeText() {
  if (!elements.informativeTitlePreview) return;
  const title = elements.infoTitleInput?.value ?? state.infoTitle;
  const body = elements.infoBodyInput?.value ?? state.infoBody;
  state.infoTitle = title;
  state.infoBody = body;
  elements.informativeTitlePreview.textContent = title || "TÍTULO DO POST AQUI";
  elements.informativeBodyPreview.replaceChildren(...getInformativeBodyRuns().map(run => {
    const span = document.createElement(run.bold ? "strong" : "span");
    span.textContent = run.text;
    return span;
  }));
  updateInformativePreview();
}

function getInformativeBodyRuns(start = 0, end = state.infoBody.length) {
  const runs = [];
  for (let index = start; index < end; index++) {
    const bold = state.infoBodyBold.some(range => index >= range.start && index < range.end);
    const last = runs.at(-1);
    if (last && last.bold === bold) last.text += state.infoBody[index];
    else runs.push({ text: state.infoBody[index], bold });
  }
  return runs;
}

function getTitleGlyphMetrics(text, fontSize) {
  const key = `${fontSize}:${text || " "}`;
  if (getTitleGlyphMetrics.cache.has(key)) return getTitleGlyphMetrics.cache.get(key);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(256, Math.ceil(fontSize * Math.max(4, (text || " ").length)));
  canvas.height = Math.ceil(fontSize * 3);
  const context = canvas.getContext("2d", { willReadFrequently: true });
  const baseline = Math.ceil(fontSize * 2);
  context.font = `${fontSize}px "Tusker Story", Impact, sans-serif`;
  context.textBaseline = "alphabetic";
  context.fillStyle = "#000";
  context.fillText(text || " ", Math.ceil(fontSize), baseline);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  let top = canvas.height;
  let bottom = -1;
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      if (pixels[(y * canvas.width + x) * 4 + 3] > 8) {
        top = y;
        break;
      }
    }
    if (top === y) break;
  }
  for (let y = canvas.height - 1; y >= 0; y--) {
    for (let x = 0; x < canvas.width; x++) {
      if (pixels[(y * canvas.width + x) * 4 + 3] > 8) {
        bottom = y;
        break;
      }
    }
    if (bottom === y) break;
  }
  const result = top <= bottom
    ? { ascent: baseline - top, descent: bottom - baseline + 1 }
    : { ascent: fontSize * 0.78, descent: fontSize * 0.08 };
  getTitleGlyphMetrics.cache.set(key, result);
  return result;
}
getTitleGlyphMetrics.cache = new Map();

function splitSingleFeedLineIntoWrapped(text, fontScale) {
  const words = text.split(" ").filter(Boolean);
  if (!words.length) return [" "];
  const lines = [];
  let current = "";

  words.forEach((word) => {
    const candidate = current ? `${current} ${word}` : word;
    if (!current || fitsFeedLine(candidate, fontScale)) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  });

  if (current) lines.push(current);
  return lines;
}

function pushFeedLine(lines, text) {
  if (lines.length < FEED.title.maxRows) {
    lines.push(text);
    return;
  }

  lines[FEED.title.maxRows - 1] = `${lines[FEED.title.maxRows - 1]} ${text}`.trim();
}

function fitsFeedLine(text, fontScale = 1) {
  const fontSize = FEED.title.baseFontSize * (fontScale || 1);
  const padding = getTitlePadding();
  const maxTextWidth = FEED.title.maxWidth - padding.left - padding.right;
  return measureTrackedText(text, fontSize, fontSize * feedTypography.title.tracking / 1000) <= maxTextWidth;
}

function getFeedLineLayout(text, index, initialFontSize, minFontSize) {
  const safeText = text || " ";
  let fontSize = initialFontSize;
  let tracking = fontSize * feedTypography.title.tracking / 1000;
  const padding = getTitlePadding();
  const maxTextWidth = FEED.title.maxWidth - padding.left - padding.right;
  let textWidth = measureTrackedText(safeText, fontSize, tracking);

  while (textWidth > maxTextWidth && fontSize > minFontSize) {
    fontSize -= 1;
    tracking = fontSize * feedTypography.title.tracking / 1000;
    textWidth = measureTrackedText(safeText, fontSize, tracking);
  }

  if (textWidth > maxTextWidth) {
    tracking = Math.max(0, tracking - (textWidth - maxTextWidth) / Math.max(1, safeText.length - 1));
    textWidth = measureTrackedText(safeText, fontSize, tracking);
  }

  const scaleX = textWidth > maxTextWidth ? maxTextWidth / textWidth : 1;
  const visibleTextWidth = textWidth * scaleX;
  const width = Math.min(FEED.title.maxWidth, Math.ceil(visibleTextWidth + padding.left + padding.right));
  const height = FEED.title.highlightHeight;
  const lineMetrics = getTitleGlyphMetrics("CONHECA", fontSize);
  const baselineY = FEED.title.top - 6.6 + index * FEED.title.lineHeight + height / 2 + FEED.title.baselineShift + (lineMetrics.ascent - lineMetrics.descent) / 2;

  return {
    text: safeText,
    x: FEED.width / 2 - width / 2,
    y: FEED.title.top - 6.6 + index * FEED.title.lineHeight,
    width,
    height,
    fontSize,
    tracking,
    scaleX,
    baselineShift: FEED.title.baselineShift,
    baselineY,
  };
}

function getOrCreateFeedTitleStrip(index) {
  if (state.feedTitleStrips[index]) {
    return state.feedTitleStrips[index];
  }

  const strip = document.createElement("div");
  const text = document.createElement("span");
  strip.className = "feed-headline-strip";
  strip.dataset.index = String(index);
  strip.dataset.fresh = "true";
  strip.append(text);
  elements.feedTitleLayer.append(strip);
  state.feedTitleStrips[index] = strip;
  return strip;
}

function trimFeedTitleStrips(count) {
  while (state.feedTitleStrips.length > count) {
    const strip = state.feedTitleStrips.pop();
    strip.remove();
  }
}

function getTitleLayouts() {
  const items = parseTitleSource(elements.titleInput.value);
  const layouts = [];

  items.forEach((item) => {
    const wrappedLines = splitSingleStoryLineIntoWrapped(item.text);
    wrappedLines.forEach((text) => {
      const template = getLineTemplate(layouts.length);
      const lineLayout = getLineLayout(text, template);
      lineLayout.hasHighlight = item.hasHighlight;
      layouts.push(lineLayout);
    });
  });

  return layouts.length ? layouts : [getLineLayout(" ", getLineTemplate(0))];
}

function splitSingleStoryLineIntoWrapped(text) {
  const words = text.split(" ").filter(Boolean);
  if (!words.length) return [" "];
  const lines = [];
  let current = "";

  words.forEach((word) => {
    const lineIndex = Math.min(lines.length, STORY.title.maxRows - 1);
    const template = getLineTemplate(lineIndex);
    const candidate = current ? `${current} ${word}` : word;

    if (!current || fitsBaseLine(candidate, template) || lines.length >= STORY.title.maxRows) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  });

  if (current) lines.push(current);
  return lines;
}

function pushTitleLine(lines, text) {
  if (lines.length < STORY.title.maxRows) {
    lines.push(text);
    return;
  }

  lines[STORY.title.maxRows - 1] = `${lines[STORY.title.maxRows - 1]} ${text}`.trim();
}

function fitsBaseLine(text, template) {
  const padding = getTitlePadding();
  const maxTextWidth = template.maxWidth - padding.left - padding.right;
  return measureTrackedText(text, template.fontSize, STORY.title.tracking) <= maxTextWidth;
}

function getLineTemplate(index) {
  const template = STORY.title.templates[Math.min(index, STORY.title.templates.length - 1)];
  const scale = getTitleFontScale();
  const fontSize = Math.round(template.fontSize * scale);

  return {
    ...template,
    fontSize,
    minFontSize: Math.min(fontSize, Math.round(template.minFontSize * scale)),
  };
}

function getLineLayout(text, line) {
  const safeText = text || " ";
  let fontSize = line.fontSize;
  let tracking = STORY.title.tracking;
  let textWidth = measureTrackedText(safeText, fontSize, tracking);
  const padding = getTitlePadding();
  const maxTextWidth = line.maxWidth - padding.left - padding.right;

  while (textWidth > maxTextWidth && fontSize > line.minFontSize) {
    fontSize -= 1;
    textWidth = measureTrackedText(safeText, fontSize, tracking);
  }

  if (textWidth > maxTextWidth) {
    tracking = Math.max(0, tracking - (textWidth - maxTextWidth) / Math.max(1, safeText.length - 1));
    textWidth = measureTrackedText(safeText, fontSize, tracking);
  }

  const scaleX = textWidth > maxTextWidth ? maxTextWidth / textWidth : 1;
  const visibleTextWidth = textWidth * scaleX;

  const width = Math.min(line.maxWidth, Math.ceil(visibleTextWidth + padding.left + padding.right));
  const height = Math.round(fontSize + padding.top + padding.bottom);
  const x = clamp(Math.round(STORY.width / 2 - visibleTextWidth / 2 - padding.left), 0, STORY.width - width);
  return {
    text: safeText,
    x,
    y: line.y,
    width,
    height,
    fontSize,
    tracking,
    scaleX,
    padLeft: padding.left,
    padTop: padding.top,
    textLeft: padding.left,
    textTop: padding.top + fontSize / 2,
    baselineShift: STORY.title.baselineShift,
  };
}

function stackLineLayouts(layouts) {
  if (!layouts.length) return layouts;

  const firstTemplate = getLineTemplate(0);
  const firstTextCenter = firstTemplate.y + firstTemplate.height / 2;
  let y = Math.round(firstTextCenter - layouts[0].padTop - layouts[0].fontSize / 2);

  layouts.forEach((layout) => {
    layout.y = y;
    y += layout.height + STORY.title.rowGap;
  });

  const bottomLimit = STORY.video.y - STORY.title.rowGap;
  const overflow = y - STORY.title.rowGap - bottomLimit;
  if (overflow > 0) {
    layouts.forEach((layout) => {
      layout.y -= overflow;
    });
  }

  return layouts;
}

function getTitlePadding() {
  return TITLE_HIGHLIGHT_PADDING;
}

function getTitleFontScale() {
  const fontSize = Number.isFinite(state.titleFontSize) ? state.titleFontSize : STORY.title.baseFontSize;
  return fontSize / STORY.title.baseFontSize;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getOrCreateTitleStrip(index) {
  if (state.titleStrips[index]) {
    return state.titleStrips[index];
  }

  const strip = document.createElement("div");
  const text = document.createElement("span");
  strip.className = "headline-strip";
  strip.dataset.index = String(index);
  strip.dataset.fresh = "true";
  strip.append(text);
  elements.titleLayer.append(strip);
  state.titleStrips[index] = strip;
  return strip;
}

function trimTitleStrips(count) {
  while (state.titleStrips.length > count) {
    const strip = state.titleStrips.pop();
    strip.classList.add("is-leaving");
    strip.classList.remove("is-visible");
    const leave = strip.animate(
      [
        { opacity: 1, transform: "translateY(0) scale(1)" },
        { opacity: 0, transform: "translateY(24px) scale(0.97)" },
      ],
      {
        duration: 260,
        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
        fill: "forwards",
      },
    );
    leave.finished.then(() => strip.remove()).catch(() => strip.remove());
    window.setTimeout(() => strip.remove(), 340);
  }
}

function animateTitleStripIn(strip) {
  const center = strip.classList.contains("feed-headline-strip") ? "translateX(-50%) " : "";
  strip.animate(
    [
      { opacity: 0.72, transform: `${center}translateY(-20px) scale(0.975)` },
      { opacity: 1, transform: `${center}translateY(0) scale(1)` },
    ],
    {
      duration: 460,
      easing: "cubic-bezier(0.2, 0.9, 0.2, 1)",
      fill: "none",
    },
  );
}

function updateMediaTransform() {
  updateInformativePreview();
  if (state.format === "closing") { updateClosingPreview(); return; }
  const isInformative = state.format === "informative";
  const mediaBox = isInformative ? INFORMATIVE.image : state.format === "stories" ? FORMATS.stories : state.format === "feed" ? FEED : STORY.video;
  const media = getArtworkMedia();
  if (["feed", "stories"].includes(state.format) && media) {
    const geometry = EditorCore.imageGeometry(media.videoWidth || media.naturalWidth, media.videoHeight || media.naturalHeight, mediaBox.width, mediaBox.height, state.zoom, state.panX / 100 * mediaBox.width, state.panY / 100 * mediaBox.height);
    state.zoom = geometry.zoom;
    state.panX = geometry.panX / mediaBox.width * 100;
    state.panY = geometry.panY / mediaBox.height * 100;
    [elements.feedImage, elements.feedBlurImage].forEach(image => {
      if (!image) return;
      image.style.width = `${geometry.baseWidth}px`;
      image.style.height = `${geometry.baseHeight}px`;
    });
  }
  const informativeMedia = isInformative ? getInformativeMedia() : null;
  if (informativeMedia) {
    const geometry = EditorCore.imageGeometry(informativeMedia.videoWidth || informativeMedia.naturalWidth, informativeMedia.videoHeight || informativeMedia.naturalHeight, INFORMATIVE.image.width, INFORMATIVE.image.height, state.infoZoom, state.infoPanX / 100 * INFORMATIVE.image.width, state.infoPanY / 100 * INFORMATIVE.image.height);
    state.infoZoom = geometry.zoom;
    state.infoPanX = geometry.panX / INFORMATIVE.image.width * 100;
    state.infoPanY = geometry.panY / INFORMATIVE.image.height * 100;
    elements.informativeImage.style.width = `${geometry.baseWidth}px`;
    elements.informativeImage.style.height = `${geometry.baseHeight}px`;
  }
  const panX = isInformative ? state.infoPanX : state.panX;
  const panY = isInformative ? state.infoPanY : state.panY;
  const zoom = isInformative ? state.infoZoom : state.zoom;
  const x = (panX / 100) * mediaBox.width;
  const y = (panY / 100) * mediaBox.height;
  if (isInformative) {
    elements.informativeImage?.style.setProperty("--zoom", zoom);
    elements.informativeImage?.style.setProperty("--pan-x", `${x}px`);
    elements.informativeImage?.style.setProperty("--pan-y", `${y}px`);
    updateInformativePreview();
    return;
  }
  elements.video.style.setProperty("--zoom", state.zoom);
  elements.video.style.setProperty("--pan-x", `${x}px`);
  elements.video.style.setProperty("--pan-y", `${y}px`);
  elements.feedImage?.style.setProperty("--zoom", state.zoom);
  elements.feedImage?.style.setProperty("--pan-x", `${x}px`);
  elements.feedImage?.style.setProperty("--pan-y", `${y}px`);
  elements.feedBlurImage?.style.setProperty("--zoom", state.zoom);
  elements.feedBlurImage?.style.setProperty("--pan-x", `${x}px`);
  elements.feedBlurImage?.style.setProperty("--pan-y", `${y}px`);
  syncCircleInset();
  updateRangeOutput(elements.zoomInput, elements.zoomValue);
  updateRangeOutput(elements.panXInput, elements.panXValue);
  updateRangeOutput(elements.panYInput, elements.panYValue);
  updateFeedEffectStyles();
  updateStoriesPreview();
  refreshVideoArtwork();
}

function updateFeedEffectStyles() {
  const blur = clamp(Number(state.maskBlur) || 0, 0, 120);
  const gradientOpacity = clamp(Number(state.blurGradientOpacity) || 0, 0, 100) / 100;
  elements.feedLayer?.style.setProperty("--mask-blur", `${blur}px`);
  elements.feedLayer?.style.setProperty("--blur-gradient-opacity", String(gradientOpacity));
}

function updateLogoTransform() {
  if (!elements.logoLayer) return;

  elements.logoLayer.style.setProperty("--logo-width", `${state.logoWidth}px`);
  elements.logoLayer.style.setProperty("--logo-x", `${state.logoX}px`);
  elements.logoLayer.style.setProperty("--logo-y", `${state.logoY}px`);
  elements.logoLayer.style.setProperty("--logo-opacity", String(state.logoOpacity / 100));
  elements.logoLayer.classList.toggle("has-logo", Boolean(state.logoImage));

  if (elements.logoPreview && elements.logoPreview.src !== state.logoUrl) {
    elements.logoPreview.src = state.logoUrl || "";
  }
  updateStoriesPreview();
}

async function loadLogoPresets() {
  if (!elements.logoCatalog) return;

  try {
    const response = await fetch("/catalog/logos.json");
    const payload = await response.json();
    const files = Array.isArray(payload.files) ? payload.files : [];

    renderLogoCatalog(files);
  } catch (error) {
    console.warn("Nao consegui listar as logos", error);
    if (elements.logoCatalog) {
      elements.logoCatalog.innerHTML = '<div class="logo-catalog-empty"><span>Erro</span><small>Nao consegui ler assets/logos</small></div>';
    }
  }
}

async function loadFeedTextures() {
  if (!elements.feedLayer) return;

  try {
    const files = await fetchFeedTextureFiles();
    const exclusion = findTextureFile(files, ["exclu", "eclu", "38"]);
    const softLight = findTextureFile(files, ["luz", "indireta", "soft", "49"]);

    await Promise.all([
      exclusion ? applyFeedTexture("exclusion", exclusion.path) : Promise.resolve(),
      softLight ? applyFeedTexture("softLight", softLight.path) : Promise.resolve(),
    ]);
  } catch (error) {
    console.warn("Nao consegui carregar as texturas do feed", error);
  }
}

async function fetchFeedTextureFiles() {
  try {
    const response = await fetch("/catalog/textures.json");
    if (!response.ok) throw new Error("Endpoint de texturas indisponivel");

    const payload = await response.json();
    if (Array.isArray(payload.files) && payload.files.length) {
      return payload.files;
    }
  } catch (error) {
    console.warn("Usando texturas padrao por caminho direto", error);
  }

  return FALLBACK_FEED_TEXTURES;
}

function findTextureFile(files, hints) {
  return files.find((file) => {
    const normalized = normalizeAssetName(file.name || file.path || "");
    return hints.some((hint) => normalized.includes(hint));
  });
}

function normalizeAssetName(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

async function applyFeedTexture(kind, url) {
  try {
    const image = await loadImage(url);

    if (kind === "exclusion") {
      state.feedTextureExclusionUrl = url;
      state.feedTextureExclusionImage = image;
      if (elements.feedTextureExclusion) {
        elements.feedTextureExclusion.src = url;
      }
      elements.feedLayer.classList.add("has-texture-exclusion");
      return;
    }

    state.feedTextureSoftLightUrl = url;
    state.feedTextureSoftLightImage = image;
    if (elements.feedTextureSoftLight) {
      elements.feedTextureSoftLight.src = url;
    }
    elements.feedLayer.classList.add("has-texture-soft-light");
  } catch (error) {
    console.warn(`Nao consegui aplicar textura ${kind}`, error);
  }
}

function renderLogoCatalog(files) {
  if (!elements.logoCatalog) return;

  elements.logoCatalog.innerHTML = "";
  if (!files.length) {
    elements.logoCatalog.innerHTML = '<div class="logo-catalog-empty"><span>Sem logos</span><small>Coloque PNG ou SVG em assets/logos</small></div>';
    return;
  }

  files.forEach((file) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "logo-card";
    button.dataset.path = file.path;
    button.dataset.name = file.name;
    button.dataset.size = String(file.size || 0);
    button.setAttribute("aria-label", `Aplicar logo ${file.name}`);
    button.innerHTML = `
      <span class="logo-thumb"><img alt="" src="${file.path}"></span>
    `;
    button.addEventListener("click", () => applyLogoFromCard(button));
    elements.logoCatalog.append(button);
  });

  updateLogoCatalogSelection();
}

async function applyLogoFromCard(button) {
  if (button.classList.contains("is-active")) {
    clearLogo();
    return;
  }

  await applyLogo(
    button.dataset.path,
    button.dataset.name || "Logo aplicada",
    formatFileSize(Number(button.dataset.size || 0)),
  );
}

async function applyLogo(url, name, meta, isObjectUrl = false) {
  const editFormat = state.format;
  const finishLoading = isObjectUrl ? beginMediaLoading() : null;
  let mediaReady = false;
  try {
    const image = await loadImage(url);
    mediaReady = true;

    if (state.logoObjectUrl && state.logoObjectUrl !== url) {
      URL.revokeObjectURL(state.logoObjectUrl);
    }

    state.logoUrl = url;
    state.logoName = name || "Logo aplicada";
    state.logoImage = image;
    if (typeof ExportReview !== "undefined") ExportReview.touch(editFormat);
    state.logoObjectUrl = isObjectUrl ? url : "";
    updateLogoTransform();
    updateLogoCatalogSelection();
    setStatus("Logo aplicada");
  } catch (error) {
    console.error(error);
    if (isObjectUrl) {
      URL.revokeObjectURL(url);
    }
    setStatus("Nao consegui carregar a logo");
  } finally {
    finishLoading?.(mediaReady);
  }
}

function clearLogo() {
  if (state.logoObjectUrl) {
    URL.revokeObjectURL(state.logoObjectUrl);
  }

  state.logoUrl = "";
  state.logoName = "";
  state.logoObjectUrl = "";
  state.logoImage = null;
  if (elements.logoPreview) elements.logoPreview.removeAttribute("src");
  updateLogoTransform();
  updateLogoCatalogSelection();
  setStatus("Logo removida");
}

function updateLogoCatalogSelection() {
  if (!elements.logoCatalog) return;

  elements.logoCatalog.querySelectorAll(".logo-card").forEach((button) => {
    const isActive = Boolean(state.logoUrl) && button.dataset.path === state.logoUrl;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function setActiveDockPanel(panelName) {
  if (panelName && matchMedia("(max-width: 800px)").matches) {
    document.body.classList.add("mobile-controls-open");
    closeTextEditPopover();
  }
  if (!panelName) {
    closeDockPanel();
    return;
  }

  if (panelName === state.activeDockPanel) {
    return;
  }

  const currentPanel = elements.dockPanels.find((panel) => panel.classList.contains("is-active"));
  const nextPanel = elements.dockPanels.find((panel) => panel.dataset.panel === panelName);
  if (!nextPanel) return;

  if (panelName === "logo") {
    loadLogoPresets();
  }

  state.activeDockPanel = panelName;
  elements.dockPanelStack.dataset.active = panelName;
  document.body.classList.add("panel-open");
  elements.controlPanelShell.classList.add("is-open");

  elements.dockButtons.forEach((button) => {
    const isActive = button.dataset.panel === panelName;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  if (currentPanel && currentPanel !== nextPanel) {
    currentPanel.classList.remove("is-active");
    currentPanel.classList.add("is-leaving");
    currentPanel.setAttribute("aria-hidden", "true");
    window.setTimeout(() => currentPanel.classList.remove("is-leaving"), 280);
  }

  nextPanel.classList.remove("is-leaving");
  nextPanel.classList.add("is-active");
  nextPanel.setAttribute("aria-hidden", "false");
  nextPanel.scrollTop = 0;

  requestAnimationFrame(updateControlPanelFade);
}

function closeDockPanel() {
  const currentPanel = elements.dockPanels.find((panel) => panel.classList.contains("is-active"));
  state.activeDockPanel = "";
  delete elements.dockPanelStack.dataset.active;
  document.body.classList.remove("panel-open");
  elements.controlPanelShell.classList.remove("is-open", "has-scroll-after");

  elements.dockButtons.forEach((button) => {
    button.classList.remove("is-active");
    button.setAttribute("aria-selected", "false");
  });

  if (!currentPanel) return;

  currentPanel.classList.remove("is-active");
  currentPanel.classList.add("is-leaving");
  currentPanel.setAttribute("aria-hidden", "true");
  window.setTimeout(() => currentPanel.classList.remove("is-leaving"), 280);
}

function replayActiveDockPanelMotion() {
  const activePanel = elements.dockPanels.find((panel) => panel.dataset.panel === state.activeDockPanel);
  if (!activePanel) return;

  activePanel.animate(
    [
      { transform: "translateY(0) scale(1)", filter: "blur(0)" },
      { transform: "translateY(-3px) scale(1.012)", filter: "blur(0)" },
      { transform: "translateY(0) scale(1)", filter: "blur(0)" },
    ],
    {
      duration: 260,
      easing: "cubic-bezier(0.2, 0.9, 0.2, 1)",
    },
  );
}

function updateControlPanelFade() {
  const panel = elements.dockPanels.find((item) => item.classList.contains("is-active"));
  const shell = elements.controlPanelShell;
  if (!panel || !shell || !shell.classList.contains("is-open")) {
    shell?.classList.remove("has-scroll-after");
    return;
  }

  const hasHiddenContentBelow = panel.scrollTop + panel.clientHeight < panel.scrollHeight - 4;
  shell.classList.toggle("has-scroll-after", hasHiddenContentBelow);
}

function updatePlaybackIcons() {
  const video = getTimelineVideo() || elements.video;
  elements.togglePlayback.classList.toggle("is-playing", !video.paused);
  elements.toggleMute.classList.toggle("is-muted", video.muted);
  elements.panelPlayButton?.classList.toggle("is-playing", !video.paused);
  elements.panelMuteButton?.classList.toggle("is-muted", video.muted);
  if (elements.panelMuteButton) {
    const label = video.muted ? "Ouvir prévia" : "Silenciar prévia";
    elements.panelMuteButton.setAttribute("aria-label", label);
    elements.panelMuteButton.setAttribute("aria-pressed", String(!video.muted));
    elements.panelMuteButton.dataset.tooltip = label;
  }
}

let batchExportFiles = null, batchExportName = "";
const exportObjectIds = new WeakMap();
let exportObjectId = 0;
function exportIdentity(object) {
  if (!object) return null;
  if (!exportObjectIds.has(object)) exportObjectIds.set(object, ++exportObjectId);
  return exportObjectIds.get(object);
}
function exportReviewEntries() {
  const pick = (object, keys) => keys.map(key => object[key]);
  const common = [elements.titleInput.value, elements.feedKickerInput.value, elements.feedSubtitleInput.innerHTML,
    ...pick(state, ["mediaKind", "videoUrl", "videoTrimStart", "videoTrimEnd", "feedImageUrl", "zoom", "panX", "panY", "maskBlur", "blurGradientOpacity", "titleHighlights", "titleHighlightColor", "titleFontSize", "kickerMode", "kickerLogoIndex", "subtitleFontSize", "subtitleLetterSpacing", "subtitleLineHeight", "subtitleWordSpacing", "subtitleScaleX", "subtitleScaleY", "subtitleTextAlign", "subtitleTextTransform", "subtitleRotation", "subtitlePositionX", "subtitlePositionY", "subtitleMaxWidth", "subtitleMarks", "logoUrl"]),
    ...pick(state.circle, ["url", "x", "y", "size", "zoom", "panX", "panY", "behind"]), exportIdentity(state.circle.image)];
  const entries = ["feed", "stories", "story"].map(format => ({ key: format, format, label: format === "feed" ? "Feed" : "Stories / Reels",
    video: state.mediaKind === "video" && !!state.videoUrl, signature: JSON.stringify([common, state.logoSettings[format]]) }));
  state.informativePages.forEach((page, index) => entries.push({ key: page, format: "informative", board: true,
    label: `Informativo ${index + 1}`, index, video: !!page.infoVideo,
    signature: JSON.stringify([...pick(page, ["infoTitle", "infoBody", "infoBodyBold", "infoImageUrl", "infoVideoTrimStart", "infoVideoTrimEnd", "infoZoom", "infoPanX", "infoPanY"]), state.infoBackgroundBlur, state.infoShade]) }));
  entries.push(...PolaroidStudio.exportEntries());
  entries.push({ key: "closing", format: "closing", label: "Encerramento", signature: JSON.stringify([
    exportIdentity(state.closingImage), state.closingBlur, state.closingShade, state.titleHighlightColor, state.logoSettings.closing]) });
  return entries;
}
function initExportReview() {
  if (typeof ExportReview === "undefined") return;
  ExportReview.init({ entries: exportReviewEntries, format: () => state.format, status: setStatus,
    loading: () => activeMediaLoads.size > 0 || state.randomPhotoLoading || state.circle.maskBusy,
    flush: () => { saveLogoSettingsForCurrentFormat(); updateFeedText(); updateInformativeText(); },
    export: exportReviewedArtwork, download: downloadBlob });
}
async function exportReviewedArtwork(entries, progress) {
  const original = { format: state.format, informative: state.activeInformativePage, focused: state.artboardFocused,
    playing: !elements.video.paused, infoPlaying: state.infoVideo && !state.infoVideo.paused };
  batchExportFiles = [];
  try {
    for (const [index, entry] of entries.entries()) {
      progress(`Preparando ${index + 1} de ${entries.length} · ${entry.label}`);
      batchExportName = entry.format === "informative" ? `informativo-${entry.index + 1}` : entry.format === "polaroid" ? `polaroid-${entry.index + 1}` : entry.format === "closing" ? "encerramento" : entry.format === "feed" ? "feed" : "stories";
      const countBefore = batchExportFiles.length;
      if (entry.format === "polaroid") {
        applyFormat("polaroid", { keepPanel: true });
        batchExportFiles.push({ name: `${batchExportName}.png`, blob: await PolaroidStudio.exportPage(entry.key) });
      } else {
        if (entry.format === "informative") selectInformativePage(entry.index);
        else applyFormat(entry.format, { keepPanel: true });
        await exportSingleArtwork();
      }
      if (batchExportFiles.length !== countBefore + 1) throw new Error(`Não foi possível gerar ${entry.label}. Verifique a mídia e tente novamente.`);
    }
    progress("Artes prontas para salvar.");
    return batchExportFiles.slice();
  } finally {
    batchExportFiles = null; batchExportName = "";
    selectInformativePage(original.informative);
    applyFormat(original.format, { keepPanel: true });
    state.artboardFocused = original.focused;
    if (original.format === "polaroid") PolaroidStudio.refresh(); else renderInformativePageTabs();
    if (!original.playing) elements.video.pause();
    if (!original.infoPlaying) state.infoVideo?.pause();
    updateStageScale();
  }
}

async function exportPrimary() {
  if (typeof ExportReview !== "undefined") { ExportReview.open(); return; }
  await exportSingleArtwork();
}

async function exportSingleArtwork() {
  if (state.format === "polaroid") { await PolaroidStudio.exportActive(); return; }
  if (hasArtworkVideo() || hasInformativeVideo()) { await exportStoryVideo(); return; }
  if (["feed", "informative", "closing", "stories"].includes(state.format)) {
    await exportFeedPng();
    return;
  }

  await exportStoryVideo();
}

async function exportCurrentPng() {
  if (typeof ExportReview !== "undefined") { ExportReview.open(); return; }
  if (state.format === "polaroid") { await PolaroidStudio.exportActive(); return; }
  if (["feed", "informative", "closing", "stories"].includes(state.format)) {
    await exportFeedPng();
    return;
  }

  await exportStoryPng();
}

async function exportStoryVideo() {
  if (state.exportingVideo) return;
  const informative = hasInformativeVideo();
  const previewVideo = informative ? state.infoVideo : elements.video;
  const videoUrl = informative ? state.infoImageUrl : state.videoUrl;
  const timeline = getTimelineState();
  if (!videoUrl) { setStatus("Selecione um vídeo primeiro"); return; }
  const trim = EditorCore.videoTrim(previewVideo.duration, timeline.videoTrimStart, timeline.videoTrimEnd);
  const previewWasPlaying = !previewVideo.paused;
  state.exportingVideo = true;
  previewVideo.pause();
  document.body.classList.add("is-video-exporting");
  elements.exportButton.disabled = true;
  elements.progress.value = 0;
  setStatus("Preparando vídeo…");
  try {
    await document.fonts.ready;
    const { exportVideoFrames } = await import("./assets/vendor/video-export.js?v=20261027-icon-refresh2");
    const response = await fetch(videoUrl);
    if (!response.ok) throw new Error("Não foi possível ler o vídeo selecionado. Selecione o arquivo novamente.");
    const spec = getCurrentFormatSpec();
    state.renderInformativePage = informative ? state.informativePages[state.activeInformativePage] : null;
    const blob = await exportVideoFrames({
      blob: await response.blob(), width: spec.width, height: spec.height,
      start: trim.start, end: trim.end,
      render(source) {
        state.renderVideo = source;
        if (state.format === "stories") drawStoriesFrame(renderContext);
        else if (informative) drawInformativeFrame(renderContext);
        else drawFeedFrame(renderContext);
        return elements.canvas;
      },
      onProgress(value) {
        elements.progress.value = Math.min(.99, value);
        setStatus(`Exportando vídeo… ${Math.round(value * 100)}%`);
      },
    });
    state.exportMime = "video/mp4";
    state.exportExt = "mp4";
    const saved = await downloadExport(blob, makeExportName().replace("-lpz-zero.", `-lpz-zero-${state.format}.`));
    setStatus(`MP4 — download iniciado: ${saved.fileName}`);
  } catch (error) {
    console.error(error);
    const message = error.message || "Não foi possível exportar este vídeo.";
    setStatus(message); beginMediaLoading()(false, message);
    if (batchExportFiles) throw error;
  } finally {
    state.renderVideo = null;
    state.renderInformativePage = null;
    state.exportingVideo = false;
    document.body.classList.remove("is-video-exporting");
    refreshVideoArtwork();
    if (informative && previewWasPlaying) syncInformativeVideoPlayback();
    else if (previewWasPlaying) previewVideo.play().catch(() => {});
    elements.exportButton.disabled = false;
    elements.progress.value = 0;
  }
}

async function exportStoryPng() {
  elements.pngExportButton.disabled = true;
  setStatus("Preparando PNG");

  try {
    if (state.videoUrl && elements.video.readyState < 2) {
      await waitForVideo(elements.video);
    }

    drawFrame(elements.video);
    const blob = await canvasToBlob(elements.canvas, "image/png");
    const saved = await downloadExport(blob, makePngExportName());
    setStatus(`PNG — download iniciado: ${saved.fileName}`);
  } catch (error) {
    console.error(error);
    setStatus("Nao consegui gerar o PNG");
    if (batchExportFiles) throw error;
  } finally {
    elements.pngExportButton.disabled = false;
  }
}

async function exportFeedPng() {
  elements.exportButton.disabled = true;
  elements.pngExportButton.disabled = true;
  setStatus("Preparando PNG do feed");

  try {
    await ensureCircleForeground();
    updateFeedText();
    updateInformativeText();
    if (state.format === "stories") {
      updateStoriesPreview();
      renderContext.drawImage(document.getElementById("storiesPreview"), 0, 0);
    }
    else if (state.format === "closing") drawClosingFrame(renderContext);
    else if (state.format === "informative") drawInformativeFrame(renderContext);
    else drawFeedFrame(renderContext);
    const blob = await canvasToBlob(elements.canvas, "image/png");
    const saved = await downloadExport(blob, makeFeedExportName());
    setStatus(`${state.format === "stories" ? "PNG Stories" : state.format === "closing" ? "PNG encerramento" : state.format === "informative" ? "PNG informativo" : "PNG do feed"} — download iniciado: ${saved.fileName}`);
  } catch (error) {
    console.error(error);
    setStatus("Nao consegui gerar o PNG do feed");
    if (batchExportFiles) throw error;
  } finally {
    elements.exportButton.disabled = false;
    elements.pngExportButton.disabled = false;
  }
}


function drawFrame(video) {
  if (["feed", "informative", "closing", "stories"].includes(state.format)) {
    if (state.format === "stories") {
      updateStoriesPreview();
      renderContext.drawImage(document.getElementById("storiesPreview"), 0, 0);
    }
    else if (state.format === "closing") drawClosingFrame(renderContext);
    else if (state.format === "informative") drawInformativeFrame(renderContext);
    else drawFeedFrame(renderContext);
    return;
  }

  const ctx = renderContext;
  ctx.save();
  ctx.fillStyle = "#11100f";
  ctx.fillRect(0, 0, STORY.width, STORY.height);

  if (state.background) {
    ctx.filter = "contrast(1.09) brightness(0.86)";
    drawImageCover(ctx, state.background, 0, 0, STORY.width, STORY.height);
    ctx.filter = "none";
  }

  drawVideoSlot(ctx, video);
  drawTextureOverlay(ctx);
  drawHeadline(ctx);
  drawLogo(ctx);
  ctx.restore();
}

function drawFeedFrame(ctx) {
  const media = getArtworkMedia();
  ctx.save();
  ctx.fillStyle = "#07070a";
  ctx.fillRect(0, 0, FEED.width, FEED.height);

  if (media) {
    ctx.filter = "contrast(1.07) saturate(1.08) brightness(0.9)";
    drawImageCoverTransformed(
      ctx,
      media,
      0,
      0,
      FEED.width,
      FEED.height,
      state.zoom,
      (state.panX / 100) * FEED.width,
      (state.panY / 100) * FEED.height,
    );
    ctx.filter = "none";
  } else {
    const gradient = ctx.createLinearGradient(0, 0, FEED.width, FEED.height);
    gradient.addColorStop(0, "#2eb8b1");
    gradient.addColorStop(0.58, "#19151b");
    gradient.addColorStop(1, "#050506");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, FEED.width, FEED.height);
  }

  drawFeedOverlay(ctx);
  if (media) {
    drawFeedBlurMask(ctx);
    drawFeedBlurTopGradient(ctx);
  }
  drawFeedTextures(ctx);
  drawFeedCopy(ctx);
  drawLogo(ctx);
  drawCircleInset(ctx);
  ctx.restore();
}

function drawFeedOverlay(ctx) {
  const topGradient = ctx.createLinearGradient(0, 0, 0, FEED.height);
  topGradient.addColorStop(0, "rgba(0,0,0,0)");
  topGradient.addColorStop(1, "rgba(0,0,0,0.22)");
  ctx.fillStyle = topGradient;
  ctx.fillRect(0, 0, FEED.width, FEED.height);
}

function ensureCanvasSize(canvas, width, height) {
  if (canvas.width !== width) {
    canvas.width = width;
  }
  if (canvas.height !== height) {
    canvas.height = height;
  }
}

function drawFeedBlurMask(ctx, width = FEED.width, height = FEED.height) {
  const media = getArtworkMedia();
  if (!media || !feedEffectContext) return;

  ensureCanvasSize(feedEffectCanvas, width, height);
  const fx = feedEffectContext;
  fx.clearRect(0, 0, width, height);

  fx.save();
  ArtworkEffects.drawCover(fx, media, 0, 0, width, height, state.maskBlur, { zoom: state.zoom, panX: state.panX / 100 * width, panY: state.panY / 100 * height });
  fx.restore();

  fx.save();
  fx.globalCompositeOperation = "destination-in";
  const mask = fx.createLinearGradient(0, 0, 0, height);
  mask.addColorStop(0, "rgba(0,0,0,0)");
  mask.addColorStop(0.52, "rgba(0,0,0,0)");
  mask.addColorStop(0.68, "rgba(0,0,0,0.36)");
  mask.addColorStop(1, "rgba(0,0,0,1)");
  fx.fillStyle = mask;
  fx.fillRect(0, 0, width, height);
  fx.restore();

  ctx.drawImage(feedEffectCanvas, 0, 0);
}

function drawFeedBlurTopGradient(ctx, width = FEED.width, height = FEED.height) {
  const opacity = clamp(Number(state.blurGradientOpacity) || 0, 0, 100) / 100;
  if (opacity <= 0) return;

  const startY = 0;
  const softShade = ctx.createLinearGradient(0, startY, 0, height);
  softShade.addColorStop(0, "rgba(0,0,0,0)");
  softShade.addColorStop(0.44, "rgba(0,0,0,0)");
  softShade.addColorStop(0.66, `rgba(0,0,0,${opacity * 0.42})`);
  softShade.addColorStop(0.82, `rgba(0,0,0,${opacity})`);
  softShade.addColorStop(1, `rgba(0,0,0,${opacity})`);
  ctx.fillStyle = softShade;
  ctx.fillRect(0, startY, width, height - startY);
}

const storiesTextureCache = new WeakMap();
function getStoriesTexture(image) {
  if (!image) return null;
  if (storiesTextureCache.has(image)) return storiesTextureCache.get(image);
  const canvas = document.createElement("canvas");
  canvas.width = FEED.width;
  canvas.height = FEED.height;
  const ctx = canvas.getContext("2d");
  drawImageCover(ctx, image, 0, 0, FEED.width, FEED.height);
  // Preserve the lower texture while clearing the subject/video above the copy.
  const mask = ctx.createLinearGradient(0, 0, 0, FEED.height);
  mask.addColorStop(0, "rgba(0,0,0,.16)");
  mask.addColorStop(.5, "rgba(0,0,0,.16)");
  mask.addColorStop(.8, "rgba(0,0,0,1)");
  mask.addColorStop(1, "rgba(0,0,0,1)");
  ctx.globalCompositeOperation = "destination-in";
  ctx.fillStyle = mask;
  ctx.fillRect(0, 0, FEED.width, FEED.height);
  storiesTextureCache.set(image, canvas);
  return canvas;
}

function drawFeedTextures(ctx, stories = false) {
  const texture = image => stories ? getStoriesTexture(image) : image;
  drawFeedTexture(ctx, texture(state.feedTextureExclusionImage), "exclusion", 0.38);
  drawFeedTexture(ctx, texture(state.feedTextureSoftLightImage), "soft-light", 0.49);
}

function drawFeedTexture(ctx, image, blendMode, opacity) {
  if (!image) return;

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.globalCompositeOperation = blendMode;
  drawImageCover(ctx, image, 0, 0, FEED.width, FEED.height);
  ctx.restore();
}

function drawFeedCopy(ctx) {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";

  const kicker = getFeedTypography("kicker");
  const titleLayouts = getFeedTitleLayouts();
  const kickerPosition = getFeedKickerPosition(titleLayouts);
  if (state.kickerMode === "image" && state.kickerImage) {
    const width = 320;
    const height = width * state.kickerImage.naturalHeight / state.kickerImage.naturalWidth;
    ctx.drawImage(state.kickerImage, (FEED.width - width) / 2, kickerPosition - height, width, height);
  } else {
    drawTrackedTextWithFont(ctx, normalizeLine(elements.feedKickerInput.value || "CHAPEU"), FEED.width / 2, kickerPosition, kicker.tracking, `400 ${kicker.fontSize}px Gotham, Montserrat, "Segoe UI", Arial, sans-serif`);
  }

  const highlightColor = HIGHLIGHT_COLORS[state.titleHighlightColor] || HIGHLIGHT_COLORS.pink;

  titleLayouts.forEach((spec) => {
    if (state.titleHighlightColor !== "none") {
      ctx.fillStyle = highlightColor;
      spec.highlightRects.forEach(rect => ctx.fillRect(rect.x, rect.y, rect.width, rect.height));
    }

    ctx.fillStyle = "#ffffff";
    ctx.font = `${spec.fontSize}px "Tusker Story", Impact, sans-serif`;
    ctx.save();
    ctx.textBaseline = "alphabetic";
    ctx.translate(FEED.width / 2, spec.baselineY);
    ctx.scale(spec.scaleX, 1);
    if (supportsCanvasLetterSpacing(ctx)) {
      ctx.textAlign = "left";
      ctx.letterSpacing = `${spec.tracking}px`;
      ctx.fillText(spec.text || " ", -measureTrackedText(spec.text, spec.fontSize, spec.tracking) / 2, 0);
    } else {
      drawTrackedText(ctx, spec.text || " ", 0, 0, spec.tracking);
    }
    ctx.restore();
  });

  ctx.fillStyle = "#ffffff";
  drawSubtitleBlock(ctx);
  ctx.restore();
}

function drawVideoSlot(ctx, video) {
  const slot = STORY.video;
  ctx.save();
  ctx.beginPath();
  ctx.rect(slot.x, slot.y, slot.width, slot.height);
  ctx.clip();

  if (video.videoWidth && video.videoHeight) {
    const zoom = state.zoom;
    const panX = (state.panX / 100) * slot.width;
    const panY = (state.panY / 100) * slot.height;
    const mediaRatio = video.videoWidth / video.videoHeight;
    const slotRatio = slot.width / slot.height;
    let drawWidth = slot.width;
    let drawHeight = slot.height;

    if (mediaRatio > slotRatio) {
      drawHeight = slot.height;
      drawWidth = drawHeight * mediaRatio;
    } else {
      drawWidth = slot.width;
      drawHeight = drawWidth / mediaRatio;
    }

    drawWidth *= zoom;
    drawHeight *= zoom;

    const x = slot.x + (slot.width - drawWidth) / 2 + panX;
    const y = slot.y + (slot.height - drawHeight) / 2 + panY;
    ctx.drawImage(video, x, y, drawWidth, drawHeight);
  } else {
    ctx.fillStyle = "#d8d8d8";
    ctx.fillRect(slot.x, slot.y, slot.width, slot.height);
  }

  ctx.restore();
}

function drawTextureOverlay(ctx) {
  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = "#ffffff";
  for (let x = 0; x < STORY.width; x += 176) {
    ctx.fillRect(x, 0, 1, STORY.height);
  }
  ctx.restore();
}

function drawHeadline(ctx) {
  const layouts = getTitleLayouts();
  const highlightColor = HIGHLIGHT_COLORS[state.titleHighlightColor] || HIGHLIGHT_COLORS.pink;

  layouts.forEach((spec) => {
    if (spec.hasHighlight && state.titleHighlightColor !== "none") {
      ctx.fillStyle = highlightColor;
      ctx.fillRect(spec.x, spec.y, spec.width, spec.height);
    }

    ctx.fillStyle = "#ffffff";
    ctx.font = `${spec.fontSize}px "Tusker Story", Impact, sans-serif`;
    ctx.textBaseline = "middle";
    ctx.save();
    ctx.translate(STORY.width / 2, spec.y + spec.padTop + spec.fontSize / 2 + spec.baselineShift);
    ctx.scale(spec.scaleX, 1);
    drawTrackedText(ctx, spec.text || " ", 0, 0, spec.tracking);
    ctx.restore();
  });
}

function drawLogo(ctx) {
  if (!state.logoImage) return;

  const image = state.logoImage;
  const imageWidth = image.naturalWidth || image.width || state.logoWidth;
  const imageHeight = image.naturalHeight || image.height || state.logoWidth;
  if (!imageWidth || !imageHeight) return;

  const width = state.logoWidth;
  const height = width * (imageHeight / imageWidth);
  const x = STORY.width / 2 - width / 2 + state.logoX;
  const y = state.logoY;

  ctx.save();
  ctx.globalAlpha = state.logoOpacity / 100;
  ctx.drawImage(image, x, y, width, height);
  ctx.restore();
}

function drawImageCover(ctx, image, x, y, width, height) {
  const mediaWidth = image.videoWidth || image.naturalWidth || image.width;
  const mediaHeight = image.videoHeight || image.naturalHeight || image.height;
  const imageRatio = mediaWidth / mediaHeight;
  const targetRatio = width / height;
  let sourceWidth = mediaWidth;
  let sourceHeight = mediaHeight;
  let sourceX = 0;
  let sourceY = 0;

  if (imageRatio > targetRatio) {
    sourceWidth = mediaHeight * targetRatio;
    sourceX = (mediaWidth - sourceWidth) / 2;
  } else {
    sourceHeight = mediaWidth / targetRatio;
    sourceY = (mediaHeight - sourceHeight) / 2;
  }

  ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
}

function drawImageCoverTransformed(ctx, image, x, y, width, height, zoom = 1, panX = 0, panY = 0) {
  const geometry = EditorCore.imageGeometry(image.videoWidth || image.naturalWidth || image.width, image.videoHeight || image.naturalHeight || image.height, width, height, zoom, panX, panY);
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.clip();
  ctx.drawImage(image, x + geometry.x, y + geometry.y, geometry.width, geometry.height);
  ctx.restore();
}

function measureTrackedText(text, fontSize, tracking) {
  measureContext.font = `${fontSize}px "Tusker Story", Impact, sans-serif`;
  return measureWholeTrackedText(measureContext, text, tracking);
}

function drawTrackedText(ctx, text, centerX, centerY, tracking) {
  if (drawWholeTrackedText(ctx, text, centerX, centerY, tracking)) {
    return;
  }

  const fontSize = getCanvasFontSize(ctx.font);
  const width = measureTrackedGlyphs(ctx, text, fontSize, tracking);
  let x = centerX - width / 2;
  let hasGlyph = false;

  for (const char of text) {
    if (hasGlyph) {
      x += tracking;
    }
    if (char === " ") {
      x += getTrackedSpaceAdvance(fontSize);
    } else {
      ctx.fillText(char, x, centerY);
      x += getTrackedGlyphAdvance(ctx, char, fontSize);
    }
    hasGlyph = true;
  }
}

function drawTrackedTextWithFont(ctx, text, centerX, centerY, tracking, font) {
  measureContext.font = font;
  const fontSize = getCanvasFontSize(font);

  ctx.font = font;
  if (drawWholeTrackedText(ctx, text, centerX, centerY, tracking)) {
    return;
  }

  const width = measureTrackedGlyphs(ctx, text, fontSize, tracking);
  let x = centerX - width / 2;
  let hasGlyph = false;

  for (const char of text) {
    if (hasGlyph) {
      x += tracking;
    }
    if (char === " ") {
      x += getTrackedSpaceAdvance(fontSize);
    } else {
      ctx.fillText(char, x, centerY);
      x += getTrackedGlyphAdvance(ctx, char, fontSize);
    }
    hasGlyph = true;
  }
}

function drawWholeTrackedText(ctx, text, centerX, centerY, tracking) {
  if (!supportsCanvasLetterSpacing(ctx)) return false;

  const previousAlign = ctx.textAlign;
  const previousSpacing = ctx.letterSpacing;
  ctx.textAlign = "center";
  ctx.letterSpacing = `${tracking}px`;
  ctx.fillText(text, centerX, centerY);
  ctx.textAlign = previousAlign;
  ctx.letterSpacing = previousSpacing;
  return true;
}

function measureWholeTrackedText(context, text, tracking) {
  const characters = Array.from(text);
  return context.measureText(text).width + Math.max(0, characters.length - 1) * tracking;
}

function measureTrackedGlyphs(context, text, fontSize, tracking) {
  let width = 0;
  let hasGlyph = false;

  for (const char of text) {
    if (hasGlyph) {
      width += tracking;
    }
    width += char === " " ? getTrackedSpaceAdvance(fontSize) : getTrackedGlyphAdvance(context, char, fontSize);
    hasGlyph = true;
  }

  return width;
}

function getTrackedGlyphAdvance(context, char, fontSize) {
  return Math.max(context.measureText(char).width, fontSize * 0.18);
}

function getTrackedSpaceAdvance(fontSize) {
  return Math.max(10, fontSize * 0.24);
}

function supportsCanvasLetterSpacing(ctx) {
  return "letterSpacing" in ctx;
}

function getCanvasFontSize(font) {
  const match = String(font).match(/(\d+(?:\.\d+)?)px/);
  return match ? Number(match[1]) : 16;
}

function drawSubtitleBlock(ctx) {
  const titleLayouts = getFeedTitleLayouts();
  applyAutoSubtitleState(titleLayouts);
  const lines = layoutSubtitleLines(measureContext, getSubtitleDisplaySegments(), titleLayouts);
  if (!lines.length) return;

  const layout = getSubtitleBlockLayout(lines.length, titleLayouts);
  const lineHeight = state.subtitleLineHeight;
  const totalHeight = lines.length * lineHeight;

  ctx.save();
  ctx.translate(layout.x, layout.y);
  ctx.rotate((state.subtitleRotation * Math.PI) / 180);
  ctx.scale(state.subtitleScaleX / 100, layout.scaleY);
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  lines.forEach((line, index) => {
    const isLastLine = index === lines.length - 1;
    const extraSpace =
      state.subtitleTextAlign === "justify" && !isLastLine
        ? getSubtitleJustifySpace(measureContext, line, layout.maxWidth)
        : 0;
    const lineWidth = measureSubtitleLine(measureContext, line, extraSpace);
    const lineScaleX = Math.min(1, layout.maxWidth / Math.max(1, lineWidth));
    const displayWidth = lineWidth * lineScaleX;
    const x = getSubtitleLineStartX(displayWidth, layout.maxWidth);
    const y = -totalHeight / 2 + lineHeight / 2 + index * lineHeight;

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(lineScaleX, 1);
    drawSubtitleLine(ctx, line, 0, 0, extraSpace, measureContext);
    ctx.restore();
  });

  ctx.restore();
}

function layoutSubtitleLines(ctx, segments, titleLayouts = getFeedTitleLayouts()) {
  const tokens = getSubtitleTokens(segments);
  const lines = [];
  let current = [];
  const maxWidth = getEffectiveSubtitleMaxWidth(titleLayouts);

  tokens.forEach((token) => {
    if (token.type === "line-break") {
      lines.push(trimTrailingSubtitleSpaces(current).length ? trimTrailingSubtitleSpaces(current) : [makeSubtitleSpaceToken()]);
      current = [];
      return;
    }

    if (token.type === "space" && !current.length) return;

    const candidate = current.concat(token);
    const candidateWidth = measureSubtitleLine(ctx, trimTrailingSubtitleSpaces(candidate));

    if (token.type !== "space" && current.length && candidateWidth > maxWidth) {
      lines.push(trimTrailingSubtitleSpaces(current));
      current = [token];
      return;
    }

    current = candidate;
  });

  const finalLine = trimTrailingSubtitleSpaces(current);
  if (finalLine.length) {
    lines.push(finalLine);
  }

  return lines.length ? lines : [[makeSubtitleSpaceToken()]];
}

function getSubtitleTokens(segments) {
  const tokens = [];
  let word = [];

  const flushWord = () => {
    if (!word.length) return;
    tokens.push({ type: "word", chars: word });
    word = [];
  };

  segments.forEach((segment) => {
    for (const char of segment.text) {
      if (char === "\n") {
        flushWord();
        tokens.push({ type: "line-break", chars: [] });
      } else if (/[^\S\n]/.test(char)) {
        flushWord();
        if (tokens[tokens.length - 1]?.type !== "space") {
          tokens.push(makeSubtitleSpaceToken());
        }
      } else {
        word.push({
          char,
          bold: segment.bold,
          underline: segment.underline,
          strike: segment.strike,
          superscript: segment.superscript,
          subscript: segment.subscript,
        });
      }
    }
  });

  flushWord();
  return tokens;
}

function makeSubtitleSpaceToken() {
  return { type: "space", chars: [{ char: " ", ...getEmptySubtitleStyle() }] };
}

function trimTrailingSubtitleSpaces(tokens) {
  const trimmed = tokens.slice();
  while (trimmed[trimmed.length - 1]?.type === "space") {
    trimmed.pop();
  }
  return trimmed;
}

function getSubtitleSafeBox() {
  return {
    left: FEED.subtitle.safeLeft,
    right: FEED.width - FEED.subtitle.safeRight,
    top: FEED.subtitle.safeTop,
    bottom: FEED.subtitle.safeBottom,
    width: FEED.width - FEED.subtitle.safeLeft - FEED.subtitle.safeRight,
    height: FEED.subtitle.safeBottom - FEED.subtitle.safeTop,
  };
}

function getEffectiveSubtitleMaxWidth(titleLayouts = getFeedTitleLayouts()) {
  const safe = getSubtitleSafeBox();
  return clamp(getAutoSubtitleSettings(titleLayouts).maxWidth, 120, safe.width);
}

function getSubtitleBlockLayout(lineCount = 1, titleLayouts = getFeedTitleLayouts()) {
  const safe = getSubtitleSafeBox();
  const settings = getAutoSubtitleSettings(titleLayouts);
  const maxWidth = getEffectiveSubtitleMaxWidth(titleLayouts);
  const rawHeight = Math.max(1, lineCount) * state.subtitleLineHeight;
  if (state.format !== "stories") {
    const top = settings.titleBottom + FEED.copy.subtitleGap;
    const availableHeight = Math.max(1, FEED.copy.bottom - top);
    const scaleY = Math.min(1, availableHeight / rawHeight);
    return { x: FEED.width / 2, y: top + rawHeight * scaleY / 2, maxWidth, scaleY };
  }
  const fittedScaleY = Math.min(1, Math.max(0.88, safe.height / Math.max(1, rawHeight)));
  const displayHeight = rawHeight * fittedScaleY;
  const x = FEED.width / 2;
  const preferredTop = settings.titleBottom + 24;
  const minY = safe.top + displayHeight / 2;
  const maxY = safe.bottom - displayHeight / 2;
  const preferredY = preferredTop + displayHeight / 2;
  const y = minY > maxY ? safe.top + safe.height / 2 : clamp(preferredY, minY, maxY);

  return {
    x,
    y,
    maxWidth,
    scaleY: fittedScaleY,
  };
}

function measureSubtitleLine(ctx, tokens, extraSpace = 0) {
  let width = 0;
  let hasCharacter = false;

  tokens.forEach((token) => {
    token.chars.forEach((charSpec) => {
      if (hasCharacter) {
        width += state.subtitleLetterSpacing;
      }
      width += getSubtitleCharAdvance(ctx, charSpec, extraSpace);
      hasCharacter = true;
    });
  });

  return width;
}

function drawSubtitleLine(ctx, tokens, startX, y, extraSpace = 0, measurementContext = ctx) {
  let x = startX;
  let hasCharacter = false;

  tokens.forEach((token) => {
    token.chars.forEach((charSpec) => {
      if (hasCharacter) {
        x += state.subtitleLetterSpacing;
      }

      const advance = getSubtitleCharAdvance(measurementContext, charSpec, extraSpace);
      const charY = y + getSubtitleInlineOffset(charSpec);
      if (charSpec.char !== " ") {
        ctx.font = getSubtitleCanvasFont(charSpec);
        ctx.fillText(charSpec.char, x, charY);
      }
      drawSubtitleCharacterDecorations(ctx, charSpec, x, charY, advance);

      x += advance;
      hasCharacter = true;
    });
  });
}

function getSubtitleCharAdvance(ctx, charSpec, extraSpace = 0) {
  if (charSpec.char === " ") {
    ctx.font = getSubtitleCanvasFont(charSpec);
    return ctx.measureText(" ").width + state.subtitleWordSpacing + extraSpace;
  }

  ctx.font = getSubtitleCanvasFont(charSpec);
  return ctx.measureText(charSpec.char).width;
}

function getSubtitleCanvasFont(charSpec) {
  const weight = charSpec.bold ? 800 : 400;
  const fontSize = getSubtitleInlineFontSize(charSpec);
  return `${weight} ${fontSize}px Gotham, Montserrat, "Segoe UI", Arial, sans-serif`;
}

function getSubtitleInlineFontSize(charSpec) {
  return charSpec.superscript || charSpec.subscript ? Math.round(state.subtitleFontSize * 0.68) : state.subtitleFontSize;
}

function getSubtitleInlineOffset(charSpec) {
  if (charSpec.superscript) return -state.subtitleFontSize * 0.3;
  if (charSpec.subscript) return state.subtitleFontSize * 0.22;
  return 0;
}

function drawSubtitleCharacterDecorations(ctx, charSpec, x, y, width) {
  if (!charSpec.underline && !charSpec.strike) return;

  const fontSize = getSubtitleInlineFontSize(charSpec);
  const thickness = Math.max(1.3, fontSize * 0.055);
  ctx.save();
  ctx.fillStyle = "#ffffff";

  if (charSpec.underline) {
    ctx.fillRect(x, y + fontSize * 0.45, width, thickness);
  }

  if (charSpec.strike) {
    ctx.fillRect(x, y - fontSize * 0.04, width, thickness);
  }

  ctx.restore();
}

function getSubtitleLineStartX(lineWidth, maxWidth = getEffectiveSubtitleMaxWidth()) {
  if (state.subtitleTextAlign === "left" || state.subtitleTextAlign === "justify") {
    return -maxWidth / 2;
  }
  if (state.subtitleTextAlign === "right") {
    return maxWidth / 2 - lineWidth;
  }
  return -lineWidth / 2;
}

function getSubtitleJustifySpace(ctx, tokens, maxWidth) {
  const spaceCount = tokens.filter((token) => token.type === "space").length;
  if (!spaceCount) return 0;

  const currentWidth = measureSubtitleLine(ctx, tokens);
  return Math.max(0, (maxWidth - currentWidth) / spaceCount);
}

function seekVideo(video, time) {
  if (Math.abs(video.currentTime - time) < 0.001) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const cleanup = () => { video.removeEventListener("seeked", done); video.removeEventListener("error", fail); };
    const done = () => { cleanup(); resolve(); };
    const fail = () => { cleanup(); reject(new Error("Não foi possível posicionar o vídeo")); };
    video.addEventListener("seeked", done, { once: true });
    video.addEventListener("error", fail, { once: true });
    video.currentTime = time;
  });
}

function waitForVideo(video) {
  return new Promise((resolve, reject) => {
    const cleanup = () => {
      video.removeEventListener("loadedmetadata", onReady);
      video.removeEventListener("canplay", onReady);
      video.removeEventListener("error", onError);
    };

    const onReady = () => {
      if (video.readyState >= 2 && video.videoWidth) {
        cleanup();
        resolve();
      }
    };

    const onError = () => {
      cleanup();
      reject(new Error("Video could not load"));
    };

    video.addEventListener("loadedmetadata", onReady);
    video.addEventListener("canplay", onReady);
    video.addEventListener("error", onError);
    video.load();
    onReady();
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60000);
}

function canvasToBlob(canvas, type) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Canvas export failed"));
      }
    }, type);
  });
}

async function downloadExport(blob, fileName) {
  if (!blob || !blob.size) throw new Error("Arquivo exportado vazio");
  if (batchExportFiles) {
    batchExportFiles.push({ blob, name: `${batchExportName}.${blob.type.includes("video") ? "mp4" : "png"}` });
    return { ok: true, fileName };
  }
  downloadBlob(blob, fileName);
  return { ok: true, fileName };
}

function makeExportName() {
  const base = makeExportBaseName();
  return `${base || "story"}-lpz-zero.${state.exportExt}`;
}

function makePngExportName() {
  const base = makeExportBaseName();
  return `${base || "story"}-lpz-zero.png`;
}

function makeFeedExportName() {
  const base = (state.feedImageName || "feed")
    .replace(/\.[^.]+$/, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
  return `${base || "feed"}-lpz-zero-${state.format === "stories" ? "stories" : state.format === "closing" ? "encerramento" : state.format === "informative" ? `informativo-${state.activeInformativePage + 1}` : "feed"}.png`;
}

function makeExportBaseName() {
  return (state.videoName || "story")
    .replace(/\.[^.]+$/, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function setStatus(message) {
  elements.statusLine.textContent = message;
}


function selectPreviewElement(selection) {
  elements.stage.querySelectorAll(".is-selected").forEach(node => node.classList.remove("is-selected"));
  const selectors = {
    media: ["feed", "informative", "closing", "stories"].includes(state.format) ? "#feedImage" : "#videoSlot",
    title: ["feed", "stories"].includes(state.format) ? "#feedTitleLayer" : state.format === "informative" ? "#informativeTitlePreview" : "#titleLayer .headline-strip",
    text: ["feed", "stories"].includes(state.format) ? "#feedTitleLayer" : state.format === "informative" ? "#informativeBodyPreview" : "#titleLayer .headline-strip",
    subtitle: "#feedSubtitlePreview",
    kicker: "#feedKickerPreview",
    infoTitle: "#informativeTitlePreview",
    infoBody: "#informativeBodyPreview",
    logo: "#logoLayer",
  };
  if (selectors[selection]) elements.stage.querySelectorAll(selectors[selection]).forEach(node => node.classList.add("is-selected"));

}


function bindSubtitleContextBold() {
  const editor = elements.feedSubtitleInput;
  let savedRange = null;
  editor.addEventListener("pointerdown", event => {
    const offsets = getSubtitleSelectionOffsets();
    savedRange = event.button === 2 && offsets && offsets.start !== offsets.end
      ? window.getSelection().getRangeAt(0).cloneRange() : null;
  });
  editor.addEventListener("contextmenu", event => {
    if (savedRange) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(savedRange);
      savedRange = null;
    }
    const offsets = getSubtitleSelectionOffsets();
    if (!offsets || offsets.start === offsets.end) return;
    event.preventDefault();
    let allBold = true;
    for (let index = offsets.start; index < offsets.end; index++) {
      if (!getSubtitleStyleAt(index).bold) { allBold = false; break; }
    }
    applyFeedSubtitleWeight(allBold ? "regular" : "bold", offsets);
    setStatus(allBold ? "Negrito removido do trecho selecionado" : "Negrito aplicado ao trecho selecionado");
  });
}
function bindDirectImageControls() {
  const stage = elements.stage;
  let drag = null;
  let moved = false;
  const touchPoints = new Map();
  let pinch = null;
  const isImageTarget = (target) => {
    if (state.format === "closing") return false;
    if (state.format === "informative") return Boolean(target.closest(".informative-image-window")) && !target.closest("button, input");
    return !target.closest("button, input, textarea, [contenteditable=true], .informative-title, .informative-body, .feed-title-layer, .feed-subtitle, .feed-kicker, .logo-layer, .circle-inset");
  };
  const sync = () => updateMediaTransform();
  stage.addEventListener("pointerdown", (event) => {
    if (!touchPoints.size) { moved = false; state.previewClickTarget = null; }
    const activeImage = state.format === "informative" ? getInformativeMedia() : getArtworkMedia();
    if (event.button !== 0 || !activeImage || !isImageTarget(event.target)) return;
    event.preventDefault();
    state.previewClickTarget = event.target;
    const rect = stage.getBoundingClientRect();
    const frameWidth = state.format === "informative" ? INFORMATIVE.image.width : FEED.width;
    const frameHeight = state.format === "informative" ? INFORMATIVE.image.height : state.format === "stories" ? 1920 : FEED.height;
    if (event.pointerType === "touch") {
      touchPoints.set(event.pointerId, { x: event.clientX, y: event.clientY });
      stage.setPointerCapture(event.pointerId);
      if (touchPoints.size === 2) {
        const [first, second] = [...touchPoints.values()];
        const scale = rect.width / (state.format === "informative" ? INFORMATIVE.width : FEED.width);
        const offsetX = state.format === "informative" ? INFORMATIVE.image.x : 0;
        const offsetY = state.format === "informative" ? INFORMATIVE.image.y : 0;
        pinch = {
          distance: Math.max(1, Math.hypot(second.x - first.x, second.y - first.y)),
          zoom: state.format === "informative" ? state.infoZoom : state.zoom,
          panX: (state.format === "informative" ? state.infoPanX : state.panX) / 100 * frameWidth,
          panY: (state.format === "informative" ? state.infoPanY : state.panY) / 100 * frameHeight,
          centerX: ((first.x + second.x) / 2 - rect.left) / scale - offsetX - frameWidth / 2,
          centerY: ((first.y + second.y) / 2 - rect.top) / scale - offsetY - frameHeight / 2,
          rect, scale, frameWidth, frameHeight, offsetX, offsetY,
        };
        drag = null;
        moved = true;
        closeTextEditPopover();
        stage.classList.add("is-dragging");
        return;
      }
    }
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, panX: state.format === "informative" ? state.infoPanX : state.panX, panY: state.format === "informative" ? state.infoPanY : state.panY, scale: rect.width / (state.format === "informative" ? INFORMATIVE.width : FEED.width), frameWidth, frameHeight };
    moved = false;
    stage.setPointerCapture(event.pointerId);
    stage.classList.add("is-dragging");
  });
  stage.addEventListener("pointermove", (event) => {
    if (touchPoints.has(event.pointerId)) touchPoints.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pinch && touchPoints.size === 2) {
      const [first, second] = [...touchPoints.values()];
      const source = state.format === "informative" ? getInformativeMedia() : getArtworkMedia();
      const proposedZoom = pinch.zoom * Math.hypot(second.x - first.x, second.y - first.y) / pinch.distance;
      const nextZoom = EditorCore.imageGeometry(source.videoWidth || source.naturalWidth, source.videoHeight || source.naturalHeight, pinch.frameWidth, pinch.frameHeight, proposedZoom).zoom;
      const ratio = nextZoom / pinch.zoom;
      const centerX = ((first.x + second.x) / 2 - pinch.rect.left) / pinch.scale - pinch.offsetX - pinch.frameWidth / 2;
      const centerY = ((first.y + second.y) / 2 - pinch.rect.top) / pinch.scale - pinch.offsetY - pinch.frameHeight / 2;
      const panX = (centerX - pinch.centerX * ratio + pinch.panX * ratio) / pinch.frameWidth * 100;
      const panY = (centerY - pinch.centerY * ratio + pinch.panY * ratio) / pinch.frameHeight * 100;
      if (state.format === "informative") { state.infoZoom = nextZoom; state.infoPanX = panX; state.infoPanY = panY; }
      else { state.zoom = nextZoom; state.panX = panX; state.panY = panY; }
      sync();
      return;
    }
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!moved && Math.hypot(dx, dy) > 3) closeTextEditPopover();
    moved ||= Math.hypot(dx, dy) > 3;
    const nextX = drag.panX + dx / drag.scale / drag.frameWidth * 100;
    const nextY = drag.panY + dy / drag.scale / drag.frameHeight * 100;
    if (state.format === "informative") {
      state.infoPanX = nextX;
      state.infoPanY = nextY;
    } else {
      state.panX = nextX;
      state.panY = nextY;
    }
    sync();
  });
  const endDrag = (event) => {
    touchPoints.delete(event.pointerId);
    if (pinch) {
      const previous = pinch;
      pinch = null;
      drag = null;
      if (touchPoints.size === 1) {
        const [id, point] = [...touchPoints.entries()][0];
        drag = { id, x: point.x, y: point.y, panX: state.format === "informative" ? state.infoPanX : state.panX, panY: state.format === "informative" ? state.infoPanY : state.panY, scale: previous.scale, frameWidth: previous.frameWidth, frameHeight: previous.frameHeight, wasPinch: true };
      } else stage.classList.remove("is-dragging");
      if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
      return;
    }
    if (!drag || event.pointerId !== drag.id) return;
    const currentX = state.format === "informative" ? state.infoPanX : state.panX;
    const currentY = state.format === "informative" ? state.infoPanY : state.panY;
    if (moved && !drag.wasPinch && currentX === drag.panX && currentY === drag.panY) {
      setStatus("Limite da imagem atingido. Amplie com a roda do mouse para ter mais espaço de movimento.");
    }
    drag = null;
    stage.classList.remove("is-dragging");
    if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
  };
  stage.addEventListener("pointerup", endDrag);
  stage.addEventListener("pointercancel", endDrag);
  stage.addEventListener("lostpointercapture", endDrag);
  stage.addEventListener("click", (event) => {
    if (moved) { event.stopImmediatePropagation(); moved = false; state.previewClickTarget = null; }
  }, true);
  stage.addEventListener("wheel", (event) => {
    const activeImage = state.format === "informative" ? getInformativeMedia() : getArtworkMedia();
    if (!activeImage || !isImageTarget(event.target)) return;
    event.preventDefault();
    const rect = stage.getBoundingClientRect();
    const frameWidth = state.format === "informative" ? INFORMATIVE.image.width : FEED.width;
    const frameHeight = state.format === "informative" ? INFORMATIVE.image.height : state.format === "stories" ? 1920 : FEED.height;
    const currentZoom = state.format === "informative" ? state.infoZoom : state.zoom;
    const currentPanX = state.format === "informative" ? state.infoPanX : state.panX;
    const currentPanY = state.format === "informative" ? state.infoPanY : state.panY;
    const x = (event.clientX - rect.left) / rect.width * (state.format === "informative" ? INFORMATIVE.width : FEED.width) - frameWidth / 2 - (state.format === "informative" ? INFORMATIVE.image.x : 0);
    const y = (event.clientY - rect.top) / rect.height * (state.format === "informative" ? INFORMATIVE.height : FEED.height) - frameHeight / 2 - (state.format === "informative" ? INFORMATIVE.image.y : 0);
    const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? rect.height : 1);
    const next = EditorCore.imageGeometry(activeImage.videoWidth || activeImage.naturalWidth, activeImage.videoHeight || activeImage.naturalHeight, frameWidth, frameHeight, currentZoom * Math.exp(-delta * 0.0015)).zoom;
    const ratio = next / currentZoom;
    const nextPanX = (x - (x - currentPanX / 100 * frameWidth) * ratio) / frameWidth * 100;
    const nextPanY = (y - (y - currentPanY / 100 * frameHeight) * ratio) / frameHeight * 100;
    if (state.format === "informative") {
      state.infoPanX = nextPanX;
      state.infoPanY = nextPanY;
      state.infoZoom = next;
    } else {
      state.panX = nextPanX;
      state.panY = nextPanY;
      state.zoom = next;
    }
    sync();
  }, { passive: false });
}


function bindTextEditPopover() {
  const popover = document.getElementById("textEditPopover");
  const highlightWarning = document.getElementById("fullHighlightWarning");
  highlightWarning.addEventListener("pointerdown", event => event.stopPropagation());
  highlightWarning.addEventListener("keydown", event => event.stopPropagation());
  document.getElementById("closeTextEditPopover").addEventListener("click", () => closeTextEditPopover(true));
  document.addEventListener("pointerdown", (event) => {
    if (popover.hidden || popover.contains(event.target) || event.target.closest(".feed-title-layer, .feed-kicker, .feed-subtitle, .informative-title, .informative-body, [data-edit-text]")) return;
    closeTextEditPopover();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || popover.hidden) return;
    closeTextEditPopover();
    event.preventDefault();
  });
  window.addEventListener("resize", () => {
    if (!matchMedia("(max-width: 800px)").matches) closeTextEditPopover();
  });
  const syncMobileViewport = () => {
    document.documentElement.style.setProperty("--mobile-height", `${window.visualViewport?.height || innerHeight}px`);
    document.documentElement.style.setProperty("--mobile-top", `${window.visualViewport?.offsetTop || 0}px`);
  };
  syncMobileViewport();
  window.visualViewport?.addEventListener("resize", syncMobileViewport);
  window.visualViewport?.addEventListener("scroll", syncMobileViewport);
  window.addEventListener("resize", syncMobileViewport);
  document.getElementById("mobilePanelClose").addEventListener("click", () => closeMediaPopover(true));
  document.querySelectorAll("[data-mobile-zoom]").forEach(button => button.addEventListener("click", () => {
    if (state.format === "informative") state.infoZoom *= button.dataset.mobileZoom === "in" ? 1.15 : 1 / 1.15;
    else state.zoom *= button.dataset.mobileZoom === "in" ? 1.15 : 1 / 1.15;
    updateMediaTransform();
  }));
  const rememberTitleSelection = () => {
    const input = elements.titleInput;
    if (input.selectionEnd > input.selectionStart) state.titleEditSelection = { start: input.selectionStart, end: input.selectionEnd, text: input.value };
  };
  for (const name of ["select", "keyup", "pointerup"]) elements.titleInput.addEventListener(name, rememberTitleSelection);
  document.addEventListener("selectionchange", () => { if (document.activeElement === elements.titleInput) rememberTitleSelection(); });
  elements.titleInput.addEventListener("input", () => { state.titleEditSelection = null; });
  const titleButton = document.getElementById("mobileTitleHighlight");
  titleButton.addEventListener("pointerdown", event => { rememberTitleSelection(); if (event.pointerType !== "touch") event.preventDefault(); });
  titleButton.addEventListener("touchstart", rememberTitleSelection, { passive: true });
  titleButton.addEventListener("click", () => {
    let { selectionStart: start, selectionEnd: end } = elements.titleInput;
    if (start === end && state.titleEditSelection?.text === elements.titleInput.value) ({ start, end } = state.titleEditSelection);
    if (start === end) { setStatus("Selecione um trecho do título primeiro."); return; }
    void applyTitleHighlight(start, end);
  });
  const boldButton = document.getElementById("mobileSubtitleBold");
  const rememberSubtitleSelection = () => {
    const offsets = getSubtitleSelectionOffsets();
    if (offsets && offsets.end > offsets.start) state.subtitleEditSelection = { ...offsets, text: getSubtitlePlainText() };
  };
  document.addEventListener("selectionchange", rememberSubtitleSelection);
  elements.feedSubtitleInput.addEventListener("input", () => { state.subtitleEditSelection = null; });
  boldButton.addEventListener("pointerdown", event => { rememberSubtitleSelection(); if (event.pointerType !== "touch") event.preventDefault(); });
  boldButton.addEventListener("click", () => {
    let offsets = getSubtitleSelectionOffsets();
    if ((!offsets || offsets.start === offsets.end) && state.subtitleEditSelection?.text === getSubtitlePlainText()) offsets = state.subtitleEditSelection;
    if (!offsets || offsets.start === offsets.end) { setStatus("Selecione um trecho do subtítulo primeiro."); return; }
    let allBold = true;
    for (let index = offsets.start; index < offsets.end; index++) {
      if (!getSubtitleStyleAt(index).bold) { allBold = false; break; }
    }
    applyFeedSubtitleWeight(allBold ? "regular" : "bold");
  });
}

function drawInformativeFrame(ctx, layer = null) {
  ctx.save();
  const cached = !layer && state.renderInformativeLayers;
  if (layer !== "foreground") {
    if (cached) ctx.drawImage(cached.background, 0, 0);
    else {
      ctx.fillStyle = "#07070a";
      ctx.fillRect(0, 0, INFORMATIVE.width, INFORMATIVE.height);
      if (state.feedImage) {
        ArtworkEffects.drawCover(ctx, state.feedImage, 0, 0, INFORMATIVE.width, INFORMATIVE.height, state.infoBackgroundBlur, { zoom: state.zoom, panX: state.panX / 100 * INFORMATIVE.width, panY: state.panY / 100 * INFORMATIVE.height, contrast: 1.04, saturation: 1.04, brightness: .72 });
        ctx.filter = "none";
        ctx.fillStyle = "rgba(0,0,0,0.18)";
        ctx.fillRect(0, 0, INFORMATIVE.width, INFORMATIVE.height);
      } else if (state.background) {
        ArtworkEffects.drawCover(ctx, state.background, 0, 0, INFORMATIVE.width, INFORMATIVE.height, 12, { contrast: 1.08, brightness: .62 });
        ctx.filter = "none";
      }
      drawFeedTexture(ctx, state.feedTextureExclusionImage, "exclusion", 0.38);
    }
    if (layer === "background") { ctx.restore(); return; }
    const informativeMedia = getInformativeMedia();
    if (informativeMedia) {
      ctx.save();
      ctx.beginPath();
      const image = INFORMATIVE.image;
      ctx.moveTo(image.x, image.y + image.height * 0.074);
      ctx.lineTo(image.x, image.y + image.height);
      ctx.lineTo(image.x + image.width * 0.874, image.y + image.height * 0.998);
      ctx.lineTo(image.x + image.width, image.y + image.height * 0.794);
      ctx.lineTo(image.x + image.width, image.y + image.height * 0.172);
      ctx.lineTo(image.x + image.width * 0.894, image.y);
      ctx.lineTo(image.x + image.width * 0.553, image.y);
      ctx.lineTo(image.x + image.width * 0.461, image.y + image.height * 0.072);
      ctx.closePath();
      ctx.clip();
      drawImageCoverTransformed(ctx, informativeMedia, INFORMATIVE.image.x, INFORMATIVE.image.y, INFORMATIVE.image.width, INFORMATIVE.image.height, state.infoZoom, (state.infoPanX / 100) * INFORMATIVE.image.width, (state.infoPanY / 100) * INFORMATIVE.image.height);
      ctx.restore();
    } else {
      const box = INFORMATIVE.image;
      ctx.fillStyle = "#111"; ctx.beginPath();
      for (const [index, point] of [[0,[0,.074]],[1,[0,1]],[2,[.874,.998]],[3,[1,.794]],[4,[1,.172]],[5,[.894,0]],[6,[.553,0]],[7,[.461,.072]]]) {
        ctx[index ? "lineTo" : "moveTo"](box.x + point[0] * box.width, box.y + point[1] * box.height);
      }
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#bbb";
      ctx.font = `64px Gotham, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("+", INFORMATIVE.image.x + INFORMATIVE.image.width / 2, INFORMATIVE.image.y + INFORMATIVE.image.height / 2);
    }
    ctx.fillStyle = `rgba(0,0,0,${state.infoShade / 100})`;
    ctx.fillRect(0, 0, INFORMATIVE.width, INFORMATIVE.height);
  }
  if (cached) ctx.drawImage(cached.foreground, 0, 0);
  else {
    drawInformativeCopy(ctx);
    if (state.informativeSymbols) {
      const symbols = state.informativeSymbols;
      ctx.drawImage(symbols, 125, 146, 370, 370 * symbols.naturalHeight / symbols.naturalWidth);
    }
    drawLogo(ctx);
  }
  ctx.restore();
}

function drawInformativeCopy(ctx) {
  ctx.save();
  ctx.fillStyle = "#fff";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.font = `43px "Tusker Story", Impact, sans-serif`;
  ctx.fillText(state.infoTitle || "TÍTULO DO POST AQUI", INFORMATIVE.title.x, INFORMATIVE.title.y);
  ctx.letterSpacing = ".15px";
  let x = INFORMATIVE.body.x;
  let y = INFORMATIVE.body.y;
  for (const token of state.infoBody.matchAll(/\n|[^\S\n]+|[^\s]+/g)) {
    if (token[0] === "\n") {
      x = INFORMATIVE.body.x;
      y += INFORMATIVE.body.lineHeight;
      continue;
    }
    const runs = getInformativeBodyRuns(token.index, token.index + token[0].length);
    const setFont = run => { ctx.font = `${run.bold ? 700 : 400} ${INFORMATIVE.body.fontSize}px Gotham, Montserrat, sans-serif`; };
    const width = runs.reduce((sum, run) => { setFont(run); return sum + ctx.measureText(run.text).width; }, 0);
    if (x > INFORMATIVE.body.x && x + width > INFORMATIVE.body.x + INFORMATIVE.body.width) {
      x = INFORMATIVE.body.x;
      y += INFORMATIVE.body.lineHeight;
    }
    if (x === INFORMATIVE.body.x && /^\s+$/.test(token[0])) continue;
    for (const run of runs) {
      setFont(run);
      ctx.fillText(run.text, x, y);
      x += ctx.measureText(run.text).width;
    }
  }
  ctx.restore();
}
function syncDockAffordances() {
  const button = document.getElementById("dockImage");
  document.querySelectorAll(".dock-format-unit").forEach(unit => {
    const open = state.dockAttachmentFormat === unit.dataset.formatUnit;
    const slot = unit.querySelector(".dock-media-slot");
    unit.classList.toggle("has-media-attachment", open);
    if (slot) {
      if (open && button.parentElement !== slot) slot.append(button);
      slot.inert = !open;
      slot.setAttribute("aria-hidden", String(!open));
      unit.querySelector(".format-option").setAttribute("aria-expanded", String(open));
    }
  });
  button.disabled = !state.dockAttachmentFormat;
  const mediaOpen = document.body.classList.contains("mobile-controls-open");
  const mediaButton = document.getElementById("dockImage");
  mediaButton.classList.toggle("is-active", mediaOpen);
  mediaButton.setAttribute("aria-expanded", String(mediaOpen));
  const mediaLabel = state.format === "informative" ? "Imagem do informativo" : state.format === "closing" ? "Imagem do encerramento" : "Enviar imagem ou vídeo";
  mediaButton.setAttribute("aria-label", mediaLabel);
  mediaButton.dataset.tooltip = mediaLabel;
  const names = { title: state.format === "informative" ? "Título do informativo" : "Editar título", subtitle: state.format === "informative" ? "Texto do informativo" : "Editar subtítulo", kicker: "Mundo Soldier / chapéu" };
  document.querySelectorAll(".glass-dock [data-edit-text]").forEach(button => {
    button.dataset.tooltip = names[button.dataset.editText];
    button.setAttribute("aria-label", names[button.dataset.editText]);
  });
  const expanded = document.body.classList.contains("mobile-dock-expanded");
  document.getElementById("dockMore")?.classList.toggle("is-active", expanded);
}

function closeMediaPopover(restoreFocus = false) {
  document.body.classList.remove("mobile-controls-open");
  syncDockAffordances();
  StudioUI.sync();
  if (restoreFocus) (state.dockAttachmentFormat ? document.getElementById("dockImage") : elements.formatButtons.find(button => button.dataset.format === state.format))?.focus({ preventScroll: true });
}

function toggleMediaPopover() {
  if (state.exportingVideo) return;
  StudioUI.closeOtherPanels("media");
  const wasOpen = document.body.classList.contains("mobile-controls-open");
  closeTextEditPopover();
  document.body.classList.remove("mobile-dock-expanded");
  document.getElementById("dockMore")?.setAttribute("aria-expanded", "false");
  document.body.classList.toggle("mobile-controls-open", !wasOpen);
  state.activeDockPanel = "media";
  elements.dockPanels.forEach(panel => {
    const active = panel.dataset.panel === "media";
    panel.classList.toggle("is-active", active);
    panel.classList.remove("is-leaving");
    panel.setAttribute("aria-hidden", String(!active));
  });
  syncDockAffordances();
  if (!wasOpen) {
    const target = document.body.classList.contains("is-mobile-studio") ? document.getElementById("mobilePanelClose") :
      state.format === "informative" ? document.querySelector(".informative-upload-action") :
      document.getElementById(state.format === "closing" ? "closingImageInput" : "feedImageInput");
    target?.focus({ preventScroll: true });
  }
}

function openTextEditPopover(selection, event) {
  StudioUI.closeOtherPanels("text");
  closeMediaPopover();
  const popover = document.getElementById("textEditPopover");
  const fieldIds = { title: "titleInput", kicker: "feedKickerInput", subtitle: "feedSubtitleInput", infoTitle: "infoTitleInput", infoBody: "infoBodyInput" };
  state.lastTextSelection = selection;
  const titles = { title: "Título", kicker: "Chapéu", subtitle: "Subtítulo", infoTitle: "Título do informativo", infoBody: "Texto do informativo" };
  const field = document.getElementById(fieldIds[selection]);
  if (!field) return;
  document.getElementById("textEditHeading").textContent = titles[selection];
  popover.querySelectorAll("[data-text-editor]").forEach(section => { section.hidden = section.dataset.textEditor !== field.id; });
  popover.hidden = false;
  document.body.classList.add("text-popover-open");
  document.querySelectorAll(".glass-dock [data-edit-text]").forEach(button => {
    const key = state.format === "informative" ? ({ title: "infoTitle", subtitle: "infoBody" }[button.dataset.editText] || button.dataset.editText) : button.dataset.editText;
    button.classList.toggle("is-active", key === selection);
  });
  field.focus({ preventScroll: true });
}
function closeTextEditPopover(restoreFocus = false) {
  const trigger = document.querySelector(".glass-dock [data-edit-text].is-active");
  document.body.classList.remove("text-popover-open");
  document.querySelectorAll(".glass-dock [data-edit-text]").forEach(button => button.classList.remove("is-active"));
  const popover = document.getElementById("textEditPopover");
  if (popover.contains(document.activeElement)) document.activeElement.blur();
  popover.hidden = true;
  window.getSelection()?.removeAllRanges();
  if (restoreFocus) {
    const ids = { title: "feedTitleLayer", subtitle: "feedSubtitlePreview", kicker: "feedKickerPreview", infoTitle: "informativeTitlePreview", infoBody: "informativeBodyPreview" };
    (trigger || document.getElementById(ids[state.lastTextSelection]))?.focus({ preventScroll: true });
  }
}

function updateClosingPreview() {
  const canvas = document.getElementById("closingPreview");
  if (canvas && state.format === "closing") drawClosingFrame(canvas.getContext("2d"));
}

function drawClosingFrame(ctx) {
  ctx.save();
  ctx.fillStyle = "#101010";
  ctx.fillRect(0, 0, 1080, 1350);
  const image = state.closingImage || state.feedImage || state.background;
  if (image) {
    ctx.save();
    ArtworkEffects.drawCover(ctx, image, -70, -70, 1220, 1490, state.closingBlur, { saturation: .78, brightness: .76 });
    ctx.restore();
  }
  if (state.background) {
    ctx.save();
    ctx.globalAlpha = 0.34;
    ctx.globalCompositeOperation = "soft-light";
    drawImageCover(ctx, state.background, 0, 0, 1080, 1350);
    ctx.restore();
  }
  drawFeedTextures(ctx);
  const shade = ctx.createLinearGradient(0, 0, 0, 1350);
  shade.addColorStop(0, "rgba(0,0,0,.06)");
  shade.addColorStop(.55, `rgba(0,0,0,${state.closingShade / 100})`);
  shade.addColorStop(1, "rgba(0,0,0,.8)");
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, 1080, 1350);
  const lines = ["SIGA A @LP_ZEROBR AQUI VOCÊ ESTÁ", "ENTRE O NOVO E O NOSTÁLGICO"];
  const padding = getTitlePadding();
  let fontSize = 60;
  let tracking = fontSize * feedTypography.title.tracking / 1000;
  const maxWidth = 920 - padding.left - padding.right;
  while (Math.max(...lines.map(text => measureTrackedText(text, fontSize, tracking))) > maxWidth && fontSize > 28) {
    fontSize -= 1;
    tracking = fontSize * feedTypography.title.tracking / 1000;
  }
  const referenceMetrics = getTitleGlyphMetrics("ÁÉÍÓÚÂÊÔÃÕÇ", fontSize);
  const height = referenceMetrics.ascent + referenceMetrics.descent + padding.top + padding.bottom;
  const top = 629 - height / 2;
  const closingLineGap = 0;
  ctx.font = `${fontSize}px "Tusker Story", Impact, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  lines.forEach((text, index) => {
    const y = top + index * (height + closingLineGap);
    const metrics = getTitleGlyphMetrics(text, fontSize);
    if (index === 0 && state.titleHighlightColor !== "none") {
      const width = measureTrackedText(text, fontSize, tracking) + padding.left + padding.right;
      ctx.fillStyle = HIGHLIGHT_COLORS[state.titleHighlightColor] || HIGHLIGHT_COLORS.pink;
      ctx.fillRect((1080 - width) / 2, y, width, height);
    }
    ctx.fillStyle = "#fff";
    drawTrackedText(ctx, text, 540, y + height / 2 + (metrics.ascent - metrics.descent) / 2, tracking);
  });
  const symbols = state.informativeSymbols;
  if (symbols) ctx.drawImage(symbols, 355, 784, 370, 370 * symbols.naturalHeight / symbols.naturalWidth);
  ctx.restore();
}


function updateInformativePreview() {
  if (state.format === "informative") drawInformativeFrame(document.getElementById("informativePreview").getContext("2d"));
}

function updateStoriesPreview() {
  updateInformativePreview();
  if (state.format === "feed" && (state.circle.image || document.body.classList.contains("is-mobile-studio")) && state.mediaKind === "image") {
    drawFeedFrame(document.getElementById("videoArtworkPreview").getContext("2d"));
    return;
  }
  if (state.format !== "stories") return;
  const canvas = document.getElementById("storiesPreview");
  drawStoriesFrame(canvas.getContext("2d"));
}

function drawStoriesFrame(ctx) {
  const media = getArtworkMedia();
  ctx.reset();
  ctx.save();
  ctx.fillStyle = "#07070a";
  ctx.fillRect(0, 0, 1080, 1920);
  if (media) {
    ctx.filter = "contrast(1.07) saturate(1.08) brightness(0.9)";
    drawImageCoverTransformed(ctx, media, 0, 0, 1080, 1920, state.zoom, state.panX / 100 * 1080, state.panY / 100 * 1920);
    ctx.filter = "none";
  } else {
    const gradient = ctx.createLinearGradient(0, 0, 1080, 1920);
    gradient.addColorStop(0, "#2eb8b1");
    gradient.addColorStop(.58, "#19151b");
    gradient.addColorStop(1, "#050506");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1920);
  }
  ctx.save();
  ctx.scale(1, 1920 / 1350);
  drawFeedOverlay(ctx);
  ctx.restore();
  if (media) { drawFeedBlurMask(ctx, 1080, 1920); drawFeedBlurTopGradient(ctx, 1080, 1920); }
  ctx.save();
  ctx.scale(1, 1920 / 1350);
  drawFeedTextures(ctx, true);
  ctx.restore();
  // Keep the Feed typography undistorted, with more space above the copy.
  const shade = ctx.createLinearGradient(0, 850, 0, 1700);
  shade.addColorStop(0, "rgba(0,0,0,0)");
  shade.addColorStop(.6, "rgba(0,0,0,.55)");
  shade.addColorStop(1, "rgba(0,0,0,.75)");
  ctx.fillStyle = shade;
  ctx.fillRect(0, 850, 1080, 1070);
  ctx.save();
  ctx.translate(540, 450);
  ctx.scale(1.1, 1.1);
  ctx.translate(-540, 0);
  drawFeedCopy(ctx);
  ctx.restore();
  drawLogo(ctx);
  drawCircleInset(ctx);
  ctx.restore();
}



// The inset has independent media and crop settings; the same painter is used by exports.
function circleBounds() {
  const c = state.circle, spec = getCurrentFormatSpec(), radius = c.size / 2;
  c.x = clamp(c.x, radius / spec.width, 1 - radius / spec.width);
  c.y = clamp(c.y, radius / spec.height, 1 - radius / spec.height);
  return { x: c.x * spec.width - radius, y: c.y * spec.height - radius, size: c.size };
}

function paintCirclePhoto(ctx) {
  const c = state.circle;
  if (!c.image || !["feed", "stories"].includes(state.format)) return;
  const { x, y, size } = { x: 0, y: 0, size: c.size };
  const cover = Math.min(1, size / Math.min(c.image.naturalWidth, c.image.naturalHeight));
  ctx.save();
  ctx.filter = "none";
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
  ctx.beginPath();
  ctx.arc(x + size / 2, y + size / 2, size / 2 - 1, 0, Math.PI * 2);
  ctx.clip();
  drawImageCoverTransformed(ctx, c.image, x, y, size, size, cover * c.zoom, c.panX * size, c.panY * size);
  ctx.restore();
  ctx.save();
  ctx.filter = "none";
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
  ctx.beginPath();
  ctx.arc(x + size / 2, y + size / 2, size / 2 - 1, 0, Math.PI * 2);
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
}

function drawCircleInset(ctx, local = false) {
  const c = state.circle;
  if (!c.image || !["feed", "stories"].includes(state.format)) return;
  const bounds = circleBounds(), spec = getCurrentFormatSpec();
  const masked = c.behind && c.mask && c.maskSource === state.feedImage && state.mediaKind === "image";
  const key = [c.size, c.zoom, c.panX, c.panY, bounds.x, bounds.y, spec.height, state.zoom, state.panX, state.panY, Boolean(masked)].join(":");
  if (c.tileKey !== key || c.tileImage !== c.image || c.tileMask !== c.mask) {
    const tile = document.createElement("canvas"); tile.width = tile.height = c.size;
    const painter = tile.getContext("2d");
    paintCirclePhoto(painter);
    if (masked) {
      painter.globalCompositeOperation = "destination-out";
      // Apply exactly the background crop so the hole follows the subject.
      const geometry = EditorCore.imageGeometry(state.feedImage.naturalWidth, state.feedImage.naturalHeight, spec.width, spec.height, state.zoom, state.panX / 100 * spec.width, state.panY / 100 * spec.height);
      painter.drawImage(c.mask, geometry.x - bounds.x, geometry.y - bounds.y, geometry.width, geometry.height);
    }
    c.tile = tile; c.tileKey = key; c.tileImage = c.image; c.tileMask = c.mask;
  }
  ctx.drawImage(c.tile, local ? 0 : bounds.x, local ? 0 : bounds.y);
}

let foregroundWorker = null, foregroundSequence = 0;
const foregroundJobs = new Map();
function analyzeForeground(blob) {
  if (!foregroundWorker) {
    foregroundWorker = new Worker("/assets/vendor/foreground-worker.js", { type: "module" });
    foregroundWorker.onmessage = ({ data }) => {
      const job = foregroundJobs.get(data.id);
      if (!job || data.progress) return;
      foregroundJobs.delete(data.id);
      if (data.error) job.reject(new Error(data.error)); else job.resolve(data.mask);
    };
    foregroundWorker.onerror = () => {
      foregroundJobs.forEach(job => job.reject(new Error("Falha no analisador da imagem")));
      foregroundJobs.clear(); foregroundWorker.terminate(); foregroundWorker = null;
    };
  }
  return new Promise((resolve, reject) => {
    const id = ++foregroundSequence; foregroundJobs.set(id, { resolve, reject });
    foregroundWorker.postMessage({ id, blob });
  });
}

async function ensureCircleForeground() {
  const c = state.circle, source = state.feedImage;
  if (!c.image || !c.behind || !source || state.mediaKind !== "image" || !["feed", "stories"].includes(state.format)) return;
  if (c.maskSource === source && c.mask) return;
  if (c.maskBusy) {
    await c.maskTask;
    if (source !== state.feedImage) return ensureCircleForeground();
    if (c.maskBusy) return c.maskTask;
    return;
  }
  const token = ++c.maskToken;
  c.maskBusy = true;
  const finish = beginMediaLoading("Recortando objeto principal…");
  document.getElementById("circleBehind").setAttribute("aria-busy", "true");
  const input = document.createElement("canvas"), scale = Math.min(1, 1280 / Math.max(source.naturalWidth, source.naturalHeight));
  input.width = Math.round(source.naturalWidth * scale); input.height = Math.round(source.naturalHeight * scale);
  input.getContext("2d").drawImage(source, 0, 0, input.width, input.height);
  c.maskTask = (async () => {
    try {
      // Raw pixels avoid OffscreenCanvas dependencies in Safari's worker environment.
      const pixels = input.getContext("2d").getImageData(0, 0, input.width, input.height);
      const blob = new Blob([pixels.data], { type: `image/x-rgba8;width=${input.width};height=${input.height}` });
      const result = await analyzeForeground(blob);
      const mask = document.createElement("canvas"); mask.width = input.width; mask.height = input.height;
      mask.getContext("2d").putImageData(new ImageData(new Uint8ClampedArray(await result.arrayBuffer()), mask.width, mask.height), 0, 0);
      if (token === c.maskToken && source === state.feedImage) { c.mask = mask; c.maskSource = source; c.tileKey = null; syncCircleInset(); }
      finish(true, "Recorte pronto");
    } catch (error) {
      console.warn("Recorte automático:", error.message);
      finish(false, "Não foi possível recortar. Toque no ícone de camadas para tentar novamente.");
    } finally {
      c.maskBusy = false; c.maskTask = null;
      document.getElementById("circleBehind").setAttribute("aria-busy", "false");
      if (c.image && c.behind && source !== state.feedImage) ensureCircleForeground();
    }
  })();
  return c.maskTask;
}

function syncCircleInset() {
  const node = document.getElementById("circleInset"), c = state.circle;
  elements.shell.classList.toggle("has-circle-image", Boolean(c.image));
  node.hidden = !c.image || !["feed", "stories"].includes(state.format);
  if (node.hidden) return;
  const bounds = circleBounds(), canvas = document.getElementById("circleInsetPreview");
  Object.assign(node.style, { left: `${bounds.x}px`, top: `${bounds.y}px`, width: `${c.size}px`, height: `${c.size}px` });
  canvas.width = canvas.height = c.size;
  drawCircleInset(canvas.getContext("2d"), true);
  document.getElementById("circleSize").value = c.size;
  document.getElementById("circleFrameMode").setAttribute("aria-pressed", String(c.framing));
  node.classList.toggle("is-framing", c.framing);
  const behind = document.getElementById("circleBehind");
  behind.disabled = state.mediaKind === "video";
  behind.setAttribute("aria-pressed", String(c.behind));
  updateStoriesPreview();
  refreshVideoArtwork();
}

function bindCircleInset() {
  const node = document.getElementById("circleInset"), popup = document.getElementById("circlePopover"), input = document.getElementById("circleImageInput");
  const open = () => {
    if (!["feed", "stories"].includes(state.format) || !state.circle.image) return;
    StudioUI.closeOtherPanels("circle");
    closeMediaPopover(); closeTextEditPopover(); popup.hidden = false;
  };
  document.addEventListener("keydown", event => { if (event.key === "Escape") popup.hidden = true; });
  input.addEventListener("change", async () => {
    const file = input.files[0]; input.value = "";
    if (!file) return;
    const c = state.circle, token = ++c.token, url = URL.createObjectURL(file), finish = beginMediaLoading();
    try {
      const image = await loadImage(url);
      if (token !== c.token) { URL.revokeObjectURL(url); finish(true); return; }
      if (c.url) URL.revokeObjectURL(c.url);
      Object.assign(c, { image, url, zoom: 1, panX: 0, panY: 0, framing: false });
      syncCircleInset(); open(); finish(true); ensureCircleForeground();
    } catch { URL.revokeObjectURL(url); finish(false, "Não foi possível abrir essa imagem"); }
  });
  document.getElementById("circleBehind").addEventListener("click", () => {
    const c = state.circle;
    if (c.maskSource === state.feedImage && c.mask) c.behind = !c.behind;
    else c.behind = true;
    syncCircleInset(); if (c.behind) ensureCircleForeground();
  });
  document.getElementById("circleSize").addEventListener("input", event => { state.circle.size = Number(event.target.value); syncCircleInset(); });
  document.getElementById("circleFrameMode").addEventListener("click", () => { state.circle.framing = !state.circle.framing; syncCircleInset(); });
  for (const [id, factor] of [["circleZoomIn", 1.15], ["circleZoomOut", 1 / 1.15]]) {
    document.getElementById(id).addEventListener("click", () => { state.circle.zoom = clamp(state.circle.zoom * factor, 1, 4); syncCircleInset(); });
  }
  document.getElementById("circleClose").addEventListener("click", () => { popup.hidden = true; node.focus({ preventScroll: true }); });
  document.getElementById("circleRemove").addEventListener("click", () => {
    const c = state.circle; ++c.token;
    if (c.url) URL.revokeObjectURL(c.url);
    c.image = null; c.url = ""; popup.hidden = true; syncCircleInset();
    updateStoriesPreview(); refreshVideoArtwork();
  });
  document.addEventListener("pointerdown", event => {
    if (!event.target.closest(".circle-inset, .circle-popover, .circle-upload-action")) popup.hidden = true;
  });
  let drag = null, moved = false;
  node.addEventListener("pointerdown", event => {
    if (event.button !== 0 || drag) return;
    event.stopPropagation();
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY }; moved = false;
    node.setPointerCapture(event.pointerId);
  });
  node.addEventListener("pointermove", event => {
    if (!drag || drag.id !== event.pointerId) return;
    event.stopPropagation();
    const scale = elements.stage.getBoundingClientRect().width / getCurrentFormatSpec().width;
    const dx = (event.clientX - drag.x) / scale, dy = (event.clientY - drag.y) / scale, c = state.circle;
    if (Math.abs(dx) + Math.abs(dy) < 2) return;
    moved = true;
    if (c.framing) {
      const cover = Math.min(1, c.size / Math.min(c.image.naturalWidth, c.image.naturalHeight));
      const g = EditorCore.imageGeometry(c.image.naturalWidth, c.image.naturalHeight, c.size, c.size, cover * c.zoom, c.panX * c.size + dx, c.panY * c.size + dy);
      c.panX = g.panX / c.size; c.panY = g.panY / c.size;
    } else { c.x += dx / getCurrentFormatSpec().width; c.y += dy / getCurrentFormatSpec().height; }
    drag.x = event.clientX; drag.y = event.clientY;
    syncCircleInset();
  });
  for (const type of ["pointerup", "pointercancel", "lostpointercapture"]) node.addEventListener(type, event => {
    event.stopPropagation();
    if (drag?.id === event.pointerId) {
      drag = null;
      if (type === "pointerup" && event.pointerType === "touch" && !moved) open();
    }
  });
  node.addEventListener("click", event => { event.stopPropagation(); if (!moved) open(); });
  node.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); event.stopPropagation(); open(); }
    const step = event.shiftKey ? 20 : 5, c = state.circle;
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
      event.preventDefault(); event.stopPropagation();
      c.x += (event.key === "ArrowLeft" ? -step : event.key === "ArrowRight" ? step : 0) / getCurrentFormatSpec().width;
      c.y += (event.key === "ArrowUp" ? -step : event.key === "ArrowDown" ? step : 0) / getCurrentFormatSpec().height;
      syncCircleInset();
    }
    if (event.key === "Escape") popup.hidden = true;
  });
}


async function applyTitleHighlight(start, end) {
  const input = elements.titleInput;
  const text = input.value;
  const next = EditorCore.toggleRange(state.titleHighlights, start, end);
  if (EditorCore.isFullyHighlighted(text, next)) {
    const dialog = document.getElementById("fullHighlightWarning");
    if (dialog.open) return;
    await new Promise(resolve => {
      dialog.returnValue = "correct";
      dialog.addEventListener("close", resolve, { once: true });
      dialog.showModal();
    });
    input.focus({ preventScroll: true });
    if (input.value !== text) return;
    input.setSelectionRange(start, end);
    return;
  }
  const beforeHighlight = { ranges: state.titleHighlights, color: state.titleHighlightColor, text };
  state.titleHighlights = next;
  if (state.titleHighlightColor === "none") state.titleHighlightColor = "pink";
  document.querySelectorAll(".color-chip").forEach(chip => {
    const active = chip.dataset.color === state.titleHighlightColor;
    chip.classList.toggle("is-active", active);
    chip.setAttribute("aria-pressed", String(active));
  });
  updateFeedText();
  EditorHistory.record(beforeHighlight, { ranges: next, color: state.titleHighlightColor, text }, snapshot => {
    state.titleHighlights = EditorCore.remapRanges(snapshot.text, elements.titleInput.value, snapshot.ranges); state.titleHighlightColor = snapshot.color; updateFeedText();
  }, "Alterar tarja");
  setStatus("Tarja atualizada no trecho selecionado");
}


function informativeBoardSnapshot() { return { pages: [...state.informativePages], active: state.activeInformativePage }; }
function restoreInformativeBoards(snapshot) {
  state.informativePages.forEach(page => page.infoVideo?.pause());
  state.informativePages = [...snapshot.pages];
  selectInformativePage(snapshot.active);
}
function addInformativePage() {
  if (state.exportingVideo || state.informativePages.length >= MAX_INFORMATIVE_PAGES) return;
  const before = informativeBoardSnapshot();
  state.artboardFocused = false;
  state.informativePages.push(createInformativePage());
  selectInformativePage(state.informativePages.length - 1);
  EditorHistory.record(before, informativeBoardSnapshot(), restoreInformativeBoards, "Adicionar prancheta informativa");
  setStatus(`Página informativa ${state.informativePages.length} de ${MAX_INFORMATIVE_PAGES} adicionada`);
}
function removeInformativePage(index = state.activeInformativePage) {
  if (state.exportingVideo) return;
  if (index === 0) { setStatus("A primeira prancheta é fixa."); return; }
  if (state.informativePages.length <= 1) { setStatus("Mantenha pelo menos uma prancheta."); return; }
  const before = informativeBoardSnapshot();
  const selected = state.informativePages[state.activeInformativePage];
  state.informativePages[index].infoVideo?.pause();
  state.informativePages.splice(index, 1);
  const next = state.informativePages.indexOf(selected);
  selectInformativePage(next < 0 ? Math.min(index, state.informativePages.length - 1) : next);
  EditorHistory.record(before, informativeBoardSnapshot(), restoreInformativeBoards, "Excluir prancheta informativa");
}
function bindEditorShortcuts() {
  document.addEventListener("keydown", event => {
    const target = event.target;
    if (event.defaultPrevented || event.isComposing || target.closest('textarea, select, [contenteditable], dialog[open], input:not([type="range"]):not([type="checkbox"]):not([type="button"])')) return;
    if (state.exportingVideo || elements.exportButton.disabled || document.querySelector("dialog[open]")) return;
    const mod = event.ctrlKey || event.metaKey, key = event.key.toLowerCase();
    if (mod && (key === "z" || key === "y")) {
      event.preventDefault();
      const redo = key === "y" || event.shiftKey;
      const label = redo ? EditorHistory.redo() : EditorHistory.undo();
      setStatus(label ? `${redo ? "Refeito" : "Desfeito"}: ${label}` : "Nenhuma alteração para desfazer ou refazer.");
    } else if (!mod && !event.altKey && event.key === "Delete") {
      if (!["informative", "polaroid"].includes(state.format)) return;
      event.preventDefault();
      state.format === "informative" ? removeInformativePage() : PolaroidStudio.removeActive();
    } else if (mod && event.shiftKey && key === "n") {
      if (!["informative", "polaroid"].includes(state.format)) return;
      event.preventDefault();
      state.format === "informative" ? addInformativePage() : PolaroidStudio.add();
    } else if (mod && event.key === "Enter") {
      event.preventDefault(); void exportPrimary();
    } else if (!mod && !event.altKey && ["ArrowLeft", "ArrowRight"].includes(event.key) && target.closest(".stage-host")) {
      if (!["informative", "polaroid"].includes(state.format)) return;
      event.preventDefault(); const delta = event.key === "ArrowLeft" ? -1 : 1;
      if (state.format === "polaroid") PolaroidStudio.selectRelative(delta);
      else selectInformativePage(Math.max(0, Math.min(state.informativePages.length - 1, state.activeInformativePage + delta)));
    }
  });
}
