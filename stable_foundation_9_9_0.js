(function(global){
  'use strict';
  const VERSION='9.9.0';
  const SCREEN_IDS=['home','portfolio','market','analysisScreen','ideas','goals','more'];

  function setVersion(){
    document.title='Mästarklass OS '+VERSION+' – Stable Foundation';
    document.documentElement.dataset.buildVersion=VERSION;
    document.body?.setAttribute('data-build',VERSION);
    const badge=document.getElementById('mkVersionBuildBadge'); if(badge)badge.textContent=VERSION;
    const h1=document.querySelector('header h1'); if(h1)h1.textContent='Mästarklass OS '+VERSION;
    global.MK_BUILD_VERSION=VERSION;
  }

  function activateOnly(id,el){
    document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active',s.id===id));
    document.querySelectorAll('nav .tab').forEach(t=>t.classList.remove('active'));
    if(el)el.classList.add('active');
    const target=document.getElementById(id);
    if(!target){console.error('Saknad skärm:',id);return false;}
    if(global.MKSync883?.renderScreen){try{global.MKSync883.renderScreen(id)}catch(e){console.warn(e)}}
    if(id==='home' && typeof global.renderIntegration761==='function'){try{global.renderIntegration761()}catch(e){}}
    global.scrollTo({top:0,behavior:'auto'});
    return true;
  }

  function installNavigation(){
    global.showScreen=function(id,el){return activateOnly(id,el)};
    document.querySelectorAll('nav .tab').forEach(tab=>{
      if(tab.dataset.mk990Bound)return;
      tab.dataset.mk990Bound='1';
      tab.addEventListener('click',function(ev){
        const raw=this.getAttribute('onclick')||'';
        const m=raw.match(/showScreen\(['"]([^'"]+)/);
        if(m){ev.preventDefault();ev.stopImmediatePropagation();activateOnly(m[1],this)}
      },true);
    });
  }

  function headingText(el){return (el.querySelector('h1,h2,h3,.title,.headline')?.textContent||'').trim()}
  function addPortfolioJumpbar(){
    const screen=document.getElementById('portfolio');
    if(!screen || screen.querySelector('.mk990-jumpbar'))return;
    const candidates=[...screen.querySelectorAll(':scope > section, :scope > div, .card, article')];
    const wanted=[
      ['Översikt',/översikt|cockpit|portföljvärde/i],
      ['Konton',/konton|kontoöversikt/i],
      ['Tillgångsslag',/tillgångsslag|tillgångar/i],
      ['Största innehav',/största innehav/i],
      ['Datakvalitet',/datakvalitet|datatäckning/i],
      ['Från analys till handling',/från analys till handling|åtgärd|beslut/i],
      ['Personlig intelligens',/personlig investeringsintelligens|investment intelligence|portfolio intelligence/i]
    ];
    const found=[];
    wanted.forEach(([label,rx],i)=>{
      const node=candidates.find(n=>rx.test(headingText(n)) || rx.test(n.textContent?.slice(0,180)||''));
      if(node && !found.some(x=>x.node===node)){
        node.id=node.id||'mk990PortfolioSection'+i;
        found.push({label,node});
      }
    });
    if(!found.length)return;
    const nav=document.createElement('div');nav.className='mk990-jumpbar';
    nav.innerHTML=found.map(x=>`<button type="button" data-target="${x.node.id}">${x.label}</button>`).join('');
    screen.insertBefore(nav,screen.firstElementChild);
    nav.querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>{
      document.getElementById(btn.dataset.target)?.scrollIntoView({behavior:'smooth',block:'start'});
    }));
    found.forEach(x=>{
      const b=document.createElement('button');b.type='button';b.className='mk990-top';b.textContent='↑ Till snabbmenyn';
      b.addEventListener('click',()=>nav.scrollIntoView({behavior:'smooth',block:'start'}));x.node.appendChild(b);
    });
  }

  function enforceSingleScreen(){
    const active=[...document.querySelectorAll('.screen.active')];
    if(active.length!==1){
      const preferred=active.find(x=>SCREEN_IDS.includes(x.id))||document.getElementById('home');
      document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active',s===preferred));
    }
  }

  function cleanOldCodeCaches(){
    if(!('caches' in global))return;
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('mastarklass-os-')&&k!=='mastarklass-os-9.9.0').map(k=>caches.delete(k)))).catch(()=>{});
  }

  function boot(){
    setVersion();installNavigation();enforceSingleScreen();addPortfolioJumpbar();cleanOldCodeCaches();
    const observer=new MutationObserver(()=>{setVersion();enforceSingleScreen()});
    observer.observe(document.body,{subtree:true,attributes:true,attributeFilter:['class','data-build'],childList:false});
    global.addEventListener('pageshow',()=>{setVersion();enforceSingleScreen()});
  }

  global.MKStableFoundation990={version:VERSION,activateOnly,addPortfolioJumpbar};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})(window);
