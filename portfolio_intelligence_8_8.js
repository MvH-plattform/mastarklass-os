
function pi88SetTab(tab){
 document.querySelectorAll("[data-pi88tab]").forEach(b=>b.classList.toggle("active",b.dataset.pi88tab===tab));
 document.querySelectorAll("[id^='pi88-']").forEach(p=>{if(p.classList.contains("pi88Panel"))p.classList.toggle("active",p.id==="pi88-"+tab)});
}
function setupPortfolioIntelligence88(){
 document.querySelectorAll("[data-pi88tab]").forEach(b=>{if(!b.dataset.bound){b.dataset.bound="1";b.addEventListener("click",()=>pi88SetTab(b.dataset.pi88tab));}});
}
function openPortfolioIntelligence88(tab="overview"){
 document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
 document.getElementById("portfolioIntelligence88")?.classList.add("active");
 document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
 renderPortfolioIntelligence88();pi88SetTab(tab);window.scrollTo({top:0,behavior:"smooth"});
}
function pi88Money(v){return Math.round(Number(v)||0).toLocaleString("sv-SE")+" kr";}
function pi88Row(title,meta,right,badge,cls="info"){
 return `<div class="pi88Row"><div><div class="pi88Name">${title}</div><div class="pi88Meta">${meta||""}</div>${badge?`<span class="pi88Badge ${cls}">${badge}</span>`:""}</div><div class="pi88Right">${right||""}</div></div>`;
}
function pi88Group(rows){
 return rows?.length?rows.map(x=>pi88Row(x.name,`${x.weight.toFixed(1)} % av portföljen`,pi88Money(x.value))).join(""):pi88Row("Ingen data","Komplettera din lokala portföljdata.","");
}
function renderPortfolioIntelligence88(){
 const a=window.MKPortfolioIntelligence88.analyze(DATA||{}),empty=!a.holdings.length;
 const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
 set("pi88PortfolioValue",empty?"Ingen lokal portfölj":pi88Money(a.value));
 set("pi88Health",empty?"—":a.health.total+"/100");
 set("pi88Holdings",a.holdings.length);
 set("pi88Largest",empty?"—":a.health.largestWeight.toFixed(1)+"%");
 set("pi88Coverage",empty?"—":a.health.coverage.toFixed(0)+"%");
 set("pi88Summary",empty?"Importera eller återställ portföljen i Private Vault. Analysen startar automatiskt därefter.":`Portföljen innehåller ${a.holdings.length} innehav och har ett lokalt hälsobetyg på ${a.health.total}/100.`);
 const es=document.getElementById("pi88EmptyState"),content=document.getElementById("pi88Content");
 if(es)es.style.display=empty?"block":"none";if(content)content.style.display=empty?"none":"block";
 if(empty)return;

 const grid=document.getElementById("pi88ScoreGrid");
 if(grid)grid.innerHTML=Object.entries(a.health.components).map(([k,v])=>`<div class="pi88Metric"><span>${k}</span><b>${v}/100</b><div><i style="width:${v}%"></i></div></div>`).join("");
 const exp=document.getElementById("pi88ExposurePreview");
 if(exp)exp.innerHTML=[
  ...(a.sectors.slice(0,2).map(x=>({...x,name:"Sektor: "+x.name}))),
  ...(a.countries.slice(0,2).map(x=>({...x,name:"Land: "+x.name}))),
  ...(a.currencies.slice(0,2).map(x=>({...x,name:"Valuta: "+x.name})))
 ].map(x=>pi88Row(x.name,`${x.weight.toFixed(1)} %`,pi88Money(x.value))).join("");
 const pri=document.getElementById("pi88PriorityPreview");
 if(pri)pri.innerHTML=a.health.priorities.slice(0,4).map(x=>pi88Row(x.title,x.detail,"",x.impact,x.impact==="HÖG"?"block":x.impact==="MEDEL"?"wait":"pass")).join("");

 const ov=document.getElementById("pi88Overview");
 if(ov)ov.innerHTML=
  pi88Row("Portföljvärde","Lokalt registrerat värde",pi88Money(a.value))+
  pi88Row("Portfolio Health","Samlat struktur- och databetyg",a.health.total+"/100")+
  pi88Row("Innehav",`${a.holdings.length} lokalt lagrade`,a.holdings.length)+
  pi88Row("Datatäckning","Namn, typ, valuta, land och sektor",a.health.coverage.toFixed(0)+"%")+
  pi88Row("Extern kursdata","Påverkar inte denna analys","AV","LOKAL ANALYS","pass");

 const acc=document.getElementById("pi88Accounts");if(acc)acc.innerHTML=pi88Group(a.accounts);
 const assets=document.getElementById("pi88Assets");if(assets)assets.innerHTML=pi88Group(a.assets);
 const exposure=document.getElementById("pi88Exposure");
 if(exposure)exposure.innerHTML=`<div class="pi88Sub">Sektor</div>${pi88Group(a.sectors)}<div class="pi88Sub">Land</div>${pi88Group(a.countries)}<div class="pi88Sub">Valuta</div>${pi88Group(a.currencies)}`;
 const risk=document.getElementById("pi88Risk");
 if(risk)risk.innerHTML=
  pi88Row("Största innehav",a.health.largestWeight>20?"Över rekommenderad granskningsnivå":"Inom lokal granskningsnivå",a.health.largestWeight.toFixed(1)+"%",a.health.largestWeight>20?"GRANSKA":"OK",a.health.largestWeight>20?"block":"pass")+
  pi88Row("Fem största",a.health.top5Weight>60?"Hög koncentration":"Kontrollerad koncentration",a.health.top5Weight.toFixed(1)+"%",a.health.top5Weight>60?"GRANSKA":"OK",a.health.top5Weight>60?"wait":"pass")+
  a.health.issues.map(x=>pi88Row("Identifierad punkt",x,"")).join("");
 const goals=document.getElementById("pi88Goals");
 if(goals)goals.innerHTML=a.goals.map(g=>pi88Row(g.name,`${g.progress.toFixed(2)} % uppnått · ${pi88Money(g.remaining)} återstår`,pi88Money(g.current))).join("");
 const timeline=document.getElementById("pi88Timeline"),snaps=window.MKPortfolioSnapshot88.load().slice().reverse();
 if(timeline)timeline.innerHTML=snaps.length?snaps.map(s=>pi88Row(new Date(s.at).toLocaleDateString("sv-SE"),`${s.holdings} innehav · Health ${s.health}/100`,pi88Money(s.value))).join(""):pi88Row("Ingen historik ännu","Första lokala snapshoten skapas automatiskt när en portfölj finns.","");
 const sys=document.getElementById("pi88System");
 if(sys)sys.innerHTML=Object.entries(DATA?.portfolioIntelligence88?.status||{}).map(([k,v])=>pi88Row(k,"",v)).join("");
}
