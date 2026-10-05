figma.loadFontAsync({ family: "Inter", style: "Regular" })
  .then(function () {
    return figma.loadFontAsync({ family: "Inter", style: "Bold" });
  })
  .then(function () {
    buildLayout();
    figma.notify("LPZ Liquid Glass criado em camadas editaveis.");
    figma.closePlugin();
  })
  .catch(function (error) {
    figma.notify("Erro ao criar layout: " + error.message);
    figma.closePlugin();
  });

function buildLayout() {
  var root = createFrame("LPZ Liquid Glass Story Maker", 0, 0, 1600, 900);
  root.fills = [paint("#05030a", 1)];
  figma.currentPage.appendChild(root);

  addAmbient(root);

  var previewW = 330;
  var previewH = 587;
  var panelW = 380;
  var dockW = 72;
  var dockH = 330;
  var gap = 16;
  var previewX = 868;
  var previewY = 106;
  var dockX = previewX - gap - dockW;
  var dockY = previewY + (previewH - dockH) / 2;
  var panelX = dockX - gap - panelW;
  var panelY = dockY;
  var topW = 382;
  var topX = previewX + previewW / 2 - topW / 2;

  createTopBar(root, topX, 38, topW, 46);
  createPanel(root, panelX, panelY, panelW, 200);
  createDock(root, dockX, dockY, dockW, dockH);
  createPreview(root, previewX, previewY, previewW, previewH);
  createPlayer(root, previewX, previewY + previewH + 16, previewW, 69);

  figma.viewport.scrollAndZoomIntoView([root]);
}

function hex(color) {
  var clean = color.replace("#", "");
  var value = parseInt(clean, 16);
  return {
    r: ((value >> 16) & 255) / 255,
    g: ((value >> 8) & 255) / 255,
    b: (value & 255) / 255
  };
}

function paint(color, opacity) {
  return {
    type: "SOLID",
    color: hex(color),
    opacity: opacity
  };
}

function rgba(color, opacity) {
  var c = hex(color);
  return { r: c.r, g: c.g, b: c.b, a: opacity };
}

function createFrame(name, x, y, w, h) {
  var node = figma.createFrame();
  node.name = name;
  node.x = x;
  node.y = y;
  node.resize(w, h);
  node.fills = [];
  node.clipsContent = false;
  return node;
}

function createRect(parent, name, x, y, w, h, fill) {
  var node = figma.createRectangle();
  node.name = name;
  node.x = x;
  node.y = y;
  node.resize(w, h);
  node.fills = fill ? [fill] : [];
  parent.appendChild(node);
  return node;
}

function createEllipse(parent, name, x, y, w, h, fill) {
  var node = figma.createEllipse();
  node.name = name;
  node.x = x;
  node.y = y;
  node.resize(w, h);
  node.fills = fill ? [fill] : [];
  parent.appendChild(node);
  return node;
}

function append(parent, child) {
  parent.appendChild(child);
  return child;
}

function applyGlass(node, fillColor, fillOpacity, strokeOpacity, blur, shadow) {
  node.fills = [paint(fillColor || "#ffffff", fillOpacity == null ? 0.14 : fillOpacity)];
  node.strokes = [paint("#ffffff", strokeOpacity == null ? 0.28 : strokeOpacity)];
  node.strokeWeight = 1;
  node.effects = [
    {
      type: "DROP_SHADOW",
      color: rgba("#000000", shadow == null ? 0.36 : shadow),
      offset: { x: 0, y: 24 },
      radius: 58,
      spread: 0,
      visible: true,
      blendMode: "NORMAL"
    },
    {
      type: "INNER_SHADOW",
      color: rgba("#ffffff", 0.22),
      offset: { x: 0, y: 1 },
      radius: 0,
      spread: 0,
      visible: true,
      blendMode: "NORMAL"
    },
    {
      type: "BACKGROUND_BLUR",
      radius: blur == null ? 24 : blur,
      visible: true
    }
  ];
}

function addText(parent, name, value, x, y, size, bold, color, opacity) {
  var node = figma.createText();
  node.name = name;
  node.fontName = { family: "Inter", style: bold ? "Bold" : "Regular" };
  node.characters = value;
  node.fontSize = size;
  node.fills = [paint(color || "#ffffff", opacity == null ? 1 : opacity)];
  node.x = x;
  node.y = y;
  node.textAutoResize = "WIDTH_AND_HEIGHT";
  parent.appendChild(node);
  return node;
}

function addFixedText(parent, name, value, x, y, w, h, size, bold, color, opacity) {
  var node = addText(parent, name, value, x, y, size, bold, color, opacity);
  node.textAutoResize = "NONE";
  node.resize(w, h);
  node.textAlignHorizontal = "CENTER";
  node.textAlignVertical = "CENTER";
  return node;
}

