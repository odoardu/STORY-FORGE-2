import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const read = name => readFileSync(new URL('../'+name,import.meta.url),'utf8');
test('iPhone, iPad and browser fallbacks declare actual opaque PNG files of the right dimensions',()=>{
 const html = read('index.html');
 for (const size of [152,167,180]) {
  const path = `apple-touch-icon-${size}-20261028.png`, bytes = readFileSync(new URL('../'+path,import.meta.url));
  assert.ok(html.includes(`sizes="${size}x${size}" type="image/png" href="/${path}"`));
  assert.equal(bytes.subarray(1,4).toString(),'PNG'); assert.equal(bytes.readUInt32BE(16),size); assert.equal(bytes.readUInt32BE(20),size); assert.equal(bytes[25],2);
 }
 assert.ok(html.includes('/favicon.ico')); assert.ok(html.includes('/assets/pwa/icon-32-20261028-v3.png'));
 const manifest = JSON.parse(read('manifest.webmanifest')); assert.equal(manifest.id,'/'); assert.equal(manifest.start_url,'/');
 for(const icon of manifest.icons) {const bytes=readFileSync(new URL('..'+icon.src,import.meta.url));assert.equal(bytes.subarray(1,4).toString(),'PNG');}
});
test('another page navigation cannot overwrite the cached editor document',async()=>{
 const listeners={},stored=[];
 vm.runInNewContext(read('service-worker.js'),{self:{location:{hostname:'story-forge-2.vercel.app',origin:'https://story-forge-2.vercel.app'},addEventListener:(type,fn)=>listeners[type]=fn},URL,Request,Response,fetch:async()=>new Response('<html>Refresh</html>',{headers:{'Content-Type':'text/html'}}),caches:{open:async()=>({put:async(key,response)=>stored.push([key,await response.text()])})}});
 let response;const work=[];const request={method:'GET',url:'https://story-forge-2.vercel.app/atualizar-pwa.html',mode:'navigate'};
 listeners.fetch({request,respondWith:value=>response=value,waitUntil:value=>work.push(value)});await response;await Promise.all(work);
 assert.equal(stored.length,1);assert.equal(stored[0][0],request);assert.notEqual(stored[0][0],'/index.html');
});
