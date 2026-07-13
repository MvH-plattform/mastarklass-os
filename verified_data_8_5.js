
function vd85SetTab(tab){
 document.querySelectorAll("[data-vd85tab]").forEach(b=>b.classList.toggle("active",b.dataset.vd85tab===tab));
 document.querySelectorAll("[id^='vd85-']").forEach(p=>{if(p.classList.contains("vd85Panel"))p.classList.toggle("active",p.id==="vd85-"+tab)});
}
function setupVerifiedData85(){
 document.querySelectorAll("[data-vd85tab]").forEach(b=>{if(!b.dataset.bound){b.dataset.bound="1";b.addEventListener("click",()=>vd85SetTab(b.dataset.vd85tab));}});
}
function openVerifiedData85(tab="sources"){
 document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
 document.getElementById("verifiedData85")?.classList.add("active");
 document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
 renderVerifiedData85();vd85SetTab(tab);window.scrollTo({top:0,behavior:"smooth"});
}
function vd85Row(title,meta,right,badge,cls="info"){
 return `<div class="vd85Row"><div><div class="vd85Name">${title}</div><div class="vd85Meta">${meta||""}</div>${badge?`<span class="vd85Badge ${cls}">${badge}</span>`:""}</div><div class="vd85Right">${right||""}</div></div>`;
}
function renderVerifiedData85(){
 const p=DATA?.verifiedData85;if(!p||!document.getElementById("vd85Score"))return;
 const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
 set("vd85Score",p.verifiedDataScore+"/100");set("vd85Verdict",p.verdict);
 set("vd85Sources",p.sourceCount);set("vd85Approved",p.approvedForTest);
 set("vd85Rules",p.validationRuleCount);set("vd85Compliance",p.compliancePass+"/"+(p.compliancePass+p.complianceWait));
 const preview=document.getElementById("vd85SourcePreview");
 if(preview)preview.innerHTML=p.sourceRatings.slice().sort((a,b)=>b.totalScore-a.totalScore).slice(0,5).map(s=>vd85Row(s.name,`${s.category} · ${s.reason}`,s.totalScore+"/100",s.status,s.status==="GODKÄND FÖR TEST"?"pass":s.status==="BLOCKERAD"?"block":"wait")).join("");
 const comp=document.getElementById("vd85Components");
 if(comp)comp.innerHTML=Object.entries(p.componentScores).map(([k,v])=>`<div class="vd85Metric"><span>${k}</span><b>${Math.round(v)}/100</b><div><i style="width:${Math.max(0,Math.min(100,v))}%"></i></div></div>`).join("");
 const sl=document.getElementById("vd85SourceList");
 if(sl)sl.innerHTML=p.sourceRatings.slice().sort((a,b)=>b.totalScore-a.totalScore).map(s=>vd85Row(s.name,`${s.category}<br>${s.licenseStatus||""}<br>${s.corsStatus||""}<br>${s.adapterStatus||""}`,s.totalScore+"/100",s.status,s.status==="GODKÄND FÖR TEST"?"pass":s.status==="BLOCKERAD"?"block":"wait")).join("");
 const val=document.getElementById("vd85Validation");
 if(val)val.innerHTML=p.validationRules.map(x=>vd85Row(x.name,x.description,"",x.severity,x.severity==="BLOCK"?"block":"wait")).join("");
 const cache=document.getElementById("vd85Cache");
 if(cache)cache.innerHTML=p.cachePolicies.map(x=>vd85Row(x.type,`TTL ${x.ttlMinutes} min · max stale ${x.maxStaleMinutes} min<br>Fallback: ${x.fallback}`,x.priority)).join("");
 const lin=document.getElementById("vd85Lineage");
 if(lin)lin.innerHTML=p.lineageSteps.map(x=>vd85Row(`${x.step}. ${x.name}`,x.detail,"")).join("");
 const compList=document.getElementById("vd85ComplianceList");
 if(compList)compList.innerHTML=p.complianceChecks.map(x=>vd85Row(x.name,x.detail,"",x.status,x.status==="PASS"?"pass":"wait")).join("");
 const ai=document.getElementById("vd85AI");
 if(ai)ai.innerHTML=`<div class="vd85Name">Tillåtet som fakta</div>${p.aiUsagePolicy.allowed.map(x=>vd85Row(x,"","","TILLÅTET","pass")).join("")}<div class="vd85Name space">Begränsat</div>${p.aiUsagePolicy.restricted.map(x=>vd85Row(x,"","","BEGRÄNSAT","wait")).join("")}<div class="vd85Name space">Blockerat</div>${p.aiUsagePolicy.blocked.map(x=>vd85Row(x,"","","BLOCKERAT","block")).join("")}<div class="vd85Meta space">${p.aiUsagePolicy.rule}</div>`;
 const sys=document.getElementById("vd85System");
 if(sys)sys.innerHTML=Object.entries(p.status).map(([k,v])=>vd85Row(k,"",v)).join("");
}
