
window.MKPortfolioExposure88={
 num(v){const n=Number(v);return Number.isFinite(n)?n:0;},
 value(h){
   return this.num(h?.marketValueSEK||h?.marketValue||h?.valueSEK||h?.currentValue||h?.costValueSEK||0);
 },
 total(holdings){return (holdings||[]).reduce((s,h)=>s+this.value(h),0);},
 group(holdings,field,fallback="Okänt"){
   const total=this.total(holdings);
   const map={};
   (holdings||[]).forEach(h=>{
     const key=String(h?.[field]||fallback).trim()||fallback;
     map[key]=(map[key]||0)+this.value(h);
   });
   return Object.entries(map).map(([name,value])=>({name,value,weight:total?value/total*100:0})).sort((a,b)=>b.value-a.value);
 },
 account(h){return h?.platform||h?.accountId||h?.account||"Okänt konto";},
 asset(h){return h?.type||h?.instrumentType||"Okänd tillgång";},
 accounts(holdings){
   const total=this.total(holdings),map={};
   (holdings||[]).forEach(h=>{const k=this.account(h);map[k]=(map[k]||0)+this.value(h);});
   return Object.entries(map).map(([name,value])=>({name,value,weight:total?value/total*100:0})).sort((a,b)=>b.value-a.value);
 },
 assets(holdings){
   const total=this.total(holdings),map={};
   (holdings||[]).forEach(h=>{const k=this.asset(h);map[k]=(map[k]||0)+this.value(h);});
   return Object.entries(map).map(([name,value])=>({name,value,weight:total?value/total*100:0})).sort((a,b)=>b.value-a.value);
 }
};
