"use strict";
const ExportChecks = (() => {
  const issue = (id, text, action, label, level = 'error') => ({ id, text, action, label, level });
  const empty = value => !String(value || '').trim();
  function inspect(art) {
    const result = [], name = art.label || art.format;
    const add = (id, text, action, label, level) => result.push(issue(`${name}:${id}`, `${name}: ${text}`, action, label, level));
    if (art.loading) { add('loading','a mídia ainda está sendo preparada. Aguarde o carregamento terminar.'); return result; }
    if (art.format === 'vinyl') {
      if (!art.audio) add('audio','adicione um MP3 ou MP4 com áudio.','audio','Adicionar áudio');
      else if (!Number.isFinite(art.duration) || art.duration <= 0) add('duration','não foi possível ler a duração do áudio. Selecione o arquivo novamente.','audio','Trocar áudio');
      if (!art.image) add('cover','adicione a capa do disco.','cover','Adicionar capa');
      if (empty(art.title) || /^nome da m[uú]sica$/i.test(art.title.trim())) add('title','preencha o nome da música.','title','Editar nome');
      if (empty(art.artist) || /^nome do artista$/i.test(art.artist.trim())) add('artist','o nome do artista ainda não foi preenchido.','artist','Editar artista','warning');
      if (art.audio && Number.isFinite(art.duration) && (!Number.isFinite(art.start) || !Number.isFinite(art.end) || art.start < 0 || art.end <= art.start || art.end > art.duration + .05)) add('trim','o trecho escolhido está fora da duração do áudio.','trim','Ajustar corte');
    } else if (art.format === 'collage') {
      if (!art.count) add('photos','adicione ao menos uma foto.','photos','Adicionar fotos');
      else if (art.broken) add('broken','uma ou mais fotos não puderam ser abertas. Substitua as imagens.','photos','Conferir fotos');
      if (art.examples) add('examples','a composição ainda contém fotos de exemplo.','photos','Conferir fotos','warning');
    } else if (art.format === 'polaroid') {
      if (!art.image) add('photo',art.skipped ? 'está sem foto e ficará fora desta exportação.' : 'adicione uma foto antes de exportar.','photo','Adicionar foto',art.skipped ? 'warning' : 'error');
    } else if (art.format === 'informative') {
      if (empty(art.body)) add('body','preencha o texto da página.','body','Editar texto');
      else if (art.lines < 4) add('short',`o texto ocupa ${art.lines} ${art.lines === 1 ? 'linha' : 'linhas'}. Para manter a harmonia desta página, prefira um texto maior, com pelo menos 4 linhas na arte.`,'body','Ampliar texto','warning');
      if (art.overflow) add('overflow','o texto ultrapassa a área prevista. Revise o tamanho antes de exportar.','body','Revisar texto','warning');
    } else if (['feed','stories','story'].includes(art.format)) {
      if (!art.image && !art.video) add('media','adicione uma imagem ou um vídeo.','media','Adicionar mídia');
      if (art.format !== 'feed' && art.title !== undefined && (empty(art.title) || /^escreva aqui o t[ií]tulo/i.test(art.title.trim()))) add('title','o título ainda não foi preenchido.','title','Editar título','warning');
      if (art.video && art.broken) add('video','o vídeo não está pronto para exportar. Selecione o arquivo novamente.','media','Trocar vídeo');
    }
    if (art.assetsReady === false) add('assets','a textura ou a logo não terminou de carregar. Reabra a aba antes de exportar.');
    return result;
  }
  let dialog, pending;
  function confirm(issues, actions = {}) {
    if (!issues.length) return Promise.resolve(true);
    if (pending) return Promise.resolve(false);
    if (!dialog) { dialog = document.createElement('dialog'); dialog.className = 'export-checks'; dialog.setAttribute('aria-labelledby','exportChecksTitle'); document.body.append(dialog); }
    dialog.replaceChildren();
    const heading = document.createElement('h2'); heading.id = 'exportChecksTitle'; heading.textContent = issues.some(item => item.level === 'error') ? 'Falta ajustar alguns pontos' : 'Confira antes de exportar';
    const list = document.createElement('ul'); list.setAttribute('aria-label','Pontos para revisar');
    const finish = accepted => { const resolve = pending; pending = null; dialog.close(); resolve?.(accepted); };
    for (const item of issues) {
      const row = document.createElement('li'), text = document.createElement('p'); row.dataset.level = item.level; text.textContent = item.text; row.append(text);
      if (actions[item.action]) { const fix = document.createElement('button'); fix.type = 'button'; fix.textContent = item.label; fix.onclick = () => { finish(false); actions[item.action](item); }; row.append(fix); }
      list.append(row);
    }
    const footer = document.createElement('footer'), back = document.createElement('button'); back.type = 'button'; back.textContent = 'Voltar'; back.onclick = () => finish(false); footer.append(back);
    if (!issues.some(item => item.level === 'error')) { const proceed = document.createElement('button'); proceed.type = 'button'; proceed.className = 'export-checks-continue'; proceed.textContent = 'Continuar'; proceed.onclick = () => finish(true); footer.append(proceed); }
    dialog.append(heading, list, footer); dialog.oncancel = event => { event.preventDefault(); finish(false); };
    return new Promise(resolve => { pending = resolve; dialog.showModal(); });
  }
  return { inspect, confirm };
})();
if (typeof module !== 'undefined') module.exports = ExportChecks;
