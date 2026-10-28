"use strict";
const StudioSession = (() => {
  const adapters = new Map(), timers = new Map(), saving = new Map(), urlAssets = new Map(), blobAssets = new WeakMap(), sourceBlobs = new Map();
  let database;
  const open = () => database ||= new Promise((resolve, reject) => {
    const request = indexedDB.open('story-forge-session', 1);
    request.onupgradeneeded = () => { request.result.createObjectStore('drafts'); request.result.createObjectStore('media'); };
    request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
  });
  async function access(store, key, value) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(store, value === undefined ? 'readonly' : 'readwrite');
      const request = value === undefined ? transaction.objectStore(store).get(key) : transaction.objectStore(store).put(value, key);
      transaction.oncomplete = () => resolve(request.result); transaction.onerror = transaction.onabort = () => reject(transaction.error || new Error('Falha ao salvar'));
    });
  }
  async function asset(blob) {
    if (blobAssets.has(blob)) return blobAssets.get(blob);
    const id = crypto.randomUUID(); await access('media', id, blob); blobAssets.set(blob, id); return id;
  }
  async function encode(value) {
    if (value == null || typeof value === 'number' || typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      if (!value.startsWith('blob:')) return value;
      if (!urlAssets.has(value)) urlAssets.set(value, asset(sourceBlobs.get(value) || await (await fetch(value)).blob()));
      return { $session: 'url', id: await urlAssets.get(value) };
    }
    if (value instanceof Blob) return { $session: 'blob', id: await asset(value), name: value.name || '', type: value.type };
    if (value instanceof HTMLImageElement) return { $session: 'image', src: await encode(value.src) };
    if (value instanceof HTMLVideoElement) return { $session: 'video', src: await encode(value.currentSrc || value.src) };
    if (Array.isArray(value)) return Promise.all(value.map(encode));
    const result = {}; for (const [key, item] of Object.entries(value)) if (typeof item !== 'function' && !(item instanceof Node)) result[key] = await encode(item); else if (item instanceof HTMLImageElement || item instanceof HTMLVideoElement) result[key] = await encode(item);
    return result;
  }
  async function decode(value, urls = new Map()) {
    if (!value || typeof value !== 'object') return value;
    if (value.$session === 'blob') { const blob = await access('media', value.id); if (!blob) throw Error('Mídia salva indisponível'); const result = value.name ? new File([blob], value.name, { type: value.type }) : blob; blobAssets.set(result, value.id); return result; }
    if (value.$session === 'url') {
      if (!urls.has(value.id)) { const blob = await access('media', value.id); if (!blob) throw Error('Mídia salva indisponível'); const url = URL.createObjectURL(blob); urls.set(value.id, url); urlAssets.set(url, Promise.resolve(value.id)); }
      return urls.get(value.id);
    }
    if (value.$session === 'image') { const image = new Image(); image.src = await decode(value.src, urls); await image.decode(); return image; }
    if (value.$session === 'video') {
      const video = document.createElement('video'); video.playsInline = true; video.preload = 'auto';
      const loaded = new Promise((resolve, reject) => { const timeout = setTimeout(() => reject(Error('Não foi possível restaurar o vídeo')), 15000); video.onloadeddata = () => { clearTimeout(timeout); resolve(); }; video.onerror = () => { clearTimeout(timeout); reject(Error('Vídeo indisponível')); }; });
      video.src = await decode(value.src, urls); await loaded; return video;
    }
    if (Array.isArray(value)) return Promise.all(value.map(item => decode(item, urls)));
    const result = {}; for (const [key, item] of Object.entries(value)) result[key] = await decode(item, urls); return result;
  }
  function indicate(state) {
    if (state === 'saved' && (timers.size || saving.size > 1)) state = 'saving';
    let dot = document.getElementById('sessionSaveState');
    if (!dot) { dot = document.createElement('span'); dot.id = 'sessionSaveState'; dot.setAttribute('role', 'status'); document.querySelector('.app-header')?.prepend(dot); }
    dot.dataset.state = state; dot.setAttribute('aria-label', state === 'saved' ? 'Sessão salva neste dispositivo' : state === 'error' ? 'Não foi possível salvar a sessão neste dispositivo' : 'Salvando sessão');
  }
  async function save(name) {
    clearTimeout(timers.get(name)); timers.delete(name);
    const adapter = adapters.get(name); if (!adapter || adapter.restoring || adapter.busy?.()) return;
    if (saving.has(name)) { saving.get(name).again = true; return saving.get(name).promise; }
    const task = { again: false }; saving.set(name, task); indicate('saving');
    task.promise = (async () => {
      try { do { task.again = false; const data = await encode(adapter.capture()); await access('drafts', name, { version: 1, data }); } while (task.again); indicate('saved'); }
      catch (error) { indicate('error'); console.warn('Sessão não salva:', error.message); }
      finally { saving.delete(name); }
    })(); return task.promise;
  }
  function schedule(name) { if (!adapters.has(name) || adapters.get(name).restoring) return; indicate('saving'); clearTimeout(timers.get(name)); timers.set(name, setTimeout(() => void save(name), 350)); }
  async function register(name, adapter) {
    adapter.restoring = true; adapters.set(name, adapter);
    try { const record = await access('drafts', name); if (record?.version === 1) await adapter.restore(await decode(record.data)); indicate('saved'); }
    catch (error) { indicate('error'); console.warn('Sessão não restaurada:', error.message); }
    finally { adapter.restoring = false; }
  }
  for (const type of ['input', 'change', 'pointerup', 'keydown']) document.addEventListener(type, () => adapters.forEach((_, name) => schedule(name)));
  document.addEventListener('visibilitychange', () => { if (document.hidden) adapters.forEach((_, name) => void save(name)); });
  window.addEventListener('pagehide', () => adapters.forEach((_, name) => void save(name)));
  return { register, schedule, save, encode, decode, remember: (url, blob) => sourceBlobs.set(url, blob) };
})();
