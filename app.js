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
const TITLE_LINE_GAP = 4.5968;
const TITLE_HIGHLIGHT_PADDING = Object.freeze({ left: 10, right: 10, top: 5.46, bottom: 5.46 });

function getFeedTypography(role) {
  const value = feedTypography[role];
  const fontSize = value.size * 4 / 3;
  return { fontSize, tracking: fontSize * value.tracking / 1000, lineHeight: fontSize * value.leading };
}

const FORMATS = {
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
  formatButtons: Array.from(document.querySelectorAll(".format-option")),
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
  format: "feed",
  videoUrl: "",
  videoName: "",
  feedImageUrl: "",
  feedImageName: "",
  feedImageObjectUrl: "",
  feedImage: null,
  infoImageUrl: "",
  infoImageName: "",
  infoImageObjectUrl: "",
  infoImage: null,
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
    story: { width: 220, x: 0, y: 1710, opacity: 100 },
    feed: { width: FEED.logo.width, x: FEED.logo.x, y: FEED.logo.y, opacity: FEED.logo.opacity },
    informative: { width: INFORMATIVE.logo.width, x: INFORMATIVE.logo.x, y: INFORMATIVE.logo.y, opacity: INFORMATIVE.logo.opacity },
  },
  titleHighlightColor: "yellow",
  activeDockPanel: "media",
};

