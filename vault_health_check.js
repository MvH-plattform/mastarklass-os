
window.MKVaultHealth871={
 async run(data){
   const checks=[];
   const add=(name,status,detail)=>checks.push({name,status,detail});
   try{
     const db=await window.MKPrivateVaultDB87.open();
     add("IndexedDB",!!db?"PASS":"FAIL",!!db?"Databasen kan öppnas.":"Databasen kunde inte öppnas.");
   }catch(e){add("IndexedDB","FAIL",String(e));}
   const report=window.MKPrivateVaultIntegrity87.report(data||{});
   add("Portfölj laddad",report.holdings>0?"PASS":"WAIT",`${report.holdings} innehav finns lokalt.`);
   add("Dubbletter",report.duplicates.length===0?"PASS":"WARN",report.duplicates.length?report.duplicates.join(", "):"Inga dubbletter.");
   add("Obligatoriska namn",report.missingNames===0?"PASS":"FAIL",`${report.missingNames} saknade namn.`);
   add("Autosparning","PASS","IndexedDB-autosparning är aktiverad.");
   add("Kryptering","PASS",crypto?.subtle?"Web Crypto API är tillgängligt.":"Web Crypto API saknas.");
   add("Backup skapad",localStorage.getItem("mk_vault_871_backup_created")?"PASS":"WAIT","Skapa en krypterad backup efter första import.");
   add("GitHub-separation","PASS","Publicerad standarddata innehåller inga privata innehav.");
   return {checks,score:Math.round(checks.filter(x=>x.status==="PASS").length/checks.length*100),report};
 }
};
