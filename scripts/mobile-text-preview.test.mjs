import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
const source = readFileSync(new URL('../mobile-text-preview.js', import.meta.url), 'utf8');
const { geometry } = vm.runInNewContext(source + '; MobileTextPreview', {
  matchMedia: () => ({}), document: { readyState: 'loading', addEventListener() {} }
});
for (const [width, height, offset] of [[390, 844, 0], [390, 480, 0], [390, 430, 110], [320, 340, 0], [844, 260, 25]]) {
  test(`preview and text panel remain separated inside ${width}×${height} visible pixels, offset ${offset}`, () => {
    const layout = geometry(width, height, offset);
    assert.ok(layout.previewTop >= offset);
    assert.ok(layout.previewHeight >= 100);
    assert.ok(layout.previewTop + layout.previewHeight + 8 <= layout.panelTop);
    assert.ok(layout.panelTop + layout.panelHeight <= offset + height);
    assert.ok(layout.panelHeight >= 100);
  });
}
test('inline editing gives the artwork the visible height instead of reserving a text popup', () => {
  for (const height of [844, 480, 340]) {
    const layout = geometry(390, height, 50, true);
    assert.ok(layout.previewTop >= 50);
    assert.ok(layout.previewTop + layout.previewHeight <= 50 + height);
    assert.ok(layout.previewHeight > height * .8);
  }
});
