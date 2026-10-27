"use strict";
const ExportReview = (() => {
  // Identity follows the page object, so deleting/reordering boards cannot move edits.
  function plan(entries, baseline, touched, format) {
    const vertical = ["stories", "story"].includes(format);
    const changed = entries.filter(entry => entry.format !== "closing" &&
      (["stories", "story"].includes(entry.format) === vertical) &&
      (!vertical || entry.format === format) && entry.ready !== false &&
      (baseline.get(entry.key) !== entry.signature) &&
      (entry.board || touched.has(entry.format)));
    if (!vertical && (changed.length || touched.has("closing"))) {
      const closing = entries.find(entry => entry.format === "closing");
      if (changed.length || baseline.get(closing.key) !== closing.signature) changed.push(closing);
    }
    return changed;
  }
  async function downloadAll(files, download, pause = () => new Promise(resolve => setTimeout(resolve, 160))) {
    if (!files.length || files.some(file => !file.name || !file.blob?.size)) throw new Error("Há uma arte vazia. Exporte novamente.");
    for (const [index, file] of files.entries()) {
      await download(file.blob, file.name);
      if (index < files.length - 1) await pause();
    }
  }
  function shareData(files, shareApi, FileType) {
    if (typeof shareApi?.share !== "function" || typeof shareApi?.canShare !== "function") return null;
    try {
      const data = { files: files.map(file => new FileType([file.blob], file.name, { type: file.blob.type })) };
      return shareApi.canShare(data) ? data : null;
    } catch { return null; }
  }
  let api, baseline, dialog, list, confirm, status, cancel, pending = [], prepared = null, running = false, urls = [], nativeShareFailed = false, needsShareTap = false;
  const touched = new Set();
  function init(adapter) {
    api = adapter; baseline = new Map(api.entries().map(entry => [entry.key, entry.signature]));
    dialog = document.createElement("dialog"); dialog.className = "export-review"; dialog.id = "exportReview";
    dialog.setAttribute("aria-labelledby", "exportReviewTitle");
    dialog.innerHTML = `<header><h2 id="exportReviewTitle">Revisar exportação</h2><button type="button" class="export-review-close" aria-label="Fechar revisão"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17"/></svg></button></header><p class="export-review-note"></p><ul aria-label="Artes para exportar"></ul><p class="export-review-status" role="status" aria-live="polite"></p><footer><button type="button" class="export-review-cancel">Voltar</button><button type="button" class="export-review-confirm">Exportar</button></footer>`;
    document.body.append(dialog);
    list = dialog.querySelector("ul"); confirm = dialog.querySelector(".export-review-confirm");
    status = dialog.querySelector(".export-review-status"); cancel = dialog.querySelector(".export-review-close");
    for (const button of [cancel, dialog.querySelector(".export-review-cancel")]) button.onclick = () => { if (!running) dialog.close(); };
    dialog.addEventListener("cancel", event => { if (running) event.preventDefault(); });
    confirm.onclick = run;
    dialog.addEventListener("close", clearPrepared);
    // Compare before/after actual interactions; navigation, preview playback and mute do not alter signatures.
    for (const type of ["input", "change", "click", "pointerdown", "pointermove", "pointerup", "wheel", "keydown"]) {
      document.addEventListener(type, event => {
        if (running || dialog.contains(event.target)) return;
        const format = api.format(), before = api.entries().map(entry => entry.signature).join("|");
        if (type === "input" && event.target.type !== "file") touched.add(format);
        if (type === "change" && event.target.type === "file" && event.target.files?.length) touched.add(format);
        queueMicrotask(() => {
          if (format === api.format() && before !== api.entries().map(entry => entry.signature).join("|")) touched.add(format);
        });
      }, true);
    }
  }
  function open() {
    if (!api || running) return;
    if (api.loading()) { api.status("Aguarde a mídia terminar de carregar antes de exportar."); return; }
    clearPrepared();
    api.flush();
    pending = plan(api.entries(), baseline, touched, api.format());
    list.replaceChildren();
    for (const entry of pending) {
      const row = document.createElement("li"), name = document.createElement("span"), type = document.createElement("small");
      name.textContent = entry.label; type.textContent = entry.video ? "MP4 · com áudio da origem" : "PNG";
      row.append(name, type); list.append(row);
    }
    const vertical = ["stories", "story"].includes(api.format());
    dialog.querySelector(".export-review-note").textContent = !pending.length ? "Nenhuma arte alterada para exportar." : vertical ? "Stories/Reels é exportado separadamente." : "Artes alteradas e encerramento, em arquivos separados.";
    status.textContent = ""; dialog.querySelector(".export-review-cancel").textContent = "Voltar"; confirm.disabled = !pending.length;
    confirm.textContent = vertical ? "Exportar vídeo / imagem" : `Exportar ${pending.length} artes`;
    if (vertical && pending.length) confirm.textContent = pending[0].video ? "Exportar MP4" : "Exportar PNG";
    dialog.showModal();
  }
  function clearPrepared() {
    urls.forEach(url => setTimeout(() => URL.revokeObjectURL(url), 60000)); urls = [];
    prepared = null; nativeShareFailed = false; needsShareTap = false;
  }
  function showFileLinks() {
    prepared.forEach((file, index) => {
      const link = document.createElement("a"), row = list.children[index];
      const url = URL.createObjectURL(file.blob); urls.push(url);
      link.href = url; link.download = file.name; link.textContent = pending[index].label;
      link.setAttribute("aria-label", `Baixar ${file.name}`); row.firstElementChild.replaceWith(link);
    });
  }
  async function deliver() {
    const mobile = matchMedia("(max-width: 800px), (max-width: 960px) and (pointer: coarse)").matches;
    const data = mobile && !nativeShareFailed ? shareData(prepared, navigator, File) : null;
    if (data) {
      confirm.textContent = `Salvar ${prepared.length} ${prepared.length === 1 ? "arquivo" : "arquivos"}`;
      // Large video exports may outlive the original click's user activation.
      if (navigator.userActivation && !navigator.userActivation.isActive) { needsShareTap = true; status.textContent = "Tudo pronto. Toque em salvar para escolher o destino."; return; }
      try { await navigator.share(data); dialog.close(); return; }
      catch (error) {
        if (error.name === "AbortError") { status.textContent = "Artes prontas para salvar."; return; }
        if (error.name === "NotAllowedError" && !needsShareTap) { needsShareTap = true; status.textContent = "Toque em salvar para abrir as opções do aparelho."; return; }
        nativeShareFailed = true;
      }
    }
    await downloadAll(prepared, api.download);
    status.textContent = prepared.length === 1 ? "Download iniciado." : "Downloads iniciados. Cada arte também está disponível pelo nome acima.";
    confirm.textContent = "Baixar novamente";
    dialog.querySelector(".export-review-cancel").textContent = "Concluir";
    api.status("Exportação concluída — arquivos separados");
  }
  async function run() {
    if (running || !pending.length) return;
    running = true; dialog.setAttribute("aria-busy", "true");
    dialog.querySelectorAll("button").forEach(button => { button.disabled = true; });
    try {
      if (!prepared) {
        prepared = await api.export(pending, message => { status.textContent = message; });
        showFileLinks();
      }
      await deliver();
    } catch (error) { status.textContent = error.message || "Não foi possível exportar. Tente novamente."; }
    finally {
      running = false; dialog.removeAttribute("aria-busy");
      dialog.querySelectorAll("button").forEach(button => { button.disabled = false; });
    }
  }

  return { init, open, plan, downloadAll, shareData, touch: format => { if (api && !running) touched.add(format); }, isRunning: () => running };
})();
if (typeof module !== "undefined") module.exports = ExportReview;
