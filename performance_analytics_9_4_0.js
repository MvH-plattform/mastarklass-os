
(function(){
'use strict';
const fmt=n=>new Intl.NumberFormat('sv-SE',{maximumFractionDigits:0}).format(Number(n||0))+' kr';
const pct=n=>(Number.isFinite(n)?n:0).toFixed(2).replace('.',',')+' %';
const num=v=>{const n=Number(String(v??0).replace(',','.'));return Number.isFinite(n)?n:0};
const dateOf=x=>new Date(x.date||x.createdAt||x.timestamp||Date.now());
function valueOf(h){return num(h.marketValue||h.valueSEK||h.currentValue||h.value||num(h.quantity||h.qty||h.amount)*num(h.priceSEK||h.currentPriceSEK||h.price||h.gav));}
function costOf(h){return num(h.costBasisSEK||h.costBasis||h.investedCapital||num(h.quantity||h.qty||h.amount)*num(h.gavSEK||h.gav||h.averagePrice));}
function txType(t){return String(t.type||t.kind||'').toLowerCase();}
function txAmount(t){return num(t.totalSEK||t.amountSEK||t.netAmountSEK||t.total||t.amount||num(t.quantity||t.qty)*num(t.priceSEK||t.price)*num(t.fxRate||1));}
function snapshotList(){
 const p=window.DATA||{}; const pools=[p.portfolioSnapshots,p.snapshots,p.portfolioTimeline,p.performanceSnapshots];
 return pools.find(Array.isArray)||[];
}
function cashflows(){
 const p=window.DATA||{}, tx=[...(p.transactions||[]),...(p.portfolioLedger930?.entries||[]),...(p.ledger||[])];
 const out=[];
 tx.forEach(t=>{const typ=txType(t),a=txAmount(t),d=dateOf(t);if(!a||isNaN(d))return;
   if(/deposit|insättning|capital_in|transfer_in/.test(typ))out.push({date:d,amount:-Math.abs(a)});
   else if(/withdraw|uttag|capital_out/.test(typ))out.push({date:d,amount:Math.abs(a)});
 });
 return out;
}
function xnpv(rate,flows){const t0=flows[0].date;return flows.reduce((s,f)=>s+f.amount/Math.pow(1+rate,(f.date-t0)/31557600000),0)}
function xirr(flows){if(flows.length<2||!flows.some(f=>f.amount<0)||!flows.some(f=>f.amount>0))return null;let lo=-.9999,hi=10;for(let i=0;i<160;i++){const mid=(lo+hi)/2,v=xnpv(mid,flows);if(Math.abs(v)<.01)return mid;if(v>0)lo=mid;else hi=mid}return (lo+hi)/2}
function maxDrawdown(values){let peak=-Infinity,dd=0;values.forEach(v=>{peak=Math.max(peak,v);if(peak>0)dd=Math.min(dd,(v-peak)/peak)});return dd*100}
function stdev(a){if(a.length<2)return null;const m=a.reduce((s,x)=>s+x,0)/a.length;return Math.sqrt(a.reduce((s,x)=>s+(x-m)**2,0)/(a.length-1))}
function metrics(){
 const p=window.DATA||{}, hs=p.holdings||[], current=hs.reduce((s,h)=>s+valueOf(h),0), cost=hs.reduce((s,h)=>s+costOf(h),0), unreal=current-cost;
 const tx=p.transactions||[], dividends=tx.filter(t=>/dividend|utdelning/.test(txType(t))).reduce((s,t)=>s+Math.abs(txAmount(t)),0);
 const realized=tx.filter(t=>/sell|försälj/.test(txType(t))).reduce((s,t)=>s+num(t.realizedResultSEK||t.realizedResult||t.profitSEK||0),0);
 const snaps=snapshotList().map(x=>({date:dateOf(x),value:num(x.value||x.portfolioValue||x.totalValue||x.marketValue)})).filter(x=>x.value>0&&!isNaN(x.date)).sort((a,b)=>a.date-b.date);
 const returns=[];for(let i=1;i<snaps.length;i++)returns.push(snaps[i].value/snaps[i-1].value-1);
 const vol=stdev(returns);const annualVol=vol==null?null:vol*Math.sqrt(12)*100;
 const rf=0, avg=returns.length?returns.reduce((s,x)=>s+x,0)/returns.length:null;const sharpe=vol&&avg!=null?(avg-rf)/vol*Math.sqrt(12):null;
 const neg=returns.filter(x=>x<0),down=stdev(neg),sortino=down&&avg!=null?(avg-rf)/down*Math.sqrt(12):null;
 const flows=cashflows(); if(current>0)flows.push({date:new Date(),amount:current}); const irr=xirr(flows);
 const totalReturn=cost>0?(current+dividends+realized-cost)/cost*100:null;
 return {hs,current,cost,unreal,dividends,realized,snaps,returns,annualVol,sharpe,sortino,irr,totalReturn,drawdown:maxDrawdown(snaps.map(x=>x.value))};
}
function holdingRows(m){return [...m.hs].map(h=>{const v=valueOf(h),c=costOf(h),r=c?v-c:0,p=c?(v-c)/c*100:0;return {name:h.name||'Innehav',v,c,r,p}}).filter(x=>x.v||x.c).sort((a,b)=>b.r-a.r)}
function render(){const root=document.getElementById('performanceAnalytics940Root');if(!root)return;const m=metrics(),rows=holdingRows(m),coverage=m.hs.length?m.hs.filter(h=>costOf(h)>0&&valueOf(h)>0).length/m.hs.length*100:0;
 root.innerHTML=`<div class="pa940"><div class="pa940Hero"><div class="pa940Kicker">MÄSTARKLASS OS 9.4.0 · PERFORMANCE ANALYTICS</div><h2>Förstå avkastningen – inte bara saldot</h2><p>Lokala beräkningar skiljer kapitalflöden från resultat och visar endast nyckeltal som datan faktiskt stödjer.</p><div class="pa940Grid"><div class="pa940Metric"><span>Marknadsvärde</span><b>${fmt(m.current)}</b></div><div class="pa940Metric"><span>Känd kostnadsbas</span><b>${fmt(m.cost)}</b></div><div class="pa940Metric"><span>Orealiserat</span><b class="${m.unreal>=0?'pa940Good':'pa940Bad'}">${fmt(m.unreal)}</b></div><div class="pa940Metric"><span>Total return*</span><b>${m.totalReturn==null?'—':pct(m.totalReturn)}</b></div></div></div>
 <div class="pa940Tabs"><button class="active" data-pa940="overview">Översikt</button><button data-pa940="holdings">Innehav</button><button data-pa940="risk">Risk</button><button data-pa940="history">Historik</button><button data-pa940="method">Metod</button></div>
 <div class="pa940Panel active" data-pa940-panel="overview"><div class="pa940Card"><h3>Resultatbild</h3><div class="pa940Row"><span>Orealiserat resultat</span><b>${fmt(m.unreal)}</b></div><div class="pa940Row"><span>Registrerat realiserat resultat</span><b>${fmt(m.realized)}</b></div><div class="pa940Row"><span>Registrerade utdelningar</span><b>${fmt(m.dividends)}</b></div><div class="pa940Row"><span>XIRR sedan första kapitalflöde</span><b>${m.irr==null?'Otillräcklig data':pct(m.irr*100)}</b></div></div><div class="pa940Card"><h3>Datatäckning</h3><div class="pa940Row"><span>Innehav med kostnadsbas och värde</span><b>${Math.round(coverage)} %</b></div><div class="pa940Bar"><i style="width:${Math.min(100,coverage)}%"></i></div><p class="pa940Muted">Nyckeltalen blir mer rättvisande när historiska insättningar, uttag och värden registreras.</p></div></div>
 <div class="pa940Panel" data-pa940-panel="holdings"><div class="pa940Card"><h3>Innehavsresultat</h3>${rows.length?`<div style="overflow:auto"><table class="pa940Table"><thead><tr><th>Innehav</th><th>Värde</th><th>Resultat</th><th>%</th></tr></thead><tbody>${rows.slice(0,40).map(x=>`<tr><td>${x.name}</td><td>${fmt(x.v)}</td><td class="${x.r>=0?'pa940Good':'pa940Bad'}">${fmt(x.r)}</td><td>${pct(x.p)}</td></tr>`).join('')}</tbody></table></div>`:'<div class="pa940Empty">Inga innehav med tillräckliga värden.</div>'}</div></div>
 <div class="pa940Panel" data-pa940-panel="risk"><div class="pa940Card"><h3>Riskanalys</h3><div class="pa940Row"><span>Historisk volatilitet, årstakt</span><b>${m.annualVol==null?'Otillräcklig historik':pct(m.annualVol)}</b></div><div class="pa940Row"><span>Maximal drawdown</span><b>${m.snaps.length<2?'Otillräcklig historik':pct(m.drawdown)}</b></div><div class="pa940Row"><span>Sharpe-kvot</span><b>${m.sharpe==null?'—':m.sharpe.toFixed(2).replace('.',',')}</b></div><div class="pa940Row"><span>Sortino-kvot</span><b>${m.sortino==null?'—':m.sortino.toFixed(2).replace('.',',')}</b></div></div><div class="pa940Notice">Riskmåtten aktiveras först när det finns minst två lokala portföljsnapshots. De bygger inte på extern marknadsdata.</div></div>
 <div class="pa940Panel" data-pa940-panel="history"><div class="pa940Card"><h3>Lokala snapshots</h3>${m.snaps.length?m.snaps.slice(-24).reverse().map(x=>`<div class="pa940Row"><span>${x.date.toLocaleDateString('sv-SE')}</span><b>${fmt(x.value)}</b></div>`).join(''):'<div class="pa940Empty">Ingen historik ännu. Portfolio Snapshot Engine behöver skapa lokala snapshots över tid.</div>'}</div></div>
 <div class="pa940Panel" data-pa940-panel="method"><div class="pa940Card"><h3>Beräkningsprinciper</h3><div class="pa940Row"><span>Total return</span><b>(värde + utdelning + realiserat − kostnadsbas) / kostnadsbas</b></div><div class="pa940Row"><span>XIRR</span><b>Datumsviktad internränta från registrerade kapitalflöden</b></div><div class="pa940Row"><span>Volatilitet</span><b>Standardavvikelse för lokala periodavkastningar</b></div><div class="pa940Row"><span>Benchmark</span><b>Ej aktiverad utan godkänd datakälla</b></div></div><div class="pa940Notice">*Total return är en lokal uppskattning. Den kan vara missvisande när kostnadsbas, utdelningar, realiserade resultat eller kapitalflöden saknas.</div></div></div>`;
 root.querySelectorAll('[data-pa940]').forEach(b=>b.onclick=()=>{root.querySelectorAll('[data-pa940]').forEach(x=>x.classList.toggle('active',x===b));root.querySelectorAll('[data-pa940-panel]').forEach(x=>x.classList.toggle('active',x.dataset.pa940Panel===b.dataset.pa940));});
}
window.openPerformanceAnalytics940=function(){const tab=document.querySelectorAll('.tab')[6]||document.querySelectorAll('.tab')[0];window.showScreen('performanceAnalytics940',tab);setTimeout(render,0)};
window.renderPerformanceAnalytics940=render;
const old=window.renderAll; if(typeof old==='function')window.renderAll=function(){old.apply(this,arguments);setTimeout(render,0)};
window.addEventListener('DOMContentLoaded',()=>setTimeout(render,100));
})();
