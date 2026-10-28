"use strict";
(() => {
  const $=id=>document.getElementById(id);
  const workspace=$('collageWorkspace'),media=$('collageMedia'),effects=$('collageEffects'),photos=$('collagePhotosPanel');
  let active=false;
  const mobile=matchMedia('(max-width:800px), (max-width:960px) and (pointer:coarse)');
  let noticeShown=false;
  const notice=document.createElement('dialog');notice.id='collageMobileNotice';notice.className='collage-mobile-notice';notice.setAttribute('aria-labelledby','collageNoticeTitle');notice.setAttribute('aria-describedby','collageNoticeDescription');
  notice.innerHTML='<form method="dialog"><h2 id="collageNoticeTitle">Colagem em teste</h2><p id="collageNoticeDescription">Esta página ainda está em teste e pode apresentar bugs ou travamentos em dispositivos móveis.</p><button type="submit" autofocus>Entendi, continuar</button></form>';
  document.body.append(notice);
  function showMobileNotice(){
    if(noticeShown||!active||!mobile.matches||document.querySelector('dialog[open]'))return;
    if($('contentIdeasStatus')?.textContent.trim().startsWith('Carregando'))return;
    noticeShown=true;notice.showModal();
  }
  document.addEventListener('close',()=>queueMicrotask(showMobileNotice),true);
  mobile.addEventListener('change',()=>{if(!mobile.matches&&notice.open)notice.close();else showMobileNotice();});
  new MutationObserver(showMobileNotice).observe($('contentIdeasStatus'),{childList:true,subtree:true});
  const icon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 5 10-2 2 12-10 2zM15 7l6 1-2 13-10-2"/></svg>';
  function close(){effects.hidden=true;photos.hidden=true;$('collageGear').setAttribute('aria-expanded','false');$('managePhotos').setAttribute('aria-expanded','false');}
  function activate(){
    StudioUI.closeOtherPanels();active=true;document.body.classList.add('collage-active');workspace.hidden=false;media.hidden=false;
    document.dispatchEvent(new Event('collage:activate'));
    document.querySelectorAll('.glass-dock .format-option,.mobile-navigation .mobile-format').forEach(b=>b.setAttribute('aria-pressed',String(b.classList.contains('collage-option'))));
    $('exportButton').disabled=$('export').disabled;$('exportButton').setAttribute('aria-label','Exportar colagem PNG');
    showMobileNotice();
  }
  function mount(){
    if(document.body.classList.contains('workbench-loading'))return;
    observer.disconnect();document.querySelector('.experience-shell').append(workspace,media,effects,photos);
    const unit=document.createElement('div');unit.className='dock-format-unit';
    const button=document.createElement('button');button.type='button';button.className='format-option glass-tool collage-option';button.setAttribute('aria-label','Colagem');button.setAttribute('aria-pressed','false');button.innerHTML=icon;button.addEventListener('click',activate);unit.append(button);
    const closing=document.querySelector('.dock-formats [data-format-unit="closing"]');
    document.querySelector('.dock-formats').insertBefore(unit,closing);
    if(document.body.hasAttribute('data-collage-start'))activate();
  }
  document.addEventListener('click',event=>{
    const original=event.target.closest('.glass-dock .format-option:not(.collage-option),.mobile-navigation .mobile-format');
    if(original&&active){active=false;document.body.classList.remove('collage-active');workspace.hidden=true;media.hidden=true;close();document.querySelectorAll('.collage-option').forEach(b=>b.setAttribute('aria-pressed','false'));$('exportButton').setAttribute('aria-label','Exportar PNG');}
    if(active&&event.target.closest('#exportButton')){event.preventDefault();event.stopImmediatePropagation();$('export').click();}
  },true);
  function toggle(panel,trigger){const opening=panel.hidden;close();panel.hidden=!opening;trigger.setAttribute('aria-expanded',String(opening));}
  $('collageGear').addEventListener('click',()=>toggle(effects,$('collageGear')));
  $('managePhotos').addEventListener('click',()=>toggle(photos,$('managePhotos')));
  $('closeCollageEffects').addEventListener('click',()=>{close();$('collageGear').focus();});
  $('closeCollagePhotos').addEventListener('click',()=>{close();$('managePhotos').focus();});
  document.addEventListener('pointerdown',event=>{if(!event.target.closest('.collage-panel,#collageGear,#managePhotos'))close();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')close();});
  const observer=new MutationObserver(mount);observer.observe(document.body,{attributes:true,attributeFilter:['class']});mount();
})();