const HIGHLIGHT_COLORS = {
  yellow: "#dfc330",
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

init();

async function init() {
  elements.exportLabel.textContent = "Exportar PNG";

  elements.background = await loadImage("./assets/black-texture.jpg");
  state.background = elements.background;
  state.kickerImage = await loadImage("./assets/mundo-soldier-branca.png");
  state.informativeSymbols = await loadImage("./assets/informative-linkin-park-logos.png");
  state.kickerMode = "image";

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
  applyFormat("feed", { keepPanel: true });
  document.body.classList.remove("mobile-controls-open");
  await applyLogo("/assets/logos/LOGO%201%20MONO.png", "Linkin Park Zero Brasil", "Logo padrão");
  await loadFeedTextures();
  loadRandomFeedImage({ silent: true });
  updateStageScale();
  updateText();
  updateFeedText();
  updateMediaTransform();
  updateLogoTransform();
  requestAnimationFrame(updateControlPanelFade);
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
  document.getElementById("mobileSheetBackdrop").addEventListener("click", () => document.body.classList.remove("mobile-controls-open"));
  document.querySelectorAll("[data-canvas-zoom]").forEach(button => button.addEventListener("click", () => {
    const factor = button.dataset.canvasZoom === "in" ? 1.15 : 1 / 1.15;
    if (state.format === "informative") state.infoZoom *= factor;
    else if (state.format === "feed") state.zoom *= factor;
    updateMediaTransform();
  }));
  const infoBoldButton = document.getElementById("mobileInfoBold");
  infoBoldButton.addEventListener("pointerdown", event => event.preventDefault());
  infoBoldButton.addEventListener("click", () => {
    const { selectionStart: start, selectionEnd: end } = elements.infoBodyInput;
    if (start === end) { setStatus("Selecione um trecho para aplicar negrito"); return; }
    state.infoBodyBold = EditorCore.toggleRange(state.infoBodyBold, start, end);
    updateInformativeText();
  });
  document.getElementById("workspaceImageButton").addEventListener("click", () => {
    if (state.format === "informative") { elements.informativeImageInput.click(); return; }
    setActiveDockPanel("media");
    elements.controlPanelShell.scrollTop = 0;
  });
  document.getElementById("closingImageInput").addEventListener("change", async event => {
    const file = event.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    try {
      const image = await loadImage(url);
      state.closingImage = image;
      updateClosingPreview();
      setStatus("Imagem do encerramento atualizada");
    } catch { setStatus("Não foi possível abrir essa imagem"); }
    finally { URL.revokeObjectURL(url); event.target.value = ""; }
  });
  document.getElementById("closingUseFeed").addEventListener("click", () => {
    state.closingImage = null;
    updateClosingPreview();
    setStatus("Encerramento vinculado à imagem do Feed");
  });
  bindDirectImageControls();
  bindSubtitleContextBold();
  bindTextEditPopover();
  elements.stage.addEventListener("click", (event) => {
    const target = (state.previewClickTarget || event.target).closest(".logo-layer, .headline-strip, .feed-title-layer, .feed-subtitle, .feed-kicker, .informative-title, .informative-body");
    state.previewClickTarget = null;
    const selection = target?.matches(".logo-layer") ? "logo" : target?.matches(".feed-subtitle") ? "subtitle" : target?.matches(".feed-kicker") ? "kicker" : target?.matches(".informative-title") ? "infoTitle" : target?.matches(".informative-body") ? "infoBody" : target ? "title" : "media";
    if (selection === "logo") return;
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
    button.addEventListener("click", () => applyFormat(button.dataset.format));
  });

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
      const selection = button.dataset.editText;
      const bounds = button.getBoundingClientRect();
      selectPreviewElement(selection);
      openTextEditPopover(selection, { clientX: bounds.right, clientY: bounds.top });
    });
  });
  document.getElementById("kickerModeInput")?.addEventListener("change", event => {
    state.kickerMode = event.target.value;
    updateFeedText();
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
    state.titleHighlights = EditorCore.toggleRange(state.titleHighlights, start, end);
    if (state.titleHighlightColor === "none") {
      state.titleHighlightColor = "yellow";
      document.querySelectorAll(".color-chip").forEach(chip => chip.classList.toggle("is-active", chip.dataset.color === "yellow"));
    }
    updateFeedText();
    setStatus("Tarja atualizada no trecho selecionado");
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
      state.titleHighlightColor = chip.dataset.color || "yellow";
      chips.forEach((btn) => {
        btn.classList.toggle("is-active", btn.dataset.color === state.titleHighlightColor);
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

async function togglePreviewPlayback() {
  if (!state.videoUrl) return;
  if (elements.video.paused) {
    await elements.video.play();
  } else {
    elements.video.pause();
  }
  updatePlaybackIcons();
}

function togglePreviewMute() {
  elements.video.muted = !elements.video.muted;
  updatePlaybackIcons();
}

function applyFormat(format, options = {}) {
  if (!FORMATS[format]) return;

  if (format === state.format && !options.keepPanel) {
    elements.formatButtons.forEach((button) => {
      const isActive = button.dataset.format === format;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
    return;
  }

  saveLogoSettingsForCurrentFormat();
  state.format = format;
  document.getElementById("workspaceImageButton").textContent = format === "informative" ? "Imagem do vetor" : "Imagem de fundo";
  document.body.classList.remove("mobile-controls-open");
  closeTextEditPopover();
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    elements.frame.animate([{ opacity: .45 }, { opacity: 1 }], { duration: 240, easing: "ease-out" });
  }
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
  requestAnimationFrame(updateControlPanelFade);
}

function getCurrentFormatSpec() {
  return FORMATS[state.format] || FORMATS.story;
}

function updateStageScale() {
  const stageHost = elements.frame.closest(".stage-host");
  const spec = getCurrentFormatSpec();
  const hostStyle = getComputedStyle(stageHost);
  const availableWidth = Math.max(100, stageHost.clientWidth - parseFloat(hostStyle.paddingLeft) - parseFloat(hostStyle.paddingRight));
  const availableHeight = Math.max(100, stageHost.clientHeight - parseFloat(hostStyle.paddingTop) - parseFloat(hostStyle.paddingBottom));
  const scale = Math.min(availableWidth / spec.width, availableHeight / spec.height, 0.72);
  const width = Math.ceil(spec.width * scale);
  const height = Math.ceil(spec.height * scale);
  stageHost.style.justifyContent = width > availableWidth ? "flex-start" : "center";
  stageHost.style.alignItems = height > availableHeight ? "flex-start" : "center";
  elements.stage.style.transform = `scale(${scale})`;
  elements.stage.style.left = "0";
  elements.stage.style.marginLeft = "0";
  elements.frame.style.width = `${width}px`;
  elements.frame.style.height = `${height}px`;
}

function handleVideoUpload(event) {
  const [file] = event.target.files;
  if (!file) return;

  if (state.videoUrl) {
    URL.revokeObjectURL(state.videoUrl);
  }

  state.videoUrl = URL.createObjectURL(file);
  state.videoName = file.name;
  elements.video.src = state.videoUrl;
  elements.video.currentTime = 0;
  elements.video.muted = true;
  elements.video.loop = true;
  elements.slot.classList.add("has-media");
  elements.fileMain.textContent = file.name;
  elements.fileSub.textContent = formatFileSize(file.size);
  if (elements.trackTitle) elements.trackTitle.textContent = file.name;
  if (elements.trackSub) elements.trackSub.textContent = formatFileSize(file.size);
  setStatus("Video carregado");
  updatePlaybackIcons();
}

function handleFeedImageUpload(event) {
  const [file] = event.target.files;
  if (!file) return;

  const url = URL.createObjectURL(file);
  applyFeedImage(url, file.name, formatFileSize(file.size), true);
  applyFormat("feed");
}

async function loadRandomFeedImage(options = {}) {
  if (!elements.feedImage) return;

  const seed = `${Date.now()}-${Math.round(Math.random() * 100000)}`;
  const url = `/api/random-feed-image?seed=${encodeURIComponent(seed)}`;

  try {
    await applyFeedImage(url, "Foto de exemplo", "Envie sua foto para personalizar.", false);
    if (!options.silent) {
      applyFormat("feed");
      setStatus("Foto de exemplo aplicada");
    }
  } catch (error) {
    console.warn("Nao consegui carregar imagem aleatoria", error);
    if (!options.silent) {
      setStatus("Não foi possível carregar a foto. Tente novamente ou envie uma imagem.");
    }
  }
}

async function applyFeedImage(url, name, meta, isObjectUrl = false) {
  try {
    const image = await loadImage(url);

    if (state.feedImageObjectUrl && state.feedImageObjectUrl !== url) {
      URL.revokeObjectURL(state.feedImageObjectUrl);
    }

    state.feedImageUrl = url;
    state.feedImageName = name || "Imagem do feed";
    state.feedImageObjectUrl = isObjectUrl ? url : "";
    state.feedImage = image;
    updateClosingPreview();
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
    if (state.format === "feed" || state.format === "informative") {
      elements.trackTitle.textContent = state.feedImageName;
      elements.trackSub.textContent = meta || "Feed 1080 x 1350";
    }
  } catch (error) {
    if (isObjectUrl) {
      URL.revokeObjectURL(url);
    }
    throw error;
  }
}

function updateText() {
  const layouts = getTitleLayouts();
  const highlightColor = HIGHLIGHT_COLORS[state.titleHighlightColor] || HIGHLIGHT_COLORS.yellow;

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

function updateFeedText() {
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
  if (imageKicker) {
    const image = document.createElement("img");
    image.src = state.kickerImage.src;
    image.alt = "Mundo Soldier";
    image.draggable = false;
    elements.feedKickerPreview.replaceChildren(image);
  }
  const layouts = getFeedTitleLayouts();
  const kickerOffset = layouts[0].y - (FEED.title.top - 6.6);
  elements.feedKickerPreview.style.top = `${(imageKicker ? 735 : 737.35) + kickerOffset}px`;
  renderFeedSubtitlePreview(layouts);

  const highlightColor = HIGHLIGHT_COLORS[state.titleHighlightColor] || HIGHLIGHT_COLORS.yellow;

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
    strip.style.top = `${layout.y - FEED.title.top}px`;
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

function applyFeedSubtitleWeight(weight) {
  applySubtitleSelectionMark("bold", weight === "bold");
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

function getSubtitlePlainText() {
  const raw = elements.feedSubtitleInput?.innerText ?? elements.feedSubtitleInput?.textContent ?? "";
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

function applySubtitleSelectionMark(property, value) {
  const selection = getSubtitleSelectionOffsets();
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

  const start = startRange.toString().length;
  const end = endRange.toString().length;
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
  const padding = getTitlePadding();
  const referenceMetrics = getTitleGlyphMetrics("ÁÉÍÓÚÂÊÔÃÕÇ", fontSize);
  const commonHeight = referenceMetrics.ascent + referenceMetrics.descent + padding.top + padding.bottom;
  const gap = TITLE_LINE_GAP;
  const blockHeight = layouts.length * commonHeight + Math.max(0, layouts.length - 1) * gap;
  if ((layouts.length > 4 && fontSize > 46) || (blockHeight > FEED.title.maxBottom - FEED.title.minTop && fontSize > 28)) {
    return getFeedTitleLayouts(fontSize - 1);
  }
  const top = Math.min(FEED.title.top - 6.6, FEED.title.maxBottom - blockHeight);
  layouts.forEach((layout, index) => {
    const metrics = getTitleGlyphMetrics(layout.text, layout.fontSize);
    layout.y = top + index * (commonHeight + gap);
    layout.height = commonHeight;
    layout.baselineY = layout.y + commonHeight / 2 + (metrics.ascent - metrics.descent) / 2;
    layout.highlightRects = getTitleHighlightRects(layout, layout.highlightMarks);
  });
  return layouts.length ? layouts : [{ ...getFeedLineLayout(" ", 0, fontSize, FEED.title.minFontSize), highlightRects: [] }];
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
      x: left + offset * layout.scaleX - padding.left,
      y: layout.y,
      width: width + padding.left + padding.right,
      height: layout.height,
    });
    start = end;
  }
  return rectangles;
}

function handleInformativeImageUpload(event) {
  const [file] = event.target.files;
  if (!file) return;
  const url = URL.createObjectURL(file);
  applyInformativeImage(url, file.name, formatFileSize(file.size), true).catch(() => {
    URL.revokeObjectURL(url);
    setStatus("Não foi possível carregar a imagem do bloco.");
  });
}

async function applyInformativeImage(url, name, meta, isObjectUrl = false) {
  try {
    const image = await loadImage(url);
    if (state.infoImageObjectUrl && state.infoImageObjectUrl !== url) URL.revokeObjectURL(state.infoImageObjectUrl);
    state.infoImageUrl = url;
    state.infoImageName = name || "Imagem do bloco";
    state.infoImageObjectUrl = isObjectUrl ? url : "";
    state.infoImage = image;
    state.infoZoom = 1;
    state.infoPanX = 0;
    state.infoPanY = 0;
    if (elements.informativeImage) elements.informativeImage.src = url;
    elements.feedLayer?.classList.add("has-informative-image");
    if (elements.informativeImageMain) elements.informativeImageMain.textContent = state.infoImageName;
    if (elements.informativeImageSub) elements.informativeImageSub.textContent = meta || "Imagem independente aplicada";
    if (state.format === "informative" && elements.trackSub) {
      elements.trackTitle.textContent = state.infoImageName;
      elements.trackSub.textContent = "Bloco pronto";
    }
    updateMediaTransform();
    setStatus("Imagem do bloco aplicada na máscara");
  } catch (error) {
    if (isObjectUrl) URL.revokeObjectURL(url);
    throw error;
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
  const lineMetrics = getTitleGlyphMetrics(safeText, fontSize);
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
  strip.animate(
    [
      { opacity: 0.72, transform: "translateY(-20px) scale(0.975)" },
      { opacity: 1, transform: "translateY(0) scale(1)" },
    ],
    {
      duration: 460,
      easing: "cubic-bezier(0.2, 0.9, 0.2, 1)",
      fill: "none",
    },
  );
}

function updateMediaTransform() {
  if (state.format === "closing") { updateClosingPreview(); return; }
  const isInformative = state.format === "informative";
  const mediaBox = isInformative ? INFORMATIVE.image : state.format === "feed" ? FEED : STORY.video;
  if (state.format === "feed" && state.feedImage) {
    const geometry = EditorCore.imageGeometry(state.feedImage.naturalWidth, state.feedImage.naturalHeight, FEED.width, FEED.height, state.zoom, state.panX / 100 * FEED.width, state.panY / 100 * FEED.height);
    state.zoom = geometry.zoom;
    state.panX = geometry.panX / FEED.width * 100;
    state.panY = geometry.panY / FEED.height * 100;
    [elements.feedImage, elements.feedBlurImage].forEach(image => {
      if (!image) return;
      image.style.width = `${geometry.baseWidth}px`;
      image.style.height = `${geometry.baseHeight}px`;
    });
  }
  if (isInformative && state.infoImage) {
    const geometry = EditorCore.imageGeometry(state.infoImage.naturalWidth, state.infoImage.naturalHeight, INFORMATIVE.image.width, INFORMATIVE.image.height, state.infoZoom, state.infoPanX / 100 * INFORMATIVE.image.width, state.infoPanY / 100 * INFORMATIVE.image.height);
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
  updateRangeOutput(elements.zoomInput, elements.zoomValue);
  updateRangeOutput(elements.panXInput, elements.panXValue);
  updateRangeOutput(elements.panYInput, elements.panYValue);
  updateFeedEffectStyles();
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
  try {
    const image = await loadImage(url);

    if (state.logoObjectUrl && state.logoObjectUrl !== url) {
      URL.revokeObjectURL(state.logoObjectUrl);
    }

    state.logoUrl = url;
    state.logoName = name || "Logo aplicada";
    state.logoImage = image;
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
  elements.togglePlayback.classList.toggle("is-playing", !elements.video.paused);
  elements.toggleMute.classList.toggle("is-muted", elements.video.muted);
  elements.panelPlayButton?.classList.toggle("is-playing", !elements.video.paused);
  elements.panelMuteButton?.classList.toggle("is-muted", elements.video.muted);
}

async function exportPrimary() {
  if (["feed", "informative", "closing"].includes(state.format)) {
    await exportFeedPng();
    return;
  }

  await exportStoryVideo();
}

async function exportCurrentPng() {
  if (["feed", "informative", "closing"].includes(state.format)) {
    await exportFeedPng();
    return;
  }

  await exportStoryPng();
}

async function exportStoryVideo() {
  if (!state.videoUrl) {
    setStatus("Selecione um video primeiro");
    return;
  }

  elements.exportButton.disabled = true;
  elements.progress.value = 0;
  setStatus("Preparando render");

  const exportVideo = document.createElement("video");
  exportVideo.src = state.videoUrl;
  exportVideo.playsInline = true;
  exportVideo.preload = "auto";
  exportVideo.loop = false;
  exportVideo.muted = false;
  exportVideo.volume = 0;

  let audioContext = null;

  try {
    await waitForVideo(exportVideo);
    const duration = Number.isFinite(exportVideo.duration) && exportVideo.duration > 0 ? exportVideo.duration : 8;
    const stream = elements.canvas.captureStream(30);

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioContext = new AudioContextClass();
        const source = audioContext.createMediaElementSource(exportVideo);
        const destination = audioContext.createMediaStreamDestination();
        source.connect(destination);
        destination.stream.getAudioTracks().forEach((track) => stream.addTrack(track));
        await audioContext.resume();
      }
    } catch (error) {
      tryAddCapturedAudio(exportVideo, stream);
    }

    if (!stream.getAudioTracks().length) {
      tryAddCapturedAudio(exportVideo, stream);
    }

    const chunks = [];
    const recorder = new MediaRecorder(stream, {
      mimeType: state.exportMime,
      videoBitsPerSecond: 9_000_000,
      audioBitsPerSecond: 192_000,
    });

    recorder.addEventListener("dataavailable", (event) => {
      if (event.data && event.data.size) {
        chunks.push(event.data);
      }
    });

    const stopped = new Promise((resolve) => {
      recorder.addEventListener("stop", resolve, { once: true });
    });

    recorder.start(500);
    setStatus("Renderizando video");
    await exportVideo.play();
    await renderUntilEnd(exportVideo, duration);

    if (recorder.state !== "inactive") {
      recorder.stop();
    }
    await stopped;

    const blob = new Blob(chunks, { type: state.exportMime });
    const saved = await downloadExport(blob, makeExportName());
    setStatus(`${state.exportExt.toUpperCase()} — download iniciado: ${saved.fileName}`);
  } catch (error) {
    console.error(error);
    setStatus("Nao consegui renderizar este video");
  } finally {
    exportVideo.pause();
    if (audioContext) {
      audioContext.close().catch(() => {});
    }
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
  } finally {
    elements.pngExportButton.disabled = false;
  }
}

async function exportFeedPng() {
  elements.exportButton.disabled = true;
  elements.pngExportButton.disabled = true;
  setStatus("Preparando PNG do feed");

  try {
    updateFeedText();
    updateInformativeText();
    if (state.format === "closing") drawClosingFrame(renderContext);
    else if (state.format === "informative") drawInformativeFrame(renderContext);
    else drawFeedFrame(renderContext);
    const blob = await canvasToBlob(elements.canvas, "image/png");
    const saved = await downloadExport(blob, makeFeedExportName());
    setStatus(`${state.format === "closing" ? "PNG encerramento" : state.format === "informative" ? "PNG informativo" : "PNG do feed"} — download iniciado: ${saved.fileName}`);
  } catch (error) {
    console.error(error);
    setStatus("Nao consegui gerar o PNG do feed");
  } finally {
    elements.exportButton.disabled = false;
    elements.pngExportButton.disabled = false;
  }
}

function renderUntilEnd(video, duration) {
  return new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (!done) {
        done = true;
        drawFrame(video);
        resolve();
      }
    };

    video.addEventListener("ended", finish, { once: true });

    const tick = () => {
      if (done) return;
      drawFrame(video);
      elements.progress.value = Math.min(1, video.currentTime / duration);

      if (video.ended || video.currentTime >= duration - 0.05) {
        finish();
        return;
      }

      requestAnimationFrame(tick);
    };

    tick();
  });
}

function drawFrame(video) {
  if (["feed", "informative", "closing"].includes(state.format)) {
    if (state.format === "closing") drawClosingFrame(renderContext);
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
  ctx.save();
  ctx.fillStyle = "#07070a";
  ctx.fillRect(0, 0, FEED.width, FEED.height);

  if (state.feedImage) {
    ctx.filter = "contrast(1.07) saturate(1.08) brightness(0.9)";
    drawImageCoverTransformed(
      ctx,
      state.feedImage,
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
  if (state.feedImage) {
    drawFeedBlurMask(ctx);
    drawFeedBlurTopGradient(ctx);
  }
  drawFeedTextures(ctx);
  drawFeedCopy(ctx);
  drawLogo(ctx);
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

function drawFeedBlurMask(ctx) {
  if (!state.feedImage || !feedEffectContext) return;

  ensureCanvasSize(feedEffectCanvas, FEED.width, FEED.height);
  const fx = feedEffectContext;
  fx.clearRect(0, 0, FEED.width, FEED.height);

  fx.save();
  fx.filter = `blur(${clamp(Number(state.maskBlur) || 0, 0, 120)}px)`;
  drawImageCoverTransformed(
    fx,
    state.feedImage,
    0,
    0,
    FEED.width,
    FEED.height,
    state.zoom,
    (state.panX / 100) * FEED.width,
    (state.panY / 100) * FEED.height,
  );
  fx.restore();

  fx.save();
  fx.globalCompositeOperation = "destination-in";
  const mask = fx.createLinearGradient(0, 0, 0, FEED.height);
  mask.addColorStop(0, "rgba(0,0,0,0)");
  mask.addColorStop(0.52, "rgba(0,0,0,0)");
  mask.addColorStop(0.68, "rgba(0,0,0,0.36)");
  mask.addColorStop(1, "rgba(0,0,0,1)");
  fx.fillStyle = mask;
  fx.fillRect(0, 0, FEED.width, FEED.height);
  fx.restore();

  ctx.drawImage(feedEffectCanvas, 0, 0);
}

function drawFeedBlurTopGradient(ctx) {
  const opacity = clamp(Number(state.blurGradientOpacity) || 0, 0, 100) / 100;
  if (opacity <= 0) return;

  const startY = 0;
  const softShade = ctx.createLinearGradient(0, startY, 0, FEED.height);
  softShade.addColorStop(0, "rgba(0,0,0,0)");
  softShade.addColorStop(0.44, "rgba(0,0,0,0)");
  softShade.addColorStop(0.66, `rgba(0,0,0,${opacity * 0.42})`);
  softShade.addColorStop(0.82, `rgba(0,0,0,${opacity})`);
  softShade.addColorStop(1, `rgba(0,0,0,${opacity})`);
  ctx.fillStyle = softShade;
  ctx.fillRect(0, startY, FEED.width, FEED.height - startY);
}

function drawFeedTextures(ctx) {
  drawFeedTexture(ctx, state.feedTextureExclusionImage, "exclusion", 0.38);
  drawFeedTexture(ctx, state.feedTextureSoftLightImage, "soft-light", 0.49);
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
  const kickerOffset = titleLayouts[0].y - (FEED.title.top - 6.6);
  if (state.kickerMode === "image" && state.kickerImage) {
    const width = 430;
    const height = width * state.kickerImage.naturalHeight / state.kickerImage.naturalWidth;
    ctx.drawImage(state.kickerImage, (FEED.width - width) / 2, 735 + kickerOffset - height, width, height);
  } else {
    drawTrackedTextWithFont(ctx, normalizeLine(elements.feedKickerInput.value || "CHAPEU"), FEED.width / 2, 737.35 + kickerOffset, kicker.tracking, `400 ${kicker.fontSize}px Gotham, Montserrat, "Segoe UI", Arial, sans-serif`);
  }

  const highlightColor = HIGHLIGHT_COLORS[state.titleHighlightColor] || HIGHLIGHT_COLORS.yellow;

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
  const highlightColor = HIGHLIGHT_COLORS[state.titleHighlightColor] || HIGHLIGHT_COLORS.yellow;

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
  const imageRatio = image.width / image.height;
  const targetRatio = width / height;
  let sourceWidth = image.width;
  let sourceHeight = image.height;
  let sourceX = 0;
  let sourceY = 0;

  if (imageRatio > targetRatio) {
    sourceWidth = image.height * targetRatio;
    sourceX = (image.width - sourceWidth) / 2;
  } else {
    sourceHeight = image.width / targetRatio;
    sourceY = (image.height - sourceHeight) / 2;
  }

  ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
}

function drawImageCoverTransformed(ctx, image, x, y, width, height, zoom = 1, panX = 0, panY = 0) {
  const geometry = EditorCore.imageGeometry(image.naturalWidth || image.width, image.naturalHeight || image.height, width, height, zoom, panX, panY);
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

function pickRecorderMime() {
  const types = [
    'video/mp4;codecs="avc1.42E01E,mp4a.40.2"',
    "video/mp4;codecs=h264,aac",
    "video/mp4",
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
  ];

  return types.find((type) => MediaRecorder.isTypeSupported(type)) || "";
}

function tryAddCapturedAudio(video, stream) {
  const capture = video.captureStream || video.mozCaptureStream;
  if (!capture) return;

  try {
    const captured = capture.call(video);
    captured.getAudioTracks().forEach((track) => stream.addTrack(track));
  } catch (error) {
    console.warn("Audio capture unavailable", error);
  }
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
  return `${base || "feed"}-lpz-zero-${state.format === "closing" ? "encerramento" : state.format === "informative" ? "informativo" : "feed"}.png`;
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
    media: ["feed", "informative", "closing"].includes(state.format) ? "#feedImage" : "#videoSlot",
    title: state.format === "feed" ? "#feedTitleLayer" : state.format === "informative" ? "#informativeTitlePreview" : "#titleLayer .headline-strip",
    text: state.format === "feed" ? "#feedTitleLayer" : state.format === "informative" ? "#informativeBodyPreview" : "#titleLayer .headline-strip",
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
    applyFeedSubtitleWeight(allBold ? "regular" : "bold");
    setStatus(allBold ? "Negrito removido do trecho selecionado" : "Negrito aplicado ao trecho selecionado");
  });
}
function bindDirectImageControls() {
  const stage = elements.stage;
  let drag = null;
  let moved = false;
  const isImageTarget = (target) => {
    if (state.format === "closing") return false;
    if (state.format === "informative") return Boolean(target.closest(".informative-image-window")) && !target.closest("button, input");
    return !target.closest("button, input, textarea, [contenteditable=true], .informative-title, .informative-body, .feed-title-layer, .feed-subtitle, .feed-kicker, .logo-layer");
  };
  const sync = () => updateMediaTransform();
  stage.addEventListener("pointerdown", (event) => {
    const activeImage = state.format === "informative" ? state.infoImage : state.feedImage;
    if (event.button !== 0 || !activeImage || !isImageTarget(event.target)) return;
    event.preventDefault();
    state.previewClickTarget = event.target;
    const rect = stage.getBoundingClientRect();
    const frameWidth = state.format === "informative" ? INFORMATIVE.image.width : FEED.width;
    const frameHeight = state.format === "informative" ? INFORMATIVE.image.height : FEED.height;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, panX: state.format === "informative" ? state.infoPanX : state.panX, panY: state.format === "informative" ? state.infoPanY : state.panY, scale: rect.width / (state.format === "informative" ? INFORMATIVE.width : FEED.width), frameWidth, frameHeight };
    moved = false;
    stage.setPointerCapture(event.pointerId);
    stage.classList.add("is-dragging");
  });
  stage.addEventListener("pointermove", (event) => {
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
    if (!drag || event.pointerId !== drag.id) return;
    const currentX = state.format === "informative" ? state.infoPanX : state.panX;
    const currentY = state.format === "informative" ? state.infoPanY : state.panY;
    if (moved && currentX === drag.panX && currentY === drag.panY) {
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
    const activeImage = state.format === "informative" ? state.infoImage : state.feedImage;
    if (!activeImage || !isImageTarget(event.target)) return;
    event.preventDefault();
    const rect = stage.getBoundingClientRect();
    const frameWidth = state.format === "informative" ? INFORMATIVE.image.width : FEED.width;
    const frameHeight = state.format === "informative" ? INFORMATIVE.image.height : FEED.height;
    const currentZoom = state.format === "informative" ? state.infoZoom : state.zoom;
    const currentPanX = state.format === "informative" ? state.infoPanX : state.panX;
    const currentPanY = state.format === "informative" ? state.infoPanY : state.panY;
    const x = (event.clientX - rect.left) / rect.width * (state.format === "informative" ? INFORMATIVE.width : FEED.width) - frameWidth / 2 - (state.format === "informative" ? INFORMATIVE.image.x : 0);
    const y = (event.clientY - rect.top) / rect.height * (state.format === "informative" ? INFORMATIVE.height : FEED.height) - frameHeight / 2 - (state.format === "informative" ? INFORMATIVE.image.y : 0);
    const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? rect.height : 1);
    const next = EditorCore.imageGeometry(activeImage.naturalWidth, activeImage.naturalHeight, frameWidth, frameHeight, currentZoom * Math.exp(-delta * 0.0015)).zoom;
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
  document.getElementById("closeTextEditPopover").addEventListener("click", closeTextEditPopover);
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
  document.getElementById("mobilePanelClose").addEventListener("click", () => document.body.classList.remove("mobile-controls-open"));
  document.querySelectorAll("[data-mobile-zoom]").forEach(button => button.addEventListener("click", () => {
    if (state.format === "informative") state.infoZoom *= button.dataset.mobileZoom === "in" ? 1.15 : 1 / 1.15;
    else state.zoom *= button.dataset.mobileZoom === "in" ? 1.15 : 1 / 1.15;
    updateMediaTransform();
  }));
  const titleButton = document.getElementById("mobileTitleHighlight");
  titleButton.addEventListener("pointerdown", event => event.preventDefault());
  titleButton.addEventListener("click", () => {
    const { selectionStart: start, selectionEnd: end } = elements.titleInput;
    if (start === end) { setStatus("Selecione um trecho do título primeiro."); return; }
    state.titleHighlights = EditorCore.toggleRange(state.titleHighlights, start, end);
    if (state.titleHighlightColor === "none") state.titleHighlightColor = "yellow";
    updateFeedText();
  });
  const boldButton = document.getElementById("mobileSubtitleBold");
  boldButton.addEventListener("pointerdown", event => event.preventDefault());
  boldButton.addEventListener("click", () => {
    const offsets = getSubtitleSelectionOffsets();
    if (!offsets || offsets.start === offsets.end) { setStatus("Selecione um trecho do subtítulo primeiro."); return; }
    let allBold = true;
    for (let index = offsets.start; index < offsets.end; index++) {
      if (!getSubtitleStyleAt(index).bold) { allBold = false; break; }
    }
    applyFeedSubtitleWeight(allBold ? "regular" : "bold");
  });
}

function drawInformativeFrame(ctx) {
  ctx.save();
  ctx.fillStyle = "#07070a";
  ctx.fillRect(0, 0, INFORMATIVE.width, INFORMATIVE.height);
  if (state.feedImage) {
    ctx.filter = "contrast(1.04) saturate(1.04) brightness(0.72) blur(19px)";
    drawImageCoverTransformed(ctx, state.feedImage, 0, 0, INFORMATIVE.width, INFORMATIVE.height, state.zoom, (state.panX / 100) * INFORMATIVE.width, (state.panY / 100) * INFORMATIVE.height);
    ctx.filter = "none";
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.fillRect(0, 0, INFORMATIVE.width, INFORMATIVE.height);
  } else if (state.background) {
    ctx.filter = "contrast(1.08) brightness(0.62) blur(12px)";
    drawImageCover(ctx, state.background, 0, 0, INFORMATIVE.width, INFORMATIVE.height);
    ctx.filter = "none";
  }
  if (state.infoImage) {
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
    drawImageCoverTransformed(ctx, state.infoImage, INFORMATIVE.image.x, INFORMATIVE.image.y, INFORMATIVE.image.width, INFORMATIVE.image.height, state.infoZoom, (state.infoPanX / 100) * INFORMATIVE.image.width, (state.infoPanY / 100) * INFORMATIVE.image.height);
    ctx.restore();
  } else {
    ctx.fillStyle = "rgba(255,255,255,.12)";
    ctx.font = `28px Gotham, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("+", INFORMATIVE.image.x + INFORMATIVE.image.width / 2, INFORMATIVE.image.y + INFORMATIVE.image.height / 2);
  }
  drawFeedTexture(ctx, state.feedTextureExclusionImage, "exclusion", 0.38);
  drawInformativeCopy(ctx);
  if (state.informativeSymbols) {
    const symbols = state.informativeSymbols;
    ctx.drawImage(symbols, 125, 146, 370, 370 * symbols.naturalHeight / symbols.naturalWidth);
  }
  drawLogo(ctx);
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
function openTextEditPopover(selection, event) {
  document.body.classList.remove("mobile-controls-open");
  const popover = document.getElementById("textEditPopover");
  const fieldIds = { title: "titleInput", kicker: "feedKickerInput", subtitle: "feedSubtitleInput", infoTitle: "infoTitleInput", infoBody: "infoBodyInput" };
  const titles = { title: "Título", kicker: "Chapéu", subtitle: "Subtítulo", infoTitle: "Título do informativo", infoBody: "Texto do informativo" };
  const field = document.getElementById(fieldIds[selection]);
  if (!field) return;
  document.getElementById("textEditHeading").textContent = titles[selection];
  popover.querySelectorAll("[data-text-editor]").forEach(section => { section.hidden = section.dataset.textEditor !== field.id; });
  popover.hidden = false;
  popover.style.left = `${Math.max(8, Math.min(innerWidth - popover.offsetWidth - 8, event.clientX + 16))}px`;
  popover.style.top = `${Math.max(8, Math.min(innerHeight - popover.offsetHeight - 8, event.clientY + 16))}px`;
  field.focus({ preventScroll: true });
}
function closeTextEditPopover() {
  document.getElementById("textEditPopover").hidden = true;
  window.getSelection()?.removeAllRanges();
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
    ctx.filter = "blur(34px) saturate(.78) brightness(.76)";
    drawImageCover(ctx, image, -70, -70, 1220, 1490);
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
  shade.addColorStop(.55, "rgba(0,0,0,.12)");
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
  ctx.font = `${fontSize}px "Tusker Story", Impact, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  lines.forEach((text, index) => {
    const y = top + index * (height + TITLE_LINE_GAP);
    const metrics = getTitleGlyphMetrics(text, fontSize);
    if (index === 0) {
      const width = measureTrackedText(text, fontSize, tracking) + padding.left + padding.right;
      ctx.fillStyle = HIGHLIGHT_COLORS.yellow;
      ctx.fillRect((1080 - width) / 2, y, width, height);
    }
    ctx.fillStyle = "#fff";
    drawTrackedText(ctx, text, 540, y + height / 2 + (metrics.ascent - metrics.descent) / 2, tracking);
  });
  const symbols = state.informativeSymbols;
  if (symbols) ctx.drawImage(symbols, 355, 754, 370, 370 * symbols.naturalHeight / symbols.naturalWidth);
  ctx.restore();
}
