
function di75Money(v){const x=Number(v);return Number.isFinite(x)?Math.round(x).toLocaleString("sv-SE")+" kr":"—"}
function di75Pct(v,d=1){const x=Number(v);return Number.isFinite(x)?x.toFixed(d).replace(".",",")+"%":"—"}
function di75SetTab(tab){
 document.querySelectorAll("[data-di75tab]").forEach(b=>b.classList.toggle("active",b.dataset.di75tab===tab));
 document.querySelectorAll("[id^='di75-']").forEach(p=>{if(p.classList.contains("di75Panel"))p.classList.toggle("active",p.id==="di75-"+tab)});
}
function setupDividendIntelligence75(){
 document.querySelectorAll("[data-di75tab]").forEach(b=>{if(!b.dataset.bound){b.dataset.bound="1";b.addEventListener("click",()=>di75SetTab(b.dataset.di75tab));}});
}
function openDividendIntelligence75(){
 document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
 document.getElementById("dividendIntelligence75")?.classList.add("active");
 document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
 renderDividendIntelligence75();window.scrollTo({top:0,behavior:"smooth"});
}
function renderDividendIntelligence75(){
 const p=DATA?.dividendIntelligence75;if(!p||!document.getElementById("di75Annual"))return;
 const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
 set("di75Annual",di75Money(p.knownAnnualDividendSEK));set("di75Monthly",di75Money(p.knownMonthlyDividendSEK));set("di75Progress",di75Pct(p.goalProgressPct,2));set("di75Coverage",p.coveragePct+"%");
 document.getElementById("di75CoachItems").innerHTML=p.coach.map(x=>`<div class="di75CoachItem"><span class="di75Dot"></span><span>${x}</span></div>`).join("");
 document.getElementById("di75Overview").innerHTML=`<div class="di75GoalBox"><div class="di75Title">Utdelningsmål</div><div class="di75Right" style="text-align:left;font-size:24px;margin-top:6px">${di75Money(p.annualGoalSEK)}/år</div><div class="di75Bar"><span style="width:${Math.min(100,p.goalProgressPct)}%"></span></div><div class="di75Meta">${di75Pct(p.goalProgressPct,2)} klart · gap ${di75Money(p.annualGapSEK)}</div></div><div class="di75Row"><div><div class="di75Name">Kända utdelningsinnehav</div></div><div class="di75Right">${p.knownHoldingCount}/${p.holdingCount}</div></div><div class="di75Row"><div><div class="di75Name">Månadsgenomsnitt</div></div><div class="di75Right">${di75Money(p.knownMonthlyDividendSEK)}</div></div>`;
 document.getElementById("di75Holdings").innerHTML=p.holdings.map(x=>`<div class="di75Row"><div><div class="di75Name">${x.name}</div><div class="di75Meta">${x.account} · säkerhet ${x.safetyScore}/100 · tillväxt ${x.growthScore}/100</div><span class="di75Badge ${x.status==="KÄND"?"di75Good":"di75Warn"}">${x.status}</span></div><div class="di75Right">${di75Money(x.annualDividendSEK)}/år<div class="di75Meta">${x.nextPayDate||"Datum saknas"}</div></div></div>`).join("");
 document.getElementById("di75Calendar").innerHTML=p.monthlyPlan.map(x=>`<div class="di75Row"><div><div class="di75Name">${x.month}</div><div class="di75Meta">${x.status}</div></div><div class="di75Right">${di75Money(x.knownSEK)}</div></div>`).join("");
 const c=p.projection.curve,max=Math.max(...c.map(x=>x.annualSEK),1);
 document.getElementById("di75Projection").innerHTML=`<div class="di75Title">20-årig lokal modell</div><div class="di75Meta">${di75Pct(p.projection.annualGrowthPct)} tillväxt · ${di75Pct(p.projection.reinvestPct)} återinvestering</div><div class="di75Chart">${c.map(x=>`<div class="di75ChartBar" title="År ${x.year}: ${di75Money(x.annualSEK)}" style="height:${Math.max(2,x.annualSEK/max*100)}%"></div>`).join("")}</div><div class="di75Legend"><span>År 1</span><span>År ${c.length}</span></div><div class="di75Meta">Målår: ${p.projection.goalYear??"Ej inom modellen"}</div>`;
 document.getElementById("di75Fire").innerHTML=`<div class="di75GoalBox"><div class="di75Title">Utdelnings-FIRE</div><div class="di75Meta">Nuvarande ${di75Money(p.fire.currentMonthlySEK)}/mån</div><div class="di75Meta">Mål ${di75Money(p.fire.targetMonthlySEK)}/mån</div><div class="di75Bar"><span style="width:${Math.min(100,p.fire.coveragePct)}%"></span></div><div class="di75Meta">Kvar ${di75Money(p.fire.gapMonthlySEK)}/mån</div></div>`;
 document.getElementById("di75System").innerHTML=Object.entries(p.status).map(([k,v])=>`<div class="di75SystemRow"><span>${k}</span><b>${v}</b></div>`).join("");
 di75SetTab("overview");
}
