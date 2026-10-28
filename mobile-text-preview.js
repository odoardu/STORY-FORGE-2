"use strict";
// The actual artwork remains live; only its viewing space changes during text editing.
const MobileTextPreview = (() => {
  function geometry(width, height, top = 0, inline = false) {
    if (inline) return { width, previewTop: top + 8, previewHeight: Math.max(100, height - 24), panelTop: top + height - 52, panelHeight: 44 };
    const panel = Math.min(300, Math.max(130, Math.round(height * .44)), Math.max(80, height - 140));
    const preview = Math.max(60, height - panel - 32);
    return { width, previewTop: top + 10, previewHeight: preview, panelTop: top + preview + 22, panelHeight: panel };
  }
  const query = matchMedia('(max-width:800px), (max-width:960px) and (pointer:coarse)');
  let frame, lastKey = '', activePanel, savedScroll = 0;
  const set = (name, value) => { const style = document.documentElement.style; if (style.getPropertyValue(name) !== value) style.setProperty(name, value); };
  function update() {
    const vinyl = document.body.classList.contains('vinyl-active');
    const inline = document.body.classList.contains('inline-text-editing');
    const panel = vinyl ? document.querySelector('#vinylWorkspace.vinyl-panel-open aside') : document.getElementById('textEditPopover');
    const active = query.matches && (inline || panel && !panel.hidden);
    const wasActive = document.body.classList.contains('mobile-text-editing');
    if (Boolean(active) !== wasActive) document.body.classList.toggle('mobile-text-editing', Boolean(active));
    const host = document.querySelector('.stage-host');
    if (!wasActive && active) savedScroll = host?.scrollTop || 0;
    if (!active) {
      if (activePanel) activePanel.removeAttribute('data-mobile-text-panel');
      activePanel = null;
      if (lastKey) { lastKey = ''; if (typeof updateStageScale === 'function') updateStageScale(); if (host) requestAnimationFrame(() => { host.scrollTop = savedScroll; }); }
      return;
    }
    if (!inline && activePanel !== panel) { activePanel?.removeAttribute('data-mobile-text-panel'); activePanel = panel; panel.setAttribute('data-mobile-text-panel', ''); }
    const view = window.visualViewport, width = view?.width || innerWidth, height = view?.height || innerHeight, top = view?.offsetTop || 0;
    const layout = geometry(width, height, top, inline);
    for (const [name, value] of Object.entries(layout)) set(`--text-${name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}`, `${value}px`);
    const key = [width, height, top, vinyl, inline, document.querySelector('.experience-shell')?.dataset.format].join(':');
    if (key !== lastKey) { lastKey = key; if (typeof updateStageScale === 'function') updateStageScale(); if (typeof InlineTextEditor !== 'undefined') requestAnimationFrame(InlineTextEditor.position); }
  }
  function schedule() { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); }
  function init() {
    new MutationObserver(schedule).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['hidden', 'class'] });
    window.visualViewport?.addEventListener('resize', schedule); window.visualViewport?.addEventListener('scroll', schedule);
    window.addEventListener('resize', schedule); query.addEventListener('change', schedule);
    document.addEventListener('focusin', schedule); document.addEventListener('focusout', schedule);
    schedule();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
  return { geometry };
})();
