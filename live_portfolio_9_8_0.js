
(function(global){
'use strict';
const VERSION='9.8.0';
const KEY='mkos.live980.state.v1';
const num=v=>Number(String(v??'').replace(/\s/g,'').replace(',','.'))||0;
const fmt=v=>new Intl.NumberFormat('sv-SE',{maximumFractionDigits:0}).format(num(v))+' kr';
const now=()=>new Date().toISOString();

function load(){
  try{
    const x=JSON.parse(localStorage.getItem(KEY));
    return x&&typeof x==='object'?x:{watch:[],quotes:{},updatedAt:null};
  }catch{return {watch:[],quotes:{},updatedAt:null}}
}
function save(s){localStorage.setItem(KEY,JSON.stringify(s));global.dispatchEvent(new CustomEvent('mkos:live980-updated',{detail:s}));}
function connector(){
  if(!global.MKLiveConnectors970) throw new Error('Live Connector 9.7.2 är inte laddad.');
  return global.MKLiveConnectors970;
}
function addInstrument(row){
  const s=load();
  const symbol=String(row.symbol||'').trim().toUpperCase();
  if(!symbol) throw new Error('Symbol saknas.');
  const item={
    id: row.id||('live-'+symbol.toLowerCase()),
    symbol,
    name:String(row.name||symbol).trim(),
    currency:String(row.currency||'USD').toUpperCase(),
    quantity:num(row.quantity),
    gavSek:num(row.gavSek),
    provider:'alphavantage',
    updatedAt:now()
  };
  const i=s.watch.findIndex(x=>x.id===item.id||x.symbol===symbol);
  if(i>=0)s.watch[i]=item;else s.watch.push(item);
  save(s);return item;
}
function removeInstrument(id){
  const s=load();s.watch=s.watch.filter(x=>x.id!==id);delete s.quotes[id];save(s);
}
async function refreshOne(item){
  const c=connector();
  const quote=await c.fetchAlphaQuote(item.symbol);
  let fx=c.fxToSek(item.currency);
  if(!fx){await c.refreshFx([item.currency]);fx=c.fxToSek(item.currency);}
  if(!fx)throw new Error('Valutakurs saknas för '+item.currency);
  const marketValueSek=item.quantity*quote.price*fx;
  const costBasisSek=item.quantity*item.gavSek;
  return {
    id:item.id,symbol:item.symbol,name:item.name,currency:item.currency,
    quantity:item.quantity,gavSek:item.gavSek,price:quote.price,fxToSek:fx,
    priceSek:quote.price*fx,marketValueSek,costBasisSek,
    resultSek:marketValueSek-costBasisSek,
    resultPct:costBasisSek>0?(marketValueSek/costBasisSek-1)*100:0,
    timestamp:quote.timestamp,source:quote.source,verified:true
  };
}
async function refreshAll(){
  const s=load(), results=[];
  for(const item of s.watch){
    try{
      const q=await refreshOne(item);
      s.quotes[item.id]=q;results.push({ok:true,item,q});
    }catch(e){results.push({ok:false,item,error:e.message||String(e)});}
  }
  s.updatedAt=now();save(s);return results;
}
function summary(){
  const s=load();const qs=Object.values(s.quotes);
  const market=qs.reduce((a,q)=>a+num(q.marketValueSek),0);
  const cost=qs.reduce((a,q)=>a+num(q.costBasisSek),0);
  return {count:s.watch.length,priced:qs.length,market,cost,result:market-cost,resultPct:cost>0?(market/cost-1)*100:0,updatedAt:s.updatedAt};
}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function status(el,msg,type=''){el.className='mk980-status '+type;el.textContent=msg;}
function render(){
  const host=document.getElementById('mk980Host'); if(!host)return;
  const s=load(),sum=summary();
  host.innerHTML=`
  <div class="mk980-shell">
    <section class="mk980-hero">
      <div class="mk980-eyebrow">Mästarklass OS ${VERSION} · Live Portfolio Engine</div>
      <h2>Verkliga kurser möter din portfölj</h2>
      <p>Alpha Vantage-kurser och ECB-valuta räknas om till SEK i ett separat read-only-lager. Private Vault, antal, GAV och transaktioner skrivs aldrig över.</p>
      <div class="mk980-grid">
        <div class="mk980-kpi"><span>Pilotinnehav</span><strong>${sum.count}</strong></div>
        <div class="mk980-kpi"><span>Prissatta</span><strong>${sum.priced}</strong></div>
        <div class="mk980-kpi"><span>Pilotvärde</span><strong>${fmt(sum.market)}</strong></div>
        <div class="mk980-kpi"><span>Resultat</span><strong>${fmt(sum.result)}</strong></div>
      </div>
    </section>
    <nav class="mk980-tabs">
      <button data-tab="setup" class="active">Pilot</button>
      <button data-tab="portfolio">Portföljvärde</button>
      <button data-tab="audit">Kontroll</button>
    </nav>
    <section data-section="setup" class="mk980-section active">
      <div class="mk980-card">
        <h3>Lägg till pilotinnehav</h3>
        <div class="mk980-row">
          <div class="mk980-field"><label>Symbol</label><input id="mk980Symbol" placeholder="IBM"></div>
          <div class="mk980-field"><label>Namn</label><input id="mk980Name" placeholder="IBM"></div>
          <div class="mk980-field"><label>Valuta</label><select id="mk980Currency"><option>USD</option><option>EUR</option><option>SEK</option><option>CAD</option><option>NOK</option></select></div>
          <div class="mk980-field"><label>Antal</label><input id="mk980Qty" inputmode="decimal" placeholder="10"></div>
          <div class="mk980-field"><label>GAV per aktie i SEK</label><input id="mk980Gav" inputmode="decimal" placeholder="1800"></div>
        </div>
        <div class="mk980-actions">
          <button id="mk980Add" class="mk980-btn primary">Spara pilotinnehav</button>
          <button id="mk980Refresh" class="mk980-btn">Hämta livekurser</button>
        </div>
        <div id="mk980Status" class="mk980-status">Börja med IBM eller ett annat utländskt innehav. Alpha Vantage-nyckeln från 9.7 används lokalt.</div>
      </div>
      <div class="mk980-card"><h3>Pilotlista</h3><div id="mk980List"></div></div>
    </section>
    <section data-section="portfolio" class="mk980-section">
      <div class="mk980-card"><h3>Livevärdering</h3><div id="mk980Portfolio"></div></div>
    </section>
    <section data-section="audit" class="mk980-section">
      <div class="mk980-card">
        <h3>Datakontroll</h3>
        <p class="mk980-mini">Livekurserna ligger i LocalStorage-nyckeln <code>${KEY}</code>. De används bara som separat pilotdata och ändrar inte Private Vault eller Portfolio Ledger.</p>
        <div id="mk980Audit"></div>
      </div>
    </section>
  </div>`;
  wire();renderLists();
}
function renderLists(){
  const s=load(),sum=summary();
  const list=document.getElementById('mk980List');
  list.innerHTML=s.watch.length?`<table class="mk980-table"><thead><tr><th>Innehav</th><th>Antal</th><th></th></tr></thead><tbody>${s.watch.map(x=>`<tr><td><strong>${esc(x.name)}</strong><div class="mk980-mini">${esc(x.symbol)} · ${esc(x.currency)}</div></td><td>${x.quantity}</td><td><button class="mk980-btn" data-remove="${esc(x.id)}">Ta bort</button></td></tr>`).join('')}</tbody></table>`:'<p class="mk980-mini">Inga pilotinnehav ännu.</p>';
  const port=document.getElementById('mk980Portfolio');
  const qs=Object.values(s.quotes);
  port.innerHTML=qs.length?`<table class="mk980-table"><thead><tr><th>Innehav</th><th>Kurs SEK</th><th>Värde</th><th>Resultat</th></tr></thead><tbody>${qs.map(q=>`<tr><td><strong>${esc(q.name)}</strong><div class="mk980-mini">${esc(q.symbol)} · ${esc(q.source)}</div></td><td>${q.priceSek.toFixed(2)}</td><td>${fmt(q.marketValueSek)}</td><td>${fmt(q.resultSek)}<div class="mk980-mini">${q.resultPct.toFixed(1)}%</div></td></tr>`).join('')}</tbody></table>`:'<p class="mk980-mini">Hämta livekurser för att se värderingen.</p>';
  const audit=document.getElementById('mk980Audit');
  audit.innerHTML=`<div class="mk980-grid"><div class="mk980-kpi"><span>Connector</span><strong>${global.MKLiveConnectors970?'OK':'Saknas'}</strong></div><div class="mk980-kpi"><span>ECB</span><strong>${global.MKLiveConnectors970?.fxToSek?.('USD')?'OK':'Väntar'}</strong></div><div class="mk980-kpi"><span>Senast uppdaterad</span><strong style="font-size:15px">${sum.updatedAt?new Date(sum.updatedAt).toLocaleString('sv-SE'):'—'}</strong></div><div class="mk980-kpi"><span>Read-only</span><strong>JA</strong></div></div>`;
  document.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{removeInstrument(b.dataset.remove);render();});
}
function wire(){
  document.querySelectorAll('.mk980-tabs button').forEach(b=>b.onclick=()=>{
    document.querySelectorAll('.mk980-tabs button').forEach(x=>x.classList.remove('active'));
    document.querySelectorAll('.mk980-section').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');document.querySelector(`[data-section="${b.dataset.tab}"]`).classList.add('active');
  });
  document.getElementById('mk980Add').onclick=()=>{
    const st=document.getElementById('mk980Status');
    try{
      addInstrument({symbol:document.getElementById('mk980Symbol').value,name:document.getElementById('mk980Name').value,currency:document.getElementById('mk980Currency').value,quantity:document.getElementById('mk980Qty').value,gavSek:document.getElementById('mk980Gav').value});
      status(st,'Pilotinnehavet sparades lokalt.','ok');render();
    }catch(e){status(st,e.message||String(e),'error');}
  };
  document.getElementById('mk980Refresh').onclick=async()=>{
    const st=document.getElementById('mk980Status');status(st,'Hämtar verifierade kurser…','warn');
    try{
      const r=await refreshAll(),ok=r.filter(x=>x.ok).length,bad=r.length-ok;
      status(st,`Klart: ${ok} kurser uppdaterade${bad?`, ${bad} misslyckades`:''}.`,bad?'warn':'ok');renderLists();
    }catch(e){status(st,e.message||String(e),'error');}
  };
}
function mount(){
  let host=document.getElementById('mk980Host');
  if(!host){
    host=document.createElement('section');host.id='mk980Host';
    const live=document.getElementById('live970')||document.querySelector('[data-screen="live970"]')||document.querySelector('.screen.active')||document.querySelector('main');
    (live||document.body).appendChild(host);
  }
  render();
}
global.MKLivePortfolio980={VERSION,load,addInstrument,removeInstrument,refreshOne,refreshAll,summary,mount};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})(window);
