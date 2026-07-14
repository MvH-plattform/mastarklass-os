
function lsi86SetTab(tab){
 document.querySelectorAll("[data-lsi86tab]").forEach(b=>b.classList.toggle("active",b.dataset.lsi86tab===tab));
 document.querySelectorAll("[id^='lsi86-']").forEach(p=>{if(p.classList.contains("lsi86Panel"))p.classList.toggle("active",p.id==="lsi86-"+tab)});
}
function setupLiveSourceIntegration86(){
 document.querySelectorAll("[data-lsi86tab]").forEach(b=>{if(!b.dataset.bound){b.dataset.bound="1";b.addEventListener("click",()=>lsi86SetTab(b.dataset.lsi86tab));}});
}
function openLiveSourceIntegration86(tab="connectors"){
 document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
 document.getElementById("liveSourceIntegration86")?.classList.add("active");
 document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
 renderLiveSourceIntegration86();lsi86SetTab(tab);window.scrollTo({top:0,behavior:"smooth"});
}
function lsi86Row(title,meta,right,badge,cls="info"){
 return `<div class="lsi86Row"><div><div class="lsi86Name">${title}</div><div class="lsi86Meta">${meta||""}</div>${badge?`<span class="lsi86Badge ${cls}">${badge}</span>`:""}</div><div class="lsi86Right">${right||""}</div></div>`;
}
function renderLiveSourceIntegration86(){
 const p=DATA?.liveSourceIntegration86;if(!p||!document.getElementById("lsi86Score"))return;
 const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
 set("lsi86Score",p.integrationScore+"/100");
 set("lsi86Connectors",p.connectorCount);
 set("lsi86Active",p.activeConnectors);
 set("lsi86Schedules",p.scheduledDataTypes);
 set("lsi86Checks",p.activationChecks.filter(x=>x.status==="PASS").length+"/"+p.activationChecks.length);

 const cp=document.getElementById("lsi86ConnectorPreview");
 if(cp)cp.innerHTML=p.connectors.slice().sort((a,b)=>b.trustScore-a.trustScore).slice(0,5).map(c=>lsi86Row(c.name,`${c.category} · ${c.adapterType}<br>Sandbox: ${c.sandboxStatus} · Produktion: ${c.productionStatus}`,c.trustScore+"/100",c.sourceStatus,c.sourceStatus==="GODKÄND FÖR TEST"?"pass":c.sourceStatus==="BLOCKERAD"?"block":"wait")).join("");

 const checkp=document.getElementById("lsi86CheckPreview");
 if(checkp)checkp.innerHTML=p.activationChecks.slice(0,6).map(x=>lsi86Row(x.name,x.detail,"",x.status,x.status==="PASS"?"pass":"wait")).join("");

 const list=document.getElementById("lsi86ConnectorList");
 if(list)list.innerHTML=p.connectors.map(c=>lsi86Row(c.name,`${c.category} · ${c.adapterType}<br>Timeout ${c.timeoutMs} ms · retries ${c.maxRetries}<br>Proxy: ${c.requiresProxy?"JA":"NEJ"} · hemlighet: ${c.requiresSecret?"JA":"NEJ"}<br>Health: ${window.MKSourceHealth86.classify(c)}`,c.trustScore+"/100",c.productionStatus,c.productionStatus==="ENABLED"?"pass":"wait")).join("");

 const sch=document.getElementById("lsi86Scheduler");
 if(sch)sch.innerHTML=p.schedules.map(s=>lsi86Row(s.dataType,`${s.window} · jitter ${s.jitterMinutes} min · ${s.mode}`,s.intervalMinutes+" min",s.enabled?"AKTIV":"AV",s.enabled?"pass":"wait")).join("");

 const pipe=document.getElementById("lsi86Pipeline");
 if(pipe)pipe.innerHTML=p.pipeline.map(x=>lsi86Row(`${x.step}. ${x.name}`,x.detail,"")).join("");

 const health=document.getElementById("lsi86Health");
 if(health)health.innerHTML=p.healthRules.map(x=>lsi86Row(x.name,`${x.threshold}<br>${x.action}`,"")).join("");

 const act=document.getElementById("lsi86Activation");
 if(act)act.innerHTML=p.activationChecks.map(x=>lsi86Row(x.name,x.detail,"",x.status,x.status==="PASS"?"pass":"wait")).join("");

 const router=document.getElementById("lsi86Router");
 if(router)router.innerHTML=`<div class="lsi86Name">Urvalsordning</div>${p.routerPolicy.selectionOrder.map((x,i)=>lsi86Row(`${i+1}. ${x}`,"","")).join("")}<div class="lsi86Name space">Fallbackordning</div>${p.routerPolicy.fallbackOrder.map((x,i)=>lsi86Row(`${i+1}. ${x}`,"","")).join("")}<div class="lsi86Meta space">${p.routerPolicy.rule}</div>`;

 const sys=document.getElementById("lsi86System");
 if(sys)sys.innerHTML=Object.entries(p.status).map(([k,v])=>lsi86Row(k,"",v)).join("");
}
