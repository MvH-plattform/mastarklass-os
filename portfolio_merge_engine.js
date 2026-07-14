
window.MKPortfolioMerge881={
 key(h){return [h?.isin,h?.ticker,h?.name,h?.accountId||h?.platform].map(x=>String(x||"").trim().toLowerCase()).join("|");},
 merge(candidates){
   if(!candidates.length)throw new Error("Inga kandidater valda.");
   const base=structuredClone(candidates[0].data),map=new Map(),duplicates=[];
   candidates.forEach(c=>(c.data.holdings||[]).forEach(h=>{
     const k=this.key(h);
     if(!k.replace(/\|/g,""))return;
     if(!map.has(k)){map.set(k,structuredClone(h));return;}
     duplicates.push(h.name||h.ticker||"Okänt innehav");
     const old=map.get(k);
     const oldValue=Number(old.marketValueSEK||old.marketValue||0),newValue=Number(h.marketValueSEK||h.marketValue||0);
     if(newValue>oldValue)map.set(k,{...old,...h});
     else map.set(k,{...h,...old});
   }));
   base.holdings=[...map.values()];
   base.journal=base.journal||[];
   base.journal.unshift({date:new Date().toISOString().slice(0,10),title:"Portföljer sammanslagna lokalt",text:`${candidates.length} källor slogs ihop till ${base.holdings.length} unika innehav.`});
   return {data:base,duplicates:[...new Set(duplicates)]};
 },
 duplicateReport(data){
   const map=new Map(),dups=[];
   (data?.holdings||[]).forEach(h=>{
     const k=this.key(h);
     if(map.has(k))dups.push(h.name||h.ticker||"Okänt");
     else map.set(k,true);
   });
   return [...new Set(dups)];
 }
};
