
(function(){
  let syncing=false;
  const safeCall=(name,...args)=>{
    const fn=window[name];
    if(typeof fn==="function"){try{return fn(...args)}catch(e){console.error("Sync call failed",name,e)}}
  };
  window.MKSync883={
    refreshDataReference(){
      const d=window.MKUnifiedData883?.get();
      if(d)window.DATA=d;
    },
    renderScreen(id){
      this.refreshDataReference();
      const map={
        portfolioAnalytics22:["renderPortfolioAnalytics22","renderUnifiedAnalytics883"],
        portfolioBrain71:["renderPortfolioBrain71","renderUnifiedBrain883"],
        portfolio:["renderPortfolioCockpit23","renderPortfolio","renderUnifiedDashboard883"],
        home:["renderDashboard","renderUnifiedDashboard883"],
        intelligentImport881:["renderIntelligentImport881","renderSmartImportCenter882"]
      };
      (map[id]||[]).forEach(n=>safeCall(n));
    },
    async fullSync(reason="manual"){
      if(syncing)return;
      syncing=true;
      try{
        this.refreshDataReference();
        ["renderDashboard","renderPortfolio","renderPortfolioCockpit23","renderPortfolioAnalytics22",
         "renderUnifiedAnalytics883","renderPortfolioBrain71","renderUnifiedBrain883",
         "renderSmartImportCenter882","renderIntelligentImport881"].forEach(n=>safeCall(n));
        window.MKEventBus883?.emit("sync:complete",{reason,holdings:window.DATA?.holdings?.length||0});
      }finally{syncing=false}
    }
  };
  window.MKEventBus883?.on("portfolio:changed",()=>window.MKSync883.fullSync("portfolio-changed"));
  window.MKEventBus883?.on("data:adopted",()=>window.MKSync883.fullSync("data-adopted"));
})();
