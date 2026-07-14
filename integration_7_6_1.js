
function si761Money(v){const x=Number(v);return Number.isFinite(x)?Math.round(x).toLocaleString("sv-SE")+" kr":"—"}
function si761Pct(v,d=2){const x=Number(v);return Number.isFinite(x)?x.toFixed(d).replace(".",",")+"%":"—"}
function setupIntegration761(){}
function openStabilization761(){
 document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
 const el=document.getElementById("stabilization761");if(el)el.classList.add("active");
 document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
 renderIntegration761();window.scrollTo({top:0,behavior:"smooth"});
}
function renderIntegration761(){
 const w=DATA?.wealthOS76,s=DATA?.stabilization761;
 if(!w||!s)return;
 const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
 set("si761PortfolioValue",si761Money(w.portfolioValueSEK));
 set("si761Verdict",w.verdict+" – "+w.verdictText);
 set("si761WealthScore","Wealth Score "+w.wealthScore2+"/100");
 set("si761IntegrationScore","Integration "+s.integrationScore+"/100");
 set("si761GoalText",si761Pct(w.goalProgressPct)+" klart");
 set("si761ReleaseStatus",s.releaseStatus);
 const bar=document.getElementById("si761GoalBar");if(bar)bar.style.width=Math.min(100,Number(w.goalProgressPct)||0)+"%";
 const health=document.getElementById("si761HealthGrid");
 if(health)health.innerHTML=Object.entries(w.healths).map(([k,v])=>`<div class="si761Health"><span>${k}</span><b>${v}/100</b><div class="si761Bar"><span style="width:${v}%"></span></div></div>`).join("");
 const pr=document.getElementById("si761Priorities");
 if(pr)pr.innerHTML=w.priorities.map(x=>`<div class="si761Row"><div><div class="si761Name">${x.rank}. ${x.title}</div><div class="si761Meta">${x.reason}</div><span class="si761Badge si761Info">${x.impact} påverkan</span></div></div>`).join("");
 const tech=document.getElementById("si761TechnicalSummary");
 if(tech)tech.innerHTML=`<div class="si761Row"><div><div class="si761Name">Integration Health</div><div class="si761Meta">${s.passedChecks} godkända kontroller, ${s.failedChecks} fel.</div></div><div class="si761Right">${s.integrationScore}/100</div></div><div class="si761Row"><div><div class="si761Name">Cache-strategi</div><div class="si761Meta">Index hämtas network-first; modulresurser cachelagras.</div></div><div class="si761Right">${s.cacheStrategy}</div></div><div class="si761Row"><div><div class="si761Name">Startsida</div><div class="si761Meta">Wealth OS Command Center är nu standard.</div></div><div class="si761Right">${s.homeMode}</div></div>`;
 set("si761CheckScore","Integration "+s.integrationScore+"/100");
 set("si761Passed","Pass "+s.passedChecks);
 set("si761Failed","Fail "+s.failedChecks);
 const list=document.getElementById("si761CheckList");
 if(list)list.innerHTML=s.checks.map(x=>`<div class="si761Row"><div><div class="si761Name">${x.name}</div><div class="si761Meta">${x.detail}</div><span class="si761Badge ${x.status==="PASS"?"si761Pass":"si761Fail"}">${x.status}</span></div></div>`).join("");
 const lim=document.getElementById("si761Limitations");
 if(lim)lim.innerHTML=`<div class="si761Name">Kända begränsningar</div>${s.knownLimitations.map(x=>`<div class="si761Row"><div><div class="si761Meta">${x}</div></div></div>`).join("")}`;
}
