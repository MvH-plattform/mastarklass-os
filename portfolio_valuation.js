
window.MKPortfolioValuation82={
 fx(currency){const p=window.DATA?.livePortfolio82;return Number(p?.fxSnapshots?.[currency]??(currency==="SEK"?1:NaN));},
 value(record){
   const qty=Number(record.quantity),price=Number(record.lastVerifiedPrice),fx=this.fx(record.currency);
   if(Number.isFinite(qty)&&qty>0&&Number.isFinite(price)&&price>0&&Number.isFinite(fx))return qty*price*fx;
   return Number(record.lastVerifiedMarketValueSEK)||0;
 },
 recalc(){
   const p=window.DATA?.livePortfolio82;if(!p)return;
   p.records.forEach(r=>r.calculatedMarketValueSEK=Math.round(this.value(r)*100)/100);
   p.portfolioValueSEK=Math.round(p.records.reduce((s,r)=>s+(r.calculatedMarketValueSEK||0),0)*100)/100;
 }
};
