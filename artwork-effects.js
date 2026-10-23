"use strict";
// A small raster fallback keeps blur identical in preview and export, including Safari.
const ArtworkEffects = (() => {
  const cache = new WeakMap();
  // Reuse both buffers and sum RGBA together. Keep the same three box-blur
  // passes and Uint8Clamped rounding as the original raster effect.
  function boxPass(source, output, width, height, radius, horizontal) {
    const length = horizontal ? width : height, lines = horizontal ? height : width;
    const stride = horizontal ? 4 : width * 4, divisor = radius * 2 + 1;
    for (let line = 0; line < lines; line++) {
      const base = horizontal ? line * width * 4 : line * 4;
      let r = 0, g = 0, b = 0, a = 0;
      for (let offset = -radius; offset <= radius; offset++) {
        const i = base + Math.max(0, Math.min(length - 1, offset)) * stride;
        r += source[i]; g += source[i + 1]; b += source[i + 2]; a += source[i + 3];
      }
      for (let pixel = 0, i = base; pixel < length; pixel++, i += stride) {
        output[i] = r / divisor; output[i + 1] = g / divisor;
        output[i + 2] = b / divisor; output[i + 3] = a / divisor;
        const add = base + Math.min(length - 1, pixel + radius + 1) * stride;
        const remove = base + Math.max(0, pixel - radius) * stride;
        r += source[add] - source[remove]; g += source[add + 1] - source[remove + 1];
        b += source[add + 2] - source[remove + 2]; a += source[add + 3] - source[remove + 3];
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
      if (radius) {
        const scratch = new Uint8ClampedArray(data.length);
        for (let pass = 0; pass < 3; pass++) {
          boxPass(data, scratch, cw, ch, radius, true);
          boxPass(scratch, data, cw, ch, radius, false);
        }
      }
      if (saturation !== 1 || brightness !== 1 || contrast !== 1) for (let i = 0; i < data.length; i += 4) {
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
