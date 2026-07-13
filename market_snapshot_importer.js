
window.MKMarketSnapshotImporter83={
 parse(text){
   const lines=String(text||"").trim().split(/\r?\n/).filter(Boolean);
   if(lines.length<2)throw new Error("CSV måste innehålla rubrik och minst en rad.");
   const headers=lines[0].split(",").map(x=>x.trim());
   ["id","value","timestamp","source"].forEach(k=>{if(!headers.includes(k))throw new Error("Kolumn saknas: "+k);});
   return lines.slice(1).map((line,i)=>{
     const cols=line.split(",").map(x=>x.trim()),o={};
     headers.forEach((h,j)=>o[h]=cols[j]??"");
     const value=Number(o.value),changePct=Number(o.changePct);
     if(!o.id)throw new Error(`Rad ${i+2}: id saknas.`);
     if(!Number.isFinite(value))throw new Error(`Rad ${i+2}: ogiltigt värde.`);
     if(!o.timestamp||!o.source)throw new Error(`Rad ${i+2}: källa/tidsstämpel saknas.`);
     return {...o,id:o.id.toLowerCase(),value,changePct:Number.isFinite(changePct)?changePct:null};
   });
 },
 apply(rows){
   const p=window.DATA?.marketConnect83;if(!p)throw new Error("Market Connect saknas.");
   const unknown=[];
   rows.forEach(q=>{
     const obj=p.marketObjects.find(x=>x.id===q.id);
     if(!obj){unknown.push(q.id);return;}
     obj.value=q.value;obj.changePct=q.changePct;obj.timestamp=q.timestamp;obj.sourceId="manual-import";obj.sourceLabel=q.source;obj.status="VERIFIED_SNAPSHOT";
   });
   localStorage.setItem("mk_market_connect_83_snapshot",JSON.stringify({rows,importedAt:new Date().toISOString()}));
   return {imported:rows.length-unknown.length,unknown};
 }
};
