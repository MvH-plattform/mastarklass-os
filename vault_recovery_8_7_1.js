
window.MK_VAULT_HEALTH_871=null;
function setupVaultRecovery871(){
 if(!window.__vault871Setup){
   window.__vault871Setup=true;
   setTimeout(async()=>{window.MK_VAULT_HEALTH_871=await window.MKVaultHealth871.run(window.DATA);renderVaultRecovery871();},250);
 }
}
function renderVaultRecovery871(){
 const box=document.getElementById("pv871Health");
 if(box&&window.MK_VAULT_HEALTH_871){
   const h=window.MK_VAULT_HEALTH_871;
   box.innerHTML=`<div class="pv871Score">${h.score}/100</div>`+h.checks.map(x=>pv87Row(x.name,x.detail,"",x.status,x.status==="PASS"?"pass":x.status==="FAIL"?"block":"wait")).join("");
 }
}
async function runDeepRecovery871(){
 const el=document.getElementById("pv871RecoveryResult");
 try{
   if(el)el.textContent="Söker igenom all lokal lagring…";
   const r=await window.MKVaultRecovery871.recover();
   if(r.status==="NOT_FOUND"){
     if(el)el.textContent="Ingen äldre lokal portfölj hittades. Importera CSV eller JSON från din enhet.";
     return;
   }
   window.DATA=r.data;window.MK_VAULT_BOOT={status:"MIGRATED",source:r.sourceKey,data:r.data,report:r.report};
   renderAll();
   if(el)el.textContent=`Återställd från ${r.sourceKey}: ${r.report.holdings} innehav.`;
 }catch(e){if(el)el.textContent="Återställningsfel: "+e.message;}
}
async function importPortfolioFile871(file){
 const el=document.getElementById("pv871RecoveryResult");
 try{
   if(el)el.textContent="Läser och validerar portföljfilen…";
   const r=await window.MKPortfolioFileImporter871.importFile(file,window.DATA);
   window.DATA=r.data;window.MK_VAULT_BOOT={status:"LOADED",source:"FILE_IMPORT",data:r.data,report:r.report};
   window.MK_VAULT_HEALTH_871=await window.MKVaultHealth871.run(window.DATA);
   renderAll();
   if(el)el.textContent=`Import klar: ${r.report.holdings} innehav från ${r.fileName}. Skapa nu en krypterad backup.`;
 }catch(e){if(el)el.textContent="Importfel: "+e.message;}
}
const _pv871OldExport=window.exportPrivateBackup87;
window.exportPrivateBackup87=async function(){
 await _pv871OldExport();
 localStorage.setItem("mk_vault_871_backup_created",new Date().toISOString());
 window.MK_VAULT_HEALTH_871=await window.MKVaultHealth871.run(window.DATA);
 renderVaultRecovery871();
};
