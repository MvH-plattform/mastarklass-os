
window.MKPortfolioImportValidator881={
 report(data){
   const h=Array.isArray(data?.holdings)?data.holdings:[];
   const dups=window.MKPortfolioMerge881.duplicateReport(data);
   const missingNames=h.filter(x=>!String(x?.name||"").trim()).length;
   const value=h.reduce((s,x)=>s+Number(x.marketValueSEK||x.marketValue||x.currentValue||x.costValueSEK||0),0);
   const fields=["name","type","currency","country","sector"];
   const coverage=h.length?h.reduce((s,x)=>s+fields.filter(f=>String(x?.[f]||"").trim()).length,0)/(h.length*fields.length)*100:0;
   return {holdings:h.length,duplicates:dups,missingNames,value,coverage,valid:h.length>0&&missingNames===0};
 }
};