function addAmbient(root) {
  var leftGlow = createEllipse(root, "ambient purple glow", 130, 70, 700, 760, paint("#7b56b3", 0.18));
  leftGlow.effects = [{ type: "LAYER_BLUR", radius: 72, visible: true }];

  var topGlow = createEllipse(root, "ambient ceiling glow", 650, -170, 430, 360, paint("#ffffff", 0.22));
  topGlow.effects = [{ type: "LAYER_BLUR", radius: 56, visible: true }];

  var rightGlow = createEllipse(root, "ambient warm glow", 1060, 80, 620, 760, paint("#9a6a6d", 0.12));
  rightGlow.effects = [{ type: "LAYER_BLUR", radius: 78, visible: true }];

  var vignette = createRect(root, "bottom vignette", 0, 640, 1600, 260, paint("#000000", 0.42));
  vignette.effects = [{ type: "LAYER_BLUR", radius: 36, visible: true }];
}

function createTopBar(parent, x, y, w, h) {
  var bar = createFrame("floating browser bar", x, y, w, h);
  bar.cornerRadius = 23;
  applyGlass(bar, "#d7d1db", 0.2, 0.3, 26, 0.26);
  append(parent, bar);

  var labels = [
    { x: 12, label: "[]", w: 34 },
    { x: 52, label: "<", w: 32 },
    { x: 90, label: ">", w: 32 },
    { x: 296, label: "^", w: 32 },
    { x: 336, label: "+", w: 32 },
    { x: 342, label: "[]", w: 32 }
  ];

  labels.forEach(function (item) {
    var btn = createFrame("top icon", item.x, 7, item.w, 32);
    btn.cornerRadius = 16;
    btn.fills = [paint("#ffffff", 0.13)];
    append(bar, btn);
    addFixedText(btn, "icon", item.label, 0, 6, item.w, 20, 11, true, "#ffffff", 0.9);
  });

  var address = createFrame("address pill", 132, 7, 154, 32);
  address.cornerRadius = 16;
  address.fills = [paint("#ffffff", 0.12)];
  address.strokes = [paint("#ffffff", 0.16)];
  address.strokeWeight = 1;
  append(bar, address);
  addText(address, "AA", "AA", 14, 8, 11, true, "#ffffff", 0.85);
  addFixedText(address, "title", "LPZ ZERO", 43, 8, 72, 16, 10, false, "#ffffff", 0.85);
  addText(address, "reload", "o", 128, 6, 14, false, "#ffffff", 0.65);
}

function createDock(parent, x, y, w, h) {
  var dock = createFrame("dock tools", x, y, w, h);
  dock.cornerRadius = 36;
  applyGlass(dock, "#d7d1db", 0.16, 0.32, 30, 0.34);
  append(parent, dock);

  var icons = [
    { name: "media active", label: "MP4", active: true },
    { name: "text", label: "T" },
    { name: "borders", label: "BOX" },
    { name: "fit", label: "*" },
    { name: "export", label: "DL" }
  ];

  icons.forEach(function (item, index) {
    var btn = createFrame("dock " + item.name, 10, 15 + index * 62, 52, 52);
    btn.cornerRadius = 26;
    if (item.active) {
      applyGlass(btn, "#9f72bd", 0.5, 0.6, 14, 0.12);
    } else {
      btn.fills = [];
    }
    append(dock, btn);
    addFixedText(btn, "icon", item.label, 0, 16, 52, 18, item.label.length > 1 ? 9 : 18, true, "#ffffff", 0.94);
  });
}

function createPanel(parent, x, y, w, h) {
  var panel = createFrame("media panel glass", x, y, w, h);
  panel.cornerRadius = 30;
  applyGlass(panel, "#ffffff", 0.16, 0.32, 32, 0.4);
  append(parent, panel);

  var badge = createFrame("section number", 20, 24, 38, 38);
  badge.cornerRadius = 19;
  applyGlass(badge, "#ffffff", 0.16, 0.55, 14, 0.1);
  append(panel, badge);
  addFixedText(badge, "01", "01", 0, 11, 38, 15, 11, true, "#ffffff", 1);

  addText(panel, "title", "MIDIA", 70, 26, 15, true, "#ffffff", 1);
  addText(panel, "subtitle", "Video do post", 70, 48, 11, false, "#ffffff", 0.7);

  var drop = createFrame("upload drop area", 20, 82, 340, 104);
  drop.cornerRadius = 22;
  applyGlass(drop, "#c6b2dc", 0.18, 0.34, 22, 0.16);
  append(panel, drop);

  var fileIcon = createFrame("file icon", 18, 23, 56, 56);
  fileIcon.cornerRadius = 17;
  fileIcon.fills = [paint("#ffffff", 0.08)];
  fileIcon.strokes = [paint("#ffffff", 0.46)];
  fileIcon.strokeWeight = 1;
  append(drop, fileIcon);
  addFixedText(fileIcon, "icon", "MP4", 0, 20, 56, 16, 9, true, "#ffffff", 0.95);

  addText(drop, "select", "Selecionar video", 88, 30, 16, true, "#ffffff", 1);
  addText(drop, "hint", "Clique para trocar o MP4", 88, 58, 12, true, "#ffffff", 0.68);
}

