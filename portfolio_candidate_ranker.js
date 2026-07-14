
window.MKPortfolioCandidateRanker881={
 value(data){
   const h=Array.isArray(data?.holdings)?data.holdings:[];
   return h.reduce((s,x)=>s+Number(x.marketValueSEK||x.marketValue||x.currentValue||x.costValueSEK||0),0);
 },
 coverage(data){
   const h=Array.isArray(data?.holdings)?data.holdings:[];
   if(!h.length)return 0;
   const fields=["name","type","currency","country","sector"];
   const filled=h.reduce((s,x)=>s+fields.filter(f=>String(x?.[f]||"").trim()).length,0);
   return filled/(h.length*fields.length)*100;
 },
 score(candidate){
   const d=candidate.data,h=d.holdings||[];
   let s=h.length*10+this.coverage(d)*2;
   if(this.value(d)>0)s+=150;
   if(Array.isArray(d.accounts)&&d.accounts.length)s+=d.accounts.length*4;
   if(Array.isArray(d.journal)&&d.journal.length)s+=Math.min(50,d.journal.length);
   if(candidate.source==="IndexedDB")s+=30;
   return Math.round(s);
 },
 rank(candidates){
   return candidates.map(c=>({...c,score:this.score(c),holdings:c.data.holdings.length,value:this.value(c.data),coverage:this.coverage(c.data)})).sort((a,b)=>b.score-a.score);
 }
};
