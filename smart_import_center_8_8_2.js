
window.MK_SMART_IMPORT_882 = window.MK_SMART_IMPORT_882 || {history:[]};

function si882LoadHistory(){
  try{return JSON.parse(localStorage.getItem("mk_smart_import_history_882")||"[]");}
  catch(e){return [];}
}
function si882SaveHistory(list){
  localStorage.setItem("mk_smart_import_history_882", JSON.stringify(list.slice(-100)));
}
function si882AddHistory(type, detail){
  const list=si882LoadHistory();
  list.push({at:new Date().toISOString(), type, detail});
  si882SaveHistory(list);
  renderSmartImportCenter882();
}
function setupSmartImportCenter882(){
  if(window.__si882Bound)return;
  window.__si882Bound=true;
}
function openSmartImportCenter882(){
  if(typeof openIntelligentImport881==="function")openIntelligentImport881();
  setTimeout(()=>{window.scrollTo({top:0,behavior:"smooth"});renderSmartImportCenter882();},50);
}
function si882Download(name,content,type){
  const blob=new Blob([content],{type:type||"application/octet-stream"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),500);
}
function exportPortfolioJSON882(){
  const h=Array.isArray(window.DATA?.holdings)?window.DATA.holdings:[];
  if(!h.length){alert("Ingen lokal portfölj finns att exportera.");return;}
  const payload={
    format:"mastarklass-portfolio-json",
    version:"8.8.2",
    exportedAt:new Date().toISOString(),
    data:window.DATA
  };
  si882Download(`mastarklass-portfolio-${new Date().toISOString().slice(0,10)}.json`,JSON.stringify(payload,null,2),"application/json");
  si882AddHistory("Export JSON",`${h.length} innehav exporterades.`);
}
function si882CsvCell(v){
  const s=String(v??"");
  return /[",\n]/.test(s)?`"${s.replace(/"/g,'""')}"`:s;
}
function exportPortfolioCSV882(){
  const h=Array.isArray(window.DATA?.holdings)?window.DATA.holdings:[];
  if(!h.length){alert("Ingen lokal portfölj finns att exportera.");return;}
  const cols=["name","ticker","isin","platform","accountId","type","quantity","averageCost","currency","costValueSEK","marketValueSEK","country","sector","notes"];
  const rows=[cols.join(","),...h.map(x=>cols.map(c=>si882CsvCell(x?.[c])).join(","))];
  si882Download(`mastarklass-portfolio-${new Date().toISOString().slice(0,10)}.csv`,rows.join("\n"),"text/csv;charset=utf-8");
  si882AddHistory("Export CSV",`${h.length} innehav exporterades.`);
}
function renderSmartImportCenter882(){
  const historyBox=document.getElementById("si882History");
  const reportBox=document.getElementById("si882DataReport");
  if(historyBox){
    const list=si882LoadHistory().slice().reverse();
    historyBox.innerHTML=list.length
      ? list.map(x=>ii881Row(new Date(x.at).toLocaleString("sv-SE"),x.detail,"",x.type,"pass")).join("")
      : ii881Row("Ingen historik ännu","Smart Scan, import, återställning och export loggas lokalt här.","");
  }
  if(reportBox){
    const h=Array.isArray(window.DATA?.holdings)?window.DATA.holdings:[];
    const report=window.MKPortfolioImportValidator881?.report(window.DATA||{})||{holdings:0,duplicates:[],missingNames:0,value:0,coverage:0,valid:false};
    const vaultStatus=window.MK_VAULT_BOOT?.status||"EJ LADDAD";
    reportBox.innerHTML=
      ii881Row("Lokala innehav","Data i aktuell session",String(report.holdings),report.holdings?"OK":"VÄNTAR",report.holdings?"pass":"wait")+
      ii881Row("Datatäckning","Namn, typ, valuta, land och sektor",`${Number(report.coverage||0).toFixed(0)}%`) +
      ii881Row("Dubbletter",report.duplicates?.join(", ")||"Inga",String(report.duplicates?.length||0),report.duplicates?.length?"GRANSKA":"OK",report.duplicates?.length?"wait":"pass")+
      ii881Row("Saknade namn","Ogiltiga poster",String(report.missingNames||0),report.missingNames?"FEL":"OK",report.missingNames?"block":"pass")+
      ii881Row("Private Vault",`Status: ${vaultStatus}`,"IndexedDB",report.holdings?"AKTIV":"VÄNTAR",report.holdings?"pass":"wait")+
      ii881Row("Extern data","Påverkar inte importen","AV","LOKAL","pass");
  }
}

/* Logga befintliga 8.8.1-flöden utan att ändra deras funktion. */
(function(){
  const wrap=(name,type,detailFn)=>{
    const old=window[name];
    if(typeof old!=="function"||old.__si882Wrapped)return;
    const fn=async function(...args){
      const result=await old.apply(this,args);
      try{si882AddHistory(type,detailFn?detailFn(...args):type);}catch(e){}
      return result;
    };
    fn.__si882Wrapped=true;
    window[name]=fn;
  };
  setTimeout(()=>{
    wrap("scanAllPortfolioSources881","Smart Scan",()=>`${window.MK_II881?.candidates?.length||0} kandidater hittades.`);
    wrap("mergeSelectedCandidates881","Merge",()=>`${window.MK_II881?.selectedIds?.size||0} kandidater behandlades.`);
    wrap("restoreSelectedCandidate881","Återställning",()=>`${window.MK_II881?.selected?.holdings||0} innehav återställdes till Private Vault.`);
    wrap("loadPortfolioFile881","Filimport",(file)=>file?`${file.name} lästes in.`:"Filimport startades.");
  },800);
})();
