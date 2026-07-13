
window.MKTickerMapping82={
 records(){return window.DATA?.livePortfolio82?.records||[];},
 summary(){
   const r=this.records();
   return {total:r.length,mapped:r.filter(x=>x.ticker).length,ready:r.filter(x=>x.mappingStatus==="READY").length};
 }
};