function createPreview(parent, x, y, w, h) {
  var preview = createFrame("vertical story preview 1080x1920", x, y, w, h);
  preview.cornerRadius = 30;
  preview.clipsContent = true;
  preview.fills = [paint("#0a090b", 1)];
  preview.strokes = [paint("#ffffff", 0.18)];
  preview.strokeWeight = 1;
  preview.effects = [
    {
      type: "DROP_SHADOW",
      color: rgba("#000000", 0.5),
      offset: { x: 0, y: 32 },
      radius: 70,
      spread: 0,
      visible: true,
      blendMode: "NORMAL"
    }
  ];
  append(parent, preview);

  createRect(preview, "top texture", 0, 0, w, 196, paint("#070609", 1));
  createRect(preview, "video placeholder", 0, 196, w, 184, paint("#d9d9d9", 1));
  createRect(preview, "bottom texture", 0, 380, w, h - 380, paint("#070609", 1));
  addSpeckles(preview, 0, 0, w, h, 80);

  addFixedText(preview, "mp4", "MP4", 0, 256, w, 50, 40, true, "#000000", 0.2);

  createRect(preview, "pink headline strip 1", 62, 82, 206, 28, paint("#e981be", 1));
  createRect(preview, "pink headline strip 2", 35, 112, 260, 28, paint("#e981be", 1));
  addFixedText(preview, "headline 1", "O DIA EM QUE O LINKIN PARK", 62, 84, 206, 24, 15, true, "#ffffff", 1);
  addFixedText(preview, "headline 2", "FEZ UMA COISA MUITO LEGAL E FODA", 35, 114, 260, 24, 14, true, "#ffffff", 1);

  var expand = createFrame("expand chip", 22, 22, 92, 36);
  expand.cornerRadius = 18;
  applyGlass(expand, "#151119", 0.48, 0.28, 18, 0.18);
  append(preview, expand);
  addText(expand, "expand icon", "<>", 13, 10, 10, true, "#ffffff", 0.95);
  addText(expand, "expand text", "Expand", 35, 10, 11, true, "#ffffff", 0.95);

  var more = createFrame("more chip", w - 58, 22, 38, 38);
  more.cornerRadius = 19;
  applyGlass(more, "#151119", 0.48, 0.28, 18, 0.18);
  append(preview, more);
  addFixedText(more, "dots", "...", 0, 7, 38, 18, 16, true, "#ffffff", 0.8);
}

function createPlayer(parent, x, y, w, h) {
  var player = createFrame("bottom player dock", x, y, w, h);
  player.cornerRadius = h / 2;
  applyGlass(player, "#d7d1db", 0.18, 0.3, 28, 0.34);
  append(parent, player);

  var play = createFrame("play button", 12, 12, 44, 44);
  play.cornerRadius = 22;
  play.fills = [paint("#ffffff", 0.14)];
  append(player, play);
  addFixedText(play, "play", "PLAY", 0, 16, 44, 14, 8, true, "#ffffff", 0.96);

  var track = createFrame("track card", 68, 10, 132, 49);
  track.cornerRadius = 13;
  track.fills = [paint("#151118", 0.34)];
  track.strokes = [paint("#ffffff", 0.16)];
  track.strokeWeight = 1;
  append(player, track);

  var art = createRect(track, "track artwork", 8, 7, 36, 36, paint("#08070a", 1));
  art.cornerRadius = 8;
  addSpeckles(track, 8, 7, 36, 36, 18);
  addText(track, "track title", "LPZ Story", 52, 10, 13, true, "#ffffff", 1);
  addText(track, "track meta", "A area cinza recebe o MP4", 52, 29, 9, false, "#ffffff", 0.65);
  var progress = createRect(track, "track progress", 52, 41, 54, 3, paint("#ffffff", 0.3));
  progress.cornerRadius = 2;

  addText(player, "download", "DL", 218, 25, 11, true, "#ffffff", 0.9);
  addText(player, "text", "T", 258, 24, 15, true, "#ffffff", 0.9);
  addText(player, "sound", "VOL", 296, 25, 10, true, "#ffffff", 0.9);
}

function addSpeckles(parent, x, y, w, h, count) {
  var seed = 12345 + Math.round(x * 7 + y * 11 + w * 13 + h * 17);
  function random() {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  }
  for (var i = 0; i < count; i += 1) {
    var size = 0.8 + random() * 1.8;
    var dot = createEllipse(parent, "texture speckle " + String(i + 1), x + random() * w, y + random() * h, size, size, paint("#ffffff", 0.05 + random() * 0.12));
    dot.name = "texture speckle " + String(i + 1);
  }
}
