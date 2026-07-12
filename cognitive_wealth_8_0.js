
function cw80Money(v){const x=Number(v);return Number.isFinite(x)?Math.round(x).toLocaleString("sv-SE")+" kr":"—"}
function cw80Pct(v,d=2){const x=Number(v);return Number.isFinite(x)?x.toFixed(d).replace(".",",")+"%":"—"}
function cw80SetTab(tab){
 document.querySelectorAll("[data-cw80tab]").forEach(b=>b.classList.toggle("active",b.dataset.cw80tab===tab));
 document.querySelectorAll("[id^='cw80-']").forEach(p=>{if(p.classList.contains("cw80Panel"))p.classList.toggle("active",p.id==="cw80-"+tab)});
}
function setupCognitiveWealth80(){
 document.querySelectorAll("[data-cw80tab]").forEach(b=>{if(!b.dataset.bound){b.dataset.bound="1";b.addEventListener("click",()=>cw80SetTab(b.dataset.cw80tab));}});
}
function openCognitiveWealth80(){
 document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
 document.getElementById("cognitiveWealth80")?.classList.add("active");
 document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
 renderCognitiveWealth80();window.scrollTo({top:0,behavior:"smooth"});
}
function cw80ReasoningHTML(items){
 return items.map(x=>`<div class="cw80Row"><div class="cw80Name">${x.priority}. ${x.title}</div><span class="cw80Badge">${x.conclusion}</span><div class="cw80Meta">${x.why}</div><ul class="cw80Evidence">${(x.evidence||[]).map(e=>`<li>${e}</li>`).join("")}</ul></div>`).join("");
}
function renderCognitiveWealth80(){
 const p=DATA?.cognitiveWealth80;if(!p||!document.getElementById("cw80PortfolioValue"))return;
 const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
 set("cw80PortfolioValue",cw80Money(p.portfolioValueSEK));
 set("cw80Verdict",p.verdict+" – "+p.verdictText);
 set("cw80CognitiveScore","Cognitive Score "+p.cognitiveScore+"/100");
 set("cw80MemoryCount","Memory "+p.portfolioMemory.eventCount);
 set("cw80GoalText",cw80Pct(p.goalProgressPct)+" klart");
 const bar=document.getElementById("cw80GoalBar");if(bar)bar.style.width=Math.min(100,Number(p.goalProgressPct)||0)+"%";
 const scores=document.getElementById("cw80Scores");
 if(scores)scores.innerHTML=Object.entries(p.crossEngineScores).map(([k,v])=>`<div class="cw80Score"><span>${k}</span><b>${Math.round(v)}/100</b><div class="cw80Bar"><span style="width:${Math.max(0,Math.min(100,v))}%"></span></div></div>`).join("");
 const shortReason=document.getElementById("cw80Reasoning");if(shortReason)shortReason.innerHTML=cw80ReasoningHTML(p.reasoning.slice(0,3));
 const full=document.getElementById("cw80ReasoningFull");if(full)full.innerHTML=cw80ReasoningHTML(p.reasoning);
 const memSummary=document.getElementById("cw80MemorySummary");
 if(memSummary)memSummary.innerHTML=`<div class="cw80Row"><div class="cw80Name">Minneshändelser</div><div class="cw80Meta">${p.portfolioMemory.eventCount} lokala händelser, ${p.portfolioMemory.snapshotCount} snapshots och ${p.portfolioMemory.decisionCount} beslut.</div></div><div class="cw80Row"><div class="cw80Name">Knowledge Graph</div><div class="cw80Meta">${p.knowledgeGraph.entityCount} noder och ${p.knowledgeGraph.relationCount} relationer.</div></div>`;
 const mem=document.getElementById("cw80MemoryList");
 if(mem)mem.innerHTML=p.portfolioMemory.events.slice(0,30).map(x=>`<div class="cw80Row"><div class="cw80Name">${x.title||x.type}</div><div class="cw80Meta">${x.date||"—"} · ${x.source}<br>${x.text||""}</div></div>`).join("");
 const graph=document.getElementById("cw80Graph");
 if(graph)graph.innerHTML=`<div class="cw80Row"><div class="cw80Name">Noder</div><div class="cw80Meta">${p.knowledgeGraph.entityCount} bolag, sektorer, länder och valutor.</div></div><div class="cw80Row"><div class="cw80Name">Relationer</div><div class="cw80Meta">${p.knowledgeGraph.relationCount} lokala kopplingar mellan innehav och exponeringar.</div></div>${p.knowledgeGraph.entities.slice(0,20).map(x=>`<div class="cw80Row"><div class="cw80Name">${x.label}</div><div class="cw80Meta">${x.type}${x.weightPct!=null?` · ${cw80Pct(x.weightPct)}`:""}</div></div>`).join("")}`;
 const coach=document.getElementById("cw80Coach");
 if(coach)coach.innerHTML=p.coach.map(x=>`<div class="cw80Row"><div class="cw80Meta">${x}</div></div>`).join("");
 const system=document.getElementById("cw80System");
 if(system)system.innerHTML=Object.entries(p.status).map(([k,v])=>`<div class="cw80SystemRow"><span>${k}</span><b>${v}</b></div>`).join("");
 cw80SetTab("reasoning");
}
