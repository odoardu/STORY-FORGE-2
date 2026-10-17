"use strict";
const StudioMotion = (() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const ease = "cubic-bezier(.22, 1, .36, 1)";
  const running = new Map(), identities = new WeakMap();
  let serial = 0, queued = false, gridFrame = 0, boardSnapshotPending = false, previousBoards = new Map();
  function key(object) {
    if (!identities.has(object)) identities.set(object, String(++serial));
    return identities.get(object);
  }
  function animate(element, frames, duration = 360) {
    if (!element || reduced.matches || !element.getClientRects().length) return;
    running.get(element)?.cancel();
    const animation = element.animate(frames, { duration, easing: ease });
    running.set(element, animation);
    const clean = () => { if (running.get(element) === animation) running.delete(element); };
    animation.onfinish = clean; animation.oncancel = clean;
  }
  function captureBoards() {
    // Keep the first visual state until layout settles, even across nested renders.
    if (boardSnapshotPending) return;
    boardSnapshotPending = true;
    previousBoards = new Map();
    if (reduced.matches) return;
    document.querySelectorAll("[data-board-motion-key]").forEach(element => {
      if (element.getClientRects().length) previousBoards.set(element.dataset.boardMotionKey, element.getBoundingClientRect());
      running.get(element)?.cancel();
    });
  }
  function settleBoards() {
    cancelAnimationFrame(gridFrame);
    gridFrame = requestAnimationFrame(() => {
      boardSnapshotPending = false;
      if (reduced.matches) return;
      document.querySelectorAll("[data-board-motion-key]").forEach(element => {
        if (!element.getClientRects().length) return;
        const before = previousBoards.get(element.dataset.boardMotionKey), after = element.getBoundingClientRect();
        if (!before) {
          animate(element, [{ opacity: .35, translate: "0 10px", scale: ".97" }, { opacity: 1, translate: "0 0", scale: "1" }], 360);
        } else if (Math.abs(before.x - after.x) + Math.abs(before.y - after.y) + Math.abs(before.width - after.width) > 1 && after.width && after.height) {
          animate(element, [
            { transformOrigin: "0 0", transform: `translate(${before.x - after.x}px, ${before.y - after.y}px) scale(${before.width / after.width}, ${before.height / after.height})` },
            { transformOrigin: "0 0", transform: "none" }
          ], 420);
        }
      });
      previousBoards.clear();
    });
  }
  function formatChanged() {
    const format = document.querySelector(".experience-shell").dataset.format;
    const target = document.getElementById(format === "informative" ? "informativeArtboards" : format === "polaroid" ? "polaroidArtboards" : "stageFrame");
    animate(target, [{ opacity: .5, translate: "0 12px" }, { opacity: 1, translate: "0 0" }], 400);
  }
  const surfaces = ["mediaPopover", "textEditPopover", "circlePopover", "effectsPopover", "videoOptionsPanel"];
  const visibility = new Map();
  function sync() {
    queued = false;
    surfaces.forEach(id => {
      const element = document.getElementById(id);
      if (!element) return;
      const visible = !element.hidden && (id !== "mediaPopover" || document.body.classList.contains("mobile-controls-open")) && getComputedStyle(element).display !== "none";
      if (visible && !visibility.get(id)) animate(element, [{ opacity: 0, translate: "0 14px", scale: ".98" }, { opacity: 1, translate: "0 0", scale: "1" }], 340);
      if (!visible) running.get(element)?.cancel();
      visibility.set(id, visible);
    });
    const formats = document.querySelector(".glass-dock .dock-formats"), selected = formats?.querySelector('.format-option[aria-pressed="true"]');
    if (selected && selected.getClientRects().length) {
      const root = formats.getBoundingClientRect(), rect = selected.getBoundingClientRect();
      formats.style.setProperty("--selection-x", `${rect.x - root.x}px`);
      formats.style.setProperty("--selection-y", `${rect.y - root.y}px`);
      formats.style.setProperty("--selection-width", `${rect.width}px`);
      formats.style.setProperty("--selection-height", `${rect.height}px`);
    }
  }
  function schedule() { if (!queued) { queued = true; requestAnimationFrame(sync); } }
  new MutationObserver(schedule).observe(document.body, { subtree: true, attributes: true, attributeFilter: ["hidden", "open", "class", "aria-pressed"] });
  const dock = document.querySelector(".glass-dock");
  if (dock) new ResizeObserver(schedule).observe(dock);
  reduced.addEventListener("change", () => { if (reduced.matches) { running.forEach(animation => animation.cancel()); running.clear(); } schedule(); });
  schedule();
  return { key, captureBoards, settleBoards, formatChanged };
})();
