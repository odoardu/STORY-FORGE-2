import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const layout=vm.runInNewContext(readFileSync(new URL('../collage-layout.js',import.meta.url),'utf8')+'; CollageLayout');
test('free collages use finite, varied cutouts without circular shapes',()=>{
 for(let count=1;count<=12;count++)for(let seed=1;seed<=10;seed++){
  const tiles=layout.arrange(count,seed);assert.equal(tiles.length,count);
  for(const tile of tiles){for(const key of ['x','y','width','height','angle'])assert.ok(Number.isFinite(tile[key]));assert.ok(tile.width>0&&tile.height>0);assert.ok(['rect','slant','trapezoid','torn'].includes(tile.shape));}
  if(count>1)assert.ok(tiles.some(tile=>Math.abs(tile.angle)>0));
 }
});
test('composition stays stable until a new seed is requested',()=>{
 assert.equal(JSON.stringify(layout.arrange(6,841)),JSON.stringify(layout.arrange(6,841)));
 assert.notEqual(JSON.stringify(layout.arrange(6,841)),JSON.stringify(layout.arrange(6,842)));
 assert.equal(layout.arrange(0).length,0);
});
test('pan clamps the image inside its mask without moving the mask',()=>{
 const tile=layout.arrange(6,841)[2],before=JSON.stringify(tile);
 for(const [iw,ih] of [[800,1200],[1600,900],[1080,1350]]){
  const framing={x:0,y:0,zoom:1.15},g=layout.crop(iw,ih,tile.width,tile.height,framing);
  for(const [dx,dy] of [[100000,100000],[-100000,-100000],[20,-30]]){
   const pan=layout.pan(framing,g,dx,dy),crop=layout.crop(iw,ih,tile.width,tile.height,pan);
   assert.ok(crop.x<=1e-6&&crop.y<=1e-6);
   assert.ok(crop.x+crop.width>=tile.width-1e-6&&crop.y+crop.height>=tile.height-1e-6);
   assert.ok(Math.abs(pan.x)<=1&&Math.abs(pan.y)<=1);
  }
 }
 assert.equal(JSON.stringify(tile),before);
});
test('drag coordinates respect mask rotation and torn edges remain stable',()=>{
 const tile={x:100,y:200,width:400,height:600,angle:90,shape:'torn',edge:123};
 const point=layout.localPoint(tile,{x:100,y:230});
 assert.ok(Math.abs(point.x-30)<1e-6&&Math.abs(point.y)<1e-6);
 assert.equal(JSON.stringify(layout.outline(tile)),JSON.stringify(layout.outline(tile)));
 assert.equal(layout.outline(tile).length,57);
});
test('zoom stays within cover limits and preserves the image point at frame center',()=>{
 const iw=1600,ih=900,w=500,h=600,start={x:.3,y:-.2,zoom:1.4};
 const before=layout.crop(iw,ih,w,h,start),next=layout.zoom(start,iw,ih,w,h,2.5),after=layout.crop(iw,ih,w,h,next);
 assert.ok(Math.abs((w/2-before.x)/before.width-(w/2-after.x)/after.width)<1e-9);
 assert.ok(Math.abs((h/2-before.y)/before.height-(h/2-after.y)/after.height)<1e-9);
 for(const requested of [.1,1,4,20]){
  const framing=layout.zoom(start,iw,ih,w,h,requested),g=layout.crop(iw,ih,w,h,framing);
  assert.ok(framing.zoom>=1&&framing.zoom<=4);
  assert.ok(g.x<=1e-6&&g.y<=1e-6&&g.x+g.width>=w-1e-6&&g.y+g.height>=h-1e-6);
 }
});
test('extreme drags at all zooms never sample beyond the source photograph',()=>{
 for(const [iw,ih] of [[1600,900],[900,1600],[100,100],[4000,200]]){
  for(const zoom of [0,.5,1,1.15,2,4,10])for(const x of [-100,-1,0,1,100])for(const y of [-100,-1,0,1,100]){
   const g=layout.crop(iw,ih,531.4,602.7,{zoom,x,y});
   assert.ok(g.sourceX>=0&&g.sourceY>=0&&g.sourceWidth>0&&g.sourceHeight>0);
   assert.ok(g.sourceX+g.sourceWidth<=iw+1e-6&&g.sourceY+g.sourceHeight<=ih+1e-6);
   assert.ok(g.x<=-1.999&&g.y<=-1.999&&g.x+g.width>=533.399&&g.y+g.height>=604.699);
  }
 }
});
