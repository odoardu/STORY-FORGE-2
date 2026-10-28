import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
const checks = vm.runInNewContext(readFileSync(new URL('../export-checks.js',import.meta.url),'utf8')+'\nExportChecks;');
const validVinyl = {format:'vinyl',label:'Disco',audio:true,duration:180,image:true,title:'Somewhere I Belong',artist:'Linkin Park',start:15,end:45,assetsReady:true};
test('vinyl lists missing media and real song name before starting the encoder',()=>{
 const issues = checks.inspect({format:'vinyl',label:'Disco',title:'Nome da música',artist:'Nome do artista'});
 assert.equal(issues.filter(issue=>issue.level==='error').length,3);
 assert.deepEqual(Array.from(issues,issue=>issue.action),['audio','cover','title','artist']);
});
test('valid vinyl passes; empty artist is an optional warning and bad trim is an error',()=>{
 assert.equal(checks.inspect(validVinyl).length,0);
 assert.equal(checks.inspect({...validVinyl,artist:''})[0].level,'warning');
 assert.equal(checks.inspect({...validVinyl,end:181})[0].level,'error');
 assert.equal(checks.inspect({...validVinyl,start:50,end:45})[0].action,'trim');
});
test('informative harmony advice applies below four rendered lines and allows continuing',()=>{
 const short = checks.inspect({format:'informative',label:'Informativo 2',body:'Texto curto.',lines:3});
 assert.equal(short[0].level,'warning'); assert.match(short[0].text,/harmonia/); assert.match(short[0].text,/4 linhas/);
 assert.equal(checks.inspect({format:'informative',body:'Texto completo',lines:4}).length,0);
 assert.equal(checks.inspect({format:'informative',body:'',lines:0})[0].level,'error');
});
test('empty Polaroid blocks alone but can be skipped in a batch; collage samples are optional',()=>{
 assert.equal(checks.inspect({format:'polaroid',image:false})[0].level,'error');
 assert.equal(checks.inspect({format:'polaroid',image:false,skipped:true})[0].level,'warning');
 assert.equal(checks.inspect({format:'collage',count:0})[0].level,'error');
 assert.equal(checks.inspect({format:'collage',count:6,examples:true})[0].level,'warning');
});
test('Stories detects absent or unreadable media and loading never launches export',()=>{
 assert.equal(checks.inspect({format:'stories',image:false,video:false})[0].action,'media');
 assert.equal(checks.inspect({format:'stories',video:true,broken:true})[0].level,'error');
 assert.equal(checks.inspect({format:'vinyl',loading:true})[0].level,'error');
});
