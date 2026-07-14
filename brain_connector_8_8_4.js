(function(){
  'use strict';
  const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
  const money=v=>Math.round(Number(v||0)).toLocaleString('sv-SE')+' kr';
  const pct=v=>Number(v||0).toFixed(1).replace('.',',')+'%';
  window.renderUnifiedBrain884=function(){
    const r=window.MKUnifiedIntelligence884?.get(); if(!r)return;
    set('pb71IQ',`${r.portfolioIQ}/100`); set('pb71Problems',r.problems.length?r.problems.length:'Inga kritiska'); set('pb71Overlaps',String(r.overlaps.length)); set('pb71Coverage',`${r.dataCoverage}%`);
    const summary=document.getElementById('pb71SummaryItems'); if(summary)summary.innerHTML=r.summary.map(x=>`<div class="pb71SummaryItem"><span class="pb71Dot"></span><span>${x}</span></div>`).join('');
    const labels={dataCoverage:'Datatäckning',concentrationControl:'Koncentrationskontroll',overlapControl:'Överlappskontroll',sectorDiversification:'Sektorspridning',countryDiversification:'Geografi',currencyDiversification:'Valuta',assetDiversification:'Tillgångsslag',accountDiversification:'Kontospridning'};
    const comp=document.getElementById('pb71Components'); if(comp)comp.innerHTML=Object.entries(r.components).map(([k,v])=>`<div class="pb71Score"><span>${labels[k]||k}</span><b>${v}/100</b><div class="pb71Bar"><span style="width:${v}%"></span></div></div>`).join('');
    const probs=document.getElementById('pb71ProblemList'); if(probs)probs.innerHTML=r.problems.length?r.problems.map(x=>`<div class="pb71Row"><div><div class="pb71Name">${x.title}</div><div class="pb71Muted">${x.text}</div><span class="pb71Badge ${x.severity==='high'?'pb71High':x.severity==='medium'?'pb71Medium':'pb71Low'}">${x.severity==='high'?'HÖG':x.severity==='medium'?'BEVAKA':'INFO'}</span></div></div>`).join(''):'<div class="pb71Muted">Inga strukturella problem hittades.</div>';
    const ov=document.getElementById('pb71OverlapList'); if(ov)ov.innerHTML=r.overlaps.length?r.overlaps.map(x=>`<div class="pb71Row"><div><div class="pb71Name">${x.name}</div><div class="pb71Muted">${x.count} poster${x.accounts.length?' · '+x.accounts.join(' · '):''}</div><span class="pb71Badge pb71Low">LOKALT MATCHAD</span></div><div class="pb71Right">${money(x.valueSEK)}</div></div>`).join(''):'<div class="pb71Muted">Inga tydliga överlapp hittades.</div>';
    const alloc=document.getElementById('pb71Allocation'); if(alloc)alloc.innerHTML=r.allocation.map((x,i)=>`<div class="pb71Alloc"><div class="pb71AllocTop"><div><div class="pb71Name">${i+1}. ${x.name}</div><div class="pb71Muted">${x.account} · ${x.reason}</div></div><b>${money(x.amountSEK)}</b></div><div class="pb71Muted">Förbättringspoäng ${x.score} · vikt ${pct(x.weightPct)} · målvikt ${pct(x.targetWeightPct)}</div></div>`).join('')||'<div class="pb71Muted">Ingen kapitalallokering kunde beräknas.</div>';
    const dna=document.getElementById('pb71DNA'); if(dna)dna.innerHTML=r.portfolioDNA.map(x=>`<div class="pb71DnaItem"><div class="pb71DnaHead"><span>${x.label}</span><b>${pct(x.pct)}</b></div><div class="pb71Bar"><span style="width:${Math.min(100,x.pct)}%"></span></div><div class="pb71Muted">${money(x.valueSEK)}</div></div>`).join('');
    const radar=document.getElementById('pb71Radar'); if(radar)radar.innerHTML=r.radar.map(x=>`<div class="pb71Row"><div><div class="pb71Name">${x.label}</div><div class="pb71Muted">${x.name} · ${x.signal}</div></div><div class="pb71Right">${x.score}/100</div></div>`).join('');
    const sys=document.getElementById('pb71System'); if(sys)sys.innerHTML=Object.entries(r.status).map(([k,v])=>`<div class="pb71SystemRow"><span>${k}</span><b>${v}</b></div>`).join('');
    document.getElementById('portfolioBrain71')?.setAttribute('data-sync884','ready');
  };
  const originalOpen=window.openPortfolioBrain71;
  window.openPortfolioBrain71=function(){ if(typeof originalOpen==='function')originalOpen(); setTimeout(window.renderUnifiedBrain884,0); };
  window.MKEventBus883?.on('sync:complete',()=>window.renderUnifiedBrain884());
})();
