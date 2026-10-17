import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const setup = () => vm.runInNewContext(readFileSync(new URL('../editor-history.js', import.meta.url), 'utf8') + '\nEditorHistory;');
test('undo and redo restore a deleted page; a new action clears redo', () => {
  const history=setup(); let count=2;
  history.record(1,2,v=>count=v,'add');
  assert.equal(history.undo(),'add'); assert.equal(count,1);
  assert.equal(history.redo(),'add'); assert.equal(count,2);
  history.record(2,1,v=>count=v,'delete'); count=1;
  history.undo(); assert.equal(count,2);
  history.record(2,3,v=>count=v,'new');
  assert.equal(history.redo(),null);
});
test('continuous slider changes undo as one adjustment', () => {
  const history=setup(); let value=30;
  history.record(10,20,v=>value=v,'effect','blur');
  history.record(20,30,v=>value=v,'effect','blur');
  history.undo(); assert.equal(value,10);
  history.redo(); assert.equal(value,30);
});
test('restoring state cannot recursively add history entries', () => {
  const history=setup();
  history.record(0,1,()=>history.record(1,2,()=>{},'nested'),'original');
  assert.equal(history.undo(),'original');
  assert.equal(history.undo(),null);
  assert.equal(history.redo(),'original');
});
