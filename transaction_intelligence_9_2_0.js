
(function(){
  const n=v=>{const x=Number(String(v??"").replace(",", "."));return Number.isFinite(x)?x:0};
  const round=(v,d=2)=>Math.round((n(v)+Number.EPSILON)*10**d)/10**d;
  const money=v=>Math.round(n(v)).toLocaleString("sv-SE")+" kr";
  const uuid=()=>crypto.randomUUID?.()||`tx920-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const holdingId=h=>String(h?.id||h?.isin||h?.ticker||h?.name||"");
  const holdingValue=h=>n(h?.marketValueSEK||h?.marketValue||h?.currentValue||h?.costValueSEK);

  function ensure(data){
    data.transactionIntelligence920=data.transactionIntelligence920||{};
    const m=data.transactionIntelligence920;
    m.version="9.2.0";
    m.cashAccounts=Array.isArray(m.cashAccounts)?m.cashAccounts:[];
    m.ledger=Array.isArray(m.ledger)?m.ledger:[];
    m.realized=Array.isArray(m.realized)?m.realized:[];
    data.transactions=Array.isArray(data.transactions)?data.transactions:[];
    data.holdings=Array.isArray(data.holdings)?data.holdings:[];
    return m;
  }
  function accountName(input,h){
    return String(input.account||h?.platform||h?.account||h?.accountName||"Investeringskonto").trim();
  }
  function cashAccount(data,name){
    const m=ensure(data);
    let a=m.cashAccounts.find(x=>x.name===name);
    if(!a){a={id:uuid(),name,balanceSEK:0,updatedAt:new Date().toISOString()};m.cashAccounts.push(a)}
    return a;
  }
  function securitiesValue(data){return (data.holdings||[]).reduce((s,h)=>s+holdingValue(h),0)}
  function cashValue(data){return ensure(data).cashAccounts.reduce((s,a)=>s+n(a.balanceSEK),0)}
  function investmentCapital(data){return securitiesValue(data)+cashValue(data)}
  function creditAccount(data){
    return data.investmentCredit901?.accounts?.[0]||null;
  }
  function findHolding(data,id){return (data.holdings||[]).find(h=>holdingId(h)===String(id))}
  function inputFromForm(){
    return {
      type:document.getElementById("tx920Type")?.value,
      holdingId:document.getElementById("tx920Holding")?.value,
      account:document.getElementById("tx920Account")?.value,
      date:document.getElementById("tx920Date")?.value,
      quantity:n(document.getElementById("tx920Qty")?.value),
      price:n(document.getElementById("tx920Price")?.value),
      currency:String(document.getElementById("tx920Currency")?.value||"SEK").toUpperCase(),
      fx:n(document.getElementById("tx920Fx")?.value)||1,
      fee:n(document.getElementById("tx920Fee")?.value),
      dividendSEK:n(document.getElementById("tx920Dividend")?.value),
      adjustmentSEK:n(document.getElementById("tx920Adjustment")?.value),
      destination:document.getElementById("tx920Destination")?.value,
      note:document.getElementById("tx920Note")?.value||""
    };
  }
  function preview(data,input){
    ensure(data);
    const type=input.type;
    const h=type==="CASH_ADJUSTMENT"?null:findHolding(data,input.holdingId);
    if(type!=="CASH_ADJUSTMENT"&&!h)throw new Error("Välj ett innehav.");
    if(["BUY","SELL"].includes(type)&&input.quantity<=0)throw new Error("Antalet måste vara större än noll.");
    if(["BUY","SELL"].includes(type)&&input.price<=0)throw new Error("Priset måste vara större än noll.");
    if(type==="SELL"&&input.quantity>n(h.quantity))throw new Error(`Du kan högst sälja ${n(h.quantity)} registrerade andelar.`);
    if(type==="DIVIDEND"&&input.dividendSEK<=0)throw new Error("Ange utdelningen netto i SEK.");
    if(type==="CASH_ADJUSTMENT"&&input.adjustmentSEK===0)throw new Error("Ange ett positivt eller negativt belopp.");

    const account=accountName(input,h);
    const oldCash=n(cashAccount(data,account).balanceSEK);
    const gross=round(input.quantity*input.price*input.fx,2);
    const net=type==="SELL"?round(gross-input.fee,2):
              type==="BUY"?round(-(gross+input.fee),2):
              type==="DIVIDEND"?round(input.dividendSEK,2):
              round(input.adjustmentSEK,2);
    const oldQty=n(h?.quantity), oldAvg=n(h?.averageCost);
    let newQty=oldQty, newAvg=oldAvg, realized=0, cashDelta=0, creditDelta=0, withdrawn=0;

    if(type==="BUY"){
      newQty=round(oldQty+input.quantity,6);
      const oldCost=oldQty*oldAvg;
      const localFee=input.fx?input.fee/input.fx:input.fee;
      newAvg=newQty?round((oldCost+input.quantity*input.price+localFee)/newQty,6):0;
      cashDelta=net;
    }else if(type==="SELL"){
      newQty=round(oldQty-input.quantity,6);
      newAvg=newQty>0?oldAvg:0;
      realized=round(input.quantity*(input.price-oldAvg)*input.fx-input.fee,2);
      if(input.destination==="ACCOUNT_CASH")cashDelta=net;
      if(input.destination==="CREDIT_REPAYMENT")creditDelta=-net;
      if(input.destination==="WITHDRAWAL")withdrawn=net;
      if(input.destination==="REINVESTED")cashDelta=0;
    }else if(type==="DIVIDEND"){
      cashDelta=net;
    }else{
      cashDelta=net;
    }
    return {
      input,h,account,gross,net,oldCash,newCash:round(oldCash+cashDelta,2),cashDelta,
      oldQty,newQty,oldAvg,newAvg,realized,creditDelta,withdrawn,
      capitalBefore:round(investmentCapital(data),2),
      securitiesBefore:round(securitiesValue(data),2)
    };
  }
  async function apply(data,input){
    const p=preview(data,input);
    const m=ensure(data), now=new Date().toISOString();
    const beforeHolding=p.h?structuredClone(p.h):null;

    if(["BUY","SELL"].includes(input.type)){
      const h=p.h;
      h.quantity=p.newQty;
      h.averageCost=p.newAvg;
      h.currency=input.currency||h.currency||"SEK";
      h.costValueSEK=round(h.quantity*h.averageCost*input.fx,2);
      const oldMarket=holdingValue(beforeHolding);
      const inferred= p.oldQty>0 && oldMarket>0 ? oldMarket/p.oldQty : input.price*input.fx;
      h.marketValueSEK=round(h.quantity*inferred,2);
      h.status="verified-local-transaction-9.2";
    }

    if(p.cashDelta!==0){
      const ca=cashAccount(data,p.account);
      ca.balanceSEK=p.newCash;
      ca.updatedAt=now;
    }

    if(p.creditDelta<0){
      const acc=creditAccount(data);
      if(acc){
        const repay=Math.min(n(acc.usedCredit||acc.used||acc.balance),Math.abs(p.creditDelta));
        if("usedCredit" in acc)acc.usedCredit=round(n(acc.usedCredit)-repay,2);
        else if("used" in acc)acc.used=round(n(acc.used)-repay,2);
        else acc.balance=round(n(acc.balance)-repay,2);
      }
    }

    const tx={
      id:uuid(),engine:"9.2.0",createdAt:now,date:input.date||now.slice(0,10),
      type:input.type,holdingId:p.h?holdingId(p.h):"",holdingName:p.h?.name||"Likvidjustering",
      account:p.account,quantity:input.quantity||0,price:input.price||0,
      currency:input.currency||"SEK",fxRate:input.fx||1,feeSEK:input.fee||0,
      grossSEK:p.gross,netSEK:p.net,destination:input.destination||"ACCOUNT_CASH",
      cashDeltaSEK:p.cashDelta,creditDeltaSEK:p.creditDelta,withdrawnSEK:p.withdrawn,
      realizedResultSEK:p.realized,note:input.note||"",
      before:{quantity:p.oldQty,averageCost:p.oldAvg,cashSEK:p.oldCash},
      after:{quantity:p.newQty,averageCost:p.newAvg,cashSEK:p.newCash}
    };
    data.transactions.push(tx);
    m.ledger.push(tx);
    if(input.type==="SELL")m.realized.push({id:tx.id,date:tx.date,holdingName:tx.holdingName,resultSEK:p.realized});

    data.portfolio=data.portfolio||{};
    data.portfolio.securitiesValueSEK=round(securitiesValue(data),2);
    data.portfolio.investmentCashSEK=round(cashValue(data),2);
    data.portfolio.net=round(investmentCapital(data),2);

    data.journal=Array.isArray(data.journal)?data.journal:[];
    const destinationLabel={
      ACCOUNT_CASH:"kvar på investeringskontot",
      CREDIT_REPAYMENT:"använd för att amortera värdepapperskrediten",
      WITHDRAWAL:"uttagen ur investeringsportföljen",
      REINVESTED:"återinvesterad direkt"
    }[tx.destination]||"registrerad";
    data.journal.unshift({
      date:tx.date,title:`${input.type==="SELL"?"Försäljning":input.type==="BUY"?"Köp":input.type==="DIVIDEND"?"Utdelning":"Likvidjustering"} · ${tx.holdingName}`,
      text:`${money(Math.abs(tx.netSEK))}. Likviden är ${destinationLabel}.`
    });
    return {transaction:tx,preview:p};
  }

  window.MKTransactionIntelligence920={
    ensure,preview,apply,securitiesValue,cashValue,investmentCapital,inputFromForm,cashAccount,money
  };
})();

let TX920_PREVIEW=null;

function openTransactionIntelligence920(){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  document.getElementById("transactionIntelligence920")?.classList.add("active");
  document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
  setupTransactionIntelligence920();
  renderTransactionIntelligence920();
  window.scrollTo({top:0,behavior:"smooth"});
}
function setupTransactionIntelligence920(){
  if(!window.DATA||!window.MKTransactionIntelligence920)return;
  MKTransactionIntelligence920.ensure(DATA);
  const date=document.getElementById("tx920Date");
  if(date&&!date.value)date.value=new Date().toISOString().slice(0,10);
  const holding=document.getElementById("tx920Holding");
  if(holding){
    const previous=holding.value;
    holding.innerHTML=(DATA.holdings||[]).map(h=>`<option value="${String(h.id||h.isin||h.ticker||h.name).replace(/"/g,"&quot;")}">${h.name} · ${h.platform||h.account||"konto"}</option>`).join("");
    if(previous)holding.value=previous;
  }
  const account=document.getElementById("tx920Account");
  if(account){
    const names=[...new Set((DATA.holdings||[]).map(h=>h.platform||h.account||h.accountName).filter(Boolean))];
    for(const a of MKTransactionIntelligence920.ensure(DATA).cashAccounts)if(!names.includes(a.name))names.push(a.name);
    account.innerHTML=(names.length?names:["Avanza","SAVR","Montrose","Länsförsäkringar","Lysa"]).map(x=>`<option>${x}</option>`).join("");
  }
  if(!window.__tx920Tabs){
    window.__tx920Tabs=true;
    document.addEventListener("click",e=>{
      const b=e.target.closest("[data-tx920tab]");if(!b)return;
      document.querySelectorAll(".tx920Tab").forEach(x=>x.classList.remove("active"));
      document.querySelectorAll(".tx920Panel").forEach(x=>x.classList.remove("active"));
      b.classList.add("active");
      document.getElementById("tx920-"+b.dataset.tx920tab)?.classList.add("active");
      renderTransactionIntelligence920();
    });
  }
  ["tx920Holding","tx920Account","tx920Qty","tx920Price","tx920Currency","tx920Fx","tx920Fee","tx920Dividend","tx920Adjustment","tx920Destination"].forEach(id=>{
    const el=document.getElementById(id);
    if(el&&!el.dataset.bound920){el.dataset.bound920="1";el.addEventListener("input",()=>{TX920_PREVIEW=null;document.getElementById("tx920SaveBtn").disabled=true;})}
  });
  updateTransactionIntelligence920();
}
function updateTransactionIntelligence920(){
  const type=document.getElementById("tx920Type")?.value||"SELL";
  const show=(id,on)=>{const e=document.getElementById(id);if(e)e.style.display=on?"":"none"};
  show("tx920HoldingWrap",type!=="CASH_ADJUSTMENT");
  show("tx920QtyWrap",["BUY","SELL"].includes(type));
  show("tx920PriceWrap",["BUY","SELL"].includes(type));
  show("tx920CurrencyWrap",["BUY","SELL"].includes(type));
  show("tx920FxWrap",["BUY","SELL"].includes(type));
  show("tx920FeeWrap",["BUY","SELL"].includes(type));
  show("tx920DividendWrap",type==="DIVIDEND");
  show("tx920AdjustmentWrap",type==="CASH_ADJUSTMENT");
  show("tx920DestinationWrap",type==="SELL");
  TX920_PREVIEW=null;
  const save=document.getElementById("tx920SaveBtn");if(save)save.disabled=true;
}
function previewTransaction920(){
  const result=document.getElementById("tx920Result");
  try{
    const input=MKTransactionIntelligence920.inputFromForm();
    TX920_PREVIEW=MKTransactionIntelligence920.preview(DATA,input);
    const p=TX920_PREVIEW;
    const dest={
      ACCOUNT_CASH:"Kontanter på investeringskontot",
      CREDIT_REPAYMENT:"Amortering av Avanza-krediten",
      WITHDRAWAL:"Uttag ur investeringsportföljen",
      REINVESTED:"Direkt återinvestering"
    }[input.destination]||"Kontanter";
    document.getElementById("tx920Preview").innerHTML=`
      <div class="tx920PreviewTitle">Kontroll före sparning</div>
      ${p.h?`<div><span>Innehav</span><b>${p.h.name}</b></div>`:""}
      ${["BUY","SELL"].includes(input.type)?`<div><span>Antal</span><b>${p.oldQty} → ${p.newQty}</b></div>`:""}
      ${["BUY","SELL"].includes(input.type)?`<div><span>GAV</span><b>${p.oldAvg.toFixed(4)} → ${p.newAvg.toFixed(4)}</b></div>`:""}
      <div><span>Nettobelopp</span><b>${MKTransactionIntelligence920.money(p.net)}</b></div>
      <div><span>Kontanter på konto</span><b>${MKTransactionIntelligence920.money(p.oldCash)} → ${MKTransactionIntelligence920.money(p.newCash)}</b></div>
      ${input.type==="SELL"?`<div><span>Likvidens destination</span><b>${dest}</b></div><div><span>Beräknat realiserat resultat</span><b>${MKTransactionIntelligence920.money(p.realized)}</b></div>`:""}
    `;
    document.getElementById("tx920SaveBtn").disabled=false;
    if(result)result.textContent="Förhandsgranskningen är klar. Kontrollera uppgifterna och spara.";
  }catch(e){
    TX920_PREVIEW=null;
    document.getElementById("tx920SaveBtn").disabled=true;
    if(result)result.textContent=e.message||String(e);
  }
}
async function saveTransaction920(){
  const result=document.getElementById("tx920Result");
  try{
    if(!TX920_PREVIEW)throw new Error("Förhandsgranska affären först.");
    const input=MKTransactionIntelligence920.inputFromForm();
    await MKTransactionIntelligence920.apply(DATA,input);
    if(typeof persist==="function")persist();
    window.MKAutomaticBackup885?.create?.(DATA,{reason:"transaction-intelligence-9.2"}).catch?.(()=>{});
    TX920_PREVIEW=null;
    document.getElementById("tx920SaveBtn").disabled=true;
    if(result)result.textContent="Sparat lokalt. Portföljvärde, kontanter, kredit och backup har synkroniserats.";
    renderAll();
    renderTransactionIntelligence920();
  }catch(e){
    if(result)result.textContent="Kunde inte spara: "+(e.message||String(e));
  }
}
function renderTransactionIntelligence920(){
  if(!window.DATA||!window.MKTransactionIntelligence920)return;
  const m=MKTransactionIntelligence920.ensure(DATA),money=MKTransactionIntelligence920.money;
  const securities=MKTransactionIntelligence920.securitiesValue(DATA);
  const cash=MKTransactionIntelligence920.cashValue(DATA);
  const capital=MKTransactionIntelligence920.investmentCapital(DATA);
  const realized=m.realized.reduce((s,x)=>s+Number(x.resultSEK||0),0);
  const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
  set("tx920Securities",money(securities));set("tx920Cash",money(cash));set("tx920Capital",money(capital));set("tx920Realized",money(realized));

  const ca=document.getElementById("tx920CashAccounts");
  if(ca)ca.innerHTML=m.cashAccounts.length?m.cashAccounts.map(a=>`<div class="tx920Row"><div><b>${a.name}</b><small>Investeringslikvid</small></div><strong>${money(a.balanceSEK)}</strong></div>`).join(""):`<div class="tx920Empty">Inga kontantsaldon registrerade ännu. Använd en försäljning eller Likvidjustering.</div>`;

  const hist=document.getElementById("tx920History");
  if(hist){
    const rows=[...m.ledger].reverse().slice(0,100);
    hist.innerHTML=rows.length?rows.map(t=>{
      const type={SELL:"Försäljning",BUY:"Köp",DIVIDEND:"Utdelning",CASH_ADJUSTMENT:"Likvidjustering"}[t.type]||t.type;
      const destination={ACCOUNT_CASH:"kvar som kontanter",CREDIT_REPAYMENT:"amorterade kredit",WITHDRAWAL:"uttagna",REINVESTED:"återinvesterade"}[t.destination]||"";
      return `<div class="tx920HistoryRow"><div><b>${type} · ${t.holdingName}</b><small>${t.date} · ${t.account}${destination?" · "+destination:""}</small></div><strong>${money(t.netSEK)}</strong></div>`;
    }).join(""):`<div class="tx920Empty">Ingen 9.2-transaktion registrerad ännu.</div>`;
  }

  const control=document.getElementById("tx920Control");
  if(control){
    const oldSales=(DATA.transactions||[]).filter(t=>t.type==="SELL"&&!t.engine);
    const negative=m.cashAccounts.filter(a=>Number(a.balanceSEK)<0);
    const issues=[];
    if(oldSales.length)issues.push(`${oldSales.length} äldre försäljning(ar) saknar uppgift om likvidens destination.`);
    if(negative.length)issues.push(`${negative.length} investeringskonto har negativt kontantsaldo.`);
    if(!m.cashAccounts.length)issues.push("Inga investeringskontanter är registrerade.");
    control.innerHTML=`
      <div class="tx920ControlGrid">
        <div><span>Värdepappersvärde</span><b>${money(securities)}</b></div>
        <div><span>Kontanter inom portföljen</span><b>${money(cash)}</b></div>
        <div><span>Totalt investeringskapital</span><b>${money(capital)}</b></div>
        <div><span>Uttag ur portföljen</span><b>${money(m.ledger.reduce((s,x)=>s+Number(x.withdrawnSEK||0),0))}</b></div>
      </div>
      <div class="tx920Notice ${issues.length?"warn":"ok"}">
        <b>${issues.length?"Kontroll behövs":"Kapitalflödet är konsekvent"}</b>
        <p>${issues.length?issues.join(" "):"Värdepapper och investeringskontanter räknas tillsammans, medan uttag och kreditamortering hålls åtskilda."}</p>
      </div>
      ${oldSales.length?`<div class="tx920Legacy"><b>Din tidigare Spiltan-försäljning</b><p>Om cirka 22 000 kr fortfarande ligger kvar på investeringskontot: välj <em>Likvidjustering</em>, rätt konto och ange beloppet som positivt. Detta lägger tillbaka likviden som investeringskontanter utan att återskapa fondinnehavet.</p></div>`:""}
    `;
  }
}
