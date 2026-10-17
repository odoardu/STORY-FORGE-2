import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";

function setup() {
  const timers = new Map(); let next = 0, disconnected = 0;
  function element() {
    const classes = new Set();
    return {
      children: [], isConnected: true, clientWidth: 300, clientHeight: 375,
      classList: { add: name => classes.add(name), remove: name => classes.delete(name), contains: name => classes.has(name) },
      attrs: {}, setAttribute(key, value) { this.attrs[key] = value; },
      append(child) { this.children.push(child); child.parent = this; },
      remove() { this.isConnected = false; this.parent.children = this.parent.children.filter(child => child !== this); },
    };
  }
  const context = {
    document: { createElementNS: () => element() },
    ResizeObserver: class { constructor(callback) { this.callback = callback; } observe() { this.callback(); } disconnect() { disconnected++; } },
    setTimeout: callback => { timers.set(++next, callback); return next; }, clearTimeout: id => timers.delete(id),
  };
  const border = vm.runInNewContext(readFileSync(new URL("../media-loading-border.js", import.meta.url), "utf8") + "; MediaLoadingBorder", context);
  return { border, element, timers, disconnected: () => disconnected };
}

test("parallel uploads share one ring and complete only when both finish", () => {
  const { border, element, timers } = setup(), target = element();
  const first = border.begin(() => target), second = border.begin(() => target);
  assert.equal(target.children.length, 1);
  assert.equal(target.children[0].attrs.viewBox, "0 0 300 375");
  first(true);
  assert.equal(target.children[0].classList.contains("is-complete"), false);
  second(true);
  assert.equal(target.children[0].classList.contains("is-complete"), true);
  for (const callback of [...timers.values()]) callback();
  assert.equal(target.children.length, 0);
  assert.equal(target.classList.contains("is-media-loading"), false);
});

test("rerender reattaches the ring to the same page and failure cleans it up", () => {
  const { border, element, disconnected } = setup();
  let target = element();
  const old = target, finish = border.begin(() => target);
  old.isConnected = false; target = element(); border.sync();
  assert.equal(old.children.length, 0);
  assert.equal(target.children.length, 1);
  finish(false); finish(false);
  assert.equal(target.children.length, 0);
  assert.equal(disconnected(), 2);
});

test("switching away hides the ring and switching back restores an unfinished upload", () => {
  const { border, element } = setup(), target = element(); let visible = true;
  const finish = border.begin(() => visible ? target : null);
  visible = false; border.sync(); assert.equal(target.children.length, 0);
  visible = true; border.sync(); assert.equal(target.children.length, 1);
  finish(false); assert.equal(target.children.length, 0);
});
