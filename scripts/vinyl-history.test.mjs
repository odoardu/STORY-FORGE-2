import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
const source = readFileSync(new URL('../vinyl-test.js', import.meta.url), 'utf8');
const commit = source.slice(source.indexOf('function commitVinyl('), source.indexOf('for (const id of vinylFieldIds)'));
test('loading the new waveform cannot replace the previous audio undo snapshot', () => {
  const old = { file: { name: 'original.mp3' }, coverFile: null, trimEnd: 40, fields: { start: '12' } };
  const next = { file: { name: 'replacement.mp3' }, coverFile: null, trimEnd: 30, fields: { start: '0' } };
  const records = [];
  const context = vm.createContext({ historyState: old, historyRestoring: true, vinylSnapshot: () => next, restoreVinyl() {}, EditorHistory: { record: (...args) => records.push(args) } });
  vm.runInContext(commit + "\ncommitVinyl('Waveform'); historyRestoring = false; commitVinyl('Trocar áudio');", context);
  assert.equal(records.length, 1); assert.equal(records[0][0], old); assert.equal(records[0][1], next);
  assert.equal(records[0][0].fields.start, '12'); assert.equal(records[0][0].trimEnd, 40);
});
test('preview playback with unchanged vinyl content creates no undo step', () => {
  const saved = { file: {}, coverFile: {}, trimEnd: 30, fields: { title: 'Song' } }; let records = 0;
  vm.runInNewContext(commit + "\ncommitVinyl('Prévia');", { historyState: saved, historyRestoring: false, vinylSnapshot: () => ({ ...saved, fields: { ...saved.fields } }), restoreVinyl() {}, EditorHistory: { record() { records++; } } });
  assert.equal(records, 0);
});
