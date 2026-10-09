import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const core = vm.runInNewContext(readFileSync(new URL('../editor-core.js', import.meta.url), 'utf8') + '\nEditorCore;');
const plain = value => JSON.parse(JSON.stringify(value));

test('new text is plain; selections accumulate and a selected subrange can be cleared', () => {
  assert.deepEqual(plain(core.titleLines('LINKIN PARK', []))[0].marks, Array(11).fill(false));
  let ranges = core.toggleRange([], 0, 6);
  ranges = core.toggleRange(ranges, 7, 11);
  assert.deepEqual(plain(ranges), [{ start: 0, end: 6 }, { start: 7, end: 11 }]);
  ranges = core.toggleRange(ranges, 2, 4);
  assert.deepEqual(plain(ranges), [{ start: 0, end: 2 }, { start: 4, end: 6 }, { start: 7, end: 11 }]);
});

test('inserting inside a marked phrase does not mark the newly typed characters', () => {
  assert.deepEqual(plain(core.remapRanges('PARK', 'PAXRK', [{ start: 0, end: 4 }])), [{ start: 0, end: 2 }, { start: 3, end: 5 }]);
  assert.deepEqual(plain(core.remapRanges('PARK', 'NEW PARK', [{ start: 0, end: 4 }])), [{ start: 4, end: 8 }]);
  assert.deepEqual(plain(core.remapRanges('PARK', '', [{ start: 0, end: 4 }])), []);
});

test('removing/replacing marked text preserves only surviving characters', () => {
  assert.deepEqual(plain(core.remapRanges('LINKIN PARK', 'LINKIN ROCK', [{ start: 7, end: 11 }])), [{ start: 10, end: 11 }]);
  assert.deepEqual(plain(core.remapRanges('A BAND', 'BAND', [{ start: 2, end: 6 }])), [{ start: 0, end: 4 }]);
});

test('selection offsets survive normalization, accents, newlines and uppercase expansion', () => {
  const source = '  ação  nova\nß';
  const lines = plain(core.titleLines(source, [{ start: 2, end: 6 }, { start: source.indexOf('ß'), end: source.length }]));
  assert.equal(lines[0].text, 'AÇÃO NOVA');
  assert.deepEqual(lines[0].marks, [true, true, true, true, false, false, false, false, false]);
  assert.equal(lines[1].text, 'SS');
  assert.deepEqual(lines[1].marks, [true, true]);
});

for (const [name, width, height] of [['landscape', 2400, 1000], ['portrait', 800, 2400], ['square', 1000, 1000], ['small', 100, 80]]) {
  test(`${name} image keeps its aspect ratio and cannot expose empty edges`, () => {
    for (const zoom of [0.1, 1, 2, 5, 20]) {
      for (const pan of [-100000, 0, 100000]) {
        const result = core.imageGeometry(width, height, 1080, 1350, zoom, pan, -pan);
        assert.ok(Math.abs(result.width / result.height - width / height) < 1e-10);
        assert.ok(result.x <= 1e-8 && result.y <= 1e-8);
        assert.ok(result.x + result.width >= 1080 - 1e-8);
        assert.ok(result.y + result.height >= 1350 - 1e-8);
        assert.ok(result.zoom >= result.minZoom && result.zoom <= 5);
      }
    }
  });
}

test('panning reveals both full source edges instead of moving a pre-cropped image', () => {
  const left = core.imageGeometry(2400, 1000, 1080, 1350, 1, 100000, 0);
  const right = core.imageGeometry(2400, 1000, 1080, 1350, 1, -100000, 0);
  assert.equal(left.width, 3240);
  assert.equal(left.x, 0);
  assert.equal(right.x + right.width, 1080);
  assert.equal(left.panY, 0);
});

test('2200 × 3450 source starts at native dimensions and stops at its own edges', () => {
  const image = core.imageGeometry(2200, 3450, 1080, 1350, 1, 99999, -99999);
  assert.equal(image.width, 2200);
  assert.equal(image.height, 3450);
  assert.equal(image.panX, 560);
  assert.equal(image.panY, -1050);
  assert.equal(image.x, 0);
  assert.equal(image.y + image.height, 1350);
  const zoomedOut = core.imageGeometry(2200, 3450, 1080, 1350, 0.01, -99999, 99999);
  assert.equal(zoomedOut.width, 1080);
  assert.equal(zoomedOut.x, 0);
  assert.ok(zoomedOut.y <= 0 && zoomedOut.y + zoomedOut.height >= 1350);
});
