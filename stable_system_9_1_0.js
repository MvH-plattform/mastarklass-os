
function stable910Row(name,detail,status,cls){
  return `<div class="stable910Row"><div><b>${name}</b><small>${detail||""}</small></div><span class="${cls||"info"}">${status}</span></div>`;
}
function setupStableStatus910(){}
function openStableStatus910(){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  document.getElementById("stableStatus910")?.classList.add("active");
  document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
  renderStableStatus910();
  window.scrollTo({top:0,behavior:"smooth"});
}
function renderStableStatus910(){
  const root=document.getElementById("stableStatus910");
  if(!root)return;
  const data=window.DATA||{};
  const holdings=Array.isArray(data.holdings)?data.holdings:[];
  const tx=Array.isArray(data.transactions)?data.transactions:[];
  const checks=[];
  const add=(name,ok,detail)=>checks.push({name,ok,detail});

  add("Build-version",window.MK_BUILD_VERSION==="9.1.0-stable",window.MK_BUILD_VERSION||"saknas");
  add("Private Vault",!!window.MKPrivateVaultDB87,window.MK_VAULT_BOOT?.status||"tillgänglighet kontrollerad");
  add("Unified Data Provider",!!window.MKUnifiedData883,"gemensam lokal datakälla");
  add("Innehavsdata",holdings.length>0,`${holdings.length} lokala innehav`);
  add("Transaktionsmotor",!!window.MKTransactionEngine885,`${tx.length} registrerade transaktioner`);
  add("Backupmotor",!!window.MKAutomaticBackup885&&!!window.MKManualBackup885,"automatisk lokal och manuell krypterad backup");
  add("Portfolio Analytics",typeof window.renderUnifiedAnalytics883==="function","kopplad till gemensam data");
  add("Portfolio Brain",typeof window.renderUnifiedBrain883==="function","kopplad till gemensam analys");
  add("Investment Credit",!!window.MKCreditEngine901,"värdepapperskredit, inga övriga lån");
  add("Sandbox & Safety",!!window.MKSandbox89&&!!window.MKDataIntegrity89,"testläge och integritetskontroll");
  add("Extern bankkoppling",true,"avstängd enligt projektets säkerhetsprincip");

  const score=Math.round(checks.filter(x=>x.ok).length/checks.length*100);
  const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
  set("stable910Vault",window.MK_VAULT_BOOT?.status||"LOKAL");
  set("stable910Holdings",String(holdings.length));
  set("stable910Score",score+"/100");
  const box=document.getElementById("stable910Checks");
  if(box)box.innerHTML=checks.map(x=>stable910Row(x.name,x.detail,x.ok?"PASS":"KONTROLL",x.ok?"pass":"wait")).join("");
}
