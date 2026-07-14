
window.MKPrivateVaultIntegrity87={
 stable(obj){if(Array.isArray(obj))return obj.map(x=>this.stable(x));if(obj&&typeof obj==="object"){const o={};Object.keys(obj).sort().forEach(k=>o[k]=this.stable(obj[k]));return o;}return obj;},
 async checksum(data){
   const bytes=new TextEncoder().encode(JSON.stringify(this.stable(data)));
   const hash=await crypto.subtle.digest("SHA-256",bytes);
   return Array.from(new Uint8Array(hash)).map(b=>b.toString(16).padStart(2,"0")).join("");
 },
 report(data){
   const holdings=Array.isArray(data?.holdings)?data.holdings:[];
   const names=new Set(),duplicates=[];
   holdings.forEach(h=>{const k=String(h?.name||"").trim().toLowerCase();if(k&&names.has(k))duplicates.push(h.name);if(k)names.add(k);});
   const missing=holdings.filter(h=>!h?.name);
   const portfolioValue=Number(data?.portfolio?.net||data?.livePortfolio82?.portfolioValueSEK||0);
   return {holdings:holdings.length,duplicates,missingNames:missing.length,portfolioValue,valid:duplicates.length===0&&missing.length===0};
 }
};
