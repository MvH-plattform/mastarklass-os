
function apm74Money(v){const x=Number(v);return Number.isFinite(x)?Math.round(x).toLocaleString("sv-SE")+" kr":"—"}
function apm74Pct(v,d=1){const x=Number(v);return Number.isFinite(x)?x.toFixed(d).replace(".",",")+"%":"—"}
function apm74SetTab(tab){
 document.querySelectorAll("[data-apm74tab]").forEach(b=>b.classList.toggle("active",b.dataset.apm74tab===tab));
 document.querySelectorAll("[id^='apm74-']").forEach(p=>{if(p.classList.contains("apm74Panel"))p.classList.toggle("active",p.id==="apm74-"+tab)});
}
function setupAIPortfolioManager74(){
 document.querySelectorAll("[data-apm74tab]").forEach(b=>{if(!b.dataset.bound){b.dataset.bound="1";b.addEventListener("click",()=>apm74SetTab(b.dataset.apm74tab));}});
}
function openAIPortfolioManager74(){
 document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
 document.getElementById("aiPortfolioManager74")?.classList.add("active");
 document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
 renderAIPortfolioManager74();window.scrollTo({top:0,behavior:"smooth"});
}
function apm74Badge(type){
 if(type==="ÖKA")return"apm74Buy";
 if(type.includes("MINSKA"))return"apm74Risk";
 if(type==="BEVAKA")return"apm74Watch";
 return"apm74Hold";
}
function renderAIPortfolioManager74(){
 const p=DATA?.aiPortfolioManager74;if(!p||!document.getElementById("apm74Score"))return;
 const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
 set("apm74Score",p.managerScore+"/100");set("apm74Actions",p.actionQueue.length);set("apm74Rebalance",p.rebalanceSuggestions.length);set("apm74Risk",p.riskBudget.score+"/100");
 document.getElementById("apm74BriefItems").innerHTML=p.dailyBrief.map(x=>`<div class="apm74BriefItem"><span class="apm74Dot"></span><span>${x}</span></div>`).join("");
 document.getElementById("apm74ActionList").innerHTML=p.actionQueue.length?p.actionQueue.map(x=>`<div class="apm74Row"><div><div class="apm74Name">${x.priority}. ${x.name}</div><div class="apm74Meta">${x.reason||""}</div><span class="apm74Badge ${apm74Badge(x.type)}">${x.type}</span></div><div class="apm74Right">${x.score??"—"}/100${x.amountSEK?`<div class="apm74Meta">${apm74Money(x.amountSEK)}</div>`:""}</div></div>`).join(""):`<div class="apm74Meta">Inga åtgärdsförslag.</div>`;
 document.getElementById("apm74Reports").innerHTML=`<div class="apm74Report"><div class="apm74Title">${p.weeklyReport.title}</div><ul>${p.weeklyReport.summary.map(x=>`<li>${x}</li>`).join("")}</ul></div><div class="apm74Report"><div class="apm74Title">${p.monthlyReport.title}</div><ul>${p.monthlyReport.summary.map(x=>`<li>${x}</li>`).join("")}</ul></div>`;
 document.getElementById("apm74RebalanceList").innerHTML=p.rebalanceSuggestions.length?p.rebalanceSuggestions.map(x=>`<div class="apm74Row"><div><div class="apm74Name">${x.name}</div><div class="apm74Meta">${x.action} · vikt ${apm74Pct(x.currentWeightPct,2)} · mål ${apm74Pct(x.targetWeightPct,2)} · max ${apm74Pct(x.maxWeightPct,2)}</div><span class="apm74Badge ${x.severity==="high"?"apm74Risk":"apm74Buy"}">${x.severity==="high"?"ÖVERVIKT":"UNDERVIKT"}</span></div><div class="apm74Right">${apm74Pct(x.gapPct,2)}</div></div>`).join(""):`<div class="apm74Meta">Inga tydliga ombalanseringsförslag.</div>`;
 document.getElementById("apm74RiskPanel").innerHTML=`<div class="apm74ScoreBox"><div class="apm74Title">Riskbudget ${p.riskBudget.score}/100</div><div class="apm74Bar"><span style="width:${p.riskBudget.score}%"></span></div><div class="apm74Meta">${p.riskBudget.status}</div></div><div class="apm74Row"><div><div class="apm74Name">Hög risk</div></div><div class="apm74Right">${p.riskBudget.highRiskHoldings}</div></div><div class="apm74Row"><div><div class="apm74Name">Medelrisk</div></div><div class="apm74Right">${p.riskBudget.mediumRiskHoldings}</div></div><div class="apm74Row"><div><div class="apm74Name">Låg risk</div></div><div class="apm74Right">${p.riskBudget.lowRiskHoldings}</div></div><div class="apm74Row"><div><div class="apm74Name">Aktiva risksignaler</div></div><div class="apm74Right">${p.riskBudget.riskSignals}</div></div>`;
 document.getElementById("apm74Liquidity").innerHTML=`<div class="apm74ScoreBox"><div class="apm74Title">Månadssparande ${apm74Money(p.liquidityPlan.monthlyContributionSEK)}</div><div class="apm74Meta">Reserv ${apm74Money(p.liquidityPlan.reserveSEK)} · investerbart ${apm74Money(p.liquidityPlan.investableSEK)}</div></div>${p.liquidityPlan.allocation.map(x=>`<div class="apm74Row"><div><div class="apm74Name">${x.name}</div><div class="apm74Meta">${apm74Pct(x.sharePct)} av investerbart belopp</div></div><div class="apm74Right">${apm74Money(x.monthlySEK)}</div></div>`).join("")}`;
 document.getElementById("apm74Changes").innerHTML=p.changeFeed.map(x=>`<div class="apm74Row"><div><div class="apm74Name">${x.title}</div><div class="apm74Meta">${x.date} · ${x.type}<br>${x.text}</div></div></div>`).join("");
 document.getElementById("apm74History").innerHTML=p.decisionHistory.map(x=>`<div class="apm74Row"><div><div class="apm74Name">${x.decision}</div><div class="apm74Meta">${x.date} · ${x.scope}<br>${x.reason}</div><span class="apm74Badge apm74Pink">${x.status}</span></div></div>`).join("");
 document.getElementById("apm74System").innerHTML=Object.entries(p.status).map(([k,v])=>`<div class="apm74SystemRow"><span>${k}</span><b>${v}</b></div>`).join("");
 apm74SetTab("actions");
}
