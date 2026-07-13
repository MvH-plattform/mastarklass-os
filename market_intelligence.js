
function mi73Money(v){const x=Number(v);return Number.isFinite(x)?Math.round(x).toLocaleString("sv-SE")+" kr":"—"}
function mi73Pct(v,d=1){const x=Number(v);return Number.isFinite(x)?x.toFixed(d).replace(".",",")+"%":"—"}
function mi73SetTab(tab){
 document.querySelectorAll("[data-mi73tab]").forEach(b=>b.classList.toggle("active",b.dataset.mi73tab===tab));
 document.querySelectorAll("[id^='mi73-']").forEach(p=>{if(p.classList.contains("mi73Panel"))p.classList.toggle("active",p.id==="mi73-"+tab)});
}
function setupMarketIntelligence73(){
 document.querySelectorAll("[data-mi73tab]").forEach(b=>{if(!b.dataset.bound){b.dataset.bound="1";b.addEventListener("click",()=>mi73SetTab(b.dataset.mi73tab));}});
}
function openMarketIntelligence73(){
 document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
 document.getElementById("marketIntelligence73")?.classList.add("active");
 document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
 renderMarketIntelligence73();window.scrollTo({top:0,behavior:"smooth"});
}
function mi73Rows(items,renderer){
 return items.length?items.map(renderer).join(""):`<div class="mi73Meta">Ingen lokal data tillgänglig.</div>`;
}
function renderMarketIntelligence73(){
 const p=DATA?.marketIntelligence73;if(!p||!document.getElementById("mi73Score"))return;
 const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
 set("mi73Score",p.marketScore+"/100");set("mi73Coverage",p.dataCoveragePct+"%");set("mi73Assets",p.assets.length);set("mi73Alerts",p.alerts.length);
 document.getElementById("mi73PulseItems").innerHTML=p.pulse.map(x=>`<div class="mi73PulseItem"><span class="mi73Dot"></span><span>${x}</span></div>`).join("");
 document.getElementById("mi73Dashboard").innerHTML=mi73Rows(p.assets,x=>`<div class="mi73Row"><div><div class="mi73Name">${x.name}</div><div class="mi73Meta">${x.type} · ${x.region} · ${x.symbol}</div><span class="mi73Badge mi73Manual">${x.status}</span></div><div class="mi73Right">${x.value==null?"—":x.value}<div class="mi73Meta">${x.changePct==null?"Ingen verifierad kurs":mi73Pct(x.changePct)}</div></div></div>`);
 document.getElementById("mi73Macro").innerHTML=mi73Rows(p.macro,x=>`<div class="mi73Row"><div><div class="mi73Name">${x.name}</div><div class="mi73Meta">Källa: ${x.source}</div><span class="mi73Badge mi73Manual">${x.status}</span></div><div class="mi73Right">${x.value==null?"—":x.value+x.unit}</div></div>`);
 document.getElementById("mi73Rotation").innerHTML=mi73Rows(p.sectorRotation,x=>`<div class="mi73Row"><div><div class="mi73Name">${x.sector}</div><div class="mi73Meta">Portföljvikt ${mi73Pct(x.portfolioWeightPct)} · ${x.source}</div><span class="mi73Badge mi73Manual">${x.trend}</span></div><div class="mi73Right">${x.momentumScore==null?"—":x.momentumScore+"/100"}</div></div>`);
 const heat=(title,items)=>`<div class="mi73GroupTitle">${title}</div>${items.map(x=>`<div class="mi73HeatItem"><div class="mi73HeatHead"><span>${x.label}</span><b>${mi73Pct(x.pct)}</b></div><div class="mi73Bar"><span style="width:${Math.min(100,x.pct)}%"></span></div><div class="mi73Meta">${mi73Money(x.valueSEK)}</div></div>`).join("")}`;
 document.getElementById("mi73Heatmap").innerHTML=heat("Sektor",p.heatmaps.sector)+heat("Land",p.heatmaps.country)+heat("Valuta",p.heatmaps.currency);
 document.getElementById("mi73Calendar").innerHTML=`<div class="mi73GroupTitle">Lokala genomgångar</div>${mi73Rows(p.reports,x=>`<div class="mi73Row"><div><div class="mi73Name">${x.name}</div><div class="mi73Meta">${x.type} · ${x.note}</div><span class="mi73Badge mi73Manual">${x.status}</span></div><div class="mi73Right">${x.date}</div></div>`)}<div class="mi73GroupTitle">Utdelningsunderlag</div>${mi73Rows(p.dividends,x=>`<div class="mi73Row"><div><div class="mi73Name">${x.name}</div><div class="mi73Meta">Datum ej verifierat · risk ${x.risk}</div></div><div class="mi73Right">${mi73Money(x.annualSEK)}/år</div></div>`)}`;
 document.getElementById("mi73AlertList").innerHTML=mi73Rows(p.alerts,x=>`<div class="mi73Row"><div><div class="mi73Name">${x.title}</div><div class="mi73Meta">${x.text}</div><span class="mi73Badge ${x.severity==="high"?"mi73Risk":x.severity==="medium"?"mi73Warn":"mi73Manual"}">${x.severity.toUpperCase()}</span></div></div>`);
 document.getElementById("mi73Sources").innerHTML=mi73Rows(p.sourceRegistry,x=>`<div class="mi73Row"><div><div class="mi73Name">${x.category}</div><div class="mi73Meta">${x.candidate} · ${x.legalStatus}</div><span class="mi73Badge mi73Manual">${x.technicalStatus}</span></div><div class="mi73Right">${x.cost}</div></div>`);
 document.getElementById("mi73System").innerHTML=Object.entries(p.status).map(([k,v])=>`<div class="mi73SystemRow"><span>${k}</span><b>${v}</b></div>`).join("");
 mi73SetTab("dashboard");
}
