
(function(){
  const val=h=>Number(h.marketValueSEK||h.value||h.costValueSEK||0);
  window.renderUnifiedBrain883=function(){
    if(!window.DATA)return;
    const hs=DATA.holdings||[];
    const total=hs.reduce((s,h)=>s+val(h),0);
    const known=hs.filter(h=>val(h)>0);
    const largest=known.length&&total?Math.max(...known.map(val))/total*100:0;
    const coverage=hs.length?known.length/hs.length*100:0;
    const quality=Math.max(0,Math.min(100,Math.round(45+coverage*.4-largest*.2)));
    const fields={
      pb71IQ:`${quality}/100`,
      pb71Problems: largest>20?"Koncentration":"Inga kritiska",
      pb71Overlap:"Analyseras",
      pb71Coverage:`${coverage.toFixed(0)}%`
    };
    Object.entries(fields).forEach(([id,v])=>{const el=document.getElementById(id);if(el)el.textContent=v});
    const screen=document.getElementById("portfolioBrain71");
    if(screen){
      const metrics=[...screen.querySelectorAll(".pb71Metric, .metricLarge")];
      const vals=[`${quality}/100`,largest>20?"1":"0","Analyseras",`${coverage.toFixed(0)}%`];
      metrics.forEach((el,i)=>{if((el.textContent||"").trim()==="—"&&vals[i])el.textContent=vals[i]});
      screen.dataset.sync883="ready";
    }
  };
  window.MKEventBus883?.on("sync:complete",()=>window.renderUnifiedBrain883());
})();
