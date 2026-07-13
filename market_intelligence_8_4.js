
function mi84Pct(v,d=0){const x=Number(v);return Number.isFinite(x)?x.toFixed(d).replace(".",",")+"%":"—"}
function mi84Money(v){const x=Number(v);return Number.isFinite(x)?Math.round(x).toLocaleString("sv-SE")+" kr":"—"}
function mi84SetTab(tab){
 document.querySelectorAll("[data-mi84tab]").forEach(b=>b.classList.toggle("active",b.dataset.mi84tab===tab));
 document.querySelectorAll("[id^='mi84-']").forEach(p=>{if(p.classList.contains("mi84Panel"))p.classList.toggle("active",p.id==="mi84-"+tab)});
}
function setupMarketIntelligence84(){
 document.querySelectorAll("[data-mi84tab]").forEach(b=>{if(!b.dataset.bound){b.dataset.bound="1";b.addEventListener("click",()=>mi84SetTab(b.dataset.mi84tab));}});
}
function openMarketIntelligence84(tab="brief"){
 document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
 document.getElementById("marketIntelligence84")?.classList.add("active");
 document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
 renderMarketIntelligence84();mi84SetTab(tab);window.scrollTo({top:0,behavior:"smooth"});
}
function mi84SignalHTML(x){
 const cls=x.classification==="FAKTA"?"fact":x.classification==="LOKAL DATA"?"fact":x.classification==="LOKAL MODELL"?"model":"infer";
 return `<div class="mi84Signal"><div class="mi84SignalTop"><span>${x.priority}. ${x.type}</span><b>${x.impact}</b></div><div class="mi84Name">${x.title}</div><div class="mi84Meta">${x.summary}</div><span class="mi84Badge ${cls}">${x.classification}</span><div class="mi84Effect">${x.portfolioEffect}</div><ul>${(x.evidence||[]).map(e=>`<li>${e}</li>`).join("")}</ul></div>`;
}
function renderMarketIntelligence84(){
 const p=DATA?.marketIntelligence84;if(!p||!document.getElementById("mi84Score"))return;
 const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
 set("mi84Score",p.marketIntelligenceScore+"/100");
 set("mi84Verdict",p.verdict+" – "+p.verdictText);
 set("mi84Verified",p.verifiedMarketObjects+"/"+p.marketObjectCount);
 set("mi84Mapping",mi84Pct(p.tickerMappingPct));
 set("mi84Calendar",p.calendarCoverageCount);
 set("mi84Signals",p.signals.length);
 const prev=document.getElementById("mi84SignalPreview");
 if(prev)prev.innerHTML=p.signals.slice(0,3).map(mi84SignalHTML).join("");
 const comp=document.getElementById("mi84Components");
 if(comp)comp.innerHTML=Object.entries(p.componentScores).map(([k,v])=>`<div class="mi84Metric"><span>${k}</span><b>${Math.round(v)}/100</b><div><i style="width:${Math.max(0,Math.min(100,v))}%"></i></div></div>`).join("");
 const full=document.getElementById("mi84SignalsFull");
 if(full)full.innerHTML=p.signals.map(mi84SignalHTML).join("");
 const attr=document.getElementById("mi84Attribution");
 if(attr){
   const a=p.attribution;
   attr.innerHTML=`<div class="mi84Row"><div><div class="mi84Name">Portföljens dagsförändring</div><div class="mi84Meta">Kräver verifierade aktuella kurser och föregående stängningskurser.</div></div><b>${Number.isFinite(Number(a.portfolioDayChangePct))?mi84Pct(a.portfolioDayChangePct,2):"VÄNTAR"}</b></div><div class="mi84Row"><div><div class="mi84Name">Förklarad andel</div><div class="mi84Meta">Andel av portföljrörelsen som kan kopplas till verifierade innehav och marknadsfaktorer.</div></div><b>${mi84Pct(a.explainedPct)}</b></div><div class="mi84Row"><div><div class="mi84Name">Status</div></div><b>${a.status}</b></div>`;
 }
 const cal=document.getElementById("mi84CalendarIntelligence");
 if(cal){
   const items=window.MKCalendarIntelligence84.dated();
   cal.innerHTML=items.length?items.map(x=>`<div class="mi84Row"><div><div class="mi84Name">${x.holding}</div><div class="mi84Meta">${x.type} · ${x.source}</div></div><b>${x.date}</b></div>`).join(""):`<div class="mi84Meta">Inga verifierade kalenderdatum finns ännu.</div>`;
 }
 const policy=document.getElementById("mi84Policy");
 if(policy)policy.innerHTML=`<div class="mi84Row"><div><div class="mi84Name">FAKTA</div><div class="mi84Meta">${p.analysisPolicy.fact}</div></div></div><div class="mi84Row"><div><div class="mi84Name">LOKAL MODELL</div><div class="mi84Meta">${p.analysisPolicy.localModel}</div></div></div><div class="mi84Row"><div><div class="mi84Name">HÄRLEDNING</div><div class="mi84Meta">${p.analysisPolicy.inference}</div></div></div><div class="mi84Name space">Förbjudet</div>${p.analysisPolicy.forbidden.map(x=>`<div class="mi84Row"><div class="mi84Meta">${x}</div></div>`).join("")}`;
 const sys=document.getElementById("mi84System");
 if(sys)sys.innerHTML=Object.entries(p.status).map(([k,v])=>`<div class="mi84Row"><div class="mi84Name">${k}</div><b>${v}</b></div>`).join("");
}
