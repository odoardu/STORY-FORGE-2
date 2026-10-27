import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

function viewport() {
  const values = new Map(), classes = new Set();
  let editing = false;
  const context = {
    innerHeight: 844, innerWidth: 390,
    window: { visualViewport: { height: 844, offsetTop: 0 } },
    matchMedia: () => ({ matches: true }),
    document: {
      activeElement: { matches: () => editing },
      documentElement: { style: { setProperty: (key, value) => values.set(key, value) } },
      body: { classList: { contains: key => classes.has(key), toggle: (key, on) => on ? classes.add(key) : classes.delete(key) } },
    },
  };
  const source = readFileSync(new URL('../workbench-preview-ui.js', import.meta.url), 'utf8')
    .replace('return { init, sync, closeOtherPanels };', 'return { syncViewport };');
  const api = vm.runInNewContext(source + '; StudioUI', context);
  return { context, values, classes, sync: api.syncViewport, edit: value => { editing = value; } };
}

test('Safari keyboard updates visible panel space without moving the artwork', () => {
  const v = viewport(); v.sync(); v.edit(true); v.sync();
  v.context.window.visualViewport.height = 480; v.sync();
  assert.equal(v.values.get('--editor-viewport-height'), '844px');
  assert.equal(v.values.get('--viewport-height'), '480px');
  assert.equal(v.values.get('--keyboard-inset'), '364px');
  assert.ok(v.classes.has('keyboard-open'));
  v.edit(false); v.sync();
  assert.equal(v.values.get('--editor-viewport-height'), '844px');
  v.context.window.visualViewport.height = 844; v.sync();
  assert.equal(v.classes.has('keyboard-open'), false);
});

test('resizing layout viewport keeps art stable during keyboard and resets on rotation', () => {
  const v = viewport(); v.sync(); v.edit(true);
  v.context.innerHeight = 480; v.context.window.visualViewport.height = 480; v.sync();
  assert.equal(v.values.get('--editor-viewport-height'), '844px');
  assert.ok(v.classes.has('keyboard-open'));
  v.context.innerWidth = 844; v.context.innerHeight = 390; v.context.window.visualViewport.height = 390; v.sync();
  assert.equal(v.values.get('--editor-viewport-height'), '390px');
  assert.equal(v.classes.has('keyboard-open'), false);
});
