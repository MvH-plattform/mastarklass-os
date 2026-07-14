
(function(){
  const num=x=>Number(x||0);
  const value=h=>num(h.marketValueSEK||h.value||h.costValueSEK);
  const verified=h=>!h.status||String(h.status).startsWith("verified")||h.status==="active";
  window.openUnifiedAnalytics883=function(){
    window.MKSync883?.refreshDataReference();
    if(typeof showScreen==="function")showScreen("portfolioAnalytics22",document.querySelectorAll(".tab")[1]||null);
    setTimeout(()=>window.renderUnifiedAnalytics883(),0);
  };
  window.renderUnifiedAnalytics883=function(){
    const root=document.getElementById("portfolioAnalytics22");
    if(!root||!window.DATA)return;
    const hs=(DATA.holdings||[]).filter(verified);
    const known=hs.filter(h=>value(h)>0);
    const total=known.reduce((s,h)=>s+value(h),0);
    const largest=[...known].sort((a,b)=>value(b)-value(a))[0];
    const groups={};
    hs.forEach(h=>{
      const key=String(h.ticker||h.isin||h.name||"").trim().toLowerCase();
      if(key)(groups[key]||(groups[key]=[])).push(h);
    });
    const overlaps=Object.values(groups).filter(x=>x.length>1);
    const set=(id,text)=>{const el=document.getElementById(id);if(el)el.textContent=text};
    const kr=n=>new Intl.NumberFormat("sv-SE",{style:"currency",currency:"SEK",maximumFractionDigits:0}).format(n);
    set("anKnownValue",kr(total));
    set("anCoverage",`${known.length}/${hs.length}`);
    set("anLargest",largest&&total?`${(value(largest)/total*100).toFixed(1).replace(".",",")}%`:"—");
    set("anLargestName",largest?.name||"—");
    set("anOverlapCount",String(overlaps.length));
    try{if(typeof renderPortfolioAnalytics22==="function")renderPortfolioAnalytics22()}catch(e){}
    const hero=root.querySelector(".eyebrow"); if(hero)hero.textContent="Mästarklass OS 8.8.3";
    const title=root.querySelector(".title"); if(title)title.textContent="Portfolio Analytics 2.3";
    root.dataset.sync883="ready";
  };
})();
