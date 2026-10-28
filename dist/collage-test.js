"use strict";
(() => {
  const $ = id => document.getElementById(id);
  const canvas = $('art'), ctx = canvas.getContext('2d');
  let tiles=[],orderedPhotos=[],selected=null,drag=null,compositionDirty=false;
  const panUndo=[],panRedo=[];
  let wheelGesture=null,wheelTimer;
  const zoomTools=document.createElement('div');zoomTools.className='collage-zoom';zoomTools.hidden=true;zoomTools.setAttribute('role','group');zoomTools.setAttribute('aria-label','Zoom da foto selecionada');
  zoomTools.innerHTML='<button type="button" aria-label="Diminuir zoom da foto"><svg viewBox="0 0 24 24"><path d="M5 12h14"/></svg></button><output aria-label="Nível de zoom">115%</output><button type="button" aria-label="Aumentar zoom da foto"><svg viewBox="0 0 24 24"><path d="M5 12h14M12 5v14"/></svg></button>';
  canvas.parentElement.append(zoomTools);
  const zoomOut=zoomTools.querySelector('button'),zoomIn=zoomTools.querySelector('button:last-child'),zoomValue=zoomTools.querySelector('output');
  const selection=document.createElement('canvas');selection.width=1080;selection.height=1350;selection.className='collage-selection';selection.setAttribute('aria-hidden','true');canvas.after(selection);
  canvas.tabIndex=0;canvas.setAttribute('aria-label','Fotos da colagem. Clique e arraste para ajustar o enquadramento. Use espaço para selecionar e as setas para mover.');
  let photos = [], demoPhotos = [], texture, textureSoft, logo, composite, seed = 841, pending = 0, loading = false, ready = false;
  const loadImage = src => new Promise((resolve, reject) => {
    const image = new Image(); image.onload = () => resolve(image); image.onerror = () => reject(new Error('Não foi possível abrir a imagem')); image.src = src;
  });
  function cover(context,image,x,y,w,h,framing) {
    const g=CollageLayout.crop(image.naturalWidth||image.width,image.naturalHeight||image.height,w,h,framing);
    context.save();context.beginPath();context.rect(x,y,w,h);context.clip();
    // Draw a bounded source crop across the entire mask, never a translated image edge.
    context.drawImage(image,g.sourceX,g.sourceY,g.sourceWidth,g.sourceHeight,x,y,w,h);context.restore();
  }
  function arrange() {
    cancelDrag(true);select(null);panUndo.length=0;panRedo.length=0;
    orderedPhotos=[...photos];let number=seed;
    for(let i=orderedPhotos.length-1;i>0;i--){number=(number*1664525+1013904223)>>>0;const j=number%(i+1);[orderedPhotos[i],orderedPhotos[j]]=[orderedPhotos[j],orderedPhotos[i]];}
    tiles=CollageLayout.arrange(orderedPhotos.length,seed).map((tile,index)=>{
      const path=new Path2D(),points=CollageLayout.outline(tile);points.forEach(([x,y],i)=>i?path.lineTo(x,y):path.moveTo(x,y));path.closePath();
      const photo=orderedPhotos[index];photo.framing??={x:0,y:0,zoom:1.15};return {...tile,path,photo,index};
    });
    compositionDirty=true;schedule();
  }
  function paintComposite() {
    if(!composite){composite=document.createElement('canvas');composite.width=1080;composite.height=1350;}
    const painter=composite.getContext('2d');painter.clearRect(0,0,1080,1350);painter.fillStyle='#07070a';painter.fillRect(0,0,1080,1350);
    if(orderedPhotos.length)cover(painter,orderedPhotos[0].image,0,0,1080,1350);
    tiles.forEach(tile=>{
      const w=tile.width,h=tile.height;painter.save();painter.translate(tile.x,tile.y);painter.rotate(tile.angle*Math.PI/180);
      painter.save();painter.shadowColor='#0009';painter.shadowBlur=20;painter.shadowOffsetY=9;painter.fillStyle='#141316';painter.fill(tile.path);painter.restore();
      painter.clip(tile.path);cover(painter,tile.photo.image,-w/2,-h/2,w,h,tile.photo.framing);painter.restore();
    });
    compositionDirty=false;
  }
  function drawSelection() {
    const overlay=selection.getContext('2d');overlay.clearRect(0,0,1080,1350);
    zoomTools.hidden=!selected;
    if(selected){const level=selected.photo.framing.zoom;zoomValue.value=Math.round(level*100)+'%';zoomOut.disabled=level<=1;zoomIn.disabled=level>=4;}
    if(!selected)return;
    overlay.save();overlay.translate(selected.x,selected.y);overlay.rotate(selected.angle*Math.PI/180);
    overlay.strokeStyle='#f0a3d0';overlay.lineWidth=1.5*1080/Math.max(1,canvas.getBoundingClientRect().width);overlay.stroke(selected.path);overlay.restore();
  }
  function draw() {
    if(compositionDirty)paintComposite();
    const shade = Number($('shade').value);
    $('shadeValue').value = shade+'%';
    ctx.fillStyle = '#07070a'; ctx.fillRect(0,0,1080,1350);
    if (photos.length) {
      ctx.drawImage(composite,0,0);
      const overlay=ctx.createLinearGradient(0,0,0,1350);overlay.addColorStop(0,'#0000');overlay.addColorStop(1,'rgba(0,0,0,.22)');ctx.fillStyle=overlay;ctx.fillRect(0,0,1080,1350);
      const dark=ctx.createLinearGradient(0,0,0,1350);dark.addColorStop(0,'#0000');dark.addColorStop(.44,'#0000');dark.addColorStop(.66,`rgba(0,0,0,${shade/100*.42})`);dark.addColorStop(.82,`rgba(0,0,0,${shade/100})`);dark.addColorStop(1,`rgba(0,0,0,${shade/100})`);ctx.fillStyle=dark;ctx.fillRect(0,0,1080,1350);
    }
    if (texture) { ctx.save(); ctx.globalCompositeOperation = 'exclusion'; ctx.globalAlpha=.38; cover(ctx,texture,0,0,1080,1350); ctx.restore(); }
    if (textureSoft) { ctx.save(); ctx.globalCompositeOperation='soft-light';ctx.globalAlpha=.49;cover(ctx,textureSoft,0,0,1080,1350);ctx.restore(); }
    if (logo) { const w = 160, h = w*logo.naturalHeight/logo.naturalWidth; ctx.drawImage(logo,(1080-w)/2,1190,w,h); }
    drawSelection();
    if (!photos.length) { ctx.textAlign='center'; ctx.fillStyle='#ded5de'; ctx.font='28px Gotham, sans-serif'; ctx.fillText('Adicione fotos para criar sua colagem',540,640); }
  }
  function schedule() { cancelAnimationFrame(pending); pending=requestAnimationFrame(draw); }
  function point(event) {
    const rect=canvas.getBoundingClientRect();return {x:(event.clientX-rect.left)*1080/rect.width,y:(event.clientY-rect.top)*1350/rect.height};
  }
  function hit(point) {
    for(let i=tiles.length-1;i>=0;i--){const tile=tiles[i],local=CollageLayout.localPoint(tile,point);if(ctx.isPointInPath(tile.path,local.x,local.y))return tile;}
    return null;
  }
  function select(tile) {
    flushWheel();
    selected=tile;canvas.classList.toggle('has-selection',Boolean(tile));
    canvas.setAttribute('aria-label',tile?`Foto ${photos.indexOf(tile.photo)+1} selecionada. Arraste a imagem dentro do recorte ou use as setas.`:'Fotos da colagem. Clique e arraste para ajustar o enquadramento.');
    $('status').textContent=tile?`Foto ${photos.indexOf(tile.photo)+1} selecionada. Arraste para reenquadrar.`:'';schedule();
  }
  function remember(photo,before) {
    const after={...photo.framing};if(before.x===after.x&&before.y===after.y&&before.zoom===after.zoom)return;
    panUndo.push({photo,before,after});if(panUndo.length>50)panUndo.shift();panRedo.length=0;
  }
  function cancelDrag(restore=false) {
    if(!drag)return;const old=drag;drag=null;
    if(restore){old.tile.photo.framing={...old.before};compositionDirty=true;}
    else remember(old.tile.photo,old.before);
    if(canvas.hasPointerCapture(old.id))canvas.releasePointerCapture(old.id);
    canvas.classList.remove('is-dragging');schedule();
  }
  function flushWheel(){clearTimeout(wheelTimer);if(wheelGesture){remember(wheelGesture.photo,wheelGesture.before);wheelGesture=null;}}
  function changeZoom(requested,record=true){
    if(!selected||loading)return;
    const photo=selected.photo,before={...photo.framing};
    photo.framing=CollageLayout.zoom(before,photo.image.naturalWidth,photo.image.naturalHeight,selected.width,selected.height,requested);
    if(record)remember(photo,before);compositionDirty=true;schedule();
  }
  zoomOut.addEventListener('click',()=>{flushWheel();changeZoom(selected.photo.framing.zoom/1.12);canvas.focus({preventScroll:true});});
  zoomIn.addEventListener('click',()=>{flushWheel();changeZoom(selected.photo.framing.zoom*1.12);canvas.focus({preventScroll:true});});
  canvas.addEventListener('wheel',event=>{
    if(!selected||loading||!event.deltaY)return;
    event.preventDefault();
    if(!wheelGesture)wheelGesture={photo:selected.photo,before:{...selected.photo.framing}};
    changeZoom(selected.photo.framing.zoom*Math.exp(-Math.max(-100,Math.min(100,event.deltaY))*.002),false);
    clearTimeout(wheelTimer);wheelTimer=setTimeout(flushWheel,220);
  },{passive:false});
  canvas.addEventListener('pointerdown',event=>{
    if(loading||!ready||drag||event.button!==0)return;
    const p=point(event),tile=hit(p);select(tile);if(!tile)return;
    event.preventDefault();canvas.focus({preventScroll:true});
    drag={id:event.pointerId,tile,start:CollageLayout.localPoint(tile,p),before:{...tile.photo.framing}};
    canvas.setPointerCapture(event.pointerId);canvas.classList.add('is-dragging');
  });
  canvas.addEventListener('pointermove',event=>{
    if(!drag){canvas.style.cursor=hit(point(event))?'grab':'default';return;}
    if(event.pointerId!==drag.id)return;event.preventDefault();
    const tile=drag.tile,local=CollageLayout.localPoint(tile,point(event));
    const g=CollageLayout.crop(tile.photo.image.naturalWidth,tile.photo.image.naturalHeight,tile.width,tile.height,drag.before);
    tile.photo.framing=CollageLayout.pan(drag.before,g,local.x-drag.start.x,local.y-drag.start.y);
    compositionDirty=true;schedule();
  });
  canvas.addEventListener('pointerup',event=>{if(drag?.id===event.pointerId)cancelDrag();});
  canvas.addEventListener('pointercancel',event=>{if(drag?.id===event.pointerId)cancelDrag(true);});
  canvas.addEventListener('lostpointercapture',()=>cancelDrag(true));
  window.addEventListener('resize',schedule);
  document.addEventListener('pointerdown',event=>{
    if(!event.target.closest('#art,#collageGear,.collage-zoom,.collage-panel,.collage-media,.collage-option')){cancelDrag();select(null);}
  });
  document.addEventListener('keydown',event=>{
    if(!document.body.classList.contains('collage-active')||event.target.closest('input,textarea,[contenteditable=true]'))return;
    const command=event.ctrlKey||event.metaKey,key=event.key.toLowerCase();
    if(command&&(key==='z'||key==='y')){
      event.preventDefault();event.stopImmediatePropagation();cancelDrag();flushWheel();
      const redo=key==='y'||event.shiftKey,from=redo?panRedo:panUndo,to=redo?panUndo:panRedo,change=from.pop();
      if(change){change.photo.framing={...(redo?change.after:change.before)};to.push(change);compositionDirty=true;select(tiles.find(t=>t.photo===change.photo)||null);}return;
    }
    if(document.activeElement!==canvas)return;
    if(event.key==='Escape'){cancelDrag(true);select(null);return;}
    if(event.key===' '){event.preventDefault();select(tiles[(tiles.indexOf(selected)+1)%tiles.length]||null);return;}
    if(selected&&!command&&['+','=','-','_'].includes(event.key)){event.preventDefault();event.stopImmediatePropagation();flushWheel();changeZoom(selected.photo.framing.zoom*(['-','_'].includes(event.key)?1/1.12:1.12));return;}
    if(!selected||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;
    event.preventDefault();event.stopImmediatePropagation();const before={...selected.photo.framing},step=event.shiftKey?30:8;
    const g=CollageLayout.crop(selected.photo.image.naturalWidth,selected.photo.image.naturalHeight,selected.width,selected.height,before);
    selected.photo.framing=CollageLayout.pan(before,g,event.key==='ArrowLeft'?-step:event.key==='ArrowRight'?step:0,event.key==='ArrowUp'?-step:event.key==='ArrowDown'?step:0);
    remember(selected.photo,before);compositionDirty=true;schedule();
  },true);
  function busy(value,message) {
    loading=value; $('busy').hidden=!value; $('busy').textContent=message||'Preparando a colagem…';
    $('upload').disabled=value; $('examples').disabled=value;
    $('shuffle').disabled=value||photos.length<2; $('export').disabled=value||!photos.length||!ready;
    if(document.body.classList.contains('collage-active'))document.getElementById('exportButton').disabled=$('export').disabled;
  }
  function sync() {
    $('thumbnails').replaceChildren(); $('count').textContent=photos.length+' / 12';
    photos.forEach((photo,index) => {
      const tile=document.createElement('div'); tile.className='thumb';
      const image=document.createElement('img'); image.src=photo.src; image.alt=photo.name;
      const remove=document.createElement('button'); remove.className='remove'; remove.type='button'; remove.setAttribute('aria-label','Remover foto '+(index+1));
      remove.innerHTML='<svg viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg>';
      remove.addEventListener('click',()=>{ if(loading)return; const [old]=photos.splice(index,1);if(old.objectUrl)URL.revokeObjectURL(old.src);sync();arrange();$('status').textContent=photos.length?'Composição atualizada.':'Adicione fotos para começar.'; });
      tile.append(image,remove); $('thumbnails').append(tile);
    });
    busy(loading);
  }
  function releaseUploads() { photos.filter(photo=>photo.objectUrl).forEach(photo=>URL.revokeObjectURL(photo.src)); }
  async function examples() {
    busy(true); try {
      const loaded=await Promise.all(demoPhotos.map(async photo=>({src:photo.path,name:photo.title,image:await loadImage(photo.path)})));
      releaseUploads();photos=loaded;seed=841;sync();arrange();$('status').textContent='6 fotos de exemplo. Adicione as suas ou gere outra composição.';
    } catch(error){$('status').textContent='Não foi possível carregar as fotos de exemplo. Você pode enviar suas fotos.';}
    finally{busy(false);}
  }
  $('upload').addEventListener('click',()=>$('photos').click());
  $('photos').addEventListener('change',async event=>{
    const files=[...event.target.files]; event.target.value=''; if(!files.length)return;
    const replacingExamples=photos.length>0&&photos.every(photo=>!photo.objectUrl);
    const available=replacingExamples?12:12-photos.length;if(!available){$('status').textContent='Limite de 12 fotos. Remova uma para adicionar outra.';return;}
    busy(true); let failed=0; const incoming=[];
    for (const [i,file] of files.slice(0,available).entries()) {
      $('busy').textContent=`Abrindo foto ${i+1} de ${Math.min(files.length,available)}…`;
      const src=URL.createObjectURL(file);
      try { const image=await loadImage(src);incoming.push({src,name:file.name,image,objectUrl:true}); }
      catch(error){URL.revokeObjectURL(src);failed++;}
    }
    if(incoming.length) photos=replacingExamples?incoming:[...photos,...incoming];
    sync();arrange();busy(false);
    $('status').textContent=failed?`${failed} arquivo(s) não puderam ser abertos. As outras fotos foram mantidas.`:files.length>available?'Foram adicionadas fotos até o limite de 12.':'Fotos adicionadas. A colagem foi montada automaticamente.';
  });
  $('shuffle').addEventListener('click',()=>{seed++;arrange();$('status').textContent='Nova composição pronta.';});
  $('shade').addEventListener('input',schedule);
  $('examples').addEventListener('click',examples);
  $('export').addEventListener('click',()=>{
    draw();canvas.toBlob(blob=>{
      if(!blob){$('status').textContent='Não foi possível exportar. Tente novamente.';return;}
      const href=URL.createObjectURL(blob),link=document.createElement('a');link.href=href;link.download='colagem-story-forge.png';link.click();setTimeout(()=>URL.revokeObjectURL(href),60000);$('status').textContent='PNG exportado em 1080 × 1350.';
    },'image/png');
  });
  async function init(){
    busy(true);
    try {
      [texture,textureSoft,logo,demoPhotos]=await Promise.all([loadImage('/assets/textures/ECLUS%C3%83O%2038.png'),loadImage('/assets/textures/LUZ%20INDIRETA%2049.png'),loadImage('/assets/logos/LOGO%201%20MONO.png'),fetch('/assets/collage-test/photos.json').then(r=>{if(!r.ok)throw Error();return r.json();})]);
      demoPhotos.forEach(photo=>{const li=document.createElement('li'),a=document.createElement('a');a.href=photo.source;a.target='_blank';a.rel='noopener';a.textContent=photo.author+' · '+photo.license;li.append(a);$('credits').append(li);});
      ready=true;await examples();
    }catch(error){$('status').textContent='Não foi possível preparar os efeitos. Recarregue a página para tentar novamente.';busy(false);}
  }
  document.addEventListener('collage:activate',()=>void init(),{once:true});
})();
