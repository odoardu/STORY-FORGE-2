import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const core = vm.runInNewContext(readFileSync(new URL('../editor-core.js', import.meta.url), 'utf8') + '\nEditorCore;', { Event });
function slider(handles = []) {
  const listeners = new Map(), events = [];
  const input = { min: '0', max: '90', value: '0', style: {}, disabled: false,
    getBoundingClientRect: () => ({ left: 100, width: 300 }),
    addEventListener(type, callback) { listeners.set(type, callback); },
    dispatchEvent(event) { events.push(event.type); },
    setPointerCapture() {}, releasePointerCapture() {}, focus() {}
  };
  core.bindTimelineSeek(input, handles);
  const fire = (type, x, extra = {}) => listeners.get(type)({ clientX: x, pointerId: 1, button: 0, preventDefault() {}, ...extra });
  return { input, events, fire };
}
test('click jumps directly to its time, dragging follows and clamps at the track edges', () => {
  const { input, events, fire } = slider();
  fire('pointerdown', 250); assert.equal(Number(input.value), 45);
  fire('pointermove', 325); assert.equal(Number(input.value), 67.5);
  fire('pointermove', 900); assert.equal(Number(input.value), 90);
  fire('pointerup', 50); assert.equal(Number(input.value), 0);
  assert.equal(events.at(-1), 'change');
  fire('pointermove', 250); assert.equal(Number(input.value), 0);
});

test('track clicks move the nearest pink handle and keep the same end during dragging', () => {
  const events = [];
  const start = { value: '10', focus() {}, dispatchEvent(event) { events.push(['start', event.type]); } };
  const end = { value: '70', focus() {}, dispatchEvent(event) { events.push(['end', event.type]); } };
  const { input, fire } = slider([start, end]);
  fire('pointerdown', 150); assert.equal(Number(start.value), 15); assert.equal(Number(end.value), 70);
  fire('pointerup', 150);
  fire('pointerdown', 300); assert.equal(Number(end.value), 60);
  fire('pointermove', 180); assert.equal(Number(end.value), 24); assert.equal(Number(start.value), 15);
  fire('pointerup', 180);
  assert.deepEqual(events.at(-1), ['end', 'change']);
  assert.equal(input.value, '0', 'track clicks must not move the white playback line directly');
});
test('switching media uses the new duration and disabled, secondary or canceled gestures do not seek', () => {
  const { input, fire } = slider();
  input.max = '20'; fire('pointerdown', 325); assert.equal(Number(input.value), 15);
  fire('pointercancel', 325); fire('pointermove', 150); assert.equal(Number(input.value), 15);
  input.disabled = true; fire('pointerdown', 150); assert.equal(Number(input.value), 15);
  input.disabled = false; fire('pointerdown', 150, { button: 2 }); assert.equal(Number(input.value), 15);
  fire('pointerdown', 150, { isPrimary: false }); assert.equal(Number(input.value), 15);
});
