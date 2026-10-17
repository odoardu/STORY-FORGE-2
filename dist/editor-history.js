"use strict";
const EditorHistory = (() => {
  const past = [], future = [];
  let restoring = false;
  function record(before, after, restore, label, key = null) {
    if (restoring || Object.is(before, after)) return;
    const previous = past.at(-1), now = Date.now();
    if (key && previous?.key === key && now - previous.time < 500) {
      previous.after = after; previous.time = now;
    } else {
      past.push({ before, after, restore, label, key, time: now });
      if (past.length > 50) past.shift();
    }
    future.length = 0;
  }
  function move(from, to, field) {
    const entry = from.pop();
    if (!entry) return null;
    restoring = true;
    try { entry.restore(entry[field]); to.push(entry); return entry.label; }
    finally { restoring = false; }
  }
  return { record, undo: () => move(past, future, "before"), redo: () => move(future, past, "after") };
})();
