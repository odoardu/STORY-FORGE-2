import { inspectMedia, exportVinyl } from './vinyl-video-export.js';
import { createTimeline } from './vinyl-timeline.js';
const root = document.querySelector('[data-vinyl-editor]') || document;
const $ = id => root === document ? document.getElementById(id) : root.querySelector(`[data-vinyl-id="${id}"]`);
const canvas = $('preview'), ctx = canvas.getContext('2d'), audio = $('audio');
const disc = document.createElement('canvas'); disc.width = disc.height = 900;
const background = document.createElement('canvas'); background.width = 1080; background.height = 1350;
let file, info, cover, mediaUrl, coverUrl, exporting = false, controller, loadId = 0;
let trimEnd = null;
let texture, logo, artworkReady = false;
const loadImage = src => new Promise((resolve, reject) => {
  const image = new Image(); image.onload = () => resolve(image);
  image.onerror = () => reject(new Error('Não foi possível carregar a textura ou a logo. Recarregue a página.')); image.src = src;
});
const clock = seconds => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
for (const label of root.querySelectorAll('label.upload')) {
  label.tabIndex = 0;
  label.setAttribute('role', 'button');
  label.addEventListener('keydown', event => {
    if ((event.key === 'Enter' || event.key === ' ') && !exporting) {
      event.preventDefault(); root.querySelector(`[id="${label.htmlFor}"]`).click();
    }
  });
}
const clip = () => {
  const start = Math.min(Math.max(0, Number($('start').value) || 0), Math.max(0, (info?.duration || 0) - .1));
  const remaining = Math.max(0, (info?.duration || 0) - start);
  return { start, duration: trimEnd === null ? ($('length').value === 'all' ? remaining : Math.min(remaining, Number($('length').value))) : Math.max(.1, Math.min(remaining, trimEnd - start)) };
};
function status(message, error = false) { $('status').textContent = message; $('status').dataset.error = String(error); }
function sync() {
  const { start, duration } = clip();
  $('export').disabled = exporting || !artworkReady || !file || !cover || !info || !$('title').value.trim() || duration <= 0;
  $('play').disabled = exporting || !info;
  if (audio.paused) $('time').textContent = clock(start);
  $('start').disabled = exporting || !info;
  $('range-info').textContent = info ? `${clock(start)} → ${clock(start + duration)} · ${duration.toFixed(1)} s · Feed 1080 × 1350` : 'Feed · 1080 × 1350 · 30 fps';
  timeline?.setDisabled(exporting);
  $('highlight-field').hidden = $('title-style').value !== 'brand';
  for (const id of ['effect-blur', 'effect-shade']) { const input = $(id); if (input) input.disabled = exporting; }
  document.dispatchEvent(new CustomEvent('vinyl:state', { detail: { ready: !$('export').disabled, busy: exporting, style: $('title-style').value } }));
}
function drawCover(c, image, x, y, w, h) {
  const scale = Math.max(w / image.naturalWidth, h / image.naturalHeight);
  const sw = w / scale, sh = h / scale;
  c.drawImage(image, (image.naturalWidth - sw) / 2, (image.naturalHeight - sh) / 2, sw, sh, x, y, w, h);
}
function cacheArtwork() {
  const b = background.getContext('2d'); b.fillStyle = '#07070a'; b.fillRect(0, 0, 1080, 1350);
  if (cover) {
    ArtworkEffects.drawCover(b, cover, 0, 0, 1080, 1350, Number($('effect-blur')?.value ?? 19), { contrast: 1.04, saturation: 1.04, brightness: .72 });
    b.fillStyle = 'rgba(0,0,0,.18)'; b.fillRect(0, 0, 1080, 1350);
  }
  const shadow = Number($('effect-shade')?.value ?? 75) / 100;
  const gradient = b.createLinearGradient(0, 550, 0, 1350);
  gradient.addColorStop(0, 'rgba(0,0,0,0)'); gradient.addColorStop(.6, `rgba(0,0,0,${shadow * .73})`); gradient.addColorStop(1, `rgba(0,0,0,${shadow})`);
  b.fillStyle = gradient; b.fillRect(0, 550, 1080, 800);
  // Same background texture and shade as Polaroid; the lower gradient stays underneath.
  if (texture) {
    b.save(); b.globalCompositeOperation = 'exclusion'; b.globalAlpha = .38;
    drawCover(b, texture, 0, 0, 1080, 1350); b.restore();
  }
  b.fillStyle = 'rgba(0,0,0,.48)'; b.fillRect(0, 0, 1080, 1350);
  const c = disc.getContext('2d'); c.clearRect(0, 0, 900, 900);
  const base = c.createRadialGradient(450, 450, 10, 450, 450, 440); base.addColorStop(0, '#27262b'); base.addColorStop(.4, '#101014'); base.addColorStop(1, '#09090b');
  c.fillStyle = base; c.beginPath(); c.arc(450, 450, 440, 0, Math.PI * 2); c.fill();
  for (let r = 180; r < 437; r += 3) { c.beginPath(); c.arc(450, 450, r, 0, Math.PI * 2); c.strokeStyle = r % 9 === 0 ? '#53515b66' : '#53515b30'; c.lineWidth = 1; c.stroke(); }
  c.save(); c.beginPath(); c.arc(450, 450, 159, 0, Math.PI * 2); c.clip();
  if (cover) drawCover(c, cover, 291, 291, 318, 318);
  else { c.fillStyle = '#e981be'; c.fillRect(290, 290, 320, 320); }
  c.restore();
  c.beginPath(); c.arc(450, 450, 26, 0, Math.PI * 2); c.fillStyle = '#e5e0df99'; c.fill();
  c.beginPath(); c.arc(450, 450, 8, 0, Math.PI * 2); c.fillStyle = '#07070b'; c.fill();
}
function titleLines(text, size, brand = false) {
  ctx.font = brand ? `${size}px "Tusker Story"` : `700 ${size}px Gotham`;
  const words = text.split(/\s+/), lines = [''];
  for (const word of words) {
    const i = lines.length - 1, next = `${lines[i]} ${word}`.trim();
    if (ctx.measureText(next).width > 610 && lines[i]) lines.push(word); else lines[i] = next;
  }
  return lines;
}
const glyphCache = new Map();
function feedGlyphMetrics(text, size) {
  if (typeof getTitleGlyphMetrics === 'function') return getTitleGlyphMetrics(text, size);
  const key = `${size}:${text}`; if (glyphCache.has(key)) return glyphCache.get(key);
  const tile = document.createElement('canvas'); tile.width = Math.max(256, Math.ceil(size * Math.max(4, text.length))); tile.height = Math.ceil(size * 3);
  const painter = tile.getContext('2d', { willReadFrequently: true }), baseline = Math.ceil(size * 2);
  painter.font = `${size}px "Tusker Story"`; painter.textBaseline = 'alphabetic'; painter.fillText(text, Math.ceil(size), baseline);
  const pixels = painter.getImageData(0, 0, tile.width, tile.height).data; let top = tile.height, bottom = -1;
  for (let y = 0; y < tile.height; y++) for (let x = 0; x < tile.width; x++) if (pixels[(y * tile.width + x) * 4 + 3] > 8) { top = Math.min(top, y); bottom = y; break; }
  const metrics = top <= bottom ? { ascent: baseline - top, descent: bottom - baseline + 1 } : { ascent: size * .78, descent: size * .08 };
  glyphCache.set(key, metrics); return metrics;
}
function render(time = 0) {
  const selected = clip();
  const total = info?.duration || 30;
  const position = Math.min(total, Math.max(0, selected.start + time));
  const progress = position / total;
  ctx.drawImage(background, 0, 0);
  ctx.save(); ctx.translate(0, -70);
  ctx.save(); ctx.translate(540, 530); ctx.shadowColor = '#000a'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 24;
  ctx.rotate(time * Math.PI * 2 / 10); ctx.drawImage(disc, -310, -310, 620, 620); ctx.restore();
  ctx.save(); ctx.translate(540, 530); ctx.rotate(time * Math.PI * 2 / 10); ctx.beginPath(); ctx.arc(0, 0, 303, 0, Math.PI * 2); ctx.clip();
  const shine = ctx.createLinearGradient(-350, -300, 300, 350); shine.addColorStop(0, '#ffffff00'); shine.addColorStop(.34, '#ffffff00'); shine.addColorStop(.46, '#d7d9ff0c'); shine.addColorStop(.51, '#ffffff20'); shine.addColorStop(.56, '#ffffff03'); shine.addColorStop(.7, '#ffffff00'); ctx.fillStyle = shine; ctx.fillRect(-420, -420, 840, 840); ctx.restore();
  const brand = $('title-style').value === 'brand';
  const sourceTitle = $('title').value.trim() || 'Nome da música';
  const title = brand ? sourceTitle.toLocaleUpperCase('pt-BR') : sourceTitle;
  let size = brand ? 54 : 36, lines;
  do { lines = titleLines(title, size, brand); if (lines.length <= 2 && lines.every(line => ctx.measureText(line).width <= 610)) break; size -= 2; } while (size > 18);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#ffffff';
  lines.forEach((line, i) => {
    const y = (brand ? 900 : 910) + i * size * (brand ? 1.1 : 1.25);
    let baseline = y;
    if (brand) {
      // Use Feed's raster metrics, accented reference height, CONHECA baseline and rounded edges.
      const padding = typeof getTitlePadding === 'function' ? getTitlePadding() : { left: 10, right: 10, top: 5.46, bottom: 5.46 };
      const reference = feedGlyphMetrics('ÁÉÍÓÚÂÊÔÃÕÇ', size), alignment = feedGlyphMetrics('CONHECA', size);
      const height = reference.ascent + reference.descent + padding.top + padding.bottom;
      const top = y - height / 2;
      baseline = top + height / 2 + (alignment.ascent - alignment.descent) / 2;
      ctx.textBaseline = 'alphabetic';
      if ($('highlight').value === 'on') {
        const width = ctx.measureText(line).width;
        ctx.fillStyle = '#e981be'; ctx.fillRect(Math.round(540 - width / 2 - padding.left), Math.round(top), Math.round(width + padding.left + padding.right), Math.round(height));
      }
    }
    ctx.fillStyle = '#ffffff'; ctx.fillText(line, 540, baseline);
  });
  ctx.textBaseline = 'middle';
  ctx.font = '25px Gotham'; ctx.fillStyle = '#ffffff'; ctx.fillText($('artist').value.trim() || 'Nome do artista', 540, 950 + (brand ? 10 : 0) + (lines.length - 1) * size * (brand ? 1 : 1.25), 610);
  const y = 1025;
  ctx.lineCap = 'round'; ctx.lineWidth = 3; ctx.strokeStyle = '#ffffff55'; ctx.beginPath(); ctx.moveTo(250, y); ctx.lineTo(830, y); ctx.stroke();
  ctx.strokeStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(250, y); ctx.lineTo(250 + 580 * progress, y); ctx.stroke();
  ctx.beginPath(); ctx.arc(250 + 580 * progress, y, 6, 0, Math.PI * 2); ctx.fillStyle = '#ffffff'; ctx.fill();
  ctx.font = '16px Gotham'; ctx.fillStyle = '#ffffff'; ctx.textAlign = 'left'; ctx.fillText(clock(position), 250, 1053); ctx.textAlign = 'right'; ctx.fillText(clock(Math.round(total)), 830, 1053);
  drawControls();
  ctx.restore();
  if (logo) { const width = 160, height = width * logo.naturalHeight / logo.naturalWidth; ctx.drawImage(logo, (1080 - width) / 2, 1190, width, height); }
}
function drawControls() {
  ctx.save(); ctx.translate(540, 1120); ctx.strokeStyle = ctx.fillStyle = '#ffffff'; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.arc(0, 0, 33, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#17191d'; ctx.fillRect(-10, -13, 7, 26); ctx.fillRect(3, -13, 7, 26); ctx.fillStyle = '#ffffff';
  for (const direction of [-1, 1]) {
    ctx.save(); ctx.translate(direction * 130, 0); ctx.scale(direction, 1);
    ctx.beginPath(); ctx.moveTo(-12, -15); ctx.lineTo(10, 0); ctx.lineTo(-12, 15); ctx.closePath(); ctx.fill(); ctx.fillRect(12, -15, 4, 30); ctx.restore();
  }
  ctx.save(); ctx.translate(-255, 0);
  for (const direction of [-1, 1]) { ctx.beginPath(); ctx.moveTo(-16, direction * 11); ctx.bezierCurveTo(-1, direction * 11, 0, -direction * 11, 16, -direction * 11); ctx.stroke(); ctx.beginPath(); ctx.moveTo(10, -direction * 17); ctx.lineTo(17, -direction * 11); ctx.lineTo(10, -direction * 5); ctx.stroke(); }
  ctx.restore(); ctx.save(); ctx.translate(255, 0);
  ctx.beginPath(); ctx.moveTo(-15, 4); ctx.lineTo(-15, -6); ctx.quadraticCurveTo(-15, -12, -9, -12); ctx.lineTo(16, -12); ctx.lineTo(10, -18); ctx.moveTo(16, -12); ctx.lineTo(10, -6); ctx.moveTo(15, -4); ctx.lineTo(15, 6); ctx.quadraticCurveTo(15, 12, 9, 12); ctx.lineTo(-16, 12); ctx.lineTo(-10, 18); ctx.moveTo(-16, 12); ctx.lineTo(-10, 6); ctx.stroke(); ctx.restore(); ctx.restore();
}
function pause() { audio.pause(); $('play').textContent = 'Ouvir prévia'; }
$('media').addEventListener('change', async event => {
  const chosen = event.target.files[0]; if (!chosen) return;
  const id = ++loadId; pause(); file = info = undefined; sync(); status('Lendo o áudio…');
  try {
    const inspected = await inspectMedia(chosen); if (id !== loadId) return;
    if (mediaUrl) URL.revokeObjectURL(mediaUrl);
    file = chosen; info = inspected; trimEnd = null; mediaUrl = URL.createObjectURL(chosen); audio.src = mediaUrl;
    $('media-name').textContent = chosen.name; $('start').value = '0'; $('start').max = Math.max(0, info.duration - .1);
    if (!$('title').value.trim() && document.activeElement !== $('title')) $('title').value = chosen.name.replace(/\.[^.]+$/, '').slice(0, 120);
    status('Áudio carregado. A prévia e o MP4 usam a mesma faixa.');
    void timeline.load(chosen, info.duration, info.origin);
  } catch (error) { status(error.message, true); }
  sync(); render();
});
$('cover').addEventListener('change', async event => {
  const chosen = event.target.files[0]; if (!chosen) return;
  const url = URL.createObjectURL(chosen), image = new Image(); image.src = url;
  try { await image.decode(); if (coverUrl) URL.revokeObjectURL(coverUrl); coverUrl = url; cover = image; $('cover-thumb').style.backgroundImage = `url("${url}")`; $('cover-name').textContent = chosen.name; cacheArtwork(); sync(); render(); }
  catch { URL.revokeObjectURL(url); status('Não foi possível abrir essa capa. Tente JPG, PNG ou WebP.', true); }
});
for (const id of ['title', 'artist', 'title-style', 'highlight', 'start', 'length']) $(id).addEventListener('input', () => { if (id === 'start' || id === 'length') pause(); sync(); render(info ? Math.max(0, audio.currentTime - info.origin - clip().start) : 0); });
$('start').addEventListener('change', () => { $('start').value = String(clip().start); sync(); });
$('play').addEventListener('click', async () => {
  if (!audio.paused) { pause(); return; }
  const { start, duration } = clip(), origin = info.origin;
  if (audio.currentTime < origin + start || audio.currentTime >= origin + start + duration - .05) audio.currentTime = origin + start;
  try { await audio.play(); $('play').textContent = 'Pausar prévia'; } catch { status('Não foi possível tocar o arquivo. Selecione outro áudio.', true); }
});
audio.addEventListener('ended', pause);
function animate() {
  if (!exporting && !audio.paused && info) {
    const time = Math.max(0, audio.currentTime - info.origin - clip().start);
    render(time); $('time').textContent = clock(clip().start + time);
    timeline.setPosition(clip().start + time);
    if (time >= clip().duration) pause();
  }
  requestAnimationFrame(animate);
}
$('export').addEventListener('click', async () => {
  if ($('export').disabled) return;
  pause(); exporting = true; controller = new AbortController(); $('fields').disabled = true; $('export-progress').hidden = false; $('progress').value = 0; sync(); status('Renderizando o vinil e incluindo o áudio…');
  try {
    await document.fonts.ready;
    const blob = await exportVinyl({ file, canvas, render, ...clip(), signal: controller.signal, onProgress: value => { $('progress').value = value; $('progress-label').textContent = `Exportando ${Math.round(value * 100)}%`; } });
    const url = URL.createObjectURL(blob), link = document.createElement('a'); link.href = url; link.download = `vinil-${$('title').value.trim().replace(/[^\p{L}\p{N}]+/gu, '-').slice(0, 70)}.mp4`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 60000);
    status('MP4 pronto: Feed 4:5, vinil a 30 fps e áudio incluído.');
  } catch (error) { status(error.name === 'AbortError' ? 'Exportação cancelada. Você pode continuar editando.' : `Não foi possível exportar: ${error.message}`, error.name !== 'AbortError'); }
  finally { exporting = false; $('fields').disabled = false; $('export-progress').hidden = true; if (info) audio.currentTime = info.origin + clip().start; timeline.setPosition(clip().start); sync(); render(); }
});
$('cancel').addEventListener('click', () => controller?.abort());
const timeline = createTimeline({ host: root === document ? document.querySelector('aside') : root, audio,
  onTrim(start, end) { pause(); $('start').value = start; trimEnd = end; if (info) audio.currentTime = info.origin + start; sync(); render(); timeline.setPosition(start); },
  onSeek(position) { if (!info) return; const { start, duration } = clip(); const next = Math.max(start, Math.min(start + duration, position)); audio.currentTime = info.origin + next; render(next - start); $('time').textContent = clock(next); timeline.setPosition(next); },
  togglePlayback() { $('play').click(); }
});
document.addEventListener('vinyl:deactivate', pause);
for (const id of ['effect-blur', 'effect-shade']) $(id)?.addEventListener('input', () => { cacheArtwork(); render(); });
try {
  await document.fonts.ready;
  await document.fonts.load('54px "Tusker Story"');
  [texture, logo] = await Promise.all([
    loadImage('assets/textures/ECLUS%C3%83O%2038.png'),
    loadImage('assets/logos/LOGO%201%20MONO.png')
  ]);
  artworkReady = true;
} catch (error) { status(error.message, true); }
cacheArtwork(); render(); sync(); animate();
