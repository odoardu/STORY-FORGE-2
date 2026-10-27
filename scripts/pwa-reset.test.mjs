import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
const source = readFileSync(new URL('../pwa-reset.js', import.meta.url), 'utf8');

test('cache reset removes only Story Forge caches and worker, preserving user storage', async () => {
  const removed = [], workers = [], redirects = [];
  const caches = { keys: async () => ['story-forge-shell-old', 'story-forge-shell-v43', 'other-cache'], delete: async key => removed.push(key) };
  const registration = path => ({ active: { scriptURL: 'https://story-forge-2.vercel.app' + path }, unregister: async () => workers.push(path) });
  const context = {
    URL, window: { caches }, caches,
    navigator: { serviceWorker: { getRegistrations: async () => [registration('/service-worker.js'), registration('/other-worker.js')] } },
    fetch: async (path, options) => {
      assert.equal(path, '/apple-touch-icon-ed148eba-v2.png');
      assert.equal(options.cache, 'reload');
      return { ok: true, headers: { get: () => 'image/png' } };
    },
    location: { replace: url => redirects.push(url) },
    localStorage: { clear() { assert.fail('User storage must survive'); } },
    indexedDB: { deleteDatabase() { assert.fail('Projects must survive'); } },
  };
  await vm.runInNewContext(source, context);
  assert.deepEqual(removed, ['story-forge-shell-old', 'story-forge-shell-v43']);
  assert.deepEqual(workers, ['/service-worker.js']);
  assert.deepEqual(redirects, ['/?pwa-refresh=ed148eba-v2']);
});

test('failed icon request shows a retry instead of claiming success', async () => {
  const status = { textContent: '', after() {} };
  await vm.runInNewContext(source, {
    window: {}, navigator: {}, fetch: async () => ({ ok: false }),
    location: { replace() { assert.fail('Must not report a successful refresh'); } },
    document: { getElementById: () => status, createElement: () => ({}) },
  });
  assert.match(status.textContent, /Não foi possível/);
});
