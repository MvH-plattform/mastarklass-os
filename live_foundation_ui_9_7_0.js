
function live970Money(v){return Math.round(Number(v)||0).toLocaleString('sv-SE')+' kr'}
function live970Esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function live970Holdings(){return Array.isArray(window.DATA?.holdings)?window.DATA.holdings:[]}
function live970HoldingId(h){return String(h.id||h.isin||h.ticker||h.name||'')}

function openLiveFoundation970(){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById('liveFoundation970')?.classList.add('active');
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  setupLiveFoundation970();renderLiveFoundation970();
  window.scrollTo({top:0,behavior:'smooth'});
}
function setupLiveFoundation970(){
  if(!window.__live970Tabs){
    window.__live970Tabs=true;
    document.addEventListener('click',e=>{
      const b=e.target.closest('[data-live970tab]');if(!b)return;
      document.querySelectorAll('.live970Tab').forEach(x=>x.classList.remove('active'));
      document.querySelectorAll('.live970Panel').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      document.getElementById('live970-'+b.dataset.live970tab)?.classList.add('active');
      renderLiveFoundation970();
    });
  }
  const file=document.getElementById('live970Csv');
  if(file&&!file.dataset.bound){
    file.dataset.bound='1';
    file.addEventListener('change',async e=>{
      const f=e.target.files?.[0];if(!f)return;
      try{
        const r=MKLivePortfolioPilot.importCSV(await f.text());
        document.getElementById('live970CsvMessage').textContent=`Importerade ${r.ok}. Fel ${r.errors.length}.`;
        renderLiveFoundation970();
      }catch(err){document.getElementById('live970CsvMessage').textContent=err.message}
    });
  }
}
function renderLiveFoundation970(){
  if(!window.MKLivePortfolioPilot||!window.MKLiveConnectors970)return;
  const holdings=live970Holdings(),sum=MKLivePortfolioPilot.summary(holdings),state=MKLivePortfolioPilot.state();
  const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
  set('live970Matched',`${sum.matched}/${sum.total}`);set('live970Usable',sum.usable);set('live970Blocked',sum.blocked);set('live970Value',live970Money(sum.liveValue));

  const status=document.getElementById('live970StatusRows');
  if(status)status.innerHTML=[
    ['Private Vault','SKRIVSKYDDAD','Livepiloten ändrar inte antal, GAV eller transaktioner.','ok'],
    ['ECB-valuta',Object.keys(MKLiveConnectors970.fxState().rates||{}).length>1?'AKTIV':'REDO','Officiella dagliga referenskurser till SEK.','ok'],
    ['Alpha Vantage',MKLiveConnectors970.getAlphaKey()?'NYCKEL SPARAD':'NYCKEL SAKNAS','Egen lokal API-nyckel krävs.','warn'],
    ['Instrumentmappningar',String(MKLiveConnectors970.mappings().length), 'Börja med ett fåtal pilotinnehav.','info'],
    ['Fondkurser','MANUELL/CSV','Extern fondkälla är inte aktiverad ännu.','warn']
  ].map(x=>`<div class="live970Row"><div><b>${x[0]}</b><small>${x[2]}</small></div><span class="${x[3]}">${x[1]}</span></div>`).join('');

  const comparisons=document.getElementById('live970Comparisons');
  if(comparisons){
    const rows=sum.rows.filter(x=>!x.missing);
    comparisons.innerHTML=rows.length?rows.map(x=>`<div class="live970Compare">
      <div><b>${live970Esc(x.quote.name||x.holdingId)}</b><small>${live970Esc(x.quote.source)} · ${live970Esc(x.quote.timestamp)} · ${live970Esc(x.quote.freshness)}</small></div>
      <div class="live970CompareGrid"><span>Lokalt<b>${live970Money(x.localValue)}</b></span><span>Pilot<b>${live970Money(x.liveValue)}</b></span><span>Avvikelse<b>${x.deviationPct==null?'—':x.deviationPct.toFixed(2)+' %'}</b></span><span>Status<b class="${x.blocked?'bad':'good'}">${x.blocked?'BLOCKERAD':'ANVÄNDBAR'}</b></span></div>
    </div>`).join(''):'<div class="live970Empty">Inga innehav har ännu en matchad pilotkurs.</div>';
  }

  const providers=document.getElementById('live970Providers');
  if(providers)providers.innerHTML=MKLiveProviderRegistry.list().map(p=>`<div class="live970Row"><div><b>${live970Esc(p.name)}</b><small>${live970Esc(p.notes)}</small></div><span class="${p.enabled?'ok':'info'}">${p.enabled?p.health.toUpperCase():'AV'}</span></div>`).join('');
  const key=document.getElementById('live970AlphaKey');if(key&&!key.value&&MKLiveConnectors970.getAlphaKey())key.value='••••••••••••';

  const fx=document.getElementById('live970FxStatus');
  if(fx){
    const fs=MKLiveConnectors970.fxState();
    fx.innerHTML=Object.entries(fs.rates||{}).map(([c,r])=>`<div class="live970Row"><div><b>${c} → SEK</b><small>${r.date||fs.updatedAt||''} · ${r.source||'ECB'}</small></div><strong>${Number(r.toSEK||0).toFixed(6)}</strong></div>`).join('')||'<div class="live970Empty">Inga valutakurser hämtade.</div>';
  }

  const hs=document.getElementById('live970Holding');
  if(hs&&hs.dataset.count!==String(holdings.length)){
    hs.innerHTML=holdings.map(h=>`<option value="${live970Esc(live970HoldingId(h))}">${live970Esc(h.name)} · ${live970Esc(h.platform||h.account||'')}</option>`).join('');
    hs.dataset.count=holdings.length;
  }
  const maps=document.getElementById('live970Mappings');
  if(maps)maps.innerHTML=MKLiveConnectors970.mappings().map(m=>`<div class="live970Row"><div><b>${live970Esc(m.holdingName)}</b><small>${live970Esc(m.provider)} · ${live970Esc(m.symbol)} · ${live970Esc(m.currency)}</small></div><button class="live970Tiny" onclick="removeMapping970('${live970Esc(m.holdingId)}')">Ta bort</button></div>`).join('')||'<div class="live970Empty">Inga mappningar sparade.</div>';

  const quotes=document.getElementById('live970Quotes');
  if(quotes)quotes.innerHTML=state.quotes.map(q=>`<div class="live970Row"><div><b>${live970Esc(q.name||q.id)}</b><small>${live970Esc(q.source)} · ${live970Esc(q.timestamp)} · ${live970Esc(q.status)}</small></div><div><strong>${Number(q.price).toFixed(4)} ${q.currency}</strong><small>${Number(q.sekPrice).toFixed(4)} SEK</small></div></div>`).join('')||'<div class="live970Empty">Inga kurser i pilotlagret.</div>';

  const audit=document.getElementById('live970Audit');
  if(audit)audit.innerHTML=state.audit.slice(0,100).map(a=>`<div class="live970Row"><div><b>${live970Esc(a.type)}</b><small>${live970Esc(a.at)} · ${live970Esc(JSON.stringify(a.detail))}</small></div></div>`).join('')||'<div class="live970Empty">Auditloggen är tom.</div>';
}
function saveAlphaKey970(){
  const input=document.getElementById('live970AlphaKey'),msg=document.getElementById('live970ProviderMessage');
  try{
    if(input.value.includes('•'))throw new Error('Skriv in den riktiga nyckeln för att ändra den.');
    MKLiveConnectors970.setAlphaKey(input.value);msg.textContent='API-nyckeln är sparad lokalt på denna enhet.';renderLiveFoundation970();
  }catch(e){msg.textContent=e.message}
}
async function testAlphaProvider970(){
  const msg=document.getElementById('live970ProviderMessage');msg.textContent='Testar…';
  try{const q=await MKLiveConnectors970.fetchAlphaQuote('IBM');msg.textContent=`Test OK: IBM ${q.price} USD, ${q.timestamp}.`}
  catch(e){msg.textContent='Test misslyckades: '+e.message}
}
async function refreshEcbFx970(){
  const box=document.getElementById('live970FxStatus');
  if(box)box.innerHTML='<div class="live970Empty">Hämtar ECB-valutor…</div>';
  try{
    const currencies=[...new Set(live970Holdings().map(h=>h.currency).filter(Boolean))];
    await MKLiveConnectors970.refreshFx(currencies);
    renderLiveFoundation970();
  }catch(e){if(box)box.innerHTML=`<div class="live970Notice warn"><b>ECB-hämtning misslyckades</b><p>${live970Esc(e.message)}</p></div>`}
}
function saveMapping970(){
  const id=document.getElementById('live970Holding').value;
  const h=live970Holdings().find(x=>live970HoldingId(x)===id);
  try{
    MKLiveConnectors970.saveMapping({holdingId:id,holdingName:h?.name||id,provider:document.getElementById('live970Provider').value,symbol:document.getElementById('live970Symbol').value,currency:document.getElementById('live970Currency').value,assetType:document.getElementById('live970AssetType').value});
    renderLiveFoundation970();
  }catch(e){alert(e.message)}
}
function removeMapping970(id){MKLiveConnectors970.removeMapping(id);renderLiveFoundation970()}
async function refreshMappedQuotes970(){
  const status=document.getElementById('live970SystemStatus');status.textContent='UPPDATERAR…';
  try{
    const currencies=MKLiveConnectors970.mappings().map(m=>m.currency);
    await MKLiveConnectors970.refreshFx(currencies);
    const results=await MKLiveConnectors970.refreshAll();
    status.textContent=`KLAR: ${results.filter(x=>x.ok).length}/${results.length}`;
    MKLivePortfolioPilot.settings({lastRefreshAt:new Date().toISOString(),lastRefreshResults:results});
    renderLiveFoundation970();
  }catch(e){status.textContent='FEL: '+e.message}
}
function runLiveSystemTests970(){
  const tests=[
    ['Private Vault read-only',true,'Piloten använder separat localStorage-namespace.'],
    ['Innehav laddade',live970Holdings().length>0,`${live970Holdings().length} innehav`],
    ['Provider Registry',!!window.MKLiveProviderRegistry,'Registry laddad'],
    ['ECB connector',!!window.MKLiveConnectors970?.refreshFx,'Connector laddad'],
    ['Alpha connector',!!window.MKLiveConnectors970?.fetchAlphaQuote,'Connector laddad'],
    ['Mappningar',MKLiveConnectors970.mappings().length>0,`${MKLiveConnectors970.mappings().length} mappningar`],
    ['Användbara kurser',MKLivePortfolioPilot.summary(live970Holdings()).usable>0,`${MKLivePortfolioPilot.summary(live970Holdings()).usable} kurser`]
  ];
  document.getElementById('live970Tests').innerHTML=tests.map(t=>`<div class="live970Row"><div><b>${t[0]}</b><small>${t[2]}</small></div><span class="${t[1]?'ok':'warn'}">${t[1]?'PASS':'VÄNTAR'}</span></div>`).join('');
}
function saveLiveFeedback970(){
  const type=document.getElementById('live970FeedbackType').value,text=document.getElementById('live970FeedbackText').value.trim();
  if(!text){alert('Beskriv vad du upptäckte.');return}
  const s=MKLivePortfolioPilot.state();
  s.audit.unshift({id:crypto.randomUUID?.()||String(Date.now()),type:'user-feedback',detail:{category:type,text},at:new Date().toISOString()});
  localStorage.setItem('mkos.live.pilot.v1',JSON.stringify(s));
  document.getElementById('live970FeedbackText').value='';
  renderLiveFoundation970();
}
