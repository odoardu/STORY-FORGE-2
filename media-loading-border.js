"use strict";
// UI only: the ring is outside the artwork canvases and never enters exports.
const MediaLoadingBorder = (() => {
  const jobs = new Map(), rings = new Map();
  function remove(target) {
    const ring = rings.get(target);
    if (!ring) return;
    clearTimeout(ring.timer); ring.observer.disconnect(); ring.svg.remove();
    target.classList.remove("is-media-loading");
    rings.delete(target);
  }
  function create(target) {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.classList.add("media-border-loading"); svg.setAttribute("aria-hidden", "true");
    for (const name of ["media-border-track", "media-border-runner"]) {
      const rect = document.createElementNS(ns, "rect");
      rect.classList.add(name); rect.setAttribute("pathLength", "100");
      rect.setAttribute("vector-effect", "non-scaling-stroke"); svg.append(rect);
    }
    const resize = () => {
      const width = target.clientWidth, height = target.clientHeight;
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      for (const rect of svg.children) {
        for (const [key, value] of Object.entries({ x: 1, y: 1, width: Math.max(0, width - 2), height: Math.max(0, height - 2), rx: 10 })) rect.setAttribute(key, String(value));
      }
    };
    const observer = new ResizeObserver(resize); observer.observe(target);
    target.append(svg); resize();
    const ring = { svg, observer, timer: null, completed: false };
    rings.set(target, ring); return ring;
  }
  function sync() {
    const desired = new Set([...jobs.values()].map(resolve => resolve()).filter(Boolean));
    for (const [target, ring] of rings) if (!target.isConnected || (!desired.has(target) && !ring.completed)) remove(target);
    for (const target of desired) {
      const ring = rings.get(target) || create(target);
      clearTimeout(ring.timer); ring.completed = false;
      ring.svg.classList.remove("is-complete"); target.classList.add("is-media-loading");
    }
  }
  function begin(resolveTarget) {
    const job = Symbol("media-border"); jobs.set(job, resolveTarget); sync();
    return success => {
      if (!jobs.has(job)) return;
      const target = resolveTarget(); jobs.delete(job);
      const shared = [...jobs.values()].some(resolve => resolve() === target);
      const ring = rings.get(target);
      if (ring && !shared) {
        if (success) {
          ring.completed = true; ring.svg.classList.add("is-complete");
          ring.timer = setTimeout(() => remove(target), 600);
        } else remove(target);
      }
      sync();
    };
  }
  return { begin, sync };
})();
