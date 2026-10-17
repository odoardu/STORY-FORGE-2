"use strict";
const PolaroidStudio = (() => {
  const rotations = [-2.4, 1.8, -1.2, 2.8, -.6];
  const defaultShade = 48;
  const defaultBlur = 19;
  const photoScale = .85;
  const pages = [{ image: null, name: "", token: 0 }];
  let active = 0;
  const root = document.getElementById("polaroidArtboards");
  const input = document.createElement("input");
  input.type = "file"; input.accept = "image/*"; input.hidden = true;
  document.body.append(input);
  let uploadPage = null;
  function draw(canvas, page, index) {
    canvas.width = 1080; canvas.height = 1350;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#07070a"; ctx.fillRect(0, 0, 1080, 1350);
    if (page.image) {
      ArtworkEffects.drawCover(ctx, page.image, 0, 0, 1080, 1350, page.blur ?? defaultBlur, { contrast: 1.04, saturation: 1.04, brightness: .72 });
      ctx.filter = "none";
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.fillRect(0, 0, 1080, 1350);
    }
    drawFeedTexture(ctx, state.feedTextureExclusionImage, "exclusion", 0.38);
    ctx.fillStyle = `rgba(0,0,0,${(page.shade ?? defaultShade) / 100})`;
    ctx.fillRect(0, 0, 1080, 1350);
    const landscape = page.image && page.image.naturalWidth > page.image.naturalHeight;
    const w = landscape ? 880 : 700, h = landscape ? 730 : 980;
    const inset = 50, bottom = 180, pw = w - inset * 2, ph = h - inset - bottom;
    ctx.save(); ctx.translate(540, 620); ctx.rotate(rotations[index] * Math.PI / 180);
    ctx.scale(photoScale, photoScale);
    ctx.shadowColor = "#000b"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 18;
    ctx.fillStyle = "#f4f3ee"; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 14); ctx.fill();
    ctx.shadowColor = "transparent";
    const paper = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
    paper.addColorStop(0, "#ffffff55"); paper.addColorStop(.55, "#e5e5df22"); paper.addColorStop(1, "#c9ccc326");
    ctx.fillStyle = paper; ctx.fill();
    const x = -w / 2 + inset, y = -h / 2 + inset;
    ctx.fillStyle = "#202322"; ctx.fillRect(x, y, pw, ph);
    if (page.image) {
      const image = page.image, scale = Math.max(pw / image.naturalWidth, ph / image.naturalHeight);
      ctx.save(); ctx.beginPath(); ctx.rect(x, y, pw, ph); ctx.clip();
      ctx.filter = "saturate(.78) contrast(.94) brightness(1.04) sepia(.14)";
      ctx.drawImage(image, x + (pw - image.naturalWidth * scale) / 2, y + (ph - image.naturalHeight * scale) / 2, image.naturalWidth * scale, image.naturalHeight * scale);
      ctx.restore();
      const vignette = ctx.createRadialGradient(0, y + ph / 2, ph * .1, 0, y + ph / 2, Math.max(pw, ph) * .7);
      vignette.addColorStop(0, "#0000"); vignette.addColorStop(1, "#0005");
      ctx.fillStyle = vignette; ctx.fillRect(x, y, pw, ph);
      drawInstantFilm(ctx, x, y, pw, ph, index);
    } else {
      ctx.fillStyle = "#eee"; ctx.textAlign = "center"; ctx.font = "56px Arial"; ctx.fillText("+", 0, y + ph / 2);
      ctx.font = "24px Arial"; ctx.fillText("Adicionar foto", 0, y + ph / 2 + 45);
    }
    // Stable fine grain gives paper and photo texture without flickering between exports.
    let seed = 127 + index;
    for (let i = 0; i < 16000; i++) {
      seed = (seed * 1664525 + 1013904223) >>> 0; const gx = seed / 4294967296 * (w - 8);
      seed = (seed * 1664525 + 1013904223) >>> 0; const gy = seed / 4294967296 * (h - 8);
      ctx.fillStyle = i % 2 ? "#ffffff12" : "#0000000b";
      ctx.fillRect(-w / 2 + 4 + gx, -h / 2 + 4 + gy, 1.2, 1.2);
    }
    ctx.restore();
    drawLogo(ctx);
  }
  function drawInstantFilm(ctx, x, y, width, height, index) {
    ctx.save();
    ctx.beginPath(); ctx.rect(x, y, width, height); ctx.clip();
    // Lift the blacks and warm highlights without washing out facial detail.
    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = "rgba(55, 43, 38, .16)";
    ctx.fillRect(x, y, width, height);
    ctx.globalCompositeOperation = "soft-light";
    const tone = ctx.createLinearGradient(x, y, x, y + height);
    tone.addColorStop(0, "rgba(255, 208, 150, .25)");
    tone.addColorStop(1, "rgba(71, 112, 108, .19)");
    ctx.fillStyle = tone; ctx.fillRect(x, y, width, height);
    // A restrained edge leak, alternating sides between artboards.
    ctx.globalCompositeOperation = "screen";
    const edge = index % 2 ? x + width : x;
    const leak = ctx.createRadialGradient(edge, y + height * .76, 0, edge, y + height * .76, width * .44);
    leak.addColorStop(0, "rgba(244, 138, 75, .19)");
    leak.addColorStop(.5, "rgba(228, 105, 65, .07)");
    leak.addColorStop(1, "rgba(228, 105, 65, 0)");
    ctx.fillStyle = leak; ctx.fillRect(x, y, width, height);
    ctx.globalCompositeOperation = "source-over";
    // Seeded grain stays identical in previews and PNG exports.
    let seed = 7411 + index * 97;
    const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    for (let i = 0; i < width * height / 12; i++) {
      const gx = x + random() * width, gy = y + random() * height;
      const size = .7 + random() * 1.3;
      ctx.fillStyle = i % 2 ? "rgba(255, 245, 226, .12)" : "rgba(26, 24, 22, .1)";
      ctx.fillRect(gx, gy, size, size);
    }
    ctx.restore();
  }
  function snapshot() { return { pages: [...pages], active }; }
  function restore(snapshot) {
    pages.splice(0, pages.length, ...snapshot.pages); active = snapshot.active;
    applyFormat("polaroid", { keepPanel: true }); render(); StudioUI.sync();
  }
  function addPage() {
    if (pages.length >= 5) return;
    const before = snapshot();
    pages.push({ image: null, name: "", token: 0 }); active = pages.length - 1; render();
    EditorHistory.record(before, snapshot(), restore, "Adicionar Polaroid");
  }
  function removePage(index = active) {
    if (index === 0) { setStatus("A primeira prancheta é fixa."); return; }
    if (pages.length <= 1) { setStatus("Mantenha pelo menos uma prancheta."); return; }
    const before = snapshot(), selected = pages[active];
    pages.splice(index, 1);
    active = pages.includes(selected) ? pages.indexOf(selected) : Math.min(index, pages.length - 1);
    render(); StudioUI.sync();
    EditorHistory.record(before, snapshot(), restore, "Excluir Polaroid");
  }
  function render() {
    StudioMotion.captureBoards();
    root.replaceChildren();
    pages.forEach((page, index) => {
      const board = document.createElement("article"); board.className = "polaroid-board" + (active === index ? " is-active" : "");
      board.dataset.boardMotionKey = StudioMotion.key(page);
      const header = document.createElement("header"), title = document.createElement("span"); title.textContent = `Polaroid ${index + 1}`; header.append(title);
      const remove = document.createElement("button"); remove.type = "button"; remove.className = "polaroid-remove"; remove.textContent = "×"; remove.setAttribute("aria-label", `Remover Polaroid ${index + 1}`); remove.disabled = pages.length === 1;
      remove.onclick = () => removePage(index); if (index > 0) header.append(remove);
      const photo = document.createElement("button"); photo.type = "button"; photo.className = "polaroid-photo";
      photo.setAttribute("aria-label", `${page.image ? "Selecionar ou trocar foto da" : "Adicionar foto à"} Polaroid ${index + 1}`);
      const canvas = document.createElement("canvas"); draw(canvas, page, index); photo.append(canvas);
      photo.onclick = () => { const selected = active === index; active = index; render(); if (selected || !page.image) { uploadPage = page; input.click(); } };
      board.append(header, photo); root.append(board);
    });
    const add = document.createElement("button"); add.type = "button"; add.className = "polaroid-add"; add.textContent = "+"; add.setAttribute("aria-label", "Adicionar prancheta Polaroid"); add.disabled = pages.length >= 5; add.title = add.disabled ? "Limite de 5 pranchetas" : "Adicionar Polaroid (Ctrl+Shift+N)";
    add.onclick = addPage;
    root.append(add);
    if (state.format === "polaroid") updateStageScale();
    StudioMotion.settleBoards();
  }
  input.onchange = async () => {
    const file = input.files[0], page = uploadPage; input.value = "";
    if (!file || !page) return;
    const token = ++page.token, done = beginMediaLoading("Abrindo foto…");
    const url = URL.createObjectURL(file);
    try {
      const image = new Image(); image.src = url; await image.decode();
      if (token !== page.token || !pages.includes(page)) { done(true); return; }
      const before = { image: page.image, name: page.name };
      page.image = image; page.name = file.name; render(); done(true);
      EditorHistory.record(before, { image, name: file.name }, value => {
        page.image = value.image; page.name = value.name;
        if (pages.includes(page)) { active = pages.indexOf(page); applyFormat("polaroid", { keepPanel: true }); render(); }
      }, "Trocar foto da Polaroid");
    } catch { done(false, "Não foi possível abrir a foto. Tente JPG, PNG ou WebP."); }
    finally { URL.revokeObjectURL(url); }
  };
  async function exportActive() {
    const page = pages[active];
    if (!page.image) { uploadPage = page; input.click(); return; }
    elements.exportButton.disabled = true;
    try {
      const canvas = document.createElement("canvas"); draw(canvas, page, active);
      const blob = await canvasToBlob(canvas, "image/png");
      await downloadExport(blob, `storyforge-polaroid-${active + 1}.png`);
      setStatus("Polaroid exportada");
    } catch { setStatus("Não foi possível exportar a Polaroid. Tente novamente."); }
    finally { elements.exportButton.disabled = false; }
  }
  return {
    show(visible) { root.hidden = !visible; if (visible) render(); },
    getEffects() { return { blur: pages[active].blur ?? defaultBlur, shade: pages[active].shade ?? defaultShade }; },
    setEffect(id, value) {
      const page = pages[active], key = id === "effectBlur" ? "blur" : "shade", before = page[key];
      page.historyKeys ||= { blur: {}, shade: {} };
      page[key] = value; render();
      EditorHistory.record(before, value, saved => { page[key] = saved; if (pages.includes(page)) { active = pages.indexOf(page); applyFormat("polaroid", { keepPanel: true }); render(); StudioUI.sync(); } }, "Ajustar efeito da Polaroid", page.historyKeys[key]);
    },
    add: addPage,
    removeActive: () => removePage(),
    selectRelative(delta) { active = Math.max(0, Math.min(pages.length - 1, active + delta)); render(); StudioUI.sync(); root.querySelectorAll(".polaroid-photo")[active]?.focus({ preventScroll: true }); },
    count: () => pages.length,
    refresh: render,
    exportActive
  };
})();
