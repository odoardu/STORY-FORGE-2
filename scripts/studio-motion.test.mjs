import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

function setup(reduced = false) {
  const frames = new Map(), animations = [], boards = [];
  let serial = 0;
  const context = {
    matchMedia: () => ({ matches: reduced, addEventListener() {} }),
    MutationObserver: class { observe() {} }, ResizeObserver: class { observe() {} },
    requestAnimationFrame: callback => { frames.set(++serial, callback); return serial; },
    cancelAnimationFrame: id => frames.delete(id),
    document: { body: {}, getElementById: () => null, querySelector: () => null, querySelectorAll: () => boards },
  };
  const motion = vm.runInNewContext(readFileSync(new URL("../studio-motion.js", import.meta.url), "utf8") + "; StudioMotion", context);
  const flush = () => { const pending = [...frames.values()]; frames.clear(); pending.forEach(callback => callback()); };
  flush();
  function board(key, visible, x, width) {
    const element = {
      dataset: { boardMotionKey: key }, visible, rect: { x, y: 0, width, height: width * 1.25 },
      getClientRects() { return this.visible ? [this.rect] : []; },
      getBoundingClientRect() { return { ...this.rect }; },
      animate(keyframes) { animations.push({ key, keyframes }); return { cancel() {} }; },
    };
    boards.push(element); return element;
  }
  return { motion, board, animations, flush };
}

test("returning to grid animates only the previously visible board from its expanded position", () => {
  const { motion, board, animations, flush } = setup();
  const first = board("first", false, 100, 400);
  const selected = board("selected", true, 100, 400);
  motion.captureBoards();
  // Revealing the grid changes old DOM geometry before the nested render runs.
  first.visible = true; first.rect = { x: 0, y: 0, width: 200, height: 250 };
  selected.rect = { x: 220, y: 0, width: 200, height: 250 };
  motion.captureBoards();
  motion.settleBoards(); flush();
  const restored = animations.find(animation => animation.key === "selected");
  assert.equal(restored.keyframes[0].transform, "translate(-120px, 0px) scale(2, 2)");
  const revealed = animations.find(animation => animation.key === "first");
  assert.equal(revealed.keyframes[0].opacity, .35);
  assert.equal(revealed.keyframes[0].transform, undefined);
  // The next interaction must take a fresh snapshot instead of reusing the old one.
  animations.length = 0; motion.captureBoards(); motion.settleBoards(); flush();
  assert.equal(animations.length, 0);
});

test("reduced motion skips grid animations", () => {
  const { motion, board, animations, flush } = setup(true);
  const item = board("one", true, 0, 400);
  motion.captureBoards(); item.rect.width = 200; motion.settleBoards(); flush();
  assert.equal(animations.length, 0);
});
