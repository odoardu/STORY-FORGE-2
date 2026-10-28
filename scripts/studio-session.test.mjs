import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
const source = readFileSync(new URL('../studio-session.js', import.meta.url), 'utf8');
function setup() {
  const stores = { drafts: new Map(), media: new Map() }, listeners = new Map();
  const db = { transaction(name) {
    const tx = { objectStore: () => ({ get(key) { const request = {}; queueMicrotask(() => { request.result = stores[name].get(key); tx.oncomplete(); }); return request; }, put(value,key) { const request = {}; queueMicrotask(() => { stores[name].set(key, structuredClone(value)); tx.oncomplete(); }); return request; } }) }; return tx;
  } };
  class Node {} class Image extends Node {} class Video extends Node {}
  const dot = { dataset: {}, setAttribute() {} };
  let serial = 0;
  const context = { Blob, File, Node, HTMLImageElement: Image, HTMLVideoElement: Video, Image, URL, console, setTimeout, clearTimeout,
    crypto: { randomUUID: () => String(++serial) }, fetch: () => { throw Error('Revoked source must use retained media'); },
    indexedDB: { open() { const request = {}; queueMicrotask(() => { request.result = db; request.onsuccess(); }); return request; } },
    document: { getElementById: () => dot, addEventListener: (name,fn) => listeners.set(name,fn), querySelector: () => null }, window: { addEventListener() {} }
  };
  return { session: vm.runInNewContext(source + '\nStudioSession;', context), stores, dot };
}
test('session saves text, page order and framing and restores without overwriting the draft', async () => {
  const { session, stores } = setup();
  const value = { title: 'Música com acento', pages: [{ title: 'Primeira' }, { title: 'Segunda' }], framing: { x: .3, zoom: 1.8 } };
  await session.register('studio', { capture: () => value, restore() { assert.fail('No draft yet'); } });
  await session.save('studio');
  let restored;
  await session.register('studio', { capture: () => ({}), restore: saved => { restored = saved; } });
  assert.equal(JSON.stringify(restored), JSON.stringify(value));
  assert.equal(stores.drafts.get('studio').version, 1);
});
test('retains source bytes after an image URL is revoked and deduplicates media', async () => {
  const { session, stores } = setup(); const blob = new Blob(['photo-bytes'], { type: 'image/png' });
  session.remember('blob:revoked-photo', blob);
  const encoded = await session.encode({ image: 'blob:revoked-photo', duplicate: 'blob:revoked-photo' });
  assert.equal(encoded.image.id, encoded.duplicate.id); assert.equal(stores.media.size, 1);
  assert.equal(await stores.media.get(encoded.image.id).text(), 'photo-bytes');
});
test('busy media loading never replaces the last complete draft with an incomplete one', async () => {
  const { session, stores } = setup(); let busy = false, title = 'Complete';
  await session.register('studio', { busy: () => busy, capture: () => ({ title }), restore() {} });
  await session.save('studio'); busy = true; title = 'Incomplete'; await session.save('studio');
  assert.equal(stores.drafts.get('studio').data.title, 'Complete');
});
test('concurrent edits commit the latest snapshot after an in-progress save', async () => {
  const { session, stores } = setup(); let title = 'First';
  await session.register('studio', { capture: () => ({ title }), restore() {} });
  const pending = session.save('studio'); title = 'Latest'; await session.save('studio'); await pending;
  assert.equal(stores.drafts.get('studio').data.title, 'Latest');
});
