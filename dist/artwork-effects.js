"use strict";
// A small raster fallback keeps blur identical in preview and export, including Safari.
const ArtworkEffects = (() => {
  const cache = new WeakMap();
  function boxPass(source, width, height, radius, horizontal) {
    const output = new Uint8ClampedArray(source.length), length = horizontal ? width : height, lines = horizontal ? height : width;
    const stride = horizontal ? 4 : width * 4, divisor = radius * 2 + 1;
    for (let line = 0; line < lines; line++) {
      const base = horizontal ? line * width * 4 : line * 4;
      for (let channel = 0; channel < 4; channel++) {
        let sum = 0;
        for (let offset = -radius; offset <= radius; offset++) sum += source[base + Math.max(0, Math.min(length - 1, offset)) * stride + channel];
        for (let pixel = 0; pixel < length; pixel++) {
          output[base + pixel * stride + channel] = sum / divisor;
          sum += source[base + Math.min(length - 1, pixel + radius + 1) * stride + channel] - source[base + Math.max(0, pixel - radius) * stride + channel];
        }
      }
    }
    return output;
  }
  function drawCover(ctx, media, x, y, width, height, blur = 0, options = {}) {
    const { zoom, panX = 0, panY = 0, saturation = 1, brightness = 1, contrast = 1 } = options;
    const iw = media.videoWidth || media.naturalWidth || media.width, ih = media.videoHeight || media.naturalHeight || media.height;
    const actualZoom = zoom ?? Math.min(1, Math.max(width / iw, height / ih));
    if (!blur && saturation === 1 && brightness === 1 && contrast === 1) {
      const g = EditorCore.imageGeometry(iw, ih, width, height, actualZoom, panX, panY);
      ctx.save(); ctx.beginPath(); ctx.rect(x, y, width, height); ctx.clip(); ctx.drawImage(media, x + g.x, y + g.y, g.width, g.height); ctx.restore(); return;
    }
    const scale = blur ? .25 : 1, cw = Math.ceil(width * scale), ch = Math.ceil(height * scale);
    const key = [width, height, blur, actualZoom, panX, panY, saturation, brightness, contrast, media.currentTime ?? "photo"].join(":");
    let entries = cache.get(media); if (!entries) { entries = new Map(); cache.set(media, entries); }
    let tile = entries.get(key);
    if (!tile) {
      tile = document.createElement("canvas"); tile.width = cw; tile.height = ch;
      const painter = tile.getContext("2d", { willReadFrequently: true });
      const g = EditorCore.imageGeometry(iw, ih, width, height, actualZoom, panX, panY);
      painter.drawImage(media, g.x * scale, g.y * scale, g.width * scale, g.height * scale);
      const pixels = painter.getImageData(0, 0, cw, ch); let data = pixels.data;
      const radius = Math.round(Math.max(0, Math.min(120, blur)) * scale);
      if (radius) for (let pass = 0; pass < 3; pass++) { data = boxPass(data, cw, ch, radius, true); data = boxPass(data, cw, ch, radius, false); }
      for (let i = 0; i < data.length; i += 4) {
        const luminance = .2126 * data[i] + .7152 * data[i + 1] + .0722 * data[i + 2];
        for (let channel = 0; channel < 3; channel++) data[i + channel] = ((luminance + (data[i + channel] - luminance) * saturation - 128) * contrast + 128) * brightness;
      }
      pixels.data.set(data); painter.putImageData(pixels, 0, 0);
      if (entries.size >= 3) entries.delete(entries.keys().next().value);
      entries.set(key, tile);
    }
    ctx.drawImage(tile, x, y, width, height);
  }
  return Object.freeze({ drawCover });
})();
