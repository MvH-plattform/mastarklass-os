
let DT61_FILTER="all";
function dt61Money(v){const n=Number(v);return Number.isFinite(n)?Math.round(n).toLocaleString("sv-SE")+" kr":"—"}
function dt61Pct(v,d=1){const n=Number(v);return Number.isFinite(n)?n.toFixed(d).replace(".",",")+"%":"—"}
function dt61Holdings(){return (DATA?.holdings||[]).filter(h=>String(h.status||"").startsWith("verified"))}
function dt61Account(h){return (DATA.accounts||[]).find(a=>a.id===h.accountId)?.name||h.platform||"Ej konto"}
function dt61Completeness(h){
 const t=h.digitalTwin61||{};
 const fields=[t.investmentThesis,t.buyReason,t.timeHorizon,t.role,t.targetWeightPct,t.maxWeightPct,t.riskLevel,t.lastReviewDate,t.nextReviewDate];
 return Math.round(fields.filter(v=>v!==""&&v!==null&&v!==undefined).length/fields.length*100);
}
function dt61NeedsReview(h){
 const d=h.digitalTwin61?.nextReviewDate;if(!d)return true;
 return new Date(d+"T00:00:00")<=new Date();
}
function dt61Classify(h){
 const t=h.digitalTwin61||{},role=String(t.role||"").toLowerCase(),dna=t.dna||{};
 if(role.includes("kärn"))return"core";
 if(role.includes("utdel"))return"dividend";
 if(role.includes("tillväxt"))return"growth";
 if(dt61NeedsReview(h))return"review";
 if(Number(dna.dataQuality||0)<70)return"data";
 return"other";
}
function setupDigitalTwin61(){
 document.querySelectorAll("[data-dt61filter]").forEach(b=>{if(!b.dataset.bound){b.dataset.bound="1";b.addEventListener("click",()=>{DT61_FILTER=b.dataset.dt61filter;document.querySelectorAll("[data-dt61filter]").forEach(x=>x.classList.toggle("active",x===b));renderDigitalTwin61();});}});
 const s=document.getElementById("dt61Search"),o=document.getElementById("dt61Sort");
 if(s&&!s.dataset.bound){s.dataset.bound="1";s.addEventListener("input",renderDigitalTwin61)}
 if(o&&!o.dataset.bound){o.dataset.bound="1";o.addEventListener("change",renderDigitalTwin61)}
}
function openDigitalTwinScreen61(){
 document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
 document.getElementById("digitalTwin61")?.classList.add("active");
 document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
 renderDigitalTwin61();
 window.scrollTo({top:0,behavior:"smooth"});
}
function renderDigitalTwin61(){
 const list=document.getElementById("dt61List");if(!list||!DATA)return;
 let hs=dt61Holdings();
 const q=(document.getElementById("dt61Search")?.value||"").toLowerCase();
 const sort=document.getElementById("dt61Sort")?.value||"weight";
 if(q)hs=hs.filter(h=>JSON.stringify([h.name,h.ticker,dt61Account(h),h.sector,h.country,h.digitalTwin61?.role]).toLowerCase().includes(q));
 if(DT61_FILTER!=="all")hs=hs.filter(h=>{
   if(DT61_FILTER==="review")return dt61NeedsReview(h);
   if(DT61_FILTER==="data")return Number(h.digitalTwin61?.dna?.dataQuality||0)<70;
   return dt61Classify(h)===DT61_FILTER;
 });
 const sorter={
  weight:(a,b)=>Number(b.digitalTwin61?.goalContributionPct||0)-Number(a.digitalTwin61?.goalContributionPct||0),
  rating:(a,b)=>Number(b.digitalTwin61?.dna?.masterclassRating||0)-Number(a.digitalTwin61?.dna?.masterclassRating||0),
  review:(a,b)=>String(a.digitalTwin61?.nextReviewDate||"9999").localeCompare(String(b.digitalTwin61?.nextReviewDate||"9999")),
  name:(a,b)=>String(a.name).localeCompare(String(b.name),"sv")
 }[sort];
 hs.sort(sorter);
 const all=dt61Holdings();
 const complete=all.filter(h=>dt61Completeness(h)>=80).length;
 const reviews=all.filter(dt61NeedsReview).length;
 const journals=all.reduce((s,h)=>s+(h.digitalTwin61?.journal||[]).length,0);
 const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
 set("dt61ProfileCount",all.length);set("dt61CompleteCount",complete);set("dt61ReviewCount",reviews);set("dt61JournalCount",journals);
 list.innerHTML=hs.map(h=>{
  const t=h.digitalTwin61||{},dna=t.dna||{},p=h.portfolioIntelligence42||{},comp=dt61Completeness(h),needs=dt61NeedsReview(h);
  return `<button class="dt61Card" style="width:100%;color:inherit;text-align:left" onclick="openDigitalTwin61('${String(h.id).replace(/'/g,"\\'")}')">
   <div class="dt61Top"><div><div class="dt61Name">${h.name}</div><div class="dt61Muted">${dt61Account(h)} · ${h.type||"Ej typ"} · ${h.ticker||"Ticker saknas"}</div></div><div class="dt61Score">${dna.masterclassRating||0}<div class="dt61Muted">rating</div></div></div>
   <div class="dt61Badges"><span class="dt61Badge dt61Purple">${t.role||"Roll ej satt"}</span><span class="dt61Badge ${t.riskLevel==="Låg"?"dt61Good":t.riskLevel==="Hög"?"dt61Risk":"dt61Warn"}">Risk ${t.riskLevel||"—"}</span><span class="dt61Badge ${needs?"dt61Warn":"dt61Info"}">${needs?"Genomgång behövs":"Planerad"}</span></div>
   <div class="dt61Metrics"><div class="dt61Metric"><span>Vikt</span><b>${dt61Pct(p.weightPct||0,2)}</b></div><div class="dt61Metric"><span>Målvikt</span><b>${dt61Pct(t.targetWeightPct||0,1)}</b></div><div class="dt61Metric"><span>Mot GAV</span><b>${p.resultPct==null?"—":dt61Pct(p.resultPct,1)}</b></div></div>
   <div class="dt61Completeness"><span style="width:${comp}%"></span></div><div class="dt61Muted">Digital Twin komplett ${comp}%</div>
  </button>`;
 }).join("")||'<div class="dt61Card">Inga profiler matchar filtret.</div>';
}
function openDigitalTwin61(id){
 const h=dt61Holdings().find(x=>String(x.id)===String(id));if(!h)return;
 const t=h.digitalTwin61||{},dna=t.dna||{},p=h.portfolioIntelligence42||{};
 document.getElementById("dt61DetailTitle").textContent=h.name;
 document.getElementById("dt61DetailSub").textContent=`${dt61Account(h)} · ${h.type||"Ej typ"} · ${h.ticker||"Ticker saknas"}`;
 const dims=[["Kvalitet",dna.quality],["Tillväxt",dna.growth],["Utdelning",dna.dividend],["Riskresiliens",dna.riskResilience],["Värderingsproxy",dna.valuationProxy],["Diversifiering",dna.diversification],["Portföljpassform",dna.portfolioFit],["Datakvalitet",dna.dataQuality]];
 const timeline=[...(t.timeline||[]),...(t.journal||[]).map(j=>({date:j.date,type:"Journal",text:j.text}))].sort((a,b)=>String(b.date).localeCompare(String(a.date)));
 document.getElementById("dt61DetailBody").innerHTML=`
  <div class="dt61Section"><div class="dt61SectionTitle">Digital Twin-sammanfattning</div><div class="dt61Muted" style="margin-top:9px">${t.aiSummary||"Sammanfattning saknas."}</div><div class="dt61Badges"><span class="dt61Badge dt61Purple">${t.role||"Roll ej satt"}</span><span class="dt61Badge ${t.riskLevel==="Låg"?"dt61Good":t.riskLevel==="Hög"?"dt61Risk":"dt61Warn"}">Risk ${t.riskLevel||"—"}</span><span class="dt61Badge dt61Info">${t.status||"Aktiv"}</span></div></div>
  <div class="dt61Section"><div class="dt61SectionTitle">Position</div>
   <div class="dt61Row"><span>Antal/andelar</span><b>${h.quantity!==""&&h.quantity!=null?h.quantity:"Ej registrerat"}</b></div>
   <div class="dt61Row"><span>GAV</span><b>${h.averageCost!==""&&h.averageCost!=null?h.averageCost+" "+(h.currency||""):"Ej registrerat"}</b></div>
   <div class="dt61Row"><span>Marknadsvärde</span><b>${dt61Money(h.marketValueSEK||h.value)}</b></div>
   <div class="dt61Row"><span>Resultat mot kostnadsbas</span><b>${p.resultPct==null?"—":dt61Pct(p.resultPct,2)}</b></div>
   <div class="dt61Row"><span>Portföljvikt</span><b>${dt61Pct(p.weightPct||0,2)}</b></div>
   <div class="dt61Row"><span>Målvikt / maxvikt</span><b>${dt61Pct(t.targetWeightPct||0)} / ${dt61Pct(t.maxWeightPct||0)}</b></div>
   <div class="dt61Row"><span>Bidrag till 7,5 Mkr</span><b>${dt61Pct(t.goalContributionPct||0,3)}</b></div>
  </div>
  <div class="dt61Section"><div class="dt61SectionTitle">Portfolio DNA</div><div class="dt61Dna">${dims.map(([name,v])=>`<div class="dt61DnaCell"><span>${name}</span><b>${v||0}/100</b><div class="dt61Bar"><span style="width:${v||0}%"></span></div></div>`).join("")}</div></div>
  <div class="dt61Section"><div class="dt61SectionTitle">Investeringsplan</div>
   <div class="dt61Form">
    <label class="dt61Muted">Roll<select id="dt61Role" class="dt61Select"><option>Kärninnehav</option><option>Bas / diversifiering</option><option>Utdelningsmotor</option><option>Tillväxtsatellit</option><option>Satellit / bevakning</option></select></label>
    <label class="dt61Muted">Tidshorisont<select id="dt61Horizon" class="dt61Select"><option>1–3 år</option><option>3–5 år</option><option>5–10 år</option><option>10+ år</option><option>Permanent</option></select></label>
    <label class="dt61Muted">Målvikt %<input id="dt61Target" class="dt61Input" type="number" step="0.1" value="${t.targetWeightPct||0}"></label>
    <label class="dt61Muted">Maxvikt %<input id="dt61Max" class="dt61Input" type="number" step="0.1" value="${t.maxWeightPct||0}"></label>
    <label class="dt61Muted">Risk<select id="dt61Risk" class="dt61Select"><option>Låg</option><option>Medel</option><option>Hög</option></select></label>
    <label class="dt61Muted">Nästa genomgång<input id="dt61NextReview" class="dt61Input" type="date" value="${t.nextReviewDate||""}"></label>
    <label class="dt61Muted full">Investeringsidé<textarea id="dt61Thesis" class="dt61Textarea" rows="4">${t.investmentThesis||""}</textarea></label>
    <label class="dt61Muted full">Varför köpte jag?<textarea id="dt61BuyReason" class="dt61Textarea" rows="4">${t.buyReason||""}</textarea></label>
   </div>
   <button class="dt61Btn" style="width:100%;margin-top:10px" onclick="saveDigitalTwinProfile61('${String(h.id).replace(/'/g,"\\'")}')">Spara investeringsplan</button>
  </div>
  <div class="dt61Section"><div class="dt61SectionTitle">Investment Journal</div>
   <div class="dt61Form"><input id="dt61JournalDate" class="dt61Input" type="date" value="${new Date().toISOString().slice(0,10)}"><select id="dt61JournalType" class="dt61Select"><option>Anteckning</option><option>Köp</option><option>Utdelning</option><option>Rapport</option><option>Beslutsändring</option><option>Genomgång</option></select><textarea id="dt61JournalText" class="dt61Textarea full" rows="4" placeholder="Vad hände och hur tänker du?"></textarea></div>
   <button class="dt61Btn" style="width:100%;margin-top:10px" onclick="addDigitalTwinJournal61('${String(h.id).replace(/'/g,"\\'")}')">Lägg till i journalen</button>
  </div>
  <div class="dt61Section"><div class="dt61SectionTitle">Livslinje</div><div style="margin-top:13px">${timeline.length?timeline.map(x=>`<div class="dt61TimelineItem"><div class="dt61Name">${x.type||"Händelse"}</div><div class="dt61Muted">${x.date||"Datum saknas"} · ${x.text||""}</div></div>`).join(""):'<div class="dt61Muted">Inga händelser ännu.</div>'}</div></div>`;
 document.getElementById("dt61Role").value=t.role||"Satellit / bevakning";
 document.getElementById("dt61Horizon").value=t.timeHorizon||"10+ år";
 document.getElementById("dt61Risk").value=t.riskLevel||"Medel";
 document.getElementById("dt61Detail").classList.add("open");
}
function closeDigitalTwin61(){document.getElementById("dt61Detail")?.classList.remove("open")}
function saveDigitalTwinProfile61(id){
 const h=dt61Holdings().find(x=>String(x.id)===String(id));if(!h)return;const t=h.digitalTwin61;
 t.role=document.getElementById("dt61Role").value;t.timeHorizon=document.getElementById("dt61Horizon").value;t.targetWeightPct=Number(document.getElementById("dt61Target").value||0);t.maxWeightPct=Number(document.getElementById("dt61Max").value||0);t.riskLevel=document.getElementById("dt61Risk").value;t.nextReviewDate=document.getElementById("dt61NextReview").value;t.investmentThesis=document.getElementById("dt61Thesis").value.trim();t.buyReason=document.getElementById("dt61BuyReason").value.trim();t.lastReviewDate=new Date().toISOString().slice(0,10);
 t.timeline=t.timeline||[];t.timeline.unshift({id:"profile-"+Date.now(),date:t.lastReviewDate,type:"Profil uppdaterad",text:"Investeringsplan och Digital Twin-profil uppdaterades."});
 persist();renderAll();openDigitalTwin61(id);
}
function addDigitalTwinJournal61(id){
 const h=dt61Holdings().find(x=>String(x.id)===String(id));if(!h)return;const text=document.getElementById("dt61JournalText").value.trim();if(!text){alert("Skriv en journalanteckning.");return}
 const entry={id:"journal-"+Date.now(),date:document.getElementById("dt61JournalDate").value||new Date().toISOString().slice(0,10),type:document.getElementById("dt61JournalType").value,text};
 h.digitalTwin61.journal=h.digitalTwin61.journal||[];h.digitalTwin61.journal.unshift(entry);persist();renderAll();openDigitalTwin61(id);
}
