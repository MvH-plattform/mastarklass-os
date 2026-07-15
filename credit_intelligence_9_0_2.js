(function(){
  const money=v=>Math.round(Number(v)||0).toLocaleString('sv-SE')+' kr';
  const pct=v=>(Number(v)||0).toFixed(2).replace('.',',')+' %';
  const account=()=>window.MKCreditEngine901?.account(window.DATA);
  function analysis(a){
    const r=window.MKCreditRisk901?.analyze(a)||{};
    const used=Number(a?.usedSEK)||0, limit=Number(a?.limitSEK)||0, rate=Number(a?.annualRatePct)||0;
    const collateral=Number(a?.collateralValueSEK)||0;
    const utilization=limit?used/limit*100:0;
    const ltv=collateral?used/collateral*100:0;
    const buffer=Math.max(0,limit-used);
    const targetMax=Math.min(limit*.4,collateral*.15||limit*.4);
    const targetRoom=Math.max(0,targetMax-used);
    return {...r,used,limit,rate,collateral,utilization,ltv,buffer,targetMax,targetRoom,
      dailyInterest:used*rate/100/365, monthlyInterest:used*rate/100/12, annualInterest:used*rate/100};
  }
  function coach(a,x){
    if(!a)return ['Konfigurera Avanza-krediten för att aktivera Credit Coach.'];
    const out=[];
    if(x.utilization>=70) out.push('Prioritet: amortera före nya kreditköp. Utnyttjandegraden är hög.');
    else if(x.utilization>=50) out.push('Var försiktig med nya kreditköp. Du befinner dig i bevakningszonen.');
    else out.push('Krediten ligger inom den lokala målzonen, men varje nytt köp ska fortfarande förbättra portföljens kvalitet.');
    if(x.ltv>=20) out.push('Belåningen mot registrerat belåningsvärde är förhöjd. Testa en amortering i simuleringen.');
    if(x.annualInterest>0) out.push(`Nuvarande kredit kostar ungefär ${money(x.monthlyInterest)} per månad och ${money(x.annualInterest)} per år.`);
    if(x.targetRoom>0) out.push(`Tekniskt målutrymme enligt lokal försiktighetsregel: cirka ${money(x.targetRoom)}. Det är inte en köprekommendation.`);
    return out;
  }
  function forecast(a,monthlyRepay=0,months=12){
    const rows=[]; let used=Number(a?.usedSEK)||0; const rate=Number(a?.annualRatePct)||0;
    for(let m=1;m<=months;m++){used=Math.max(0,used-monthlyRepay); rows.push({m,used,interest:used*rate/100/12});}
    return rows;
  }
  function render(){
    const a=account(), x=analysis(a);
    const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
    set('ic902Used',money(x.used)); set('ic902Available',money(x.buffer)); set('ic902Ltv',pct(x.ltv));
    set('ic902Interest',money(x.monthlyInterest));
    const meter=document.getElementById('ic902Meter'); if(meter)meter.style.width=Math.min(100,x.utilization)+'%';
    const coachBox=document.getElementById('ic902Coach'); if(coachBox)coachBox.innerHTML=coach(a,x).map(t=>`<div class="ic902Advice">${t}</div>`).join('');
    const status=document.getElementById('ic902Status'); if(status){const level=x.utilization>=70?'HÖG RISK':x.utilization>=50?'BEVAKA':'KONTROLLERAD';status.textContent=a?level:'EJ KONFIGURERAD';status.className='ic902Status '+(x.utilization>=70?'red':x.utilization>=50?'amber':'green');}
    renderForecast902(); renderCombo902();
  }
  window.renderForecast902=function(){
    const a=account(), box=document.getElementById('ic902Forecast'); if(!box)return;
    if(!a){box.innerHTML='<div class="ic901Meta">Konfigurera kreditkontot först.</div>';return;}
    const repay=Number(document.getElementById('ic902MonthlyRepay')?.value)||0;
    const rows=forecast(a,repay,12); const pick=[1,3,6,12].map(m=>rows[m-1]);
    box.innerHTML=pick.map(r=>`<div class="ic902ForecastRow"><b>Om ${r.m} mån</b><span>${money(r.used)}</span><small>ränta/mån ${money(r.interest)}</small></div>`).join('');
  };
  window.renderCombo902=function(){
    const a=account(), box=document.getElementById('ic902ComboResult'); if(!box)return;
    if(!a){box.innerHTML='<div class="ic901Meta">Konfigurera kreditkontot först.</div>';return;}
    const sale=Number(document.getElementById('ic902Sale')?.value)||0;
    const buy=Number(document.getElementById('ic902Buy')?.value)||0;
    const cash=Number(document.getElementById('ic902Cash')?.value)||0;
    const creditBuy=Math.max(0,buy-cash), after=Math.max(0,Number(a.usedSEK)-sale+creditBuy);
    const before=analysis(a), ax=analysis({...a,usedSEK:after});
    const iqDelta=Math.round((before.utilization-ax.utilization)/10);
    box.innerHTML=`<div class="ic901Row"><div><div class="ic901Name">Kredit efter scenario</div><div class="ic901Meta">Försäljning ${money(sale)} · köp ${money(buy)} · kontant ${money(cash)}</div></div><div class="ic901Right">${money(after)}</div></div>
    <div class="ic901Row"><div><div class="ic901Name">Månadskostnad</div><div class="ic901Meta">${money(before.monthlyInterest)} → ${money(ax.monthlyInterest)}</div></div><div class="ic901Right">${money(ax.monthlyInterest-before.monthlyInterest)}</div></div>
    <div class="ic901Row"><div><div class="ic901Name">Portfolio IQ-indikation</div><div class="ic901Meta">Lokal kreditpåverkan, inte marknadsprognos</div></div><div class="ic901Right">${iqDelta>=0?'+':''}${iqDelta}</div></div>`;
  };
  window.openInvestmentCredit902=function(){window.openInvestmentCredit901();setTimeout(()=>{render();window.scrollTo({top:0})},30)};
  window.MKCreditIntelligence902={analysis,coach,forecast,render};
  document.addEventListener('input',e=>{if(['ic902MonthlyRepay','ic902Sale','ic902Buy','ic902Cash'].includes(e.target.id)){renderForecast902();renderCombo902();}});
  document.addEventListener('DOMContentLoaded',()=>setTimeout(render,300));
  const old=window.renderInvestmentCredit901; window.renderInvestmentCredit901=function(){old?.();setTimeout(render,0)};
})();
