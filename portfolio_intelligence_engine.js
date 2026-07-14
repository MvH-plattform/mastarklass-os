
window.MKPortfolioIntelligence88={
 analyze(data){
   const holdings=Array.isArray(data?.holdings)?data.holdings:[];
   const exposure=window.MKPortfolioExposure88;
   const health=window.MKPortfolioHealth88.score(data);
   const value=exposure.total(holdings);
   const goals=[
     {name:"500 000 kr",target:500000},
     {name:"1 000 000 kr",target:1000000},
     {name:"7 500 000 kr",target:7500000}
   ].map(g=>({...g,current:value,progress:g.target?Math.min(100,value/g.target*100):0,remaining:Math.max(0,g.target-value)}));
   const result={
     holdings,value,health,
     accounts:exposure.accounts(holdings),
     assets:exposure.assets(holdings),
     sectors:exposure.group(holdings,"sector"),
     countries:exposure.group(holdings,"country"),
     currencies:exposure.group(holdings,"currency"),
     goals
   };
   window.MKPortfolioSnapshot88.maybeCreate(data,health);
   return result;
 }
};
