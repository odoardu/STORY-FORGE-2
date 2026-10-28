(() => {
  let root, button, mounting, active = false, busy = false, ready = false, previousExport;
  const icon = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M5 12a7 7 0 0 1 7-7m0 14a7 7 0 0 0 7-7"/></svg>';
  const byId = id => root.querySelector(`[data-vinyl-id="${id}"]`);
  function syncExport() {
    if (!active) return;
    const exportButton = document.getElementById('exportButton');
    if (exportButton.disabled !== busy) exportButton.disabled = busy;
    if (exportButton.getAttribute('aria-label') !== 'Exportar vinil MP4') exportButton.setAttribute('aria-label', 'Exportar vinil MP4');
  }
  const close = () => { root?.classList.remove('vinyl-panel-open'); if (root?.querySelector('.vinyl-effects')) root.querySelector('.vinyl-effects').hidden = true; root?.querySelector('.vinyl-edit')?.setAttribute('aria-expanded', 'false'); };
  function panel() {
    const effects = root.querySelector('.vinyl-effects'), opening = effects.hidden; StudioUI.closeOtherPanels(); close(); effects.hidden = !opening;
    root.querySelector('.vinyl-edit').setAttribute('aria-expanded', String(opening));
    const rect = root.querySelector('.vinyl-edit').getBoundingClientRect();
    effects.style.left = `${Math.max(12, Math.min(innerWidth - 292, rect.right - 280))}px`;
    effects.style.top = `${Math.max(70, rect.top - 180)}px`;
  }
  async function mount() {
    const response = await fetch('/vinyl-test.html'); if (!response.ok) throw new Error('Não foi possível abrir o Vinil.');
    const template = new DOMParser().parseFromString(await response.text(), 'text/html');
    root = document.createElement('section'); root.id = 'vinylWorkspace'; root.hidden = true; root.dataset.vinylEditor = ''; root.setAttribute('aria-label', 'Editor de vinil');
    root.append(template.querySelector('main'), template.querySelector('audio'), template.querySelector('#export'));
    for (const element of root.querySelectorAll('[id]')) { element.dataset.vinylId = element.id; element.id = `vinyl-${element.id}`; }
    for (const label of root.querySelectorAll('label[for]')) label.htmlFor = `vinyl-${label.htmlFor}`;
    byId('export').hidden = true;
    const aside = root.querySelector('aside'); aside.querySelector('h2').remove(); aside.querySelector('.intro').remove();

    const gear = document.createElement('button'); gear.type = 'button'; gear.className = 'collage-gear vinyl-edit'; gear.setAttribute('aria-label', 'Ajustar desfoque e sombra do vinil'); gear.setAttribute('aria-expanded', 'false'); gear.innerHTML = document.querySelector('#dockEffects svg').outerHTML; gear.addEventListener('click', panel); root.querySelector('.preview').append(gear);
    const effects = document.createElement('section'); effects.className = 'vinyl-effects'; effects.hidden = true; effects.setAttribute('role', 'dialog'); effects.setAttribute('aria-label', 'Efeitos da imagem do vinil');
    effects.innerHTML = '<header><strong>Efeitos da imagem</strong><button type="button" aria-label="Fechar efeitos do vinil"><svg viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg></button></header><label>Desfoque <output>19</output><input data-vinyl-id="effect-blur" type="range" min="0" max="120" value="19" aria-label="Desfoque do fundo do vinil"></label><label>Sombra <output>75%</output><input data-vinyl-id="effect-shade" type="range" min="0" max="100" value="75" aria-label="Sombra inferior do vinil"></label>';
    effects.querySelector('button').addEventListener('click', close);
    effects.querySelectorAll('input').forEach(input => input.addEventListener('input', () => { input.parentElement.querySelector('output').textContent = input.value + (input.dataset.vinylId === 'effect-shade' ? '%' : ''); })); root.append(effects);
    document.addEventListener('pointerdown', event => { if (!event.target.closest('.vinyl-effects,.vinyl-edit') && !effects.hidden) { effects.hidden = true; gear.setAttribute('aria-expanded', 'false'); } });
    const tools = document.createElement('nav'); tools.className = 'vinyl-media collage-media'; tools.setAttribute('aria-label', 'Ferramentas do vinil');
    tools.innerHTML = '<button type="button" aria-label="Selecionar MP3 ou MP4"><svg viewBox="0 0 24 24"><path d="M9 18V5l11-2v13M9 8l11-2"/><ellipse cx="6" cy="18" rx="3" ry="2"/><ellipse cx="17" cy="16" rx="3" ry="2"/></svg></button><button type="button" aria-label="Selecionar capa do vinil"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.5"/><path d="m3 17 5-5 4 4 4-6 5 7"/></svg></button>';
    const buttons = tools.querySelectorAll('button'); buttons[0].onclick = () => byId('media').click(); buttons[1].onclick = () => byId('cover').click();
    const compare = document.createElement('button'); compare.type = 'button'; compare.className = 'vinyl-compare'; compare.setAttribute('aria-label', 'Alternar estilo do título'); compare.setAttribute('aria-pressed', 'false'); compare.innerHTML = '<svg viewBox="0 0 24 24"><path d="M4 5h16M12 5v14M8 19h8"/><rect x="2" y="12" width="20" height="9" rx="1"/></svg>';
    compare.addEventListener('click', () => { if (busy) return; const input = byId('title-style'); input.value = input.value === 'brand' ? 'player' : 'brand'; input.dispatchEvent(new Event('input', { bubbles: true })); }); tools.append(compare);
    root.append(tools);
    document.querySelector('.experience-shell').append(root);
    await import('./vinyl-test.js');
  }
  async function activate() {
    if (busy) return;
    try {
      mounting ||= mount(); await mounting;
      StudioUI.closeOtherPanels(); if (!active) { const control = document.getElementById('exportButton'); previousExport = { disabled: control.disabled, label: control.getAttribute('aria-label') }; } active = true; root.hidden = false; document.body.classList.add('vinyl-active');
      document.querySelectorAll('.format-option,.mobile-format').forEach(element => element.setAttribute('aria-pressed', String(element === button)));
      document.querySelectorAll('video,audio').forEach(media => { if (!root.contains(media)) media.pause(); });
      syncExport();
      if (new URLSearchParams(location.search).get('tab') === 'vinyl') history.replaceState(null, '', location.pathname);
    } catch (error) { mounting = null; button.setAttribute('aria-label', `${error.message} Tentar abrir Vinil`); }
  }
  document.addEventListener('vinyl:state', event => {
    ready = event.detail.ready; busy = event.detail.busy; root?.classList.toggle('vinyl-exporting', busy);
    const compare = root?.querySelector('.vinyl-compare'); if (compare) { compare.setAttribute('aria-pressed', String(event.detail.style === 'brand')); compare.disabled = busy; }
    syncExport();
  });
  document.addEventListener('click', event => {
    if (!active) return;
    const other = event.target.closest('.format-option:not(.vinyl-option),.mobile-format');
    if (other && busy) { event.preventDefault(); event.stopImmediatePropagation(); return; }
    if (other) { active = false; root.hidden = true; close(); document.body.classList.remove('vinyl-active'); document.dispatchEvent(new Event('vinyl:deactivate')); button.setAttribute('aria-pressed', 'false'); const control = document.getElementById('exportButton'); control.disabled = previousExport?.disabled ?? false; control.setAttribute('aria-label', previousExport?.label || 'Exportar PNG'); }
    if (event.target.closest('#exportButton') && active) { event.preventDefault(); event.stopImmediatePropagation(); byId('export').click(); }
  }, true);
  document.addEventListener('studio:close-panels', close);
  document.addEventListener('keydown', event => { if (active && event.key === 'Escape') close(); });
  function setup() {
    if (document.body.classList.contains('workbench-loading')) return;
    const dock = document.querySelector('.dock-formats'); if (!dock || button) return;
    observer.disconnect(); document.body.classList.add('vinyl-integrated'); const unit = document.createElement('div'); unit.className = 'dock-format-unit'; unit.dataset.formatUnit = 'vinyl';
    new MutationObserver(syncExport).observe(document.getElementById('exportButton'), { attributes: true, attributeFilter: ['aria-label', 'disabled'] });
    button = document.createElement('button'); button.type = 'button'; button.className = 'format-option glass-tool vinyl-option'; button.setAttribute('aria-label', 'Vinil'); button.setAttribute('aria-pressed', 'false'); button.innerHTML = icon; button.addEventListener('click', activate); unit.append(button); dock.insertBefore(unit, dock.querySelector('[data-format-unit="closing"]'));
    if (new URLSearchParams(location.search).get('tab') === 'vinyl') void activate();
  }
  const observer = new MutationObserver(setup); observer.observe(document.body, { attributes: true, attributeFilter: ['class'] }); setup();
})();
