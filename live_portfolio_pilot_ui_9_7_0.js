(function(){
  'use strict';
  function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
  function findHoldings(){
    const candidates=[window.portfolioData,window.holdings,window.MKPortfolio?.holdings,window.MKOS?.portfolio?.holdings];
    return candidates.find(Array.isArray)||[];
  }
  function render(target){
    const root=typeof target==='string'?document.querySelector(target):target;if(!root||!window.MKLivePortfolioPilot)return;
    const s=MKLivePortfolioPilot.state(),sum=MKLivePortfolioPilot.summary(findHoldings());
    root.classList.add('mk-live-pilot');
    root.innerHTML=`<section class="lp-hero"><div class="lp-kicker">MÄSTARKLASS OS 9.7.0 · LIVE PORTFOLIO PILOT</div><h2>Verifiera verkliga data utan att röra Private Vault</h2><p>Read-only pilot för kurser, valuta, färskhet, avvikelsekontroll och källspårning.</p><div class="lp-grid"><div class="lp-stat">Matchade<b>${sum.matched}/${sum.total}</b></div><div class="lp-stat">Användbara<b>${sum.usable}</b></div><div class="lp-stat">Blockerade<b>${sum.blocked}</b></div><div class="lp-stat">Pilotvärde<b>${Math.round(sum.liveValue).toLocaleString('sv-SE')} kr</b></div></div></section>
    <section class="lp-panel"><h3>Lägg till verifierad kurs</h3><form id="lpForm"><label>Ticker/id<input name="id" required></label><label>Namn<input name="name"></label><label>Tillgångsslag<select name="assetType"><option>equity</option><option>etf</option><option>fund</option><option>fx</option></select></label><label>Pris<input name="price" inputmode="decimal" required></label><label>Valuta<input name="currency" value="SEK"></label><label>FX till SEK<input name="fxToSek" value="1" inputmode="decimal"></label><label>Källa<input name="source" value="manual"></label><label>Tidsstämpel<input name="timestamp" type="datetime-local"></label><button>Spara i pilotlager</button></form></section>
    <section class="lp-panel"><h3>CSV-import</h3><p>Kolumner: id,name,assetType,price,currency,fxToSek,timestamp,source,verified</p><input id="lpFile" type="file" accept=".csv,text/csv"><div id="lpImportStatus"></div></section>
    <section class="lp-panel"><h3>Kursregister</h3><table><thead><tr><th>Instrument</th><th>SEK-pris</th><th>Källa</th><th>Status</th></tr></thead><tbody>${s.quotes.map(q=>`<tr><td>${esc(q.name||q.id)}</td><td>${Math.round(q.sekPrice).toLocaleString('sv-SE')}</td><td>${esc(q.source)}</td><td><span class="lp-badge ${q.freshness==='fresh'?'lp-ok':q.freshness==='stale'?'lp-warn':'lp-bad'}">${esc(q.freshness)}</span></td></tr>`).join('')||'<tr><td colspan="4">Inga kurser importerade ännu.</td></tr>'}</tbody></table></section>`;
    const f=root.querySelector('#lpForm');f.addEventListener('submit',e=>{e.preventDefault();const d=Object.fromEntries(new FormData(f));if(d.timestamp)d.timestamp=new Date(d.timestamp).toISOString();MKLivePortfolioPilot.upsert(d);render(root)});
    root.querySelector('#lpFile').addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;const result=MKLivePortfolioPilot.importCSV(await file.text());root.querySelector('#lpImportStatus').textContent=`Importerade ${result.ok}. Fel ${result.errors.length}.`;render(root)});
  }
  window.MKLivePortfolioPilotUI={render};
  document.addEventListener('DOMContentLoaded',()=>{const auto=document.querySelector('[data-mk-live-pilot]');if(auto)render(auto)});
})();
