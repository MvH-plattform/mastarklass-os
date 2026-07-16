
(function(){
  const n=v=>{const x=Number(String(v??"").replace(",","."));return Number.isFinite(x)?x:0};
  const money=v=>Math.round(n(v)).toLocaleString("sv-SE")+" kr";
  const uuid=()=>crypto.randomUUID?.()||`ledger930-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const hid=h=>String(h?.id||h?.isin||h?.ticker||h?.name||"");
  const value=h=>n(h?.marketValueSEK||h?.marketValue||h?.currentValue||h?.costValueSEK);

  function ensure(data){
    data.portfolioLedger930=data.portfolioLedger930||{};
    const l=data.portfolioLedger930;
    l.version="9.3.0";
    l.entries=Array.isArray(l.entries)?l.entries:[];
    l.flows=Array.isArray(l.flows)?l.flows:[];
    l.snapshots=Array.isArray(l.snapshots)?l.snapshots:[];
    l.migrations=l.migrations||{};
    migrate920(data,l);
    return l;
  }

  function migrate920(data,l){
    if(l.migrations.tx920)return;
    const source=data.transactionIntelligence920?.ledger||[];
    source.forEach(t=>{
      if(l.entries.some(e=>e.sourceId===t.id))return;
      l.entries.push({
        id:uuid(),sourceId:t.id,source:"transaction-intelligence-9.2",
        date:t.date||String(t.createdAt||"").slice(0,10),
        createdAt:t.createdAt||new Date().toISOString(),
        type:t.type,holdingId:t.holdingId||"",holdingName:t.holdingName||"",
        account:t.account||"",quantity:n(t.quantity),price:n(t.price),
        currency:t.currency||"SEK",fxRate:n(t.fxRate)||1,feeSEK:n(t.feeSEK),
        grossSEK:n(t.grossSEK),netSEK:n(t.netSEK),realizedResultSEK:n(t.realizedResultSEK),
        cashDeltaSEK:n(t.cashDeltaSEK),creditDeltaSEK:n(t.creditDeltaSEK),
        withdrawnSEK:n(t.withdrawnSEK),destination:t.destination||"",
        before:t.before||{},after:t.after||{},note:t.note||""
      });
    });
    l.migrations.tx920=true;
  }

  function addFlow(data,input){
    const l=ensure(data);
    const amount=Math.abs(n(input.amount));
    if(amount<=0)throw new Error("Beloppet måste vara större än noll.");
    if(!input.date)throw new Error("Välj datum.");
    if(input.type==="TRANSFER"&&(!input.from||!input.to))throw new Error("Ange både från- och tillkonto.");
    if(input.type==="DEPOSIT"&&!input.to)throw new Error("Ange vilket investeringskonto pengarna sätts in på.");
    if(input.type==="WITHDRAWAL"&&!input.from)throw new Error("Ange vilket investeringskonto pengarna tas ut från.");
    const sign=input.type==="DEPOSIT"?amount:input.type==="WITHDRAWAL"?-amount:0;
    const flow={id:uuid(),createdAt:new Date().toISOString(),date:input.date,type:input.type,
      amountSEK:amount,netContributionSEK:sign,from:input.from||"",to:input.to||"",note:input.note||""};
    l.flows.push(flow);
    l.entries.push({
      id:uuid(),sourceId:flow.id,source:"portfolio-ledger-9.3",date:flow.date,createdAt:flow.createdAt,
      type:"FLOW",flowType:flow.type,holdingId:"",holdingName:"Kapitalflöde",
      account:flow.type==="DEPOSIT"?flow.to:flow.type==="WITHDRAWAL"?flow.from:`${flow.from} → ${flow.to}`,
      netSEK:flow.netContributionSEK,amountSEK:flow.amountSEK,from:flow.from,to:flow.to,note:flow.note
    });
    return flow;
  }

  function summaries(data){
    const l=ensure(data), entries=l.entries;
    const realized=entries.reduce((s,e)=>s+n(e.realizedResultSEK),0);
    const dividends=entries.filter(e=>e.type==="DIVIDEND").reduce((s,e)=>s+n(e.netSEK),0);
    const netFlows=l.flows.reduce((s,f)=>s+n(f.netContributionSEK),0);
    const buys=entries.filter(e=>e.type==="BUY").reduce((s,e)=>s+Math.abs(n(e.netSEK)),0);
    const sells=entries.filter(e=>e.type==="SELL").reduce((s,e)=>s+n(e.netSEK),0);
    return {count:entries.length,realized,dividends,netFlows,buys,sells};
  }

  function holdingRows(data){
    const l=ensure(data), map=new Map();
    (data.holdings||[]).forEach(h=>{
      map.set(hid(h),{
        id:hid(h),name:h.name||"Okänt innehav",account:h.platform||h.account||"",
        quantity:n(h.quantity),averageCost:n(h.averageCost),marketValueSEK:value(h),
        buys:0,sells:0,dividends:0,realized:0,trades:0
      });
    });
    l.entries.forEach(e=>{
      if(!e.holdingId)return;
      if(!map.has(e.holdingId))map.set(e.holdingId,{id:e.holdingId,name:e.holdingName||"Historiskt innehav",account:e.account||"",quantity:0,averageCost:0,marketValueSEK:0,buys:0,sells:0,dividends:0,realized:0,trades:0});
      const r=map.get(e.holdingId);r.trades++;
      if(e.type==="BUY")r.buys+=Math.abs(n(e.netSEK));
      if(e.type==="SELL"){r.sells+=n(e.netSEK);r.realized+=n(e.realizedResultSEK)}
      if(e.type==="DIVIDEND")r.dividends+=n(e.netSEK);
    });
    return [...map.values()].sort((a,b)=>b.marketValueSEK-a.marketValueSEK);
  }

  function integrity(data){
    const l=ensure(data), issues=[];
    const duplicateIds=l.entries.filter((e,i,a)=>a.findIndex(x=>x.id===e.id)!==i);
    if(duplicateIds.length)issues.push(`${duplicateIds.length} dubbla ledger-id:n.`);
    const missingDate=l.entries.filter(e=>!e.date);
    if(missingDate.length)issues.push(`${missingDate.length} poster saknar datum.`);
    const missingAccount=l.entries.filter(e=>["BUY","SELL","DIVIDEND","FLOW"].includes(e.type)&&!e.account);
    if(missingAccount.length)issues.push(`${missingAccount.length} poster saknar konto.`);
    const invalidType=l.entries.filter(e=>!["BUY","SELL","DIVIDEND","CASH_ADJUSTMENT","FLOW"].includes(e.type));
    if(invalidType.length)issues.push(`${invalidType.length} poster har okänd typ.`);
    const oldTransactions=(data.transactions||[]).filter(t=>!t.engine);
    if(oldTransactions.length)issues.push(`${oldTransactions.length} äldre transaktioner ligger utanför 9.2/9.3-ledgern.`);
    return {score:Math.max(0,100-issues.length*12),issues};
  }

  window.MKPortfolioLedger930={ensure,addFlow,summaries,holdingRows,integrity,money};
})();

function openPortfolioLedger930(){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  document.getElementById("portfolioLedger930")?.classList.add("active");
  document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
  setupPortfolioLedger930();
  renderPortfolioLedger930();
  window.scrollTo({top:0,behavior:"smooth"});
}

function setupPortfolioLedger930(){
  if(!window.DATA||!window.MKPortfolioLedger930)return;
  MKPortfolioLedger930.ensure(DATA);
  const d=document.getElementById("ledger930FlowDate");
  if(d&&!d.value)d.value=new Date().toISOString().slice(0,10);
  if(!window.__ledger930Tabs){
    window.__ledger930Tabs=true;
    document.addEventListener("click",e=>{
      const b=e.target.closest("[data-ledger930tab]");if(!b)return;
      document.querySelectorAll(".ledger930Tab").forEach(x=>x.classList.remove("active"));
      document.querySelectorAll(".ledger930Panel").forEach(x=>x.classList.remove("active"));
      b.classList.add("active");
      document.getElementById("ledger930-"+b.dataset.ledger930tab)?.classList.add("active");
      renderPortfolioLedger930();
    });
  }
}

function saveLedgerFlow930(){
  const msg=document.getElementById("ledger930FlowMessage");
  try{
    const flow=MKPortfolioLedger930.addFlow(DATA,{
      type:document.getElementById("ledger930FlowType").value,
      amount:document.getElementById("ledger930FlowAmount").value,
      from:document.getElementById("ledger930FlowFrom").value.trim(),
      to:document.getElementById("ledger930FlowTo").value.trim(),
      date:document.getElementById("ledger930FlowDate").value,
      note:document.getElementById("ledger930FlowNote").value.trim()
    });
    if(typeof persist==="function")persist();
    window.MKAutomaticBackup885?.create?.(DATA,{reason:"portfolio-ledger-9.3-flow"}).catch?.(()=>{});
    msg.textContent="Kapitalflödet är sparat lokalt och tillagt i ledgern.";
    document.getElementById("ledger930FlowAmount").value="";
    document.getElementById("ledger930FlowNote").value="";
    renderAll();renderPortfolioLedger930();
  }catch(e){msg.textContent=e.message||String(e)}
}

function renderPortfolioLedger930(){
  if(!window.DATA||!window.MKPortfolioLedger930)return;
  const l=MKPortfolioLedger930.ensure(DATA),m=MKPortfolioLedger930.money,s=MKPortfolioLedger930.summaries(DATA);
  const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
  set("ledger930Count",String(s.count));set("ledger930Realized",m(s.realized));set("ledger930Dividends",m(s.dividends));set("ledger930Flows",m(s.netFlows));

  const overview=document.getElementById("ledger930OverviewGrid");
  if(overview)overview.innerHTML=`
    <div><span>Köp bokförda</span><b>${m(s.buys)}</b></div>
    <div><span>Försäljningar bokförda</span><b>${m(s.sells)}</b></div>
    <div><span>Netto kapitalflöden</span><b>${m(s.netFlows)}</b></div>
    <div><span>Realiserat + utdelningar</span><b>${m(s.realized+s.dividends)}</b></div>`;

  const recent=document.getElementById("ledger930Recent");
  if(recent){
    const rows=[...l.entries].sort((a,b)=>(b.date||"").localeCompare(a.date||"")).slice(0,8);
    recent.innerHTML=rows.length?rows.map(renderLedgerRow930).join(""):`<div class="ledger930Empty">Inga ledgerposter ännu.</div>`;
  }

  const filter=document.getElementById("ledger930Filter")?.value||"ALL";
  const timeline=document.getElementById("ledger930Timeline");
  if(timeline){
    let rows=[...l.entries].sort((a,b)=>(b.date||"").localeCompare(a.date||""));
    if(filter!=="ALL")rows=rows.filter(e=>e.type===filter);
    timeline.innerHTML=rows.length?rows.map(renderLedgerRow930).join(""):`<div class="ledger930Empty">Inga poster matchar filtret.</div>`;
  }

  const holdings=document.getElementById("ledger930Holdings");
  if(holdings){
    const rows=MKPortfolioLedger930.holdingRows(DATA);
    holdings.innerHTML=rows.map(r=>`
      <div class="ledger930Holding">
        <div class="ledger930HoldingTop"><div><b>${r.name}</b><small>${r.account||"Historiskt innehav"}</small></div><strong>${m(r.marketValueSEK)}</strong></div>
        <div class="ledger930HoldingGrid">
          <div><span>Antal</span><b>${r.quantity}</b></div>
          <div><span>GAV</span><b>${r.averageCost.toFixed(4)}</b></div>
          <div><span>Realiserat</span><b>${m(r.realized)}</b></div>
          <div><span>Utdelningar</span><b>${m(r.dividends)}</b></div>
        </div>
      </div>`).join("");
  }

  const flows=document.getElementById("ledger930FlowHistory");
  if(flows){
    const rows=[...l.flows].sort((a,b)=>(b.date||"").localeCompare(a.date||""));
    flows.innerHTML=rows.length?rows.map(f=>`
      <div class="ledger930Row"><div><b>${f.type==="DEPOSIT"?"Insättning":f.type==="WITHDRAWAL"?"Uttag":"Kontoflytt"}</b>
      <small>${f.date} · ${f.from||"—"} → ${f.to||"—"}</small></div><strong>${m(f.netContributionSEK||f.amountSEK)}</strong></div>`).join(""):`<div class="ledger930Empty">Inga kapitalflöden registrerade ännu.</div>`;
  }

  const control=document.getElementById("ledger930Control");
  if(control){
    const i=MKPortfolioLedger930.integrity(DATA);
    control.innerHTML=`
      <div class="ledger930IntegrityScore"><span>Ledger Integrity Score</span><b>${i.score}/100</b></div>
      <div class="ledger930Notice ${i.issues.length?"warn":"ok"}"><b>${i.issues.length?"Kontroll behövs":"Ledgern är konsekvent"}</b>
      <p>${i.issues.length?i.issues.join(" "):"Alla kända 9.2- och 9.3-poster har datum, konto och giltig transaktionstyp."}</p></div>
      <div class="ledger930ControlGrid">
        <div><span>Ledgerposter</span><b>${l.entries.length}</b></div>
        <div><span>Kapitalflöden</span><b>${l.flows.length}</b></div>
        <div><span>Importerade 9.2-poster</span><b>${l.entries.filter(e=>e.source==="transaction-intelligence-9.2").length}</b></div>
        <div><span>Lokala 9.3-poster</span><b>${l.entries.filter(e=>e.source==="portfolio-ledger-9.3").length}</b></div>
      </div>`;
  }
}

function renderLedgerRow930(e){
  const type={BUY:"Köp",SELL:"Försäljning",DIVIDEND:"Utdelning",CASH_ADJUSTMENT:"Likvidjustering",FLOW:"Kapitalflöde"}[e.type]||e.type;
  const amount=e.type==="SELL"||e.type==="DIVIDEND"||e.type==="FLOW"?Number(e.netSEK||e.amountSEK||0):-Math.abs(Number(e.netSEK||0));
  return `<div class="ledger930Row"><div><b>${type} · ${e.holdingName||"Portfölj"}</b>
    <small>${e.date||"datum saknas"} · ${e.account||"konto saknas"}${e.note?" · "+e.note:""}</small></div>
    <strong>${MKPortfolioLedger930.money(amount)}</strong></div>`;
}
