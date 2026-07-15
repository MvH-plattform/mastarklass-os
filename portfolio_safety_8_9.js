
function ps89SetTab(tab){
  document.querySelectorAll("[data-ps89tab]").forEach(b=>b.classList.toggle("active",b.dataset.ps89tab===tab));
  document.querySelectorAll("[id^='ps89-']").forEach(p=>{if(p.classList.contains("ps89Panel"))p.classList.toggle("active",p.id==="ps89-"+tab)});
  if(tab==="history")renderSmartHistory89();
}
function setupPortfolioSafety89(){
  document.querySelectorAll("[data-ps89tab]").forEach(b=>{
    if(!b.dataset.bound){b.dataset.bound="1";b.onclick=()=>ps89SetTab(b.dataset.ps89tab)}
  });
}
function openPortfolioSafety89(){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  document.getElementById("portfolioSafety89")?.classList.add("active");
  document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
  renderPortfolioSafety89();window.scrollTo({top:0,behavior:"smooth"});
}
function ps89Money(v){return Math.round(Number(v)||0).toLocaleString("sv-SE")+" kr"}
function ps89Row(title,meta,right,badge,cls="info"){
  return `<div class="ps89Row"><div><div class="ps89Name">${title}</div><div class="ps89Meta">${meta||""}</div>${badge?`<span class="ps89Badge ${cls}">${badge}</span>`:""}</div><div class="ps89Right">${right||""}</div></div>`;
}
function ps89Input(){
  return {
    type:document.getElementById("ps89Type")?.value||"BUY",
    holdingId:document.getElementById("ps89Holding")?.value||"",
    quantity:document.getElementById("ps89Quantity")?.value,
    price:document.getElementById("ps89Price")?.value,
    currency:document.getElementById("ps89Currency")?.value||"SEK",
    fx:document.getElementById("ps89Fx")?.value||1,
    fee:document.getElementById("ps89Fee")?.value||0
  };
}
function updateSandbox89(){
  const box=document.getElementById("ps89SandboxPreview");
  try{
    const r=window.MKSandbox89.run(DATA,ps89Input());
    if(box)box.innerHTML=
      ps89Row("Antal",`${r.before.quantity} → ${r.after.quantity}`,r.delta.quantity>0?`+${r.delta.quantity}`:String(r.delta.quantity))+
      ps89Row("Innehavsvikt",`${r.before.weight.toFixed(2)} % → ${r.after.weight.toFixed(2)} %`,`${r.delta.weight>=0?"+":""}${r.delta.weight.toFixed(2)} pp`)+
      ps89Row("Portfolio IQ",`${r.before.iq}/100 → ${r.after.iq}/100`,`${r.delta.iq>=0?"+":""}${r.delta.iq}`)+
      ps89Row("Portföljvärde",`${ps89Money(r.before.total)} → ${ps89Money(r.after.total)}`,ps89Money(r.delta.total));
    renderImpact89(r);renderCoach89();
  }catch(e){
    window.MKSandbox89.clear();
    if(box)box.innerHTML='<div class="ps89Meta">Välj innehav och fyll i antal samt pris för att se effekten.</div>';
    renderImpact89(null);renderCoach89();
  }
}
function clearSandbox89(){
  ["ps89Quantity","ps89Price"].forEach(id=>{const e=document.getElementById(id);if(e)e.value=""});
  window.MKSandbox89.clear();updateSandbox89();
}
function convertSandboxToReal89(){
  const r=window.MKSandbox89.get();
  if(!r){alert("Skapa först ett giltigt sandboxscenario.");return}
  openTransactionCenter885();
  setTimeout(()=>{
    const map={tx885Type:r.input.type,tx885Holding:r.input.holdingId,tx885Quantity:r.input.quantity,tx885Price:r.input.price,tx885Currency:r.input.currency,tx885Fx:r.input.fx,tx885Fee:r.input.fee};
    Object.entries(map).forEach(([id,v])=>{const e=document.getElementById(id);if(e)e.value=v});
    tx885Tab("register");updateTransactionForm885();renderTransactionPreview885();
  },100);
}
function renderImpact89(r){
  const box=document.getElementById("ps89Impact");if(!box)return;
  if(!r){box.innerHTML=ps89Row("Ingen simulering","Skapa ett sandboxscenario för att se portföljpåverkan.","");return}
  const secBefore=r.sectorsBefore.find(x=>x.name===r.holding.sector),secAfter=r.sectorsAfter.find(x=>x.name===r.holding.sector);
  const curBefore=r.currenciesBefore.find(x=>x.name===r.holding.currency),curAfter=r.currenciesAfter.find(x=>x.name===r.holding.currency);
  box.innerHTML=
    ps89Row("Portfolio IQ",`${r.before.iq}/100 → ${r.after.iq}/100`,`${r.delta.iq>=0?"+":""}${r.delta.iq}`,r.delta.iq>0?"FÖRBÄTTRAS":r.delta.iq<0?"FÖRSÄMRAS":"OFÖRÄNDRAD",r.delta.iq>0?"pass":r.delta.iq<0?"block":"info")+
    ps89Row("Innehavsvikt",`${r.before.weight.toFixed(2)} % → ${r.after.weight.toFixed(2)} %`,`${r.delta.weight>=0?"+":""}${r.delta.weight.toFixed(2)} pp`)+
    ps89Row("Sektorexponering",`${secBefore?.weight?.toFixed(2)||"0"} % → ${secAfter?.weight?.toFixed(2)||"0"} %`,r.holding.sector||"Okänd sektor")+
    ps89Row("Valutaexponering",`${curBefore?.weight?.toFixed(2)||"0"} % → ${curAfter?.weight?.toFixed(2)||"0"} %`,r.holding.currency||"Okänd valuta")+
    ps89Row("Totalt portföljvärde",`${ps89Money(r.before.total)} → ${ps89Money(r.after.total)}`,ps89Money(r.delta.total));
}
function renderSmartHistory89(){
  const box=document.getElementById("ps89History");if(!box)return;
  const q=(document.getElementById("ps89HistorySearch")?.value||"").toLowerCase();
  const type=document.getElementById("ps89HistoryType")?.value||"";
  const account=document.getElementById("ps89HistoryAccount")?.value||"";
  const list=(DATA?.transactions||[]).filter(t=>
    (!q||`${t.holdingName} ${t.note}`.toLowerCase().includes(q))&&
    (!type||t.type===type)&&(!account||t.accountId===account)
  ).slice().sort((a,b)=>String(b.date).localeCompare(String(a.date)));
  box.innerHTML=list.length?list.map(t=>ps89Row(
    `${t.type==="BUY"?"Köp":t.type==="SELL"?"Försäljning":"Utdelning"} · ${t.holdingName}`,
    `${t.date} · ${t.accountId||"Okänt konto"}<br>${t.type==="DIVIDEND"?ps89Money(t.dividendSEK):`${t.quantity} st × ${t.price} ${t.currency}`}<br>${t.note||""}`,
    t.type==="DIVIDEND"?ps89Money(t.dividendSEK):ps89Money(t.cashFlowSEK)
  )).join(""):ps89Row("Ingen historik matchar","Ändra filter eller registrera en verklig transaktion.","");
}
function renderCoach89(){
  const box=document.getElementById("ps89Coach");if(!box)return;
  const items=window.MKDecisionCoach89.advise(DATA,window.MKSandbox89.get());
  box.innerHTML=items.map(x=>ps89Row(x.title,x.detail,"",x.level,x.level==="POSITIVE"?"pass":x.level==="WARNING"?"wait":"info")).join("");
}
function renderPortfolioSafety89(){
  if(!document.getElementById("portfolioSafety89"))return;
  const hs=DATA?.holdings||[];
  const hold=document.getElementById("ps89Holding");
  if(hold&&hold.dataset.count!==String(hs.length)){
    hold.innerHTML='<option value="">Välj innehav</option>'+hs.slice().sort((a,b)=>String(a.name).localeCompare(String(b.name),"sv")).map(h=>`<option value="${window.MKPortfolioImpact89.key(h).replace(/"/g,"&quot;")}">${h.name} · ${h.platform||h.accountId||""}</option>`).join("");
    hold.dataset.count=hs.length;
  }
  const accounts=[...new Set((DATA?.transactions||[]).map(t=>t.accountId).filter(Boolean))].sort();
  const acc=document.getElementById("ps89HistoryAccount");
  if(acc&&acc.dataset.count!==String(accounts.length)){
    acc.innerHTML='<option value="">Alla konton</option>'+accounts.map(a=>`<option>${a}</option>`).join("");acc.dataset.count=accounts.length;
  }
  const backup=window.MKBackupIntelligence89.analyze(DATA),integrity=window.MKDataIntegrity89.check(DATA),iq=window.MKPortfolioImpact89.iq(hs);
  const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
  set("ps89CurrentIQ",iq+"/100");set("ps89BackupStatus",backup.label);set("ps89IntegrityStatus",integrity.score+"/100");
  const backupBox=document.getElementById("ps89Backup");
  if(backupBox)backupBox.innerHTML=
    ps89Row("Status",backup.message,"",backup.label,backup.level==="GREEN"?"pass":backup.level==="YELLOW"?"wait":"block")+
    ps89Row("Senaste manuell backup",backup.lastManual?new Date(backup.lastManual).toLocaleString("sv-SE"):"Ingen ännu","")+
    ps89Row("Ändringar sedan backup",`${backup.changes} registrerade förändringar`,backup.changes)+
    ps89Row("Backupinnehåll",`${backup.holdings} innehav · ${backup.transactions} transaktioner`,"");
  const integrityBox=document.getElementById("ps89Integrity");
  if(integrityBox)integrityBox.innerHTML=
    `<div class="ps89Score">${integrity.score}/100</div>`+
    integrity.checks.map(x=>ps89Row(x.name,x.detail,"",x.status,x.status==="PASS"?"pass":"block")).join("");
  const timeline=document.getElementById("ps89Timeline");
  const snaps=window.MKPortfolioSnapshot88?.load?.().slice().reverse()||[];
  if(timeline)timeline.innerHTML=snaps.length?snaps.map(s=>ps89Row(new Date(s.at).toLocaleString("sv-SE"),`${s.holdings} innehav · IQ/Health ${s.health}/100`,ps89Money(s.value))).join(""):ps89Row("Ingen tidslinje ännu","Lokala snapshots skapas när portföljen analyseras.","");
  renderSmartHistory89();renderCoach89();updateSandbox89();
}
