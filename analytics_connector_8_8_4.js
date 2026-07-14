(function(){
  'use strict';
  const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
  const kr=n=>new Intl.NumberFormat('sv-SE',{style:'currency',currency:'SEK',maximumFractionDigits:0}).format(n||0);
  window.renderUnifiedAnalytics884=function(){
    const r=window.MKUnifiedIntelligence884?.get(); const root=document.getElementById('portfolioAnalytics22'); if(!r||!root)return;
    set('anKnownValue',kr(r.total)); set('anCoverage',`${r.valued.length}/${r.holdings.length}`); set('anLargest',r.largest?pct(r.largestPct):'—'); set('anLargestName',r.largest?.name||'—'); set('anOverlapCount',String(r.overlaps.length));
    const eyebrow=root.querySelector('.eyebrow');if(eyebrow)eyebrow.textContent='Mästarklass OS 8.8.4';
    const title=root.querySelector('.title');if(title)title.textContent='Portfolio Analytics 2.4';
    root.dataset.sync884='ready';
  };
  function pct(v){return Number(v||0).toFixed(1).replace('.',',')+'%'}
  const previous=window.openUnifiedAnalytics883;
  window.openUnifiedAnalytics884=function(){
    window.MKSync883?.refreshDataReference();
    if(typeof showScreen==='function')showScreen('portfolioAnalytics22',document.querySelectorAll('.tab')[1]||null);
    setTimeout(window.renderUnifiedAnalytics884,0);
  };
  window.openUnifiedAnalytics883=window.openUnifiedAnalytics884;
  window.MKEventBus883?.on('sync:complete',()=>window.renderUnifiedAnalytics884());
})();
