
function lp82Money(v){const x=Number(v);return Number.isFinite(x)?Math.round(x).toLocaleString("sv-SE")+" kr":"—"}
function lp82Pct(v,d=1){const x=Number(v);return Number.isFinite(x)?x.toFixed(d).replace(".",",")+"%":"—"}
function lp82SetTab(tab){
 document.querySelectorAll("[data-lp82tab]").forEach(b=>b.classList.toggle("active",b.dataset.lp82tab===tab));
 document.querySelectorAll("[id^='lp82-']").forEach(p=>{if(p.classList.contains("lp82Panel"))p.classList.toggle("active",p.id==="lp82-"+tab)});
}
function setupLivePortfolio82(){
 document.querySelectorAll("[data-lp82tab]").forEach(b=>{if(!b.dataset.bound){b.dataset.bound="1";b.addEventListener("click",()=>lp82SetTab(b.dataset.lp82tab));}});
}
function openLivePortfolio82(tab="holdings"){
 document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
 document.getElementById("livePortfolio82")?.classList.add("active");
 document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
 renderLivePortfolio82();lp82SetTab(tab);window.scrollTo({top:0,behavior:"smooth"});
}
function lp82Row(title,meta,right,badge,cls="info"){
 return `<div class="lp82Row"><div><div class="lp82Name">${title}</div><div class="lp82Meta">${meta||""}</div>${badge?`<span class="lp82Badge ${cls}">${badge}</span>`:""}</div><div class="lp82Right">${right||""}</div></div>`;
}
function renderLivePortfolio82(){
 const p=DATA?.livePortfolio82;if(!p||!document.getElementById("lp82PortfolioValue"))return;
 window.MKPortfolioValuation82?.recalc();
 const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
 set("lp82PortfolioValue",lp82Money(p.portfolioValueSEK));set("lp82Score",p.engineScore+"/100");
 set("lp82ValueCoverage",p.valueCoveragePct+"%");set("lp82Mapping",p.mappingPct+"%");set("lp82Sources",p.activeQuoteSources);
 set("lp82ChangeText",Number.isFinite(Number(p.portfolioDayChangePct))?`${lp82Pct(p.portfolioDayChangePct)} idag`:"Dagsförändring väntar på verifierad kurskälla.");
 const summary=document.getElementById("lp82Summary");
 if(summary)summary.innerHTML=lp82Row("Portföljvärde","Senaste lokalt verifierade snapshot",lp82Money(p.portfolioValueSEK),"VERIFIERAT","pass")+lp82Row("Kända innehavsvärden",`${p.knownValueCount}/${p.holdingCount} poster`,p.valueCoveragePct+"%")+lp82Row("Tickerklara",`${p.tickerMappedCount}/${p.holdingCount} poster`,p.mappingPct+"%");
 const preview=document.getElementById("lp82HoldingPreview");
 if(preview)preview.innerHTML=p.records.slice().sort((a,b)=>(b.calculatedMarketValueSEK||b.lastVerifiedMarketValueSEK||0)-(a.calculatedMarketValueSEK||a.lastVerifiedMarketValueSEK||0)).slice(0,8).map(r=>lp82Row(r.name,`${r.platform} · ${r.ticker||"ticker saknas"} · ${r.sourceLabel}<br>${r.timestamp||"tidsstämpel saknas"}`,lp82Money(r.calculatedMarketValueSEK||r.lastVerifiedMarketValueSEK),r.status,r.status==="VERIFIED_SNAPSHOT"?"pass":"info")).join("");
 const hs=document.getElementById("lp82Holdings");
 if(hs)hs.innerHTML=p.records.map(r=>lp82Row(r.name,`${r.platform} · ${r.type} · ${r.ticker||"ticker saknas"} · ${r.currency}<br>${r.sourceLabel} · ${r.timestamp||"—"}${Number.isFinite(Number(r.dayChangePct))?`<br>Idag ${lp82Pct(r.dayChangePct)}`:""}`,lp82Money(r.calculatedMarketValueSEK||r.lastVerifiedMarketValueSEK),r.status,r.status==="VERIFIED_SNAPSHOT"?"pass":r.status==="MISSING"?"wait":"info")).join("");
 const map=document.getElementById("lp82MappingList");
 if(map)map.innerHTML=p.records.map(r=>lp82Row(r.name,`${r.platform} · ${r.type}`,`${r.ticker||"—"} / ${r.currency}`,r.mappingStatus,r.mappingStatus==="READY"?"pass":"wait")).join("");
 const ready=document.getElementById("lp82Readiness");
 if(ready)ready.innerHTML=p.readiness.map(x=>lp82Row(x.name,x.detail,"",x.status,x.status==="PASS"?"pass":"wait")).join("");
 const sys=document.getElementById("lp82System");
 if(sys)sys.innerHTML=Object.entries(p.status).map(([k,v])=>lp82Row(k,"",v)).join("");
}
function importLivePortfolio82(){
 const result=document.getElementById("lp82ImportResult");
 try{
   const rows=window.MKSnapshotImporter82.parse(document.getElementById("lp82ImportText").value);
   const outcome=window.MKSnapshotImporter82.apply(rows);
   if(result)result.innerHTML=`<b>Import klar.</b> ${outcome.imported} tickers uppdaterades.${outcome.unknown.length?` Okända: ${outcome.unknown.join(", ")}`:""}`;
   renderLivePortfolio82();
 }catch(e){if(result)result.textContent="Importfel: "+e.message;}
}
function downloadLivePortfolioTemplate82(){
 const text="ticker,price,currency,previousClose,timestamp,source\nINVESTOR-B,0,SEK,0,2026-07-12T17:00:00+02:00,Verifierad källa";
 const blob=new Blob([text],{type:"text/csv;charset=utf-8"});
 const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="mastarklass_live_snapshot_template.csv";a.click();URL.revokeObjectURL(a.href);
}
