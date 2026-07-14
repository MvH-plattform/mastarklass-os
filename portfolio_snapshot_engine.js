
window.MKPortfolioSnapshot88={
 KEY:"mk_portfolio_snapshots_88",
 load(){try{return JSON.parse(localStorage.getItem(this.KEY)||"[]")}catch(e){return[]}},
 save(list){localStorage.setItem(this.KEY,JSON.stringify(list.slice(-365)));},
 maybeCreate(data,health){
   const holdings=Array.isArray(data?.holdings)?data.holdings:[];
   if(!holdings.length)return null;
   const list=this.load(),last=list[list.length-1],now=Date.now();
   if(last&&now-new Date(last.at).getTime()<24*3600*1000)return last;
   const value=window.MKPortfolioExposure88.total(holdings);
   const snap={at:new Date().toISOString(),value,holdings:holdings.length,health:health?.total||0};
   list.push(snap);this.save(list);return snap;
 }
};
