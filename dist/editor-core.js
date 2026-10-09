"use strict";

const EditorCore = (() => {
  function mergeRanges(ranges) {
    const result = [];
    for (const range of ranges.filter(r => r.end > r.start).sort((a, b) => a.start - b.start)) {
      const last = result.at(-1);
      if (last && range.start <= last.end) last.end = Math.max(last.end, range.end);
      else result.push({ ...range });
    }
    return result;
  }

  function toggleRange(ranges, start, end) {
    if (end <= start) return ranges;
    const merged = mergeRanges(ranges);
    if (!merged.some(r => r.start <= start && r.end >= end)) return mergeRanges([...merged, { start, end }]);
    return merged.flatMap(r => [
      { start: r.start, end: Math.min(r.end, start) },
      { start: Math.max(r.start, end), end: r.end },
    ]).filter(r => r.end > r.start);
  }

  // Keep existing characters marked across edits; newly typed characters are plain.
  function remapRanges(before, after, ranges) {
    let start = 0;
    while (start < before.length && start < after.length && before[start] === after[start]) start++;
    let oldEnd = before.length;
    let newEnd = after.length;
    while (oldEnd > start && newEnd > start && before[oldEnd - 1] === after[newEnd - 1]) { oldEnd--; newEnd--; }
    const delta = newEnd - oldEnd;
    return mergeRanges(ranges.flatMap(r => [
      { start: r.start, end: Math.min(r.end, start) },
      { start: Math.max(r.start, oldEnd) + delta, end: r.end + delta },
    ]).filter(r => r.end > r.start));
  }

  function titleLines(source, ranges) {
    return Array.from(source.matchAll(/[^\r\n]+/g), match => {
      let text = "";
      const marks = [];
      for (const word of match[0].matchAll(/\S+/gu)) {
        if (text) { text += " "; marks.push(false); }
        let offset = match.index + word.index;
        for (const char of word[0]) {
          const upper = char.toUpperCase();
          const marked = ranges.some(r => offset < r.end && offset + char.length > r.start);
          text += upper;
          marks.push(...Array(upper.length).fill(marked));
          offset += char.length;
        }
      }
      // Spaces inside a marked phrase belong to that same rectangle.
      for (let i = 1; i < marks.length - 1; i++) {
        if (text[i] === " " && marks[i - 1] && marks[i + 1]) marks[i] = true;
      }
      return { text, marks };
    }).filter(line => line.text);
  }

  function imageGeometry(imageWidth, imageHeight, frameWidth, frameHeight, zoom = 1, panX = 0, panY = 0) {
    const coverScale = Math.max(frameWidth / imageWidth, frameHeight / imageHeight);
    const scale = Math.max(1, coverScale);
    const minZoom = coverScale / scale;
    const safeZoom = Math.max(minZoom, Math.min(5, Number.isFinite(zoom) ? zoom : 1));
    const baseWidth = imageWidth * scale;
    const baseHeight = imageHeight * scale;
    const width = baseWidth * safeZoom;
    const height = baseHeight * safeZoom;
    const limitX = Math.max(0, (width - frameWidth) / 2);
    const limitY = Math.max(0, (height - frameHeight) / 2);
    const x = Math.max(-limitX, Math.min(limitX, panX));
    const y = Math.max(-limitY, Math.min(limitY, panY));
    return { baseWidth, baseHeight, width, height, minZoom, zoom: safeZoom, panX: x, panY: y, x: (frameWidth - width) / 2 + x, y: (frameHeight - height) / 2 + y };
  }

  return Object.freeze({ mergeRanges, toggleRange, remapRanges, titleLines, imageGeometry });
})();
