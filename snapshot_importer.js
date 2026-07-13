
window.MKSnapshotImporter82={
 parse(text){
   const lines=String(text||"").trim().split(/\r?\n/).filter(Boolean);
   if(lines.length<2)throw new Error("CSV måste innehålla rubrik och minst en datarad.");
   const headers=lines[0].split(",").map(x=>x.trim());
   const required=["ticker","price","currency","timestamp","source"];
   required.forEach(k=>{if(!headers.includes(k))throw new Error("Kolumn saknas: "+k);});
   return lines.slice(1).map((line,i)=>{
     const cols=line.split(",").map(x=>x.trim()),o={};
     headers.forEach((h,j)=>o[h]=cols[j]??"");
     const price=Number(o.price),prev=Number(o.previousClose);
     if(!o.ticker)throw new Error(`Rad ${i+2}: ticker saknas.`);
     if(!Number.isFinite(price)||price<=0)throw new Error(`Rad ${i+2}: ogiltig kurs.`);
     if(!/^[A-Z]{3}$/.test(String(o.currency).toUpperCase()))throw new Error(`Rad ${i+2}: ogiltig valuta.`);
     if(!o.timestamp||!o.source)throw new Error(`Rad ${i+2}: källa/tidsstämpel saknas.`);
     return {...o,ticker:o.ticker.toUpperCase(),currency:o.currency.toUpperCase(),price,previousClose:Number.isFinite(prev)&&prev>0?prev:null};
   });
 },
 apply(rows){
   const p=window.DATA?.livePortfolio82;if(!p)throw new Error("Live Portfolio saknas.");
   const unknown=[];
   rows.forEach(q=>{
     const matches=p.records.filter(r=>String(r.ticker||"").toUpperCase()===q.ticker);
     if(!matches.length){unknown.push(q.ticker);return;}
     matches.forEach(r=>{
       r.lastVerifiedPrice=q.price;r.currency=q.currency;r.previousClose=q.previousClose;
       r.sourceLabel=q.source;r.sourceId="manual-import";r.timestamp=q.timestamp;r.status="VERIFIED_SNAPSHOT";
       if(q.previousClose){
         r.dayChangePct=(q.price/q.previousClose-1)*100;
         const qty=Number(r.quantity);
         if(Number.isFinite(qty)&&qty>0)r.dayChangeSEK=(q.price-q.previousClose)*qty*(window.MKPortfolioValuation82.fx(q.currency)||1);
       }
     });
   });
   window.MKPortfolioValuation82.recalc();
   localStorage.setItem("mk_live_portfolio_82_snapshot",JSON.stringify({rows,importedAt:new Date().toISOString()}));
   return {imported:rows.length-unknown.length,unknown};
 }
};
