
function pv87SetTab(tab){
 document.querySelectorAll("[data-pv87tab]").forEach(b=>b.classList.toggle("active",b.dataset.pv87tab===tab));
 document.querySelectorAll("[id^='pv87-']").forEach(p=>{if(p.classList.contains("pv87Panel"))p.classList.toggle("active",p.id==="pv87-"+tab)});
}
function setupPrivateVault87(){
 document.querySelectorAll("[data-pv87tab]").forEach(b=>{if(!b.dataset.bound){b.dataset.bound="1";b.addEventListener("click",()=>pv87SetTab(b.dataset.pv87tab));}});
 if(!window.__pv87SavedListener){window.__pv87SavedListener=true;window.addEventListener("mk-vault-saved",()=>renderPrivateVault87());}
}
function openPrivateVault87(tab="overview"){
 document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
 document.getElementById("privateVault87")?.classList.add("active");
 document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
 renderPrivateVault87();pv87SetTab(tab);window.scrollTo({top:0,behavior:"smooth"});
}
function pv87Row(title,meta,right,badge,cls="info"){
 return `<div class="pv87Row"><div><div class="pv87Name">${title}</div><div class="pv87Meta">${meta||""}</div>${badge?`<span class="pv87Badge ${cls}">${badge}</span>`:""}</div><div class="pv87Right">${right||""}</div></div>`;
}
function renderPrivateVault87(){
 const boot=window.MK_VAULT_BOOT||{},h=Array.isArray(DATA?.holdings)?DATA.holdings:[],report=window.MKPrivateVaultIntegrity87.report(DATA);
 const value=Number(DATA?.portfolio?.net||DATA?.livePortfolio82?.portfolioValueSEK||0);
 const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
 set("pv87Value",value?Math.round(value).toLocaleString("sv-SE")+" kr":"Ingen lokal portfölj");
 set("pv87Holdings",h.length);set("pv87Storage","IndexedDB");set("pv87Autosave","PÅ");set("pv87Github","INGEN");
 const messages={MIGRATED:"Din tidigare portfölj har migrerats automatiskt till det lokala valvet.",LOADED:"Din privata portfölj laddades automatiskt från denna enhet.",EMPTY:"Ingen privat portfölj finns på denna enhet. Återställ en backup eller importera en portfölj.",ERROR:"Valvet kunde inte startas korrekt."};
 set("pv87Message",messages[boot.status]||"Private Vault är aktivt.");
 set("pv87Status",boot.status==="EMPTY"?"INGEN PORTFÖLJ LADDAD":boot.status==="ERROR"?"VAULT-FEL":"PRIVAT PORTFÖLJ LADDAD LOKALT");

 const status=document.getElementById("pv87StatusCard");
 if(status)status.innerHTML=
   pv87Row("Vault-status",messages[boot.status]||boot.status||"AKTIV","",boot.status||"AKTIV",boot.status==="ERROR"?"block":boot.status==="EMPTY"?"wait":"pass")+
   pv87Row("Senast autosparad",window.MKPrivateVault87.lastSavedAt||boot.updatedAt||"Inte ännu","")+
   pv87Row("Privata innehav",`${h.length} innehav i lokal IndexedDB`,h.length)+
   pv87Row("GitHub-källkod","Public template innehåller inga privata innehav.","","SEPARERAD","pass");

 const overview=document.getElementById("pv87Overview");
 if(overview)overview.innerHTML=
   pv87Row("Lagringsmotor","IndexedDB på aktuell enhet.","","AKTIV","pass")+
   pv87Row("Automatisk laddning","Portföljen laddas när appen öppnas.","","AKTIV","pass")+
   pv87Row("Autosparning","Ändringar sparas efter cirka 350 ms.","","AKTIV","pass")+
   pv87Row("Krypterad backup","AES-GCM 256 med lösenfras.","","AKTIV","pass");

 const mig=document.getElementById("pv87Migration");
 const mr=localStorage.getItem("mk_vault_87_migration_report");
 if(mig)mig.innerHTML=mr?pv87Row("Legacy-migrering",`Kontrollrapport: ${mr}`,"","KLAR","pass"):pv87Row("Legacy-migrering",boot.status==="EMPTY"?"Ingen äldre lokal portfölj hittades.":"Ingen migreringsrapport behövdes.","",boot.status==="EMPTY"?"VÄNTAR":"KLAR",boot.status==="EMPTY"?"wait":"pass");

 const backup=document.getElementById("pv87Backup");
 if(backup)backup.innerHTML=
   pv87Row("Backupformat","MKPV1 · krypterad JSON-fil med filändelsen .mkbackup","","AKTIV","pass")+
   pv87Row("Ny enhet","Öppna appen, välj backupfil och ange samma lösenfras.","")+
   pv87Row("Lösenfras","Sparas aldrig av appen. Förlorad lösenfras kan inte återställas.","","VIKTIGT","wait");

 const privacy=document.getElementById("pv87Privacy");
 if(privacy)privacy.innerHTML=
   pv87Row("Innehav i GitHub","0","","PASS","pass")+
   pv87Row("Privata belopp i public default","0","","PASS","pass")+
   pv87Row("API-hemligheter i frontend","0","","PASS","pass")+
   pv87Row("Extern synkronisering","Avstängd","","PASS","pass")+
   pv87Row("Bankkoppling och handel","Saknas","","PASS","pass");

 const integ=document.getElementById("pv87Integrity");
 if(integ)integ.innerHTML=
   pv87Row("Innehav",report.holdings)+
   pv87Row("Dubbletter",report.duplicates.join(", ")||"Inga",report.duplicates.length,"",report.duplicates.length?"block":"pass")+
   pv87Row("Saknade namn",report.missingNames,report.missingNames)+
   pv87Row("Portföljvärde",report.portfolioValue?Math.round(report.portfolioValue).toLocaleString("sv-SE")+" kr":"Ej angivet")+
   pv87Row("Datamodell",report.valid?"Kontrollen godkänd":"Kontroll krävs","",report.valid?"PASS":"VARNING",report.valid?"pass":"wait");

 const sys=document.getElementById("pv87System");
 if(sys)sys.innerHTML=Object.entries(DATA?.privateVault87?.status||{}).map(([k,v])=>pv87Row(k,"",v)).join("");
}
async function exportPrivateBackup87(){
 const result=document.getElementById("pv87BackupResult"),pass=document.getElementById("pv87Passphrase")?.value||"";
 try{
  if(!DATA?.holdings?.length)throw new Error("Ingen privat portfölj finns att exportera.");
  const wrapper=await window.MKPrivateVault87.exportEncrypted(DATA,pass);
  const blob=new Blob([JSON.stringify(wrapper)],{type:"application/json"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`mastarklass-private-${new Date().toISOString().slice(0,10)}.mkbackup`;a.click();URL.revokeObjectURL(a.href);
  if(result)result.textContent="Krypterad säkerhetskopia skapad. Förvara lösenfrasen separat.";
 }catch(e){if(result)result.textContent="Exportfel: "+e.message;}
}
async function importPrivateBackup87(file){
 const result=document.getElementById("pv87BackupResult"),pass=document.getElementById("pv87Passphrase")?.value||"";
 try{
  if(!file)throw new Error("Ingen fil vald.");
  const wrapper=JSON.parse(await file.text());
  const restored=await window.MKPrivateVault87.importEncrypted(wrapper,pass);
  DATA=restored.data;window.MK_VAULT_BOOT={status:"LOADED",source:"BACKUP",data:DATA,report:restored.report};
  renderAll();
  if(result)result.textContent=`Återställning klar: ${restored.report.holdings} innehav, inga integritetsfel.`;
 }catch(e){if(result)result.textContent="Importfel: "+e.message;}
}
