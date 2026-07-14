
window.MK_II881={candidates:[],selected:null,selectedIds:new Set(),report:null};
function setupIntelligentImport881(){}
function openIntelligentImport881(){
 document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
 document.getElementById("intelligentImport881")?.classList.add("active");
 renderIntelligentImport881();window.scrollTo({top:0,behavior:"smooth"});
}
function ii881Money(v){return Math.round(Number(v)||0).toLocaleString("sv-SE")+" kr";}
function ii881Row(title,meta,right,badge,cls="info"){
 return `<div class="ii881Row"><div><div class="ii881Name">${title}</div><div class="ii881Meta">${meta||""}</div>${badge?`<span class="ii881Badge ${cls}">${badge}</span>`:""}</div><div class="ii881Right">${right||""}</div></div>`;
}
function selectCandidate881(id){
 const c=window.MK_II881.candidates.find(x=>x.id===id);if(!c)return;
 window.MK_II881.selected=c;window.MK_II881.selectedIds=new Set([id]);
 renderIntelligentImport881();
}
function toggleCandidate881(id,checked){
 if(checked)window.MK_II881.selectedIds.add(id);else window.MK_II881.selectedIds.delete(id);
}
async function scanAllPortfolioSources881(){
 const box=document.getElementById("ii881Candidates");if(box)box.innerHTML=ii881Row("Söker","LocalStorage och IndexedDB granskas…","");
 try{
   const found=await window.MKPortfolioDiscovery881.all();
   window.MK_II881.candidates=window.MKPortfolioCandidateRanker881.rank(found);
   if(window.MK_II881.candidates.length){
     window.MK_II881.selected=window.MK_II881.candidates[0];
     window.MK_II881.selectedIds=new Set([window.MK_II881.candidates[0].id]);
   }
   renderIntelligentImport881();
 }catch(e){if(box)box.innerHTML=ii881Row("Sökfel",e.message,"","FEL","block");}
}
async function loadPortfolioFile881(file){
 const result=document.getElementById("ii881FileResult");
 try{
   if(!file)throw new Error("Ingen fil vald.");
   let data;
   const lower=file.name.toLowerCase();
   if(lower.endsWith(".mkbackup")){
     const pass=document.getElementById("ii881Passphrase")?.value||"";
     const wrapper=JSON.parse(await file.text());
     const restored=await window.MKPrivateVaultCrypto87.decrypt(wrapper,pass);
     data=restored.data||restored;
   }else if(lower.endsWith(".json")){
     const obj=JSON.parse(await file.text());
     data=Array.isArray(obj)?window.MKPortfolioFileImporter871.buildPortfolio(obj,DATA):obj;
   }else{
     const records=window.MKPortfolioFileImporter871.parseCSV(await file.text());
     data=window.MKPortfolioFileImporter871.buildPortfolio(records,DATA);
   }
   if(!Array.isArray(data?.holdings)||!data.holdings.length)throw new Error("Filen innehåller ingen giltig portfölj.");
   const c={id:"file:"+Date.now(),source:"Fil",name:file.name,data};
   const ranked=window.MKPortfolioCandidateRanker881.rank([c])[0];
   window.MK_II881.candidates=[ranked,...window.MK_II881.candidates];
   window.MK_II881.selected=ranked;window.MK_II881.selectedIds=new Set([ranked.id]);
   if(result)result.textContent=`${ranked.holdings} innehav lästa från ${file.name}.`;
   renderIntelligentImport881();
 }catch(e){if(result)result.textContent="Filfel: "+e.message;}
}
function mergeSelectedCandidates881(){
 try{
   const chosen=window.MK_II881.candidates.filter(c=>window.MK_II881.selectedIds.has(c.id));
   const merged=window.MKPortfolioMerge881.merge(chosen);
   const candidate=window.MKPortfolioCandidateRanker881.rank([{id:"merged:"+Date.now(),source:"Sammanslagen",name:"Sammanslagen portfölj",data:merged.data}])[0];
   candidate.mergeDuplicates=merged.duplicates;
   window.MK_II881.candidates=[candidate,...window.MK_II881.candidates];
   window.MK_II881.selected=candidate;window.MK_II881.selectedIds=new Set([candidate.id]);
   renderIntelligentImport881();
 }catch(e){alert(e.message);}
}
async function restoreSelectedCandidate881(){
 const c=window.MK_II881.selected;if(!c){alert("Välj först en portfölj.");return;}
 const report=window.MKPortfolioImportValidator881.report(c.data);
 if(!report.valid){alert("Portföljen klarade inte valideringen.");return;}
 await window.MKPrivateVaultDB87.put(c.data,"portfolio");
 window.DATA=c.data;window.MK_VAULT_BOOT={status:"LOADED",source:c.name,data:c.data,report};
 localStorage.setItem("mk_vault_881_import_report",JSON.stringify({at:new Date().toISOString(),source:c.name,report}));
 window.MK_II881.report=report;
 renderAll();
 document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
 document.getElementById("portfolioIntelligence88")?.classList.add("active");
 renderPortfolioIntelligence88();
 alert(`Återställning klar: ${report.holdings} innehav sparades i Private Vault. Skapa nu en krypterad backup.`);
}
function renderIntelligentImport881(){
 const st=window.MK_II881,c=st.selected,report=c?window.MKPortfolioImportValidator881.report(c.data):null;
 const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
 set("ii881CandidateCount",st.candidates.length);
 set("ii881BestHoldings",st.candidates[0]?.holdings||0);
 set("ii881Duplicates",report?.duplicates?.length||0);
 set("ii881ImportStatus",st.report?"KLAR":c?"REDO":"VÄNTAR");
 const list=document.getElementById("ii881Candidates");
 if(list)list.innerHTML=st.candidates.length?st.candidates.map(x=>`<div class="ii881Candidate ${c?.id===x.id?"selected":""}" onclick="selectCandidate881('${x.id.replace(/'/g,"")}')"><input type="checkbox" ${st.selectedIds.has(x.id)?"checked":""} onclick="event.stopPropagation();toggleCandidate881('${x.id.replace(/'/g,"")}',this.checked)"><div><b>${x.name}</b><small>${x.source} · ${x.holdings} innehav · ${x.coverage.toFixed(0)} % datatäckning</small></div><strong>${x.score}</strong></div>`).join(""):ii881Row("Inga kandidater ännu","Starta sökningen eller välj en portföljfil.","");
 const preview=document.getElementById("ii881Preview");
 if(preview)preview.innerHTML=report?
   ii881Row("Källa",`${c.source} · ${c.name}`,c.score+" p")+
   ii881Row("Innehav","Förhandsgranskade lokalt",report.holdings)+
   ii881Row("Portföljvärde","Registrerat i kandidatens data",ii881Money(report.value))+
   ii881Row("Datatäckning","Namn, typ, valuta, land och sektor",report.coverage.toFixed(0)+"%")+
   ii881Row("Dubbletter",report.duplicates.join(", ")||"Inga",report.duplicates.length,report.duplicates.length?"GRANSKA":"OK",report.duplicates.length?"wait":"pass"):
   ii881Row("Ingen kandidat vald","Välj en hittad portfölj för förhandsvisning.","");
 const rep=document.getElementById("ii881Report");
 if(rep)rep.innerHTML=st.report?
   ii881Row("Import genomförd",`${st.report.holdings} innehav finns nu i Private Vault.`,"","KLAR","pass")+
   ii881Row("Nästa åtgärd","Skapa en krypterad .mkbackup för säkerhetskopiering.","","BACKUP","wait"):
   ii881Row("Ingen import genomförd","Kandidaten skrivs inte till Private Vault förrän du trycker Återställ.","","SÄKERT","pass");
}
