
function mc83Num(v){const x=Number(v);return Number.isFinite(x)?x.toLocaleString("sv-SE",{maximumFractionDigits:2}):"—"}
function mc83Pct(v,d=1){const x=Number(v);return Number.isFinite(x)?x.toFixed(d).replace(".",",")+"%":"—"}
function mc83SetTab(tab){
 document.querySelectorAll("[data-mc83tab]").forEach(b=>b.classList.toggle("active",b.dataset.mc83tab===tab));
 document.querySelectorAll("[id^='mc83-']").forEach(p=>{if(p.classList.contains("mc83Panel"))p.classList.toggle("active",p.id==="mc83-"+tab)});
}
function setupMarketConnect83(){
 document.querySelectorAll("[data-mc83tab]").forEach(b=>{if(!b.dataset.bound){b.dataset.bound="1";b.addEventListener("click",()=>mc83SetTab(b.dataset.mc83tab));}});
}
function openMarketConnect83(tab="market"){
 document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
 document.getElementById("marketConnect83")?.classList.add("active");
 document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
 renderMarketConnect83();mc83SetTab(tab);window.scrollTo({top:0,behavior:"smooth"});
}
function mc83Row(title,meta,right,badge,cls="info"){
 return `<div class="mc83Row"><div><div class="mc83Name">${title}</div><div class="mc83Meta">${meta||""}</div>${badge?`<span class="mc83Badge ${cls}">${badge}</span>`:""}</div><div class="mc83Right">${right||""}</div></div>`;
}
function renderMarketConnect83(){
 const p=DATA?.marketConnect83;if(!p||!document.getElementById("mc83Score"))return;
 const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
 set("mc83Score",p.marketConnectScore+"/100");set("mc83Objects",p.marketObjectCount);set("mc83Prepared",p.preparedOfficialSources);set("mc83Active",p.activeMarketSources);
 const preview=document.getElementById("mc83MarketPreview");
 if(preview)preview.innerHTML=p.marketObjects.slice(0,6).map(x=>mc83Row(x.name,`${x.category} · ${x.region}<br>${x.sourceLabel||"Källa ej aktiverad"} · ${x.timestamp||"ingen tidsstämpel"}`,x.value!=null?mc83Num(x.value):"—",x.status,x.status==="VERIFIED_SNAPSHOT"?"pass":"wait")).join("");
 const sp=document.getElementById("mc83SourcePreview");
 if(sp)sp.innerHTML=p.sourceConnectors.filter(x=>x.official).slice(0,4).map(x=>mc83Row(x.name,`${x.scope.join(", ")}<br>${x.legal}`,x.cost,x.status,x.status==="PREPARED"?"info":"wait")).join("");
 const list=document.getElementById("mc83MarketList");
 if(list)list.innerHTML=p.marketObjects.map(x=>mc83Row(x.name,`${x.category} · ${x.region} · ${x.currency}<br>${x.sourceLabel||"Källa ej ansluten"} · ${x.timestamp||"—"}${Number.isFinite(Number(x.changePct))?`<br>Förändring ${mc83Pct(x.changePct)}`:""}`,x.value!=null?mc83Num(x.value):"—",x.status,x.status==="VERIFIED_SNAPSHOT"?"pass":"wait")).join("");
 const sources=document.getElementById("mc83SourceList");
 if(sources)sources.innerHTML=p.sourceConnectors.map(x=>mc83Row(x.name,`${x.scope.join(", ")}<br>${x.legal}<br>${x.technical}`,x.cost,x.status,x.enabled?"pass":x.status==="PREPARED"?"info":"wait")).join("");
 const cal=document.getElementById("mc83Calendar");
 if(cal){
   const items=window.MKMarketCalendar83.upcoming();
   cal.innerHTML=items.length?items.map(x=>mc83Row(x.holding,`${x.type} · ${x.source}`,x.date,x.status,x.date?"info":"wait")).join(""):mc83Row("Inga verifierade datum","Rapport- och utdelningsdatum väntar på officiella källor.","","VÄNTAR","wait");
 }
 const news=document.getElementById("mc83NewsPolicy");
 if(news)news.innerHTML=`<div class="mc83Title">Tillåtet</div>${p.newsPolicy.allowed.map(x=>mc83Row(x,"","","TILLÅTET","pass")).join("")}<div class="mc83Title space">Förbjudet</div>${p.newsPolicy.forbidden.map(x=>mc83Row(x,"","","FÖRBJUDET","block")).join("")}`;
 const ready=document.getElementById("mc83Readiness");
 if(ready)ready.innerHTML=p.readiness.map(x=>mc83Row(x.name,x.detail,"",x.status,x.status==="PASS"?"pass":"wait")).join("");
 const sys=document.getElementById("mc83System");
 if(sys)sys.innerHTML=Object.entries(p.status).map(([k,v])=>mc83Row(k,"",v)).join("");
}
function importMarketSnapshot83(){
 const result=document.getElementById("mc83ImportResult");
 try{
   const rows=window.MKMarketSnapshotImporter83.parse(document.getElementById("mc83ImportText").value);
   const outcome=window.MKMarketSnapshotImporter83.apply(rows);
   if(result)result.innerHTML=`<b>Import klar.</b> ${outcome.imported} objekt uppdaterades.${outcome.unknown.length?` Okända: ${outcome.unknown.join(", ")}`:""}`;
   renderMarketConnect83();
 }catch(e){if(result)result.textContent="Importfel: "+e.message;}
}
function downloadMarketTemplate83(){
 const text="id,value,changePct,timestamp,source\nusdsek,0,0,2026-07-12T17:00:00+02:00,Verifierad källa";
 const blob=new Blob([text],{type:"text/csv;charset=utf-8"});
 const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="mastarklass_market_snapshot_template.csv";a.click();URL.revokeObjectURL(a.href);
}
