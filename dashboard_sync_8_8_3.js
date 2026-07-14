
(function(){
  window.renderUnifiedDashboard883=function(){
    const d=window.MKUnifiedData883?.get()||window.DATA;
    if(!d)return;
    const count=d.holdings?.length||0;
    const subtitle=document.getElementById("subtitle");
    if(subtitle)subtitle.textContent=`${count} innehav • 8.8.3 Unified Data Sync • 2026-07-14`;
    document.documentElement.dataset.unifiedSync883=count?"loaded":"empty";
  };
  window.MKEventBus883?.on("sync:complete",()=>window.renderUnifiedDashboard883());
})();
