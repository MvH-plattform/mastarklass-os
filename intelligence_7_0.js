
function i70Money(v){const n=Number(v);return Number.isFinite(n)?Math.round(n).toLocaleString("sv-SE")+" kr":"—"}
function i70Pct(v,d=1){const n=Number(v);return Number.isFinite(n)?n.toFixed(d).replace(".",",")+"%":"—"}
function i70Badge(category){if(category==="buy"||category==="buy_dip")return"i70Buy";if(category==="risk")return"i70Risk";if(category==="data")return"i70Data";if(category==="hold")return"i70Hold";return"i70Watch"}
function i70SetTab(tab){
 document.querySelectorAll("[data-i70tab]").forEach(b=>b.classList.toggle("active",b.dataset.i70tab===tab));
 document.querySelectorAll("[id^='i70-']").forEach(p=>{if(p.classList.contains("i70Panel"))p.classList.toggle("active",p.id==="i70-"+tab)});
}
function setupIntelligence70(){
 document.querySelectorAll("[data-i70tab]").forEach(b=>{if(!b.dataset.bound){b.dataset.bound="1";b.addEventListener("click",()=>i70SetTab(b.dataset.i70tab));}});
}
function openIntelligence70(){
 document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
 document.getElementById("intelligence70")?.classList.add("active");
 document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
 renderIntelligence70();window.scrollTo({top:0,behavior:"smooth"});
}
function i70Rows(items){
 return items.length?items.map(x=>`<div class="i70Row"><div><div class="i70Name">${x.name}</div><div class="i70Meta">${x.account||""} · ${x.role||""}<br>${x.reason||""}</div><span class="i70Badge ${i70Badge(x.category)}">${x.conclusion}</span></div><div class="i70Right">${x.score}/100${x.weightPct?`<div class="i70Meta">${i70Pct(x.weightPct,2)}</div>`:""}</div></div>`).join(""):`<div class="i70Meta">Inga signaler i denna kategori.</div>`;
}
function renderIntelligence70(){
 const p=DATA?.intelligencePlatform70;if(!p||!document.getElementById("i70Score"))return;
 const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
 set("i70Score",p.intelligenceScore+"/100");set("i70Wealth",p.wealthScore+"/100");
 set("i70OppCount",p.radar.opportunityCount);set("i70RiskCount",p.radar.riskCount);set("i70WatchCount",p.radar.watchCount);set("i70Coverage",p.dataCoveragePct+"%");
 document.getElementById("i70BriefItems").innerHTML=p.brief.map(x=>`<div class="i70BriefItem"><span class="i70Dot"></span><span>${x}</span></div>`).join("");
 document.getElementById("i70PriorityList").innerHTML=i70Rows(p.priorities);
 document.getElementById("i70OpportunityList").innerHTML=i70Rows(p.opportunities);
 document.getElementById("i70RiskList").innerHTML=i70Rows([...p.risks,...p.watch.slice(0,5),...p.dataGaps.slice(0,5)]);
 const g=p.goalEngine;
 document.getElementById("i70Goal").innerHTML=`
   <div class="i70GoalBox"><div class="i70Name">Kapitalmål</div><div class="i70Right" style="text-align:left;font-size:24px;margin-top:6px">${i70Money(g.capitalGoalSEK)}</div><div class="i70Progress"><span style="width:${Math.min(100,p.goalProgressPct)}%"></span></div><div class="i70Meta">${i70Pct(p.goalProgressPct,2)} klart</div></div>
   <div class="i70GoalBox"><div class="i70Name">Nästa milstolpe</div><div class="i70Meta">${i70Money(g.nextMilestoneSEK)}</div><div class="i70Meta" style="margin-top:7px">${g.nextMilestoneMonths==null?"Ingen prognos.":`Basscenario: cirka ${Math.floor(g.nextMilestoneMonths/12)} år och ${g.nextMilestoneMonths%12} månader.`}</div></div>
   <div class="i70GoalBox"><div class="i70Name">7,5 Mkr</div><div class="i70Meta">${g.capitalGoalMonths==null?"Nås inte inom modellens horisont.":`Basscenario: cirka ${Math.floor(g.capitalGoalMonths/12)} år och ${g.capitalGoalMonths%12} månader.`}</div><div class="i70Meta">Antagande ${i70Pct(g.assumedReturnPct)} · sparande ${i70Money(g.monthlyContributionSEK)}/mån</div></div>`;
 document.getElementById("i70System").innerHTML=Object.entries(p.status).map(([k,v])=>`<div class="i70SystemRow"><span>${k}</span><b>${v}</b></div>`).join("");
 i70SetTab("priority");
}
