
(function(){
  const n=v=>{const x=Number(v);return Number.isFinite(x)?x:0};
  const value=h=>n(h.marketValueSEK||h.marketValue||h.currentValue||h.costValueSEK);
  const total=hs=>hs.reduce((s,h)=>s+value(h),0);
  const pct=(a,b)=>b>0?a/b*100:0;
  const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));

  function coverage(h){
    const fields=["name","type","currency","country","sector","quantity","averageCost"];
    return fields.filter(f=>h[f]!==undefined&&h[f]!==null&&String(h[f]).trim()!=="").length/fields.length*100;
  }
  function groupWeight(data,field,name){
    const t=total(data.holdings||[]);
    return pct((data.holdings||[]).filter(h=>String(h[field]||"Okänt")===String(name||"Okänt")).reduce((s,h)=>s+value(h),0),t);
  }
  function creditPenalty(data){
    const a=data.investmentCredit901?.accounts?.[0];
    if(!a)return 0;
    const used=n(a.usedSEK||a.usedCredit||a.used||a.balance),limit=n(a.limitSEK||a.limit);
    const u=pct(used,limit);
    return u>85?15:u>70?9:u>50?4:0;
  }
  function scoreHolding(data,h){
    const hs=data.holdings||[],t=total(hs),w=pct(value(h),t);
    const sectorW=groupWeight(data,"sector",h.sector);
    const countryW=groupWeight(data,"country",h.country);
    const currencyW=groupWeight(data,"currency",h.currency);
    const cov=coverage(h);
    const q=n(h.qualityScore||h.score||h.rating||70);
    const perf=n(h.returnPct||h.totalReturnPct||0);
    let score=50;
    score+=(clamp(q,0,100)-50)*0.32;
    score+=(cov-60)*0.12;
    score-=Math.max(0,w-8)*1.2;
    score-=Math.max(0,sectorW-30)*0.35;
    score-=Math.max(0,countryW-55)*0.15;
    score-=Math.max(0,currencyW-65)*0.12;
    score+=clamp(perf,-30,30)*0.08;
    score-=creditPenalty(data)*0.15;
    score=clamp(Math.round(score),0,100);
    const action=score>=68&&w<12?"BUY":score<45||w>20?"REDUCE":"HOLD";
    const reasons=[];
    if(w>20)reasons.push(`hög vikt ${w.toFixed(1)} %`);
    else if(w<4)reasons.push(`låg vikt ${w.toFixed(1)} %`);
    if(sectorW>35)reasons.push(`sektorn väger ${sectorW.toFixed(1)} %`);
    if(cov<70)reasons.push(`datatäckning ${Math.round(cov)} %`);
    if(q>=80)reasons.push("hög registrerad kvalitet");
    if(!reasons.length)reasons.push("balanserad påverkan på helheten");
    return {id:String(h.id||h.isin||h.ticker||h.name),name:h.name,account:h.platform||h.account||"",score,action,weight:w,sectorWeight:sectorW,countryWeight:countryW,currencyWeight:currencyW,coverage:cov,reasons};
  }
  function analyze(data){
    const rows=(data.holdings||[]).map(h=>scoreHolding(data,h)).sort((a,b)=>b.score-a.score);
    const coverageAvg=rows.length?rows.reduce((s,r)=>s+r.coverage,0)/rows.length:0;
    const intelligence=rows.length?Math.round(rows.reduce((s,r)=>s+r.score,0)/rows.length):0;
    return {rows,coverageAvg,intelligence,top:rows.find(r=>r.action==="BUY")||rows[0],reduce:[...rows].reverse().find(r=>r.action==="REDUCE")||[...rows].reverse()[0]};
  }
  function simulate(data,holdingId,amount,action){
    const hs=structuredClone(data.holdings||[]);
    const h=hs.find(x=>String(x.id||x.isin||x.ticker||x.name)===String(holdingId));
    if(!h)throw new Error("Välj ett innehav.");
    amount=n(amount);if(amount<=0)throw new Error("Beloppet måste vara större än noll.");
    const before=scoreHolding({ ...data, holdings: hs },h);
    const v=value(h);
    h.marketValueSEK=Math.max(0,action==="BUY"?v+amount:v-amount);
    const after=scoreHolding({ ...data, holdings: hs },h);
    return {before,after,deltaScore:after.score-before.score,deltaWeight:after.weight-before.weight,amount,action};
  }
  window.MKInvestmentIntelligence950={analyze,simulate};
})();

