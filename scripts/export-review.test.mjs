import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const review = vm.runInNewContext(readFileSync(new URL('../export-review.js', import.meta.url), 'utf8') + '\nExportReview;', { Blob, TextEncoder });
const feed = { key: 'feed', format: 'feed', label: 'Feed', signature: 'original' };
const stories = { key: 'stories', format: 'stories', label: 'Stories', signature: 'original' };
const closing = { key: 'closing', format: 'closing', signature: 'original' };
const page = { key: {}, format: 'informative', board: true, signature: 'original' };
const baseline = new Map([feed, stories, closing, page].map(entry => [entry.key, entry.signature]));
const formats = result => Array.from(result, entry => entry.format);
test('navigation and unedited pages do not export', () => {
  assert.deepEqual(formats(review.plan([feed, stories, closing, page], baseline, new Set(), 'informative')), []);
});
test('Feed includes closing and excludes shared Stories changes', () => {
  assert.deepEqual(formats(review.plan([{ ...feed, signature: 'edit' }, { ...stories, signature: 'edit' }, closing, page], baseline, new Set(['feed']), 'feed')), ['feed', 'closing']);
});
test('two edited informative boards join Feed, untouched board stays out', () => {
  const second = { key: {}, format: 'informative', board: true, signature: 'new' };
  assert.deepEqual(formats(review.plan([{ ...feed, signature: 'edit' }, stories, { ...page, signature: 'edit' }, second, closing], baseline, new Set(['feed']), 'polaroid')), ['feed', 'informative', 'informative', 'closing']);
});
test('Stories exports alone even with other formats edited', () => {
  assert.deepEqual(formats(review.plan([{ ...feed, signature: 'edit' }, { ...stories, signature: 'edit' }, { ...page, signature: 'edit' }, closing], baseline, new Set(['feed', 'stories']), 'stories')), ['stories']);
});
test('undo to original omits art; removed boards disappear; empty Polaroid omitted', () => {
  const empty = { key: {}, format: 'polaroid', board: true, ready: false, signature: 'new' };
  assert.deepEqual(formats(review.plan([feed, stories, closing, empty], baseline, new Set(['feed']), 'feed')), []);
});
test('modified Polaroid adds closing; closing alone is exportable', () => {
  const photo = { key: {}, format: 'polaroid', board: true, ready: true, signature: 'photo' };
  assert.deepEqual(formats(review.plan([feed, stories, closing, photo], baseline, new Set(), 'polaroid')), ['polaroid', 'closing']);
  assert.deepEqual(formats(review.plan([feed, stories, { ...closing, signature: 'edit' }], baseline, new Set(['closing']), 'closing')), ['closing']);
});
test('batch downloads preserve separate files, order, names and binary contents', async () => {
  const files = [{ name: 'feed.png', blob: new Blob(['photo'], { type: 'image/png' }) }, { name: 'informação.mp4', blob: new Blob([new Uint8Array([0,255,3,0])], { type: 'video/mp4' }) }];
  const saved = []; let pauses = 0;
  await review.downloadAll(files, async (blob, name) => saved.push({ name, type: blob.type, bytes: [...new Uint8Array(await blob.arrayBuffer())] }), async () => { pauses++; });
  assert.deepEqual(saved.map(item => item.name), ['feed.png', 'informação.mp4']);
  assert.deepEqual(saved.map(item => item.type), ['image/png', 'video/mp4']);
  assert.deepEqual(saved[1].bytes, [0,255,3,0]);
  assert.equal(pauses, 1);
});

test('invalid batch fails before starting any downloads', async () => {
  let started = false;
  await assert.rejects(review.downloadAll([{ name: 'feed.png', blob: new Blob(['ok']) }, { name: 'empty.png', blob: new Blob([]) }], () => { started = true; }), /arte vazia/);
  assert.equal(started, false);
});

test('download failure is propagated instead of reporting a successful batch', async () => {
  await assert.rejects(review.downloadAll([{ name: 'feed.png', blob: new Blob(['ok']) }], () => { throw new Error('blocked'); }), /blocked/);
});

test('native sharing receives every separate image with its original name and MIME type', async () => {
  const files = [{ name: 'feed.png', blob: new Blob(['one'], { type: 'image/png' }) }, { name: 'encerramento.png', blob: new Blob(['two'], { type: 'image/png' }) }];
  const data = review.shareData(files, { share() {}, canShare: data => data.files.length === 2 }, File);
  assert.deepEqual(Array.from(data.files, file => file.name), ['feed.png', 'encerramento.png']);
  assert.deepEqual(Array.from(data.files, file => file.type), ['image/png', 'image/png']);
  assert.equal(await data.files[1].text(), 'two');
});

test('unsupported native sharing falls back to individual downloads', () => {
  const files = [{ name: 'feed.png', blob: new Blob(['one']) }];
  assert.equal(review.shareData(files, {}, File), null);
  assert.equal(review.shareData(files, { share() {}, canShare() { throw new Error('unsupported'); } }, File), null);
});
