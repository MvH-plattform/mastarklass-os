
window.MKPortfolioAttribution84={
 snapshot(){return window.DATA?.marketIntelligence84?.attribution||null;},
 ready(){
   const a=this.snapshot();
   return !!a && Number.isFinite(Number(a.portfolioDayChangePct)) && a.status!=="WAITING_VERIFIED_QUOTES";
 }
};
