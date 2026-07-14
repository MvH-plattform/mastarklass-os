(function(){
  'use strict';
  const n=v=>{const x=Number(v);return Number.isFinite(x)?x:0};
  const clamp=(v,min=0,max=100)=>Math.max(min,Math.min(max,v));
  const value=h=>n(h?.marketValueSEK||h?.value||h?.costValueSEK||h?.investedSEK);
  const text=v=>String(v??'').trim();
  const norm=v=>text(v).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
  const key=h=>norm(h?.isin)||norm(h?.ticker)||norm(h?.name);
  const group=(holdings,field,total)=>{
    const map=new Map();
    holdings.forEach(h=>{const k=text(h?.[field])||'Ej satt';map.set(k,(map.get(k)||0)+value(h));});
    return [...map.entries()].map(([name,v])=>({name,valueSEK:v,pct:total?v/total*100:0})).sort((a,b)=>b.valueSEK-a.valueSEK);
  };
  const completeness=h=>['name','type','currency','country','sector'].reduce((s,k)=>s+(text(h?.[k])?1:0),0)/5;
  const diversityScore=groups=>{
    const known=groups.filter(x=>x.name!=='Ej satt'&&x.valueSEK>0);
    if(!known.length)return 0;
    const hhi=known.reduce((s,x)=>s+Math.pow(x.pct/100,2),0);
    return clamp(Math.round((1-hhi)*125));
  };
  const overlapInfo=holdings=>{
    const map=new Map();
    holdings.forEach(h=>{const k=key(h);if(!k)return;(map.get(k)||map.set(k,[]).get(k)).push(h);});
    return [...map.values()].filter(g=>g.length>1).map(g=>({
      name:text(g[0].name)||text(g[0].ticker)||'Namnlöst innehav',
      count:g.length,
      accounts:[...new Set(g.map(x=>text(x.account||x.accountName||x.platform)).filter(Boolean))],
      valueSEK:g.reduce((s,h)=>s+value(h),0),
      items:g
    })).sort((a,b)=>b.valueSEK-a.valueSEK);
  };
  function analyze(data){
    const holdings=(Array.isArray(data?.holdings)?data.holdings:[]).filter(h=>!h?.status||String(h.status).startsWith('verified')||h.status==='active');
    const valued=holdings.filter(h=>value(h)>0);
    const total=valued.reduce((s,h)=>s+value(h),0);
    const sorted=[...valued].sort((a,b)=>value(b)-value(a));
    const largest=sorted[0]||null;
    const largestPct=largest&&total?value(largest)/total*100:0;
    const coverage=holdings.length?valued.length/holdings.length*100:0;
    const fieldCoverage=holdings.length?holdings.reduce((s,h)=>s+completeness(h),0)/holdings.length*100:0;
    const overlaps=overlapInfo(holdings);
    const sectors=group(valued,'sector',total), countries=group(valued,'country',total), currencies=group(valued,'currency',total), assets=group(valued,'type',total), accounts=group(valued,'platform',total);
    const concentration=clamp(Math.round(100-Math.max(0,largestPct-5)*3.2));
    const overlapControl=clamp(Math.round(100-overlaps.length*6));
    const dataCoverage=clamp(Math.round(coverage*.65+fieldCoverage*.35));
    const components={
      dataCoverage,
      concentrationControl:concentration,
      overlapControl,
      sectorDiversification:diversityScore(sectors),
      countryDiversification:diversityScore(countries),
      currencyDiversification:diversityScore(currencies),
      assetDiversification:diversityScore(assets),
      accountDiversification:diversityScore(accounts)
    };
    const iq=Math.round(components.dataCoverage*.22+components.concentrationControl*.22+components.overlapControl*.12+components.sectorDiversification*.14+components.countryDiversification*.10+components.currencyDiversification*.08+components.assetDiversification*.07+components.accountDiversification*.05);
    const problems=[];
    if(largestPct>=20)problems.push({severity:'high',title:'Hög koncentration',text:`${text(largest?.name)||'Största innehavet'} utgör ${largestPct.toFixed(1).replace('.',',')}% av känt portföljvärde.`});
    else if(largestPct>=12)problems.push({severity:'medium',title:'Koncentrationsbevakning',text:`${text(largest?.name)||'Största innehavet'} utgör ${largestPct.toFixed(1).replace('.',',')}% av känt portföljvärde.`});
    if(coverage<80)problems.push({severity:'medium',title:'Ofullständig värdetäckning',text:`${valued.length} av ${holdings.length} innehav har ett registrerat marknadsvärde.`});
    if(overlaps.length)problems.push({severity:'low',title:'Dubbla innehav',text:`${overlaps.length} namn eller instrument förekommer på fler än ett konto.`});
    const strongest=[...components.entries?.()||[]];
    const summary=[];
    summary.push(`Portfolio IQ är ${iq}/100 och bygger på samma lokala analysobjekt i Analytics och Portfolio Brain.`);
    if(largest)summary.push(`Största innehavet är ${largest.name} med ${largestPct.toFixed(1).replace('.',',')}% av känt värde.`);
    summary.push(`Värdetäckningen är ${valued.length}/${holdings.length} innehav och datatäckningen ${dataCoverage}%.`);
    summary.push(overlaps.length?`${overlaps.length} överlapp behöver granskas; de är nu identiska i alla analysvyer.`:'Inga namnbaserade överlapp identifierades i den lokala portföljen.');
    summary.push(problems.some(p=>p.severity==='high')?'Nästa prioritet: minska koncentrationsrisken innan nytt kapital läggs i största innehavet.':coverage<80?'Nästa prioritet: komplettera saknade marknadsvärden och instrumentdata.':'Nästa prioritet: fortsätt bygga kärninnehav utan att öka koncentrationen.');
    const allocation=sorted.filter(h=>value(h)>0).slice().sort((a,b)=>value(a)-value(b)).slice(0,5).map((h,i)=>({name:h.name,account:h.platform||h.accountName||h.account||'',reason:'Låg nuvarande vikt i känd portfölj',amountSEK:[3000,2500,2000,1500,1000][i],score:Math.max(50,80-i*6),weightPct:total?value(h)/total*100:0,targetWeightPct:Math.min(8,(total?value(h)/total*100:0)+1.5)}));
    const dna=[...assets.slice(0,3).map(x=>({label:x.name,pct:x.pct,valueSEK:x.valueSEK})),...currencies.slice(0,2).map(x=>({label:`Valuta ${x.name}`,pct:x.pct,valueSEK:x.valueSEK}))];
    const radar=[
      {label:'Största position',name:largest?.name||'Saknas',signal:largestPct>=20?'Minska risk':'Bevaka',score:Math.round(clamp(100-largestPct*2))},
      {label:'Datakvalitet',name:`${valued.length}/${holdings.length} värdesatta`,signal:coverage>=80?'Stabil':'Komplettera',score:dataCoverage},
      {label:'Överlapp',name:`${overlaps.length} identifierade`,signal:overlaps.length?'Granska':'OK',score:overlapControl}
    ];
    return {version:'8.8.4',generatedAt:new Date().toISOString(),holdings,valued,total,coverage,fieldCoverage,dataCoverage,largest,largestPct,overlaps,sectors,countries,currencies,assets,accounts,components,portfolioIQ:clamp(iq),problems,summary,allocation,portfolioDNA:dna,radar,status:{'Unified Intelligence Engine':'AKTIV','Gemensamt analysobjekt':'AKTIV','Portfolio Analytics':'SYNKAD','Portfolio Brain':'SYNKAD','Extern marknadsdata':'AV','Bankkoppling':'AV','Handel':'AV'}};
  }
  window.MKUnifiedIntelligence884={analyze,get(){const result=analyze(window.DATA||{}); if(window.DATA)window.DATA.unifiedIntelligence884=result; return result;}};
})();
