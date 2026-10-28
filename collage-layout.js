"use strict";
const CollageLayout = (() => {
  function arrange(count, seed = 1, width = 1080, height = 1350) {
    if (!count) return [];
    if (count === 1) return [{x:width/2,y:height/2,width,height,angle:0,shape:"rect",edge:seed}];
    let value=seed>>>0;
    const random=()=>((value=(value*1664525+1013904223)>>>0)/4294967296);
    const shapes=["slant","trapezoid","torn","slant","rect","torn"];
    const columns=count<=3?1:2,rows=Math.ceil(count/columns);
    return Array.from({length:count},(_,i)=>{
      const col=i%columns,row=Math.floor(i/columns);
      const x=columns===1?width*(.46+(i%2?.12:-.08)):width*(col?.76:.24);
      return {
        x:x+(random()-.5)*width*.16,
        y:height*((row+.5)/rows)+(random()-.5)*height*.09,
        width:width*(columns===1?.92:.66)*(1+(random()-.5)*.18),
        height:height/rows*(1.35+random()*.18),
        angle:(random()-.5)*24,
        shape:shapes[(i+seed)%shapes.length],edge:Math.floor(random()*100000),
      };
    });
  }
  function outline(tile) {
    const w=tile.width,h=tile.height;
    if(tile.shape==='slant')return [[-w/2,-h*.38],[w/2,-h/2],[w*.42,h/2],[-w/2,h*.42]];
    if(tile.shape==='trapezoid')return [[-w*.36,-h/2],[w/2,-h*.4],[w*.35,h/2],[-w/2,h*.35]];
    if(tile.shape!=='torn')return [[-w/2,-h/2],[w/2,-h/2],[w/2,h/2],[-w/2,h/2]];
    let noise=tile.edge;const jitter=()=>{noise=(noise*1664525+1013904223)>>>0;return noise/4294967296;};
    const points=[[-w/2,-h/2]];
    for(let n=1;n<=14;n++)points.push([-w/2+w*n/14,-h/2+jitter()*16]);
    for(let n=1;n<=14;n++)points.push([w/2-jitter()*16,-h/2+h*n/14]);
    for(let n=1;n<=14;n++)points.push([w/2-w*n/14,h/2-jitter()*16]);
    for(let n=1;n<=14;n++)points.push([-w/2+jitter()*16,h/2-h*n/14]);
    return points;
  }
  function localPoint(tile,point) {
    const angle=-tile.angle*Math.PI/180,dx=point.x-tile.x,dy=point.y-tile.y;
    return {x:dx*Math.cos(angle)-dy*Math.sin(angle),y:dx*Math.sin(angle)+dy*Math.cos(angle)};
  }
  function crop(iw,ih,w,h,framing={}) {
    const zoom=Math.max(1,Math.min(4,Number.isFinite(framing.zoom)?framing.zoom:1));
    // Leave a small bleed under the mask to avoid sampling the image edge on rotation.
    const bleed=2,scale=Math.max((w+bleed*2)/iw,(h+bleed*2)/ih)*zoom;
    const width=iw*scale,height=ih*scale,limitX=Math.max(0,(width-w)/2-bleed),limitY=Math.max(0,(height-h)/2-bleed);
    const x=(w-width)/2+Math.max(-1,Math.min(1,framing.x||0))*limitX,y=(h-height)/2+Math.max(-1,Math.min(1,framing.y||0))*limitY;
    const sourceWidth=Math.min(iw,w*iw/width),sourceHeight=Math.min(ih,h*ih/height);
    const sourceX=Math.max(0,Math.min(iw-sourceWidth,-x*iw/width)),sourceY=Math.max(0,Math.min(ih-sourceHeight,-y*ih/height));
    return {width,height,limitX,limitY,x,y,sourceX,sourceY,sourceWidth,sourceHeight};
  }
  function pan(framing,geometry,dx,dy) {
    return {...framing,x:geometry.limitX?Math.max(-1,Math.min(1,(framing.x||0)+dx/geometry.limitX)):0,y:geometry.limitY?Math.max(-1,Math.min(1,(framing.y||0)+dy/geometry.limitY)):0};
  }
  function zoom(framing,iw,ih,w,h,requested) {
    const next={...framing,zoom:Math.max(1,Math.min(4,requested))};
    const before=crop(iw,ih,w,h,framing),after=crop(iw,ih,w,h,next),ratio=next.zoom/(framing.zoom||1);
    next.x=after.limitX?Math.max(-1,Math.min(1,(framing.x||0)*before.limitX*ratio/after.limitX)):0;
    next.y=after.limitY?Math.max(-1,Math.min(1,(framing.y||0)*before.limitY*ratio/after.limitY)):0;
    return next;
  }
  return Object.freeze({arrange,outline,localPoint,crop,pan,zoom});
})();
