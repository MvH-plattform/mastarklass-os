(function(){
  const money=v=>Math.round(Number(v)||0).toLocaleString('sv-SE')+' kr';
  const pct=(v,d=1)=>(Number(v)||0).toFixed(d).replace('.',',')+' %';
  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
  const account=()=>window.MKCreditEngine901?.account(window.DATA);

  function calculate(a){
    if(!a) return null;
    const used=Number(a.usedSEK)||0;
    const limit=Number(a.limitSEK)||0;
    const collateral=Number(a.collateralValueSEK)||0;
    const rate=Number(a.annualRatePct)||0;
    const utilization=limit?used/limit*100:0;
    const ltv=collateral?used/collateral*100:0;
    const available=Math.max(0,limit-used);
    const monthlyInterest=used*rate/100/12;
    const annualInterest=used*rate/100;
    const portfolioIQ=Number(window.MKUnifiedIntelligence884?.analyze?.(window.DATA)?.portfolioIQ)||Number(window.DATA?.scores?.portfolioIQ)||70;
    const utilizationPenalty=clamp((utilization-20)*1.05,0,55);
    const ltvPenalty=clamp((ltv-8)*1.4,0,35);
    const ratePenalty=clamp((rate-3)*2.5,0,15);
    const iqSupport=clamp((portfolioIQ-60)*0.15,-5,5);
    const riskScore=Math.round(clamp(100-utilizationPenalty-ltvPenalty-ratePenalty+iqSupport,0,100));
    let level='Låg', tone='green';
    if(riskScore<45){level='Hög';tone='red'}
    else if(riskScore<65){level='Förhöjd';tone='amber'}
    else if(riskScore<82){level='Normal';tone='blue'}
    const safeUsed=Math.min(limit*0.4, collateral?collateral*0.15:limit*0.4);
    const recommendedRepay=Math.max(0,used-safeUsed);
    const maxNewCredit=Math.max(0,safeUsed-used);
    return {used,limit,collateral,rate,utilization,ltv,available,monthlyInterest,annualInterest,portfolioIQ,riskScore,level,tone,safeUsed,recommendedRepay,maxNewCredit};
  }

  function stress(a,dropPct){
    const base=calculate(a); if(!base)return null;
    const stressedCollateral=base.collateral*(1-dropPct/100);
    const stressedLtv=stressedCollateral?base.used/stressedCollateral*100:0;
    let status='Stabil',tone='green';
    if(stressedLtv>=35){status='Hög risk';tone='red'} else if(stressedLtv>=25){status='Bevaka';tone='amber'}
    return {dropPct,stressedCollateral,stressedLtv,status,tone};
  }

  function advice(x){
    if(!x)return ['Konfigurera kreditkontot för att aktivera den dynamiska riskmotorn.'];
    const out=[];
    if(x.level==='Hög')out.push('Stoppa nya kreditköp tills utnyttjandet har minskat tydligt.');
    else if(x.level==='Förhöjd')out.push('Prioritera amortering före nya kreditfinansierade köp.');
    else if(x.level==='Normal')out.push('Krediten är hanterbar, men nytt kreditutrymme bör användas selektivt.');
    else out.push('Krediten ligger inom en konservativ lokal riskzon.');
    if(x.recommendedRepay>0)out.push(`Lokal mål-amortering för att nå försiktighetszonen: cirka ${money(x.recommendedRepay)}.`);
    if(x.maxNewCredit>0)out.push(`Teoretiskt utrymme inom lokal målzon: ${money(x.maxNewCredit)}. Det är inte en köprekommendation.`);
    out.push(`Beräknad räntekostnad: ${money(x.monthlyInterest)} per månad och ${money(x.annualInterest)} per år.`);
    return out;
  }

  function render(){
    const box=document.getElementById('ic903RiskPanel'); if(!box)return;
    const a=account(),x=calculate(a);
    if(!x){box.innerHTML='<div class="ic903Empty">Konfigurera Avanza-krediten under fliken Kreditkonto först.</div>';return;}
    const stressRows=[10,20,30].map(d=>stress(a,d));
    box.innerHTML=`
      <div class="ic903ScoreCard ${x.tone}">
        <div><span>Dynamiskt kreditscore</span><strong>${x.riskScore}/100</strong></div>
        <div class="ic903Pill ${x.tone}">${x.level.toUpperCase()} RISK</div>
      </div>
      <div class="ic903MetricGrid">
        <div><span>Utnyttjandegrad</span><b>${pct(x.utilization)}</b></div>
        <div><span>Belåningsgrad</span><b>${pct(x.ltv)}</b></div>
        <div><span>Ränta/månad</span><b>${money(x.monthlyInterest)}</b></div>
        <div><span>Portfolio IQ-stöd</span><b>${Math.round(x.portfolioIQ)}/100</b></div>
      </div>
      <div class="ic903Card"><h3>AI Credit Coach Pro</h3>${advice(x).map(t=>`<div class="ic903Advice">${t}</div>`).join('')}</div>
      <div class="ic903Card"><h3>Stresstest av belåningsvärde</h3>${stressRows.map(r=>`<div class="ic903Stress"><div><b>−${r.dropPct}% marknad</b><span>Belåningsgrad ${pct(r.stressedLtv)}</span></div><em class="${r.tone}">${r.status}</em></div>`).join('')}</div>
      <div class="ic903Card"><h3>Handlingsplan</h3>
        <div class="ic903Action"><span>Rekommenderad amortering</span><b>${money(x.recommendedRepay)}</b></div>
        <div class="ic903Action"><span>Utrymme inom målzon</span><b>${money(x.maxNewCredit)}</b></div>
        <div class="ic903Action"><span>Tillgängligt enligt kreditlimit</span><b>${money(x.available)}</b></div>
      </div>`;
  }

  window.MKCreditIntelligence903={calculate,stress,advice,render};
  window.renderCreditIntelligence903=render;
  const old=window.renderInvestmentCredit901;
  window.renderInvestmentCredit901=function(){old?.();setTimeout(render,0)};
  document.addEventListener('DOMContentLoaded',()=>setTimeout(render,350));
})();