function openInvestmentIntelligence950(){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  document.getElementById("investmentIntelligence950")?.classList.add("active");
  document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
  setupInvestmentIntelligence950();renderInvestmentIntelligence950();
  window.scrollTo({top:0,behavior:"smooth"});
}
function setupInvestmentIntelligence950(){
  if(!window.__ii950Tabs){
    window.__ii950Tabs=true;
    document.addEventListener("click",e=>{
      const b=e.target.closest("[data-ii950tab]");if(!b)return;
      document.querySelectorAll(".ii950Tab").forEach(x=>x.classList.remove("active"));
      document.querySelectorAll(".ii950Panel").forEach(x=>x.classList.remove("active"));
      b.classList.add("active");
      document.getElementById("ii950-"+b.dataset.ii950tab)?.classList.add("active");
      renderInvestmentIntelligence950();
    });
  }
}
function ii950Row(r){
  const label={BUY:"ÖKA",HOLD:"BEHÅLL",REDUCE:"MINSKA"}[r.action];
  const cls=r.action==="BUY"?"buy":r.action==="REDUCE"?"reduce":"hold";
  return `<div class="ii950Row"><div><b>${r.name}</b><small>${r.account||"konto saknas"} · vikt ${r.weight.toFixed(1)} % · ${r.reasons.join(", ")}</small></div><div class="ii950RowRight"><span class="${cls}">${label}</span><strong>${r.score}/100</strong></div></div>`;
}
function renderInvestmentIntelligence950(){
  if(!window.DATA||!window.MKInvestmentIntelligence950)return;
  const a=MKInvestmentIntelligence950.analyze(DATA);
  const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
  set("ii950Score",a.intelligence+"/100");set("ii950Top",a.top?.name||"—");set("ii950Reduce",a.reduce?.name||"—");set("ii950Coverage",Math.round(a.coverageAvg)+" %");

  const actions=document.getElementById("ii950Actions");
  if(actions)actions.innerHTML=[
    ...(a.rows.filter(r=>r.action==="BUY").slice(0,3)),
    ...(a.rows.filter(r=>r.action==="REDUCE").slice(-2).reverse())
  ].map(ii950Row).join("")||'<div class="ii950Empty">Ingen tydlig åtgärd identifierad.</div>';

  const filter=document.getElementById("ii950RankFilter")?.value||"ALL";
  const ranking=document.getElementById("ii950Ranking");
  if(ranking){
    const rows=filter==="ALL"?a.rows:a.rows.filter(r=>r.action===filter);
    ranking.innerHTML=rows.map(ii950Row).join("")||'<div class="ii950Empty">Inga innehav i kategorin.</div>';
  }

  const select=document.getElementById("ii950Holding");
  if(select&&select.dataset.count!==String((DATA.holdings||[]).length)){
    select.innerHTML=(DATA.holdings||[]).map(h=>`<option value="${String(h.id||h.isin||h.ticker||h.name).replace(/"/g,"&quot;")}">${h.name}</option>`).join("");
    select.dataset.count=(DATA.holdings||[]).length;
  }

  const explain=document.getElementById("ii950Explanations");
  if(explain)explain.innerHTML=`
    <div class="ii950Explain"><b>Öka</b><p>Hög relativ kvalitet, rimlig vikt och bättre balans per investerad krona.</p></div>
    <div class="ii950Explain"><b>Behåll</b><p>Ingen tydlig förbättring eller försämring jämfört med portföljens nuvarande struktur.</p></div>
    <div class="ii950Explain"><b>Minska</b><p>Låg samlad score, hög koncentration eller svag datatäckning. Motorn använder inte externa värderingar ännu.</p></div>
    <div class="ii950Explain"><b>Begränsning</b><p>Beslutsstödet bygger på lokala innehav, vikter och registrerad metadata. Det ersätter inte bolagsanalys eller aktuell marknadsdata.</p></div>`;

  const control=document.getElementById("ii950Control");
  if(control){
    const issues=[];
    if(!(DATA.holdings||[]).length)issues.push("Inga innehav.");
    if(a.coverageAvg<70)issues.push("Datatäckningen är under 70 %.");
    if(!window.MKPerformanceAnalytics940)issues.push("Performance Analytics 9.4 saknas.");
    if(!window.MKPortfolioLedger930)issues.push("Portfolio Ledger 9.3 saknas.");
    if(!window.MKTransactionIntelligence920)issues.push("Transaction Intelligence 9.2 saknas.");
    const score=Math.max(0,100-issues.length*20);
    control.innerHTML=`<div class="ii950Integrity"><span>Integrity Score</span><b>${score}/100</b></div>
      <div class="ii950Notice ${issues.length?"warn":"ok"}"><b>${issues.length?"Kontroll behövs":"Alla kärnmotorer är anslutna"}</b><p>${issues.length?issues.join(" "):"Performance, Ledger och Transaction Intelligence är tillgängliga lokalt."}</p></div>`;
  }
}
function simulateInvestment950(){
  const box=document.getElementById("ii950Simulation");
  try{
    const r=MKInvestmentIntelligence950.simulate(
      DATA,
      document.getElementById("ii950Holding").value,
      document.getElementById("ii950Amount").value,
      document.getElementById("ii950Action").value
    );
    box.innerHTML=`<div class="ii950SimGrid">
      <div><span>Score</span><b>${r.before.score} → ${r.after.score}</b></div>
      <div><span>Scoreförändring</span><b>${r.deltaScore>=0?"+":""}${r.deltaScore}</b></div>
      <div><span>Vikt</span><b>${r.before.weight.toFixed(2)} % → ${r.after.weight.toFixed(2)} %</b></div>
      <div><span>Viktförändring</span><b>${r.deltaWeight>=0?"+":""}${r.deltaWeight.toFixed(2)} pp</b></div>
    </div><div class="ii950Notice ok"><b>Sandbox</b><p>Simuleringen sparas inte och påverkar inte Private Vault.</p></div>`;
  }catch(e){box.innerHTML=`<div class="ii950Notice warn"><b>Kunde inte simulera</b><p>${e.message}</p></div>`}
}
