"use strict";
const InlineTextEditor = (() => {
  const fields = { title: 'titleInput', subtitle: 'feedSubtitleInput', kicker: 'feedKickerInput', infoTitle: 'infoTitleInput', infoBody: 'infoBodyInput', vinylTitle: 'vinyl-title', vinylArtist: 'vinyl-artist' };
  const targets = { title: 'feedTitleLayer', subtitle: 'feedSubtitlePreview', kicker: 'feedKickerPreview', infoTitle: 'informativeTitlePreview', infoBody: 'informativeBodyPreview' };
  const names = { title: 'Título', subtitle: 'Subtítulo', kicker: 'Chapéu', infoTitle: 'Título do informativo', infoBody: 'Texto do informativo', vinylTitle: 'Nome da música', vinylArtist: 'Nome do artista' };
  let selection, source, editor, tools, message, lastText = '', composing = false;
  const isVinyl = () => selection?.startsWith('vinyl');
  const isEditing = key => Boolean(editor && selection === key);
  function omit(context, key) { if (key === 'kicker' && state.kickerMode === 'image') return false; return !['title', 'infoTitle', 'infoBody', 'vinylTitle', 'vinylArtist'].includes(key) && isEditing(key) && ['videoArtworkPreview', 'storiesPreview', 'informativePreview'].includes(context.canvas.id); }
  function offsets() {
    const selected = window.getSelection();
    if (!editor || !selected?.rangeCount || !editor.contains(selected.getRangeAt(0).commonAncestorContainer)) return { start: 0, end: 0 };
    const selectedRange = selected.getRangeAt(0), prefix = document.createRange(); prefix.selectNodeContents(editor); prefix.setEnd(selectedRange.startContainer, selectedRange.startOffset);
    const start = prefix.toString().length; return { start, end: start + selectedRange.toString().length };
  }
  function selectRange(start, end) {
    const nodes = [], walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT); let node;
    while ((node = walker.nextNode())) nodes.push(node);
    const point = offset => { for (const text of nodes) { if (offset <= text.length) return [text, offset]; offset -= text.length; } return nodes.length ? [nodes.at(-1), nodes.at(-1).length] : [editor, 0]; };
    const range = document.createRange(); range.setStart(...point(start)); range.setEnd(...point(end)); const selected = window.getSelection(); selected.removeAllRanges(); selected.addRange(range);
  }
  function decorate(start = offsets().start, end = offsets().end) {
    const text = editor.value, fragment = document.createDocumentFragment(); let run, signature = '';
    for (let i = 0; i < text.length; i++) {
      const mark = selection === 'title' ? state.titleHighlightColor !== 'none' && state.titleHighlights.some(range => i >= range.start && i < range.end) : selection === 'vinylTitle' && document.getElementById('vinyl-title-style').value === 'brand' && document.getElementById('vinyl-highlight').value === 'on';
      const bold = selection === 'infoBody' ? state.infoBodyBold.some(range => i >= range.start && i < range.end) : selection === 'subtitle' && getSubtitleStyleAt(i).bold;
      const next = `${Boolean(mark)}:${Boolean(bold)}`;
      if (!run || signature !== next) { run = document.createElement('span'); run.classList.toggle('inline-title-mark', Boolean(mark) && !['title', 'vinylTitle'].includes(selection)); if (bold) run.style.fontWeight = '700'; fragment.append(run); signature = next; }
      if (run.lastChild) run.lastChild.appendData(text[i]); else run.append(document.createTextNode(text[i]));
    }
    if (!text) fragment.append(document.createTextNode(''));
    editor.replaceChildren(fragment); selectRange(Math.min(start, text.length), Math.min(end, text.length));
  }
  // CSS line boxes use the font's ascender/descender, while the artwork uses
  // an explicit alphabetic baseline. Measure the browser baseline once per style.
  const baselineCache = new Map();
  function nativeBaseline(fontSize, lineHeight, fontFamily, weight = '400') {
    const key = `${fontSize}:${lineHeight}:${fontFamily}:${weight}`;
    if (baselineCache.has(key)) return baselineCache.get(key);
    const probe = document.createElement('div'), marker = document.createElement('i');
    Object.assign(probe.style, { position: 'fixed', visibility: 'hidden', left: '-10000px', top: '0', fontFamily, fontSize: `${fontSize}px`, fontWeight: weight, lineHeight: `${lineHeight}px`, padding: '0', border: '0', margin: '0', whiteSpace: 'nowrap' });
    Object.assign(marker.style, { display: 'inline-block', width: '0', height: '0', padding: '0', border: '0', verticalAlign: 'baseline' });
    probe.append(document.createTextNode('M'), marker); document.body.append(probe);
    const baseline = marker.getBoundingClientRect().top - probe.getBoundingClientRect().top;
    probe.remove(); baselineCache.set(key, baseline); return baseline;
  }
  function canvasBaselineOffset(fontSize, fontFamily, origin, weight = '400') {
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.font = `${weight} ${fontSize}px ${fontFamily}`;
    ctx.textBaseline = 'alphabetic'; const alphabetic = ctx.measureText('M').actualBoundingBoxAscent;
    ctx.textBaseline = origin; return alphabetic - ctx.measureText('M').actualBoundingBoxAscent;
  }
  function position() {
    if (!editor || !source) return;
    let x, y, width, height, scale, fontSize, lineHeight, fontFamily, align = 'center', weight = '400', tracking = 0, transform = 'none';
    if (isVinyl()) {
      const canvas = document.getElementById('vinyl-preview'), rect = canvas.getBoundingClientRect(); scale = rect.width / 1080;
      const brand = document.getElementById('vinyl-title-style').value === 'brand';
      const layout = document.getElementById('vinylWorkspace').vinylTextLayout;
      const item = layout?.[selection === 'vinylTitle' ? 'title' : 'artist'];
      x = rect.left + (item?.x ?? 235) * scale; y = rect.top + (item?.y ?? (selection === 'vinylTitle' ? 810 : 864)) * scale;
      width = item?.width ?? 610; height = item?.height ?? 80;
      fontSize = item?.fontSize ?? (selection === 'vinylTitle' ? (brand ? 54 : 36) : 25); lineHeight = item?.lineHeight ?? fontSize * 1.2;
      weight = selection === 'vinylTitle' && !brand ? '700' : '400';
      fontFamily = selection === 'vinylTitle' && brand ? '"Tusker Story"' : 'Gotham';
      if (item?.anchorY != null) y = rect.top + (item.anchorY + canvasBaselineOffset(fontSize, fontFamily, item.baseline, weight) - nativeBaseline(fontSize, lineHeight, fontFamily, weight)) * scale;
      transform = selection === 'vinylTitle' && brand ? 'uppercase' : 'none';
    } else {
      const stage = document.getElementById('storyStage'), target = document.getElementById(targets[selection]); if (!target) return;
      const stageRect = stage.getBoundingClientRect(); scale = stageRect.width / 1080;
      const rect = target.getBoundingClientRect(), style = getComputedStyle(target);
      x = rect.left; y = rect.top; width = rect.width / scale; height = rect.height / scale;
      fontSize = parseFloat(style.fontSize) || 28; lineHeight = parseFloat(style.lineHeight) || fontSize * 1.2; fontFamily = style.fontFamily; align = style.textAlign; tracking = parseFloat(style.letterSpacing) || 0; transform = style.textTransform;
      if (selection === 'title') {
        const layouts = getFeedTitleLayouts(), first = layouts[0], last = layouts.at(-1);
        fontSize = first.fontSize; lineHeight = first.height + (layouts[1] ? layouts[1].y - first.y - first.height : 0); fontFamily = '"Tusker Story"'; align = 'center'; tracking = first.tracking; transform = 'uppercase';
        const padding = getTitlePadding();
        width = FEED.title.maxWidth - padding.left - padding.right;
        // Native letter spacing includes a trailing advance; compensate when centering.
        x = stageRect.left + ((FEED.width - width) / 2 + tracking / 2) * scale;
        y = stageRect.top + (first.baselineY - nativeBaseline(fontSize, lineHeight, fontFamily)) * scale;
        height = last.y + last.height - first.y + 16;

      }
      if (selection === 'infoBody' || selection === 'infoTitle') {
        const box = selection === 'infoBody' ? INFORMATIVE.body : INFORMATIVE.title;
        x = stageRect.left + box.x * scale; y = stageRect.top + box.y * scale; width = selection === 'infoBody' ? box.width : 862;
        fontSize = selection === 'infoBody' ? box.fontSize : 43; lineHeight = selection === 'infoBody' ? box.lineHeight : 50;
        height = selection === 'infoBody' ? 334 : 60; fontFamily = selection === 'infoBody' ? 'Gotham' : '"Tusker Story"'; align = 'left'; tracking = selection === 'infoBody' ? .15 : 0;
        y = stageRect.top + (box.y + canvasBaselineOffset(fontSize, fontFamily, 'top') - nativeBaseline(fontSize, lineHeight, fontFamily)) * scale;
      }
    }
    Object.assign(editor.style, { left: `${x}px`, top: `${y}px`, width: `${width}px`, height: `${Math.max(height, lineHeight * 1.3)}px`, fontSize: `${fontSize}px`, lineHeight: `${lineHeight}px`, fontFamily, fontWeight: weight, textAlign: align, letterSpacing: `${tracking}px`, textTransform: transform, transform: `scale(${scale})` });
    const view = window.visualViewport, top = view?.offsetTop || 0, viewportHeight = view?.height || innerHeight;
    const frame = (isVinyl() ? document.getElementById('vinyl-preview') : document.getElementById('stageFrame')).getBoundingClientRect();
    const viewportWidth = view?.width || innerWidth;
    const beside = frame.right + 10 + 44 <= viewportWidth - 8 ? frame.right + 10 : Math.max(8, frame.left - 54);
    tools.style.left = `${beside}px`; tools.style.right = 'auto';
    tools.style.top = `${Math.max(top + 8, Math.min(top + viewportHeight - tools.offsetHeight - 8, y - 30))}px`;
  }
  function close() {
    if (!editor) return;
    const field = source;
    editor.blur(); editor.remove(); tools.remove(); message.remove(); editor = tools = message = source = null; selection = null;
    document.body.classList.remove('inline-text-editing', 'inline-kicker-image'); delete document.body.dataset.inlineField;
    field.dispatchEvent(new Event('input', { bubbles: true }));
  }
  function readSource() { return source.isContentEditable ? getSubtitlePlainText() : source.value; }
  function write() {
    const saved = offsets();
    if (source.maxLength > 0 && editor.value.length > source.maxLength) editor.value = editor.value.slice(0, source.maxLength);
    if (source.isContentEditable) {
      state.subtitleMarks = state.subtitleMarks.flatMap(mark => EditorCore.remapRanges(lastText, editor.value, [mark]).map(range => ({ ...mark, ...range })));
      source.textContent = editor.value;
    } else source.value = editor.value;
    lastText = editor.value; source.dispatchEvent(new Event('input', { bubbles: true })); if (!composing) decorate(saved.start, saved.end); updateTools(); requestAnimationFrame(position);
  }
  function range() {
    let start = editor.selectionStart, end = editor.selectionEnd;
    if (start === end) { const text = editor.value; while (start > 0 && /\S/u.test(text[start - 1])) start--; while (end < text.length && /\S/u.test(text[end])) end++; }
    return { start, end };
  }
  function announce(text) { message.textContent = text; message.hidden = false; }
  function format(kind) {
    const { start, end } = range();
    if (kind === 'highlight') {
      if (selection === 'vinylTitle') { const input = document.getElementById('vinyl-highlight'), style = document.getElementById('vinyl-title-style'); input.value = style.value !== 'brand' ? 'on' : input.value === 'on' ? 'off' : 'on'; style.value = 'brand'; input.dispatchEvent(new Event('input', { bubbles: true })); }
      else if (selection === 'title') {
        if (start === end) { announce('Selecione o trecho que deseja destacar.'); return; }
        const next = EditorCore.toggleRange(state.titleHighlights, start, end);
        if (EditorCore.isFullyHighlighted(source.value, next)) { announce('Destaque só uma parte do título.'); return; }
        state.titleHighlightColor = 'pink'; void applyTitleHighlight(start, end);
      }
    } else if (selection === 'infoBody') {
      if (start === end) return; state.infoBodyBold = EditorCore.toggleRange(state.infoBodyBold, start, end); updateInformativeText();
    } else if (selection === 'subtitle') {
      if (start === end) return; applyFeedSubtitleWeight(getSubtitleStyleAt(start).bold ? 'normal' : 'bold', { start, end });
    }
    decorate(start, end); updateTools(); editor.focus({ preventScroll: true }); editor.setSelectionRange(start, end); position();
  }
  function updateTools() {
    if (!editor) return;
    if (selection === 'kicker') {
      const image = state.kickerMode === 'image';
      document.body.classList.toggle('inline-kicker-image', image);
      editor.hidden = image; editor.contentEditable = String(!image);
      if (image && document.activeElement === editor) editor.blur();
      tools.querySelector('[data-kicker-cycle]')?.setAttribute('aria-description', image ? `Atual: Mundo Soldier ${state.kickerLogoIndex + 1}` : 'Atual: chapéu em texto');
    }
    const { start, end } = range();
    for (const button of tools.querySelectorAll('[data-kind]')) {
      const active = button.dataset.kind === 'highlight'
        ? selection === 'vinylTitle' ? document.getElementById('vinyl-title-style').value === 'brand' && document.getElementById('vinyl-highlight').value === 'on' : end > start && Array.from({ length: end - start }, (_, i) => start + i).every(i => state.titleHighlights.some(r => i >= r.start && i < r.end))
        : selection === 'infoBody' ? end > start && Array.from({ length: end - start }, (_, i) => start + i).every(i => state.infoBodyBold.some(r => i >= r.start && i < r.end)) : getSubtitleStyleAt(start).bold;
      button.setAttribute('aria-pressed', String(Boolean(active)));
    }
  }
  function open(key) {
    const field = document.getElementById(fields[key]); if (!field) return;
    if (editor && selection === key) { if (!editor.hidden) editor.focus({ preventScroll: true }); return; }
    close(); if (typeof StudioUI !== 'undefined') StudioUI.closeOtherPanels();
    selection = key; source = field; lastText = readSource();
    editor = document.createElement('div'); editor.id = 'inlineTextEditor'; editor.className = 'inline-text-editor'; editor.contentEditable = 'true'; editor.setAttribute('role', 'textbox'); editor.setAttribute('aria-multiline', 'true'); editor.spellcheck = false; editor.setAttribute('aria-label', `${names[key]} diretamente na prévia`); editor.setAttribute('autocorrect', 'off');
    Object.defineProperties(editor, { value: { get() { return this.textContent; }, set(value) { this.textContent = value; } }, selectionStart: { get() { return offsets().start; } }, selectionEnd: { get() { return offsets().end; } } }); editor.setSelectionRange = selectRange; editor.value = lastText;
    if (field.maxLength > 0) editor.maxLength = field.maxLength;
    tools = document.createElement('div'); tools.className = 'inline-text-tools'; tools.setAttribute('role', 'toolbar'); tools.setAttribute('aria-label', 'Formatação do texto na prévia');
    const button = (label, path, action) => { const element = document.createElement('button'); element.type = 'button'; element.setAttribute('aria-label', label); element.innerHTML = `<svg viewBox="0 0 24 24">${path}</svg>`; element.addEventListener('pointerdown', event => { event.preventDefault(); event.stopPropagation(); }); element.addEventListener('click', event => { event.stopPropagation(); action(); }); if (label.includes('Tarja') || label.includes('tarja')) element.dataset.kind = 'highlight'; else if (label.includes('Negrito')) element.dataset.kind = 'bold'; tools.append(element); return element; };
    if (key === 'kicker') {
      const cycle = button('Alternar chapéu ou logo', '<path d="M20 7h-5m5 0V2M4 17h5m-5 0v5M5.5 7A7 7 0 0 1 17 4l3 3M4 17l3 3a7 7 0 0 0 11.5-3"/>', () => {
        const next = state.kickerMode !== 'image' ? 'image:0' : state.kickerLogoIndex === 0 ? 'image:1' : 'text:1';
        selectKickerAppearance(next);
        updateTools(); position();
        if (state.kickerMode === 'text') editor.focus({ preventScroll: true });
      });
      cycle.dataset.kickerCycle = '';
    }
    if (['infoBody', 'subtitle'].includes(key)) button('Negrito na seleção', '<path d="M7 4v16M7 4h6a4 4 0 0 1 0 8H7m6 0a4 4 0 0 1 0 8H7"/>', () => format('bold'));
    if (['title', 'vinylTitle'].includes(key)) button(key === 'vinylTitle' ? 'Ativar ou desativar tarja rosa' : 'Tarja rosa na seleção', '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="M7 8h10M12 8v8"/>', () => format('highlight'));
    button('Concluir edição na prévia', '<path d="m5 12 4 4L19 6"/>', close);
    message = document.createElement('p'); message.className = 'inline-text-message'; message.setAttribute('role', 'status'); message.hidden = true;

    document.body.append(editor, tools, message); document.body.classList.add('inline-text-editing'); document.body.dataset.inlineField = key;
    editor.addEventListener('pointerdown', event => event.stopPropagation()); editor.addEventListener('click', event => event.stopPropagation()); editor.addEventListener('input', write);
    const insert = text => { const { start, end } = offsets(); const native = window.getSelection()?.getRangeAt(0); if (!native) return; native.deleteContents(); native.insertNode(document.createTextNode(text)); selectRange(start + text.length, start + text.length); write(); };
    editor.addEventListener('beforeinput', event => { if (['insertParagraph', 'insertLineBreak'].includes(event.inputType)) { event.preventDefault(); insert('\n'); } });
    editor.addEventListener('paste', event => { event.preventDefault(); insert(event.clipboardData.getData('text/plain')); });
    editor.addEventListener('compositionstart', () => { composing = true; }); editor.addEventListener('compositionend', () => { composing = false; write(); });
    editor.addEventListener('keydown', event => { if (event.key === 'Escape') { event.preventDefault(); close(); } if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'b') { event.preventDefault(); format('bold'); } });
    decorate(0, 0); updateTools(); position(); if (!editor.hidden) editor.focus({ preventScroll: true }); source.dispatchEvent(new Event('input', { bubbles: true })); requestAnimationFrame(position);
  }
  document.addEventListener('pointerdown', event => {
    if (!editor || event.target.closest('.inline-text-editor,.inline-text-tools')) return;
    close();
  }, true);
  document.addEventListener('click', event => {
    if (event.target.closest('.inline-text-editor,.inline-text-tools')) return;
    const key = Object.entries(targets).find(([, id]) => event.target.closest(`#${id}`))?.[0];
    if (key) { event.preventDefault(); event.stopImmediatePropagation(); open(key); return; }
    if (event.target.id === 'vinyl-preview') {
      const rect = event.target.getBoundingClientRect(), y = (event.clientY - rect.top) * 1350 / rect.height;
      const layout = document.getElementById('vinylWorkspace').vinylTextLayout;
      const key = layout && y >= layout.artist.y && y <= layout.artist.y + layout.artist.height ? 'vinylArtist' : layout && y >= layout.title.y && y <= layout.title.y + layout.title.height ? 'vinylTitle' : null;
      if (key) { event.preventDefault(); event.stopImmediatePropagation(); open(key); }
    }
  }, true);
  window.addEventListener('resize', () => requestAnimationFrame(position)); window.visualViewport?.addEventListener('resize', () => requestAnimationFrame(position)); window.visualViewport?.addEventListener('scroll', () => requestAnimationFrame(position));
  document.addEventListener('scroll', () => requestAnimationFrame(position), true);
  document.addEventListener('selectionchange', updateTools);
  document.addEventListener('inline:refresh', () => { if (!editor) return; const saved = offsets(); editor.value = lastText = readSource(); decorate(saved.start, saved.end); updateTools(); position(); });
  document.addEventListener('inline:finish', close);
  return { open, close, position, isEditing, omit };
})();
