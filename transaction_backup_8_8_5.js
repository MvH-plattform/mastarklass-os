
function tx885Tab(tab){
  document.querySelectorAll("[data-tx885tab]").forEach(b=>b.classList.toggle("active",b.dataset.tx885tab===tab));
  document.querySelectorAll("[id^='tx885-']").forEach(p=>{if(p.classList.contains("tx885Panel"))p.classList.toggle("active",p.id==="tx885-"+tab)});
}
function setupTransactionBackup885(){
  document.querySelectorAll("[data-tx885tab]").forEach(b=>{
    if(!b.dataset.bound){b.dataset.bound="1";b.onclick=()=>tx885Tab(b.dataset.tx885tab);}
  });
}
function openTransactionCenter885(){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  document.getElementById("transactionCenter885")?.classList.add("active");
  document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
  renderTransactionBackup885();window.scrollTo({top:0,behavior:"smooth"});
}
function tx885Money(v){return Math.round(Number(v)||0).toLocaleString("sv-SE")+" kr"}
function tx885Row(title,meta,right,badge,cls="info"){
  return `<div class="tx885Row"><div><div class="tx885Name">${title}</div><div class="tx885Meta">${meta||""}</div>${badge?`<span class="tx885Badge ${cls}">${badge}</span>`:""}</div><div class="tx885Right">${right||""}</div></div>`;
}
function tx885HoldingKey(h){return String(h.id||h.isin||h.ticker||h.name)}
function tx885Options(){
  const hs=DATA?.holdings||[],sel=document.getElementById("tx885Holding"),hist=document.getElementById("tx885HistoryHolding");
  const options=hs.slice().sort((a,b)=>String(a.name).localeCompare(String(b.name),"sv")).map(h=>`<option value="${tx885HoldingKey(h).replace(/"/g,"&quot;")}">${h.name} · ${h.platform||h.accountId||""}</option>`).join("");
  if(sel&&sel.dataset.count!=String(hs.length)){sel.innerHTML='<option value="">Välj innehav</option>'+options;sel.dataset.count=hs.length}
  if(hist&&hist.dataset.count!=String(hs.length)){hist.innerHTML='<option value="">Alla innehav</option>'+options;hist.dataset.count=hs.length}
  const accounts=[...new Set(hs.flatMap(h=>[h.accountId,h.platform]).filter(Boolean))].sort();
  const acc=document.getElementById("tx885Account");
  if(acc&&acc.dataset.count!=String(accounts.length)){acc.innerHTML=accounts.map(x=>`<option>${x}</option>`).join("");acc.dataset.count=accounts.length}
}
function updateTransactionForm885(){
  const type=document.getElementById("tx885Type")?.value;
  const dividend=type==="DIVIDEND";
  document.getElementById("tx885QuantityLabel").style.display=dividend?"none":"block";
  document.getElementById("tx885PriceLabel").style.display=dividend?"none":"block";
  document.getElementById("tx885DividendLabel").style.display=dividend?"block":"none";
  renderTransactionPreview885();
}
function transactionInput885(){
  return {
    type:document.getElementById("tx885Type")?.value,
    holdingId:document.getElementById("tx885Holding")?.value,
    date:document.getElementById("tx885Date")?.value,
    accountId:document.getElementById("tx885Account")?.value,
    quantity:document.getElementById("tx885Quantity")?.value,
    price:document.getElementById("tx885Price")?.value,
    currency:document.getElementById("tx885Currency")?.value,
    fx:document.getElementById("tx885Fx")?.value,
    fee:document.getElementById("tx885Fee")?.value,
    dividendSEK:document.getElementById("tx885Dividend")?.value,
    note:document.getElementById("tx885Note")?.value
  };
}
function renderTransactionPreview885(){
  const box=document.getElementById("tx885Preview");if(!box)return;
  try{
    const p=window.MKTransactionEngine885.preview(DATA,transactionInput885());
    box.innerHTML=p.type==="DIVIDEND"
      ? tx885Row("Förhandskontroll",`${p.holding.name} · utdelning`,tx885Money(p.cashSEK),"INGEN ANTALSFÖRÄNDRING","pass")
      : tx885Row("Antal",`${p.oldQty} → ${p.nextQty}`,"")+
        tx885Row("GAV",`${p.oldAvg||0} → ${p.nextAvg||0}`,"")+
        tx885Row("Kassaflöde",p.type==="BUY"?"Utbetalning":"Inbetalning",tx885Money(p.cashSEK));
  }catch(e){box.innerHTML='<div class="tx885Meta">Fyll i uppgifterna för att se kontrollen före sparning.</div>'}
}
async function saveTransaction885(){
  const result=document.getElementById("tx885Result");
  try{
    const input=transactionInput885();
    const applied=await window.MKTransactionEngine885.apply(DATA,input);
    DATA=applied.data;
    if(window.MKUnifiedData883)await window.MKUnifiedData883.adopt(DATA,{source:"transaction-8.8.5",persist:false});
    if(window.MKPrivateVault87)await window.MKPrivateVault87.saveNow(DATA);
    await window.MKAutomaticBackup885.afterChange(DATA,`${applied.transaction.type} · ${applied.transaction.holdingName}`);
    window.MKEventBus883?.emit("portfolio:changed",{source:"transaction-8.8.5"});
    if(typeof renderAll==="function")renderAll();
    if(result)result.textContent=`Sparat: ${applied.transaction.holdingName}. Nytt antal ${applied.transaction.after.quantity}; GAV ${applied.transaction.after.averageCost}.`;
    renderTransactionBackup885();
  }catch(e){if(result)result.textContent="Kunde inte spara: "+e.message}
}
async function deleteTransaction885(id){
  if(!confirm("Ta bort transaktionen och återställa innehavets tidigare antal och GAV?"))return;
  try{
    const tx=await window.MKTransactionEngine885.remove(DATA,id);
    if(window.MKPrivateVault87)await window.MKPrivateVault87.saveNow(DATA);
    await window.MKAutomaticBackup885.afterChange(DATA,`Transaktion borttagen · ${tx.holdingName}`);
    window.MKEventBus883?.emit("portfolio:changed",{source:"transaction-delete-8.8.5"});
    renderAll();renderTransactionBackup885();
  }catch(e){alert(e.message)}
}
function renderTransactionHistory885(){
  const box=document.getElementById("tx885History");if(!box)return;
  const key=document.getElementById("tx885HistoryHolding")?.value;
  const list=(DATA?.transactions||[]).filter(t=>!key||t.holdingId===key).slice().sort((a,b)=>String(b.date).localeCompare(String(a.date)));
  box.innerHTML=list.length?list.map(t=>{
    const type=t.type==="BUY"?"Köp":t.type==="SELL"?"Försäljning":"Utdelning";
    const detail=t.type==="DIVIDEND"?`${tx885Money(t.dividendSEK)}`:`${t.quantity} st × ${t.price} ${t.currency} · avgift ${tx885Money(t.feeSEK)}`;
    return `<div class="tx885Row"><div><div class="tx885Name">${type} · ${t.holdingName}</div><div class="tx885Meta">${t.date} · ${detail}<br>${t.note||""}</div></div><button class="tx885Delete" onclick="deleteTransaction885('${t.id}')">Ta bort</button></div>`;
  }).join(""):tx885Row("Ingen historik","Registrerade transaktioner visas här.","");
}
async function createVerifiedBackup885(){
  const out=document.getElementById("tx885BackupResult");
  try{
    const pass=document.getElementById("tx885Passphrase")?.value||"";
    const r=await window.MKManualBackup885.create(DATA,pass);
    if(out)out.textContent=`Backup verifierad och nedladdad: ${r.name}. ${r.summary.holdings} innehav och ${r.summary.transactions} transaktioner.`;
    renderTransactionBackup885();
  }catch(e){if(out)out.textContent="Backupfel: "+e.message}
}
async function restoreBackup885(file){
  const out=document.getElementById("tx885BackupResult");
  try{
    const pass=document.getElementById("tx885Passphrase")?.value||"";
    const r=await window.MKManualBackup885.restore(file,pass);
    DATA=r.data;window.MK_VAULT_BOOT={status:"LOADED",source:"8.8.5 BACKUP",data:DATA};
    if(window.MKUnifiedData883)await window.MKUnifiedData883.adopt(DATA,{source:"backup-restore-8.8.5",persist:false});
    window.MKEventBus883?.emit("portfolio:changed",{source:"backup-restore-8.8.5"});
    renderAll();
    if(out)out.textContent=`Återställning klar: ${r.summary.holdings} innehav och ${r.summary.transactions} transaktioner.`;
  }catch(e){if(out)out.textContent="Återställningsfel: "+e.message}
}
function renderTransactionBackup885(){
  if(!document.getElementById("transactionCenter885"))return;
  DATA.transactions=Array.isArray(DATA.transactions)?DATA.transactions:[];
  tx885Options();
  const date=document.getElementById("tx885Date");if(date&&!date.value)date.value=new Date().toISOString().slice(0,10);
  ["tx885Holding","tx885Quantity","tx885Price","tx885Fee","tx885Fx","tx885Dividend"].forEach(id=>{
    const e=document.getElementById(id);if(e&&!e.dataset.preview){e.dataset.preview="1";e.addEventListener("input",renderTransactionPreview885);e.addEventListener("change",renderTransactionPreview885)}
  });
  const meta=window.MKAutomaticBackup885.meta(),status=window.MKAutomaticBackup885.status();
  const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
  set("tx885Count",DATA.transactions.length);
  set("tx885Changes",meta.changesSinceManual||0);
  set("tx885AutoBackup",meta.lastAuto?new Date(meta.lastAuto).toLocaleDateString("sv-SE"):"—");
  set("tx885BackupStatus",status.label);
  const sum=document.getElementById("tx885BackupSummary");
  if(sum)sum.innerHTML=
    tx885Row("Status",status.message,"",status.label,status.level==="GREEN"?"pass":status.level==="YELLOW"?"wait":"block")+
    tx885Row("Senaste automatiska lokalbackup",meta.lastAuto?new Date(meta.lastAuto).toLocaleString("sv-SE"):"Ingen ännu","IndexedDB")+
    tx885Row("Senaste manuella backup",meta.lastManual?new Date(meta.lastManual).toLocaleString("sv-SE"):"Ingen ännu","")+
    tx885Row("Innehåll",`${DATA.holdings?.length||0} innehav · ${DATA.transactions.length} transaktioner`,"");
  const history=document.getElementById("tx885BackupHistory");
  const bh=window.MKAutomaticBackup885.history();
  if(history)history.innerHTML=bh.length?bh.map(x=>tx885Row(new Date(x.at).toLocaleString("sv-SE"),x.detail,"",x.type,x.type.includes("MANUELL")?"pass":"info")).join(""):tx885Row("Ingen backuphistorik","Den skapas vid första portföljändringen eller manuella backupen.","");
  const health=document.getElementById("tx885Health");
  if(health)health.innerHTML=
    tx885Row("Private Vault",window.MKPrivateVaultDB87?"IndexedDB tillgängligt":"Saknas","",window.MKPrivateVaultDB87?"PASS":"FEL",window.MKPrivateVaultDB87?"pass":"block")+
    tx885Row("Kryptering",crypto?.subtle?"Web Crypto API tillgängligt":"Saknas","AES-GCM 256",crypto?.subtle?"PASS":"FEL",crypto?.subtle?"pass":"block")+
    tx885Row("Innehav",`${DATA.holdings?.length||0} lokalt lagrade`,"",DATA.holdings?.length?"PASS":"VÄNTAR",DATA.holdings?.length?"pass":"wait")+
    tx885Row("Transaktionshistorik",`${DATA.transactions.length} transaktioner`,"","AKTIV","pass")+
    tx885Row("Extern överföring","Ingen automatisk molnöverföring sker.","","LOKAL","pass");
  renderTransactionHistory885();updateTransactionForm885();
}
