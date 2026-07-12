
function lf81Bool(v){return v?"JA":"NEJ"}
function lf81SetTab(tab){
 document.querySelectorAll("[data-lf81tab]").forEach(b=>b.classList.toggle("active",b.dataset.lf81tab===tab));
 document.querySelectorAll("[id^='lf81-']").forEach(p=>{if(p.classList.contains("lf81Panel"))p.classList.toggle("active",p.id==="lf81-"+tab)});
}
function setupLiveFoundation81(){
 document.querySelectorAll("[data-lf81tab]").forEach(b=>{if(!b.dataset.bound){b.dataset.bound="1";b.addEventListener("click",()=>lf81SetTab(b.dataset.lf81tab));}});
}
function openLiveFoundation81(tab="sources"){
 document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
 document.getElementById("liveFoundation81")?.classList.add("active");
 document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
 renderLiveFoundation81();lf81SetTab(tab);window.scrollTo({top:0,behavior:"smooth"});
}
function lf81Row(title,meta,right,badge,badgeClass="info"){
 return `<div class="lf81Row"><div><div class="lf81Name">${title}</div><div class="lf81Meta">${meta||""}</div>${badge?`<span class="lf81Badge ${badgeClass}">${badge}</span>`:""}</div><div class="lf81Right">${right||""}</div></div>`;
}
function renderLiveFoundation81(){
 const p=DATA?.liveFoundation81;if(!p||!document.getElementById("lf81Readiness"))return;
 const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
 set("lf81Readiness",p.readinessScore+"/100");set("lf81Sources",p.registeredSources);set("lf81Active",p.activeSources);set("lf81Waiting",p.waitingChecks);
 const readiness=document.getElementById("lf81ReadinessList");
 if(readiness)readiness.innerHTML=p.readinessChecks.slice(0,6).map(x=>lf81Row(x.name,x.detail,"",x.status,x.status==="PASS"?"pass":"wait")).join("");
 const preview=document.getElementById("lf81SourcePreview");
 if(preview)preview.innerHTML=p.sources.slice(0,4).map(x=>lf81Row(x.name,x.category+" · "+x.notes,x.cost,x.enabled?"AKTIV":"AV","wait")).join("");
 const list=document.getElementById("lf81SourceList");
 if(list)list.innerHTML=p.sources.map(x=>lf81Row(x.name,`${x.category}<br>${x.licenseStatus}<br>${x.corsStatus}<br>${x.notes}`,x.cost,x.enabled?"AKTIV":x.adapterStatus,x.enabled?"pass":"wait")).join("");
 const val=document.getElementById("lf81Validation");
 if(val)val.innerHTML=p.validationRules.map(x=>lf81Row(x.name,x.description,"",x.severity,x.severity==="BLOCK"?"block":"wait")).join("");
 const cache=document.getElementById("lf81Cache");
 if(cache)cache.innerHTML=Object.entries(p.cachePolicy).map(([k,v])=>lf81Row(k,"",String(v))).join("");
 const mon=document.getElementById("lf81Monitor");
 if(mon)mon.innerHTML=p.readinessChecks.map(x=>lf81Row(x.name,x.detail,"",x.status,x.status==="PASS"?"pass":"wait")).join("");
 const privacy=document.getElementById("lf81Privacy");
 if(privacy)privacy.innerHTML=Object.entries(p.privacy).map(([k,v])=>lf81Row(k,"",lf81Bool(v),v?"pass":"info")).join("");
 const system=document.getElementById("lf81System");
 if(system)system.innerHTML=Object.entries(p.status).map(([k,v])=>lf81Row(k,"",v)).join("");
 lf81SetTab("sources");
}
