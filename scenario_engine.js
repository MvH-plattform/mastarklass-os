
function se72Money(v){const x=Number(v);return Number.isFinite(x)?Math.round(x).toLocaleString("sv-SE")+" kr":"—"}
function se72Pct(v,d=1){const x=Number(v);return Number.isFinite(x)?x.toFixed(d).replace(".",",")+"%":"—"}
function se72Years(months){if(months==null)return"Ej inom modellen";return`${Math.floor(months/12)} år ${months%12} mån`}
function se72SetTab(tab){
 document.querySelectorAll("[data-se72tab]").forEach(b=>b.classList.toggle("active",b.dataset.se72tab===tab));
 document.querySelectorAll("[id^='se72-']").forEach(p=>{if(p.classList.contains("se72Panel"))p.classList.toggle("active",p.id==="se72-"+tab)});
}
function setupScenarioEngine72(){
 document.querySelectorAll("[data-se72tab]").forEach(b=>{if(!b.dataset.bound){b.dataset.bound="1";b.addEventListener("click",()=>se72SetTab(b.dataset.se72tab));}});
}
function openScenarioEngine72(){
 document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
 document.getElementById("scenarioEngine72")?.classList.add("active");
 document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
 renderScenarioEngine72();window.scrollTo({top:0,behavior:"smooth"});
}
function se72Simulate(start,monthly,annualReturn,years,shockPct=0,inflation=2){
 const r=annualReturn/100/12;let v=start,curve=[];let shocked=false;
 for(let m=1;m<=years*12;m++){if(shockPct&&!shocked&&m===1){v*=1+shockPct/100;shocked=true}v=v*(1+r)+monthly;if(m%12===0)curve.push({year:m/12,nominalSEK:v,realSEK:v/Math.pow(1+inflation/100,m/12)});}
 return curve;
}
function se72MonthsToGoal(start,monthly,annualReturn,goal,shockPct=0){
 const r=annualReturn/100/12;let v=start,shocked=false;
 for(let m=1;m<=1200;m++){if(shockPct&&!shocked&&m===1){v*=1+shockPct/100;shocked=true}v=v*(1+r)+monthly;if(v>=goal)return m}return null;
}
function runCustomScenario72(){
 const p=DATA.scenarioEngine72;
 const monthly=Number(document.getElementById("se72InputMonthly").value||0);
 const ret=Number(document.getElementById("se72InputReturn").value||0);
 const years=Number(document.getElementById("se72InputYears").value||25);
 const shock=Number(document.getElementById("se72InputShock").value||0);
 const inflation=Number(document.getElementById("se72InputInflation").value||2);
 const yieldPct=Number(document.getElementById("se72InputYield").value||3.5);
 const curve=se72Simulate(p.portfolioValueSEK,monthly,ret,years,shock,inflation);
 const final=curve.length?curve[curve.length-1].nominalSEK:p.portfolioValueSEK;
 const goalMonths=se72MonthsToGoal(p.portfolioValueSEK,monthly,ret,p.capitalGoalSEK,shock);
 const annualDividend=final*yieldPct/100;
 document.getElementById("se72CustomResult").innerHTML=`<div class="se72GoalBox"><div class="se72Name">Eget scenario</div><div class="se72Meta">Slutvärde efter ${years} år</div><div class="se72Right" style="text-align:left;font-size:24px;margin-top:6px">${se72Money(final)}</div><div class="se72Meta">Tid till 7,5 Mkr: ${se72Years(goalMonths)}</div><div class="se72Meta">Teoretisk utdelning: ${se72Money(annualDividend/12)}/mån</div></div>`;
}
function renderScenarioEngine72(){
 const p=DATA?.scenarioEngine72;if(!p||!document.getElementById("se72Start"))return;
 const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
 set("se72Start",se72Money(p.portfolioValueSEK));set("se72Goal",se72Money(p.capitalGoalSEK));set("se72Monthly",se72Money(p.baseMonthlyContributionSEK));set("se72Count",p.scenarios.length);
 document.getElementById("se72InputMonthly").value=p.baseMonthlyContributionSEK;
 document.getElementById("se72InputReturn").value=p.baseReturnPct;
 document.getElementById("se72CoachItems").innerHTML=p.coach.map(x=>`<div class="se72CoachItem"><span class="se72Dot"></span><span>${x}</span></div>`).join("");
 const best=p.bestScenario;
 document.getElementById("se72Compare").innerHTML=p.scenarios.map(x=>`<div class="se72Row"><div><div class="se72Name">${x.name}</div><div class="se72Meta">${se72Money(x.monthlyContributionSEK)}/mån · ${se72Pct(x.annualReturnPct)} · risk ${x.risk}</div><span class="se72Badge ${x.name===best?"se72Best":x.name==="Bas"?"se72Base":x.shockPct<0?"se72Risk":"se72Base"}">${x.name===best?"BÄST SCORE":x.name==="Bas"?"BAS":x.shockPct<0?"STRESS":"SCENARIO"}</span></div><div class="se72Right">${se72Money(x.finalValueSEK)}<div class="se72Meta">${se72Years(x.goalMonths)}</div></div></div>`).join("");
 const base=p.scenarios.find(x=>x.name==="Bas")||p.scenarios[0];const curve=base.curve||[];const max=Math.max(...curve.map(x=>x.nominalSEK),1);
 document.getElementById("se72Curve").innerHTML=`<div class="se72Name">Basscenario – nominell utveckling</div><div class="se72Chart">${curve.map((x,i)=>`<div class="se72Bar" title="År ${x.year}: ${se72Money(x.nominalSEK)}" style="height:${Math.max(2,x.nominalSEK/max*100)}%"></div>`).join("")}</div><div class="se72Legend"><span>År 1</span><span>År ${curve.length}</span></div><div class="se72Meta">Slutvärde ${se72Money(base.finalValueSEK)} · realvärde efter inflation ${se72Money(curve.at(-1)?.realSEK||0)}</div>`;
 document.getElementById("se72GoalPanel").innerHTML=p.scenarios.map(x=>`<div class="se72GoalBox"><div class="se72Name">${x.name}</div><div class="se72Meta">Tid till 7,5 Mkr: ${se72Years(x.goalMonths)}</div><div class="se72Meta">Teoretisk utdelning efter ${x.years} år: ${se72Money(x.monthlyDividendSEK)}/mån</div><div class="se72Progress"><span style="width:${Math.min(100,x.finalValueSEK/p.capitalGoalSEK*100)}%"></span></div></div>`).join("");
 const stress=p.scenarios.filter(x=>x.shockPct<0||x.name==="Bas");
 document.getElementById("se72Stress").innerHTML=stress.map(x=>`<div class="se72Row"><div><div class="se72Name">${x.name}</div><div class="se72Meta">Engångsfall ${se72Pct(x.shockPct)} · återhämtning enligt ${se72Pct(x.annualReturnPct)} årlig modell</div></div><div class="se72Right">${se72Money(x.finalValueSEK)}<div class="se72Meta">${se72Years(x.goalMonths)}</div></div></div>`).join("");
 document.getElementById("se72System").innerHTML=Object.entries(p.status).map(([k,v])=>`<div class="se72SystemRow"><span>${k}</span><b>${v}</b></div>`).join("");
 se72SetTab("compare");
}
