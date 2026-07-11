
function pb71Money(v){const n=Number(v);return Number.isFinite(n)?Math.round(n).toLocaleString("sv-SE")+" kr":"—"}
function pb71Pct(v,d=1){const n=Number(v);return Number.isFinite(n)?n.toFixed(d).replace(".",",")+"%":"—"}
function pb71SetTab(tab){
 document.querySelectorAll("[data-pb71tab]").forEach(b=>b.classList.toggle("active",b.dataset.pb71tab===tab));
 document.querySelectorAll("[id^='pb71-']").forEach(p=>{if(p.classList.contains("pb71Panel"))p.classList.toggle("active",p.id==="pb71-"+tab)});
}
function setupPortfolioBrain71(){
 document.querySelectorAll("[data-pb71tab]").forEach(b=>{if(!b.dataset.bound){b.dataset.bound="1";b.addEventListener("click",()=>pb71SetTab(b.dataset.pb71tab));}});
}
function openPortfolioBrain71(){
 document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
 document.getElementById("portfolioBrain71")?.classList.add("active");
 document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
 renderPortfolioBrain71();window.scrollTo({top:0,behavior:"smooth"});
}
function renderPortfolioBrain71(){
 const p=DATA?.portfolioBrain71;if(!p||!document.getElementById("pb71IQ"))return;
 const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
 set("pb71IQ",p.portfolioIQ+"/100");set("pb71Problems",p.problems.length);set("pb71Overlaps",p.overlaps.length);set("pb71Coverage",p.components.dataCoverage+"%");
 document.getElementById("pb71SummaryItems").innerHTML=p.summary.map(x=>`<div class="pb71SummaryItem"><span class="pb71Dot"></span><span>${x}</span></div>`).join("");
 const labels={intelligence:"Intelligence",wealth:"Wealth",quality:"Kvalitet",risk:"Riskkontroll",portfolioFit:"Portföljpassform",dataCoverage:"Datatäckning",sectorDiversification:"Sektorspridning",countryDiversification:"Geografi",currencyDiversification:"Valuta",concentrationControl:"Koncentrationskontroll",overlapControl:"Överlappskontroll"};
 document.getElementById("pb71Components").innerHTML=Object.entries(p.components).map(([k,v])=>`<div class="pb71Score"><span>${labels[k]||k}</span><b>${v}/100</b><div class="pb71Bar"><span style="width:${v}%"></span></div></div>`).join("");
 document.getElementById("pb71ProblemList").innerHTML=p.problems.length?p.problems.map(x=>`<div class="pb71Row"><div><div class="pb71Name">${x.title}</div><div class="pb71Muted">${x.text}</div><span class="pb71Badge ${x.severity==="high"?"pb71High":x.severity==="medium"?"pb71Medium":"pb71Low"}">${x.severity==="high"?"HÖG":x.severity==="medium"?"BEVAKA":"INFO"}</span></div></div>`).join(""):`<div class="pb71Muted">Inga strukturella problem hittades.</div>`;
 document.getElementById("pb71Allocation").innerHTML=p.allocation10000.map((x,i)=>`<div class="pb71Alloc"><div class="pb71AllocTop"><div><div class="pb71Name">${i+1}. ${x.name}</div><div class="pb71Muted">${x.account||""} · ${x.reason||""}</div></div><b>${pb71Money(x.amountSEK)}</b></div><div class="pb71Muted">Förbättringspoäng ${x.score} · vikt ${pb71Pct(x.weightPct,2)} · målvikt ${pb71Pct(x.targetWeightPct,1)}</div></div>`).join("")||`<div class="pb71Muted">Ingen kapitalallokering kunde beräknas.</div>`;
 document.getElementById("pb71OverlapList").innerHTML=p.overlaps.length?p.overlaps.map(x=>`<div class="pb71Row"><div><div class="pb71Name">${x.a} ↔ ${x.b}</div><div class="pb71Muted">${x.reason}</div><span class="pb71Badge pb71Low">HEURISTIK</span></div><div class="pb71Right">${x.score}/100</div></div>`).join(""):`<div class="pb71Muted">Inga tydliga överlapp hittades.</div>`;
 document.getElementById("pb71DNA").innerHTML=p.portfolioDNA.map(x=>`<div class="pb71DnaItem"><div class="pb71DnaHead"><span>${x.label}</span><b>${pb71Pct(x.pct)}</b></div><div class="pb71Bar"><span style="width:${Math.min(100,x.pct)}%"></span></div><div class="pb71Muted">${pb71Money(x.valueSEK)}</div></div>`).join("");
 document.getElementById("pb71Radar").innerHTML=p.radar.map(x=>`<div class="pb71Row"><div><div class="pb71Name">${x.label}</div><div class="pb71Muted">${x.name} · ${x.signal}</div></div><div class="pb71Right">${x.score}/100</div></div>`).join("");
 document.getElementById("pb71System").innerHTML=Object.entries(p.status).map(([k,v])=>`<div class="pb71SystemRow"><span>${k}</span><b>${v}</b></div>`).join("");
 pb71SetTab("overview");
}
