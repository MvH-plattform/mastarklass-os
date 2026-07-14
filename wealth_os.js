
function wo76Money(v){const x=Number(v);return Number.isFinite(x)?Math.round(x).toLocaleString("sv-SE")+" kr":"—"}
function wo76Pct(v,d=1){const x=Number(v);return Number.isFinite(x)?x.toFixed(d).replace(".",",")+"%":"—"}
function wo76SetTab(tab){
 document.querySelectorAll("[data-wo76tab]").forEach(b=>b.classList.toggle("active",b.dataset.wo76tab===tab));
 document.querySelectorAll("[id^='wo76-']").forEach(p=>{if(p.classList.contains("wo76Panel"))p.classList.toggle("active",p.id==="wo76-"+tab)});
}
function setupWealthOS76(){
 document.querySelectorAll("[data-wo76tab]").forEach(b=>{if(!b.dataset.bound){b.dataset.bound="1";b.addEventListener("click",()=>wo76SetTab(b.dataset.wo76tab));}});
}
function openWealthOS76(){
 document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
 document.getElementById("wealthOS76")?.classList.add("active");
 document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
 renderWealthOS76();window.scrollTo({top:0,behavior:"smooth"});
}
function renderWealthOS76(){
 const p=DATA?.wealthOS76;if(!p||!document.getElementById("wo76Score"))return;
 const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
 set("wo76Score",p.wealthScore2+"/100");set("wo76Value",wo76Money(p.portfolioValueSEK));set("wo76Goal",wo76Pct(p.goalProgressPct,2));set("wo76Priorities",p.priorities.length);
 set("wo76VerdictTitle",p.verdict);set("wo76VerdictText",p.verdictText);
 document.getElementById("wo76HealthGrid").innerHTML=Object.entries(p.healths).map(([k,v])=>`<div class="wo76Health"><span>${k}</span><b>${v}/100</b><div class="wo76Bar"><span style="width:${v}%"></span></div></div>`).join("");
 document.getElementById("wo76Command").innerHTML=p.commandCenter.map(x=>`<div class="wo76Row"><div><div class="wo76Name">${x.label}</div></div><div class="wo76Right">${x.valueSEK!=null?wo76Money(x.valueSEK)+(x.suffix||""):(x.value??"—")+(x.suffix||"")}</div></div>`).join("");
 document.getElementById("wo76PriorityList").innerHTML=p.priorities.map(x=>`<div class="wo76Row"><div><div class="wo76Name">${x.rank}. ${x.title}</div><div class="wo76Meta">${x.reason}</div><span class="wo76Badge">${x.impact} påverkan</span></div></div>`).join("");
 document.getElementById("wo76Timeline").innerHTML=p.timeline.map(x=>`<div class="wo76Row"><div><div class="wo76Name">${x.version} · ${x.name}</div><span class="wo76Badge">${x.status}</span></div></div>`).join("");
 document.getElementById("wo76Status").innerHTML=Object.entries(p.systemStatus).map(([k,v])=>`<div class="wo76SystemRow"><span>${k}</span><b>${v}</b></div>`).join("");
 wo76SetTab("health");
}
