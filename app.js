(()=>{'use strict';
const VERSION='11.0.1';
const DATA_KEY='mastarklass_os_10_data';
const LIVE_KEY='mastarklass_os_live_readonly_v1';
const SETTINGS_KEY='mastarklass_os_10_settings';
const ADMIN_KEY='mastarklass_os_10_3_1_admin';
const TX_KEY='mastarklass_os_10_3_transactions';
const LEDGER_KEY='mastarklass_os_10_4_ledger';
const LIVE_FOUNDATION_KEY='mastarklass_os_11_live_foundation';
const LIVE_EVENT_KEY='mastarklass_os_11_live_events';
const NAV=[['home','🏠','Hem'],['portfolio','📊','Portfölj'],['market','🌍','Marknad'],['analysis','🧠','Analys'],['ideas','💡','Idéer'],['goals','🎯','Mål'],['more','☰','Mer']];
const DEFAULTS={portfolio:{net:0,monthly:9000,credit:0},holdings:[],accounts:[],goals:{capital:7500000,annualDividend:480000},monthlyPlan:{total:9000},marketCenter:{items:[]},ideaBank:[],aiRadar:[],reports:[],journal:[]};
const ADMIN_DEFAULT={overrides:{},newHoldings:[],credits:{},audit:[]};
let data=structuredClone(DEFAULTS),admin=structuredClone(ADMIN_DEFAULT),transactions=[],ledger=[],screen='home',sourceKey=null;
let query='',typeFilter='all',accountFilter='all',sortMode='value_desc',portfolioTab='overview',intelFilter='all';

const parse=x=>{try{return JSON.parse(x)}catch{return null}};
const num=x=>{if(x===null||x===undefined||x==='')return 0;if(typeof x==='number')return Number.isFinite(x)?x:0;const s=String(x).replace(/\s/g,'').replace(/[^\d,.\-]/g,'');if(!s)return 0;const n=Number((s.includes(',')&&s.includes('.'))?s.replace(/\./g,'').replace(',','.'):s.replace(',','.'));return Number.isFinite(n)?n:0};
const text=(o,keys,f='')=>{for(const k of keys){const v=o?.[k];if(v!==undefined&&v!==null&&String(v).trim()!=='')return String(v).trim()}return f};
const nval=(o,keys)=>{for(const k of keys){const v=num(o?.[k]);if(v)return v}return 0};
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const kr=n=>new Intl.NumberFormat('sv-SE',{maximumFractionDigits:0}).format(num(n))+' kr';
const dec=n=>new Intl.NumberFormat('sv-SE',{maximumFractionDigits:4}).format(num(n));
const pct=n=>num(n).toFixed(2).replace('.',',')+' %';
const today=()=>new Date().toISOString().slice(0,10);
function safeGet(k){try{return localStorage.getItem(k)}catch{return null}}
function safeSet(k,v){try{localStorage.setItem(k,v);return true}catch{return false}}
function merge(a,b){if(Array.isArray(a))return Array.isArray(b)?b:a;if(a&&typeof a==='object'){const o={...a};if(b&&typeof b==='object')for(const k of Object.keys(b))o[k]=k in a?merge(a[k],b[k]):b[k];return o}return b??a}
function looksLikePortfolio(x){return !!(x&&typeof x==='object'&&(Array.isArray(x.holdings)||Array.isArray(x.accounts)||num(x.portfolio?.net)>0))}
function score(x){if(!looksLikePortfolio(x))return 0;return (x.holdings?.length||0)*30+(x.accounts?.length||0)*10+Math.min(1000,num(x.portfolio?.net)/500)}
function loadData(){const own=parse(safeGet(DATA_KEY));if(looksLikePortfolio(own)){sourceKey=DATA_KEY;return merge(DEFAULTS,own)}let best=null,bestScore=0,bestKey=null;for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(!k||[LIVE_KEY,SETTINGS_KEY,ADMIN_KEY,TX_KEY,LEDGER_KEY,LIVE_FOUNDATION_KEY,LIVE_EVENT_KEY].includes(k)||/cache|live_readonly/i.test(k))continue;const v=parse(safeGet(k)),s=score(v);if(s>bestScore){best=v;bestScore=s;bestKey=k}}sourceKey=bestKey;return merge(DEFAULTS,best||{})}
function persistAdmin(){if(!safeSet(ADMIN_KEY,JSON.stringify(admin)))alert('Den lokala lagringen är full. Exportera backup innan fler ändringar.')}
function persistTx(){if(!safeSet(TX_KEY,JSON.stringify(transactions)))alert('Den lokala lagringen är full. Exportera backup innan fler transaktioner.')}
function persistLedger(){if(!safeSet(LEDGER_KEY,JSON.stringify(ledger)))alert('Den lokala lagringen är full. Exportera backup innan fler ledgerposter.')}
function ledgerAdd(kind,label,details={},ref=''){const id=ref?`${kind}:${ref}`:(crypto.randomUUID?.()||`ledger-${Date.now()}-${Math.random()}`);if(ledger.some(x=>x.id===id))return;ledger.unshift({id,date:new Date().toISOString(),kind,label,details,ref});ledger=ledger.slice(0,2000);persistLedger()}
function migrateLedger(){
 const existing=new Set(ledger.map(x=>x.id));
 const additions=[];
 transactions.forEach(x=>{const id=`transaction:${x.id}`;if(!existing.has(id)){existing.add(id);additions.push({id,date:x.date?new Date(`${x.date}T12:00:00`).toISOString():new Date().toISOString(),kind:'transaction',label:`${x.type==='buy'?'Köp':'Sälj'} · ${x.name}`,details:{account:x.account,holdingKey:x.key,quantity:x.quantity,price:x.price,fee:x.fee,currency:x.currency,fx:x.fx},ref:x.id})}});
 (admin.audit||[]).forEach(x=>{const id=`${x.kind}:${x.id}`;if(!existing.has(id)){existing.add(id);additions.push({id,date:x.date||new Date().toISOString(),kind:x.kind,label:x.label,details:{before:x.before,after:x.after},ref:x.id})}});
 if(additions.length){ledger=[...additions,...ledger].sort((a,b)=>String(b.date).localeCompare(String(a.date))).slice(0,2000);persistLedger()}
}
function audit(kind,label,before,after){const item={id:crypto.randomUUID?.()||String(Date.now()),date:new Date().toISOString(),kind,label,before,after};admin.audit.unshift(item);admin.audit=admin.audit.slice(0,250);persistAdmin();ledgerAdd(kind,label,{before,after},item.id)}

const LIVE_FOUNDATION_DEFAULT={
 schemaVersion:1,
 createdAt:'',
 updatedAt:'',
 mode:'foundation',
 registry:[
  {id:'official-fx',name:'Official FX Adapter',category:'fx',role:'primary',priority:100,quality:98,status:'ready',connector:'unconfigured',coverage:'Valutor och referenskurser'},
  {id:'market-primary',name:'Primary Market Data Slot',category:'prices',role:'primary',priority:90,quality:0,status:'unconfigured',connector:'unconfigured',coverage:'Aktier och ETF:er'},
  {id:'market-fallback',name:'Secondary Market Data Slot',category:'prices',role:'fallback',priority:70,quality:0,status:'unconfigured',connector:'unconfigured',coverage:'Reservkälla för priser'},
  {id:'fund-nav',name:'Fund/NAV Data Slot',category:'funds',role:'primary',priority:80,quality:0,status:'unconfigured',connector:'unconfigured',coverage:'Fonder och NAV'},
  {id:'issuer-events',name:'Issuer & Events Slot',category:'events',role:'primary',priority:85,quality:0,status:'unconfigured',connector:'unconfigured',coverage:'Rapporter, utdelningar och bolagshändelser'}
 ],
 router:{
  rules:[
   {category:'fx',strategy:'highest-quality-ready',fallback:true},
   {category:'prices',strategy:'highest-quality-ready',fallback:true},
   {category:'funds',strategy:'highest-quality-ready',fallback:true},
   {category:'events',strategy:'official-or-issuer-first',fallback:true}
  ]
 },
 mappings:{},
 validation:{checkedAt:'',accepted:0,rejected:0,warnings:0},
 cacheMeta:{updatedAt:'',items:0,fresh:0,delayed:0,stale:0}
};
let liveFoundation=structuredClone(LIVE_FOUNDATION_DEFAULT),liveEvents=[];

function persistLiveFoundation(){safeSet(LIVE_FOUNDATION_KEY,JSON.stringify(liveFoundation))}
function persistLiveEvents(){safeSet(LIVE_EVENT_KEY,JSON.stringify(liveEvents.slice(0,300)))}
function liveEvent(level,source,message,details={}){
 const item={id:`live-${Date.now()}-${Math.random().toString(16).slice(2)}`,date:new Date().toISOString(),level,source,message,details};
 liveEvents.unshift(item); liveEvents=liveEvents.slice(0,300); persistLiveEvents(); return item;
}
function initializeLiveFoundation(){
 const saved=parse(safeGet(LIVE_FOUNDATION_KEY));
 liveFoundation=merge(LIVE_FOUNDATION_DEFAULT,saved||{});
 liveEvents=parse(safeGet(LIVE_EVENT_KEY))||[];
 if(!liveFoundation.createdAt){
  liveFoundation.createdAt=new Date().toISOString();
  liveFoundation.updatedAt=liveFoundation.createdAt;
  persistLiveFoundation();
  liveEvent('info','System','Live Intelligence Foundation skapad',{version:VERSION});
 }
 const existing=liveState();
 if(!Array.isArray(existing.providers)){
  const compatible={...existing,providers:liveFoundation.registry,quotes:Array.isArray(existing.quotes)?existing.quotes:[],fx:existing.fx||existing.rates||{},foundationVersion:VERSION};
  safeSet(LIVE_KEY,JSON.stringify(compatible));
 }
}
function instrumentMappingCoverage(){
 const hs=canonicalHoldings();
 const mapped=hs.map(h=>{
  const key=h._key;
  const existing=liveFoundation.mappings[key]||{};
  const ticker=text(h,['ticker','symbol','providerSymbol'],'').trim();
  const isin=text(h,['isin','ISIN'],'').trim();
  const currency=text(h,['currency','valuta'],'SEK').toUpperCase();
  const exchange=text(h,['exchange','bors','börs','market'],'').trim();
  const asset=h._type||assetType(h);
  const complete=Boolean((ticker||isin)&&currency&&asset);
  return {key,name:h._name,account:h._account,ticker:existing.ticker||ticker,isin:existing.isin||isin,currency:existing.currency||currency,exchange:existing.exchange||exchange,assetType:existing.assetType||asset,complete};
 });
 return {items:mapped,total:mapped.length,complete:mapped.filter(x=>x.complete).length,missing:mapped.filter(x=>!x.complete)};
}
function buildInstrumentMappings(){
 const c=instrumentMappingCoverage();
 c.items.forEach(x=>{liveFoundation.mappings[x.key]={ticker:x.ticker,isin:x.isin,currency:x.currency,exchange:x.exchange,assetType:x.assetType,name:x.name,account:x.account,updatedAt:new Date().toISOString(),source:'masterdata'}});
 liveFoundation.updatedAt=new Date().toISOString();
 persistLiveFoundation();
 liveEvent('success','Instrument Mapping',`Mappning uppdaterad för ${c.total} innehav`,{complete:c.complete,missing:c.missing.length});
 return instrumentMappingCoverage();
}
function routeCategory(category){
 const candidates=(liveFoundation.registry||[]).filter(p=>p.category===category&&['ready','online','standby'].includes(p.status));
 candidates.sort((a,b)=>(b.quality||0)-(a.quality||0)||(b.priority||0)-(a.priority||0));
 return candidates[0]||null;
}
function validateLiveCache(){
 const state=liveState(),quotes=Array.isArray(state.quotes)?state.quotes:[],now=Date.now();
 let accepted=0,rejected=0,warnings=0,fresh=0,delayed=0,stale=0;
 quotes.forEach(q=>{
  const price=num(q.price||q.latestPrice||q.last||q.value||q.close);
  const ts=Date.parse(q.timestamp||q.updatedAt||q.date||'');
  if(!price||price<0){rejected++;return}
  accepted++;
  if(!ts){warnings++;stale++;return}
  const age=(now-ts)/60000;
  if(age<=30)fresh++; else if(age<=1440){delayed++;warnings++} else {stale++;warnings++}
 });
 liveFoundation.validation={checkedAt:new Date().toISOString(),accepted,rejected,warnings};
 liveFoundation.cacheMeta={updatedAt:new Date().toISOString(),items:quotes.length,fresh,delayed,stale};
 liveFoundation.updatedAt=new Date().toISOString();
 persistLiveFoundation();
 liveEvent(rejected?'warning':'success','Validation Engine',`Cachekontroll: ${accepted} godkända, ${rejected} avvisade`,{warnings,fresh,delayed,stale});
 return liveFoundation.validation;
}
function foundationHealth(){
 const mapping=instrumentMappingCoverage();
 const registry=liveFoundation.registry||[];
 const configured=registry.filter(p=>p.connector!=='unconfigured').length;
 const ready=registry.filter(p=>['ready','online','standby'].includes(p.status)).length;
 const coverage=mapping.total?Math.round(mapping.complete/mapping.total*100):0;
 const validation=liveFoundation.validation||{};
 const cache=liveFoundation.cacheMeta||{};
 const score=Math.round(Math.min(100,coverage*.45+(ready/Math.max(1,registry.length))*25+(configured/Math.max(1,registry.length))*15+(validation.checkedAt?15:0)));
 return {mapping,registry,configured,ready,coverage,validation,cache,score};
}

function liveState(){return parse(safeGet(LIVE_KEY))||{}}
function fxFor(h){const direct=nval(h,['fxToSEK','fxRate','exchangeRate','currencyRate','sekRate']);if(direct)return direct;const cur=text(h,['currency','valuta'],'SEK').toUpperCase();if(cur==='SEK')return 1;const fx=liveState().fx||liveState().rates||{};return num(fx[cur])||num(fx[cur+'SEK'])||num(fx[cur+'/SEK'])||0}
function quoteFor(h){const direct=nval(h,['latestPrice','price','currentPrice','lastPrice','kurs','quote']);if(direct)return direct;const sym=text(h,['symbol','ticker','providerSymbol','isin'],'').toUpperCase(),quotes=liveState().quotes||[];const q=quotes.find(x=>text(x,['symbol','ticker','providerSymbol','isin'],'').toUpperCase()===sym);return q?nval(q,['price','latestPrice','last','value','close']):0}
function quantity(h){return nval(h,['quantity','qty','shares','units','antal','amount'])}
function gav(h){return nval(h,['gav','avgPrice','averagePrice','averageCost','costPrice','anskaffningsvardePerEnhet'])}
function explicitValue(h){return nval(h,['marketValueSEK','marketValueSek','marketValue','currentValue','positionValue','valueSEK','value','marknadsvarde','marknadsvärde'])}
function costValue(h){const direct=nval(h,['costValueSEK','costBasisSEK','investedCapital','purchaseValue','bookValue','anskaffningsvarde','anskaffningsvärde']);if(direct)return direct;const q=quantity(h),g=gav(h),fx=fxFor(h);return q&&g&&fx?q*g*fx:0}
function holdingValue(h){const direct=explicitValue(h);if(direct)return {value:direct,method:'Marknadsvärde'};const q=quantity(h),p=quoteFor(h),fx=fxFor(h);if(q&&p&&fx)return {value:q*p*fx,method:'Kurs × antal'};const c=costValue(h);if(c)return {value:c,method:'Anskaffningsvärde'};return {value:0,method:'Saknar värde'}}
function accountName(h){return text(h,['account','accountName','konto','platform','broker'],'Okänt konto')}
function assetType(h){return text(h,['assetType','type','category','tillgangsslag','tillgångsslag'],'Övrigt')}
function holdingName(h){return text(h,['name','securityName','title','instrumentName','symbol','ticker'],'Innehav')}
function identity(h,i=0){return String(h.id||h.uuid||`${accountName(h)}|${holdingName(h)}|${text(h,['currency','valuta'],'SEK')}|${i}`).toLowerCase()}
function rawHoldings(){return [...(data.holdings||[]).map((h,i)=>({...h,_baseIndex:i,_key:identity(h,i)})),...(admin.newHoldings||[]).map((h,i)=>({...h,_newIndex:i,_key:h._key||identity(h,'new'+i)}))]}
function canonicalHoldings(){return rawHoldings().map((base,i)=>{const h={...base,...(admin.overrides[base._key]||{})};const r=holdingValue(h);return {...h,_i:i,_value:r.value,_method:r.method,_name:holdingName(h),_account:accountName(h),_type:assetType(h),_qty:quantity(h),_gav:gav(h),_fx:fxFor(h),_quote:quoteFor(h)}})}
function declaredTotal(){return nval(data.portfolio||{},['net','total','totalValue','marketValue','value'])||(data.accounts||[]).reduce((s,a)=>s+nval(a,['value','marketValue','totalValue','balance']),0)}
function calculatedTotal(){return canonicalHoldings().reduce((s,h)=>s+h._value,0)}
function total(){return declaredTotal()||calculatedTotal()}
function diagnostics(){const hs=canonicalHoldings(),declared=declaredTotal(),calc=calculatedTotal(),unresolved=hs.filter(h=>!h._value);return {declared,calc,diff:declared?declared-calc:0,unresolved,missingGav:hs.filter(h=>!h._gav).length,missingQty:hs.filter(h=>!h._qty).length}}
function navigateTo(next,{replace=false}={}){
 if(!NAV.some(x=>x[0]===next))next='home';
 const {root}=modalParts();if(root&&!root.hidden)closeModal({fromHistory:true});
 screen=next;
 const hash='#'+next;
 if(location.hash!==hash){replace?history.replaceState(null,'',hash):history.pushState(null,'',hash)}
 render();
 requestAnimationFrame(()=>scrollTo({top:0,left:0,behavior:'auto'}));
}
function nav(){const r=document.getElementById('nav');if(!r)return;r.innerHTML=NAV.map(([id,icon,label])=>`<button type="button" data-screen="${id}" class="${screen===id?'active':''}" aria-current="${screen===id?'page':'false'}"><span>${icon}</span>${label}</button>`).join('');r.querySelectorAll('button[data-screen]').forEach(b=>b.onclick=e=>{e.preventDefault();navigateTo(b.dataset.screen)})}
function row(h,t){return `<button class="holdingRow" data-index="${h._i}"><div><b>${esc(h._name)}</b><small>${esc(h._account)} · ${esc(h._type)}</small><div class="bar"><i style="width:${t?Math.min(100,h._value/t*100):0}%"></i></div></div><div class="right"><b>${kr(h._value)}</b><small>${t?pct(h._value/t*100):'0,00 %'}</small><em>${esc(h._method)}</em></div></button>`}
function home(){
 try{return wealthDashboard()}catch(error){
  console.error('Home render failed',error);
  const all=canonicalHoldings(),t=total();
  return `<section class="hero"><div class="eyebrow">Mästarklass OS 11.0.1 · Stabil återställning</div><h2>${kr(t)}</h2><p>${all.length} innehav. Din lokala portföljdata är laddad och oförändrad.</p></section><section class="section"><h2>Systemstatus</h2><div class="notice">Startsidan återställdes i säkert läge. Portfölj, Ledger, backup och Live Foundation kan användas som vanligt.</div></section>`
 }
}
function chips(){const tabs=[['overview','Översikt'],['accounts','Konton'],['holdings','Alla innehav'],['transactions','Transaktioner'],['admin','Administrera'],['ledger','Ledger'],['quality','Datakvalitet']];return `<div class="chips scrollerTabs" aria-label="Portföljflikar">${tabs.map(([id,l])=>`<button data-tab="${id}" class="${portfolioTab===id?'activeChip':''}">${l}</button>`).join('')}</div>`}
function portfolio(){const all=canonicalHoldings(),t=total(),q=query.toLowerCase(),types=[...new Set(all.map(h=>h._type))].sort((a,b)=>a.localeCompare(b,'sv')),accounts=[...new Set(all.map(h=>h._account))].sort((a,b)=>a.localeCompare(b,'sv'));let hs=all.filter(h=>(typeFilter==='all'||h._type===typeFilter)&&(accountFilter==='all'||h._account===accountFilter)&&(!q||`${h._name} ${h._account} ${h._type}`.toLowerCase().includes(q)));const sorts={value_desc:(a,b)=>b._value-a._value,value_asc:(a,b)=>a._value-b._value,name_asc:(a,b)=>a._name.localeCompare(b._name,'sv'),name_desc:(a,b)=>b._name.localeCompare(a._name,'sv')};hs.sort(sorts[sortMode]);const d=diagnostics(),accountMap=new Map();all.forEach(h=>accountMap.set(h._account,(accountMap.get(h._account)||0)+h._value));let content='';
 if(portfolioTab==='overview')content=`<section class="hero"><div class="eyebrow">Portfolio Ledger 10.4.1</div><h2>${kr(t)}</h2><p>${all.length} innehav · ${transactions.length} transaktioner · ${admin.audit.length} spårade korrigeringar.</p></section><div class="grid"><button class="card actionCard" data-tabgo="transactions"><b>Registrera köp/sälj</b><span>Uppdatera antal och viktat GAV.</span></button><button class="card actionCard" data-tabgo="admin"><b>Administrera portfölj</b><span>Ändra GAV, antal, nya innehav och kredit.</span></button></div>`;
 if(portfolioTab==='accounts')content=`<section class="section"><h2>Konton</h2><div class="list">${[...accountMap.entries()].sort((a,b)=>b[1]-a[1]).map(([n,v])=>`<div class="simpleRow"><div><b>${esc(n)}</b><small>${pct(t?v/t*100:0)}</small></div><b>${kr(v)}</b></div>`).join('')}</div></section>`;
 if(portfolioTab==='holdings')content=`<section class="section"><div class="sectionHead"><h2>Alla innehav</h2><small>${hs.length} av ${all.length}</small></div><div class="tools"><input id="search" type="search" value="${esc(query)}" placeholder="Sök innehav eller konto"><select id="typeFilter"><option value="all">Alla tillgångsslag</option>${types.map(x=>`<option ${x===typeFilter?'selected':''}>${esc(x)}</option>`).join('')}</select><select id="accountFilter"><option value="all">Alla konton</option>${accounts.map(x=>`<option ${x===accountFilter?'selected':''}>${esc(x)}</option>`).join('')}</select><select id="sortMode"><option value="value_desc">Störst värde</option><option value="value_asc" ${sortMode==='value_asc'?'selected':''}>Minst värde</option><option value="name_asc" ${sortMode==='name_asc'?'selected':''}>Namn A–Ö</option><option value="name_desc" ${sortMode==='name_desc'?'selected':''}>Namn Ö–A</option></select></div><div class="list">${hs.map(h=>row(h,t)).join('')}</div></section>`;
 if(portfolioTab==='transactions')content=transactionSection(all);
 if(portfolioTab==='admin')content=adminSection(all,accounts);
 if(portfolioTab==='ledger')content=ledgerSection(all,accounts);
 if(portfolioTab==='quality')content=`<section class="section"><h2>Datakvalitet och avstämning</h2><div class="grid"><div class="card metric"><span>Deklarerad bas</span><b>${kr(d.declared)}</b></div><div class="card metric"><span>Beräknat nu</span><b>${kr(d.calc)}</b></div><div class="card metric"><span>Differens</span><b>${kr(d.diff)}</b></div><div class="card metric"><span>Saknar värde</span><b>${d.unresolved.length}</b></div></div>${d.unresolved.length?`<div class="warning"><b>Poster som behöver kurs eller värde</b><p>${d.unresolved.slice(0,30).map(h=>esc(h._name)).join(', ')}${d.unresolved.length>30?' …':''}</p></div>`:`<div class="notice okbox">Samtliga innehav har ett spårbart värde.</div>`}</section>`;
 return chips()+content}
function transactionSection(all){const opts=all.map(h=>`<option value="${esc(h._key)}">${esc(h._name)} — ${esc(h._account)}</option>`).join('');return `<section class="section"><div class="eyebrow">Transaction Engine</div><h2>Registrera köp eller sälj</h2><div class="form twoCol"><label>Typ<select id="txType"><option value="buy">Köp</option><option value="sell">Sälj</option></select></label><label>Datum<input id="txDate" type="date" value="${today()}"></label><label>Värdepapper<select id="txHolding">${opts}</select></label><label>Antal<input id="txQty" inputmode="decimal" placeholder="0"></label><label>Pris per enhet<input id="txPrice" inputmode="decimal" placeholder="0,00"></label><label>Courtage<input id="txFee" inputmode="decimal" value="0"></label><label>Valuta<input id="txCurrency" value="SEK"></label><label>Valutakurs till SEK<input id="txFx" inputmode="decimal" value="1"></label></div><button id="saveTx" class="primary">Spara transaktion lokalt</button></section><section class="section"><h2>Historik</h2><div class="list">${transactions.length?transactions.map(x=>`<div class="simpleRow"><div><b>${x.type==='buy'?'Köp':'Sälj'} · ${esc(x.name)}</b><small>${esc(x.date)} · ${dec(x.quantity)} st · ${dec(x.price)} ${esc(x.currency)} · courtage ${dec(x.fee)}</small></div><button class="danger smallBtn" data-delete-tx="${esc(x.id)}">Radera</button></div>`).join(''):'<div class="empty">Inga transaktioner registrerade ännu.</div>'}</div></section>`}
function adminSection(all,accounts){const creditNames=[...new Set([...accounts,...Object.keys(admin.credits||{})])];return `<section class="hero"><div class="eyebrow">Master Data</div><h2>Direktkorrigering utan falsk transaktion</h2><p>Använd detta för startvärden, rättning av GAV/antal, nya värdepapper och kredit. Alla ändringar loggas.</p></section><section class="section"><h2>Redigera befintligt innehav</h2><label class="formLabel">Välj innehav<select id="adminHolding">${all.map(h=>`<option value="${esc(h._key)}">${esc(h._name)} — ${esc(h._account)}</option>`).join('')}</select></label><button id="openEdit" class="primary">Öppna redigering</button></section><section class="section"><h2>Lägg till värdepapper</h2><div class="form twoCol"><label>Namn<input id="newName"></label><label>Konto<input id="newAccount" list="accountList"></label><label>Tillgångsslag<input id="newType" value="Aktie"></label><label>Valuta<input id="newCurrency" value="SEK"></label><label>Antal<input id="newQty" inputmode="decimal"></label><label>GAV<input id="newGav" inputmode="decimal"></label><label>Ticker<input id="newTicker"></label><label>Marknadsvärde SEK<input id="newValue" inputmode="decimal"></label></div><datalist id="accountList">${accounts.map(x=>`<option>${esc(x)}</option>`).join('')}</datalist><button id="addHolding" class="primary">Lägg till utan transaktion</button></section><section class="section"><h2>Investeringskredit</h2><div class="form twoCol"><label>Konto<input id="creditAccount" list="accountList"></label><label>Kreditlimit<input id="creditLimit" inputmode="decimal"></label><label>Utnyttjad kredit<input id="creditUsed" inputmode="decimal"></label><label>Ränta %<input id="creditRate" inputmode="decimal"></label></div><button id="saveCredit" class="primary">Spara kredit lokalt</button><div class="list topGap">${creditNames.length?creditNames.map(n=>{const c=admin.credits[n]||{};return `<div class="simpleRow"><div><b>${esc(n)}</b><small>Limit ${kr(c.limit)} · Ränta ${pct(c.rate)}</small></div><b>${kr(c.used)}</b></div>`}).join(''):'<div class="empty">Ingen kredit registrerad.</div>'}</div></section><section class="section"><div class="sectionHead"><h2>Ändringslogg</h2><button id="undoAudit" class="secondary" ${admin.audit.length?'':'disabled'}>Ångra senaste</button></div><div class="list">${admin.audit.slice(0,20).map(x=>`<div class="auditRow"><b>${esc(x.label)}</b><small>${new Date(x.date).toLocaleString('sv-SE')} · ${esc(x.kind)}</small></div>`).join('')||'<div class="empty">Inga direktändringar ännu.</div>'}</div></section>`}
function market(){
 const r=providerRegistry(),fh=foundationHealth(),mapping=fh.mapping;
 const providerRows=fh.registry.map(p=>`<div class="providerRow"><div><span class="providerDot ${esc(p.status)}"></span><b>${esc(p.name)}</b><small>${esc(p.coverage)} · ${esc(p.role)} · prioritet ${p.priority}</small></div><div class="providerMeta"><strong>${p.quality||'—'}</strong><small>${esc(p.status)}</small></div></div>`).join('');
 const routerRows=['fx','prices','funds','events'].map(cat=>{const p=routeCategory(cat);return `<div class="routerRow"><span>${esc(cat.toUpperCase())}</span><b>${p?esc(p.name):'Ingen aktiv adapter'}</b><small>${p?'Fallback aktiverad':'Väntar på konfiguration'}</small></div>`}).join('');
 const eventRows=liveEvents.slice(0,12).map(e=>`<div class="eventRow ${esc(e.level)}"><div><b>${esc(e.source)}</b><small>${new Date(e.date).toLocaleString('sv-SE')}</small></div><p>${esc(e.message)}</p></div>`).join('');
 return `<section class="hero liveHero"><div class="eyebrow">Mästarklass OS 11.0 · Live Intelligence Foundation</div><h2>Ett säkert observationslager för marknaden.</h2><p>Provider Registry, Data Router, instrumentmappning, validering och live-cache arbetar separat från Portfolio Ledger. Ingen extern data får skriva över antal, GAV, kredit eller transaktioner.</p><div class="liveHeroStats"><div><span>Foundation Health</span><b>${fh.score}/100</b></div><div><span>Instrumenttäckning</span><b>${fh.coverage} %</b></div><div><span>Providers redo</span><b>${fh.ready}/${fh.registry.length}</b></div><div class="liveState ${r.code}"><span>Anslutningsstatus</span><b><i></i>${r.status}</b></div></div></section>
 <section class="section"><div class="sectionHead"><div><div class="eyebrow">Live Core</div><h2>Systemkontroller</h2></div><small>Read-only</small></div><div class="foundationActions"><button id="buildMappings" class="primary">Skapa/uppdatera instrumentmappning</button><button id="validateLive" class="secondary">Kör validering av live-cache</button></div><div class="grid topGap"><div class="card metric"><span>Mappade instrument</span><b>${mapping.complete}/${mapping.total}</b></div><div class="card metric"><span>Saknar identitet</span><b>${mapping.missing.length}</b></div><div class="card metric"><span>Cacheposter</span><b>${fh.cache.items||0}</b></div><div class="card metric"><span>Valideringsvarningar</span><b>${fh.validation.warnings||0}</b></div></div>${mapping.missing.length?`<div class="warning"><b>Instrument som behöver ticker eller ISIN</b><p>${mapping.missing.slice(0,18).map(x=>esc(x.name)).join(', ')}${mapping.missing.length>18?' …':''}</p></div>`:'<div class="notice okbox">Alla innehav har grundläggande instrumentidentitet.</div>'}</section>
 <section class="section"><h2>Provider Registry</h2><p class="disclaimer">Registryt innehåller utbytbara adapterplatser. En källa kan ersättas utan att Portfolio Intelligence behöver byggas om.</p><div class="providerList">${providerRows}</div></section>
 <section class="section"><h2>Data Router</h2><div class="routerList">${routerRows}</div></section>
 <section class="section"><h2>Validation Engine & Cache</h2><div class="healthGrid"><div class="healthItem"><div><span>Godkända</span><b>${fh.validation.accepted||0}</b></div><div class="bar"><i style="width:${fh.cache.items?Math.min(100,(fh.validation.accepted||0)/fh.cache.items*100):0}%"></i></div></div><div class="healthItem"><div><span>Avvisade</span><b>${fh.validation.rejected||0}</b></div><div class="bar dangerBar"><i style="width:${fh.cache.items?Math.min(100,(fh.validation.rejected||0)/fh.cache.items*100):0}%"></i></div></div><div class="healthItem"><div><span>Färska</span><b>${fh.cache.fresh||0}</b></div><div class="bar"><i style="width:${fh.cache.items?Math.min(100,(fh.cache.fresh||0)/fh.cache.items*100):0}%"></i></div></div><div class="healthItem"><div><span>Fördröjda/gamla</span><b>${(fh.cache.delayed||0)+(fh.cache.stale||0)}</b></div><div class="bar cautionBar"><i style="width:${fh.cache.items?Math.min(100,((fh.cache.delayed||0)+(fh.cache.stale||0))/fh.cache.items*100):0}%"></i></div></div></div></section>
 <section class="section"><div class="sectionHead"><h2>Live Event Log</h2><span>${liveEvents.length} poster</span></div><div class="eventList">${eventRows||'<div class="empty">Live Foundation är initierad. Händelser visas här när kontroller och framtida connectors körs.</div>'}</div></section>`;
}
function intelligencePortfolio(){
 const items=canonicalHoldings().map(intelligenceFor),weighted=items.reduce((s,x)=>s+x.score*(x.weight||0),0)/(items.reduce((s,x)=>s+(x.weight||0),0)||1);
 const high=items.filter(x=>x.score>=70).length,watch=items.filter(x=>x.status==='Bevaka'||x.status==='Komplettera data').length,risky=items.filter(x=>x.risk<45||x.weight>12).length;
 const dimensions={quality:Math.round(items.reduce((s,x)=>s+x.quality*(x.weight||0),0)/(items.reduce((s,x)=>s+(x.weight||0),0)||1)),risk:Math.round(items.reduce((s,x)=>s+x.risk*(x.weight||0),0)/(items.reduce((s,x)=>s+(x.weight||0),0)||1)),valuation:Math.round(items.reduce((s,x)=>s+x.valuation*(x.weight||0),0)/(items.reduce((s,x)=>s+(x.weight||0),0)||1)),dividend:Math.round(items.reduce((s,x)=>s+x.dividend*(x.weight||0),0)/(items.reduce((s,x)=>s+(x.weight||0),0)||1)),data:Math.round(items.reduce((s,x)=>s+x.dataQuality,0)/(items.length||1))};
 return {items,score:Math.round(weighted),grade:gradeFor(weighted),high,watch,risky,data:dimensions.data,dimensions};
}
function intelCard(x){return `<button class="intelCard" data-intel-index="${x._i}"><div class="intelTop"><div><b>${esc(x._name)}</b><small>${esc(x._account)} · ${esc(x._type)}</small></div><span class="scorePill">${x.grade} ${x.score}</span></div><div class="statusLine"><strong>${esc(x.status)}</strong><span>${pct(x.weight)}</span></div><div class="miniBars"><i style="--v:${x.quality}%"><span>Kvalitet</span></i><i style="--v:${x.valuation}%"><span>Värdering</span></i><i style="--v:${x.risk}%"><span>Riskkontroll</span></i><i style="--v:${x.dataQuality}%"><span>Data</span></i></div><p>${esc(x.reasons.join(' · '))}</p></button>`}
function aRisk(x){return Math.min(20,x.risk/5)+Math.min(10,x.dataQuality/10)+Math.min(12,x.valuation/8)-Math.max(0,x.weight-8)*2}
function eligibleCandidates(ip){
 const strict=ip.items.filter(x=>x.dataQuality>=60&&x.risk>=48&&x.weight<12&&x.score>=60&&!/Minska/.test(x.status));
 return strict.sort((a,b)=>(b.score+aRisk(b)+b.confidence/10)-(a.score+aRisk(a)+a.confidence/10));
}
function allocationPlan(ip){
 const monthly=num(data.portfolio?.monthly)||num(data.monthlyPlan?.total)||9000;
 const creditUsed=Object.values(admin.credits||{}).reduce((s,x)=>s+num(x.used),0);
 const candidates=eligibleCandidates(ip).slice(0,3);
 let debt=creditUsed>0?Math.min(monthly,Math.max(Math.round(monthly*.5/100)*100,Math.min(creditUsed,monthly))):0;
 let invest=Math.max(0,monthly-debt);
 if(!candidates.length){debt=creditUsed>0?monthly:0;invest=monthly-debt}
 const weights=candidates.map(x=>Math.max(1,(x.score-50)+(x.risk-45)*.5+(10-Math.min(10,x.weight))*1.5));
 const sum=weights.reduce((a,b)=>a+b,0)||1;
 let remaining=invest;
 const rows=candidates.map((x,i)=>{let amount=i===candidates.length-1?remaining:Math.round((invest*weights[i]/sum)/100)*100;amount=Math.max(0,Math.min(remaining,amount));remaining-=amount;return {...x,amount}}).filter(x=>x.amount>0);
 return {monthly,creditUsed,debt,invest,rows,buffer:Math.max(0,monthly-debt-rows.reduce((s,x)=>s+x.amount,0))};
}
function allocationRow(x,rank){return `<button class="allocationRow" data-intel-index="${x._i}"><span class="rank">${rank}</span><div><b>${esc(x._name)}</b><small>${esc(x.reasons.slice(0,2).join(' · '))}</small><em>Score ${x.score} · tillit ${x.confidence}% · vikt ${pct(x.weight)}</em></div><strong>${kr(x.amount)}</strong></button>`}
function decisionCenter(ip){
 const plan=allocationPlan(ip),candidates=eligibleCandidates(ip).slice(0,5);
 const review=ip.items.filter(x=>x.risk<45||x.weight>12||x.dataQuality<55).sort((a,b)=>(a.risk+a.dataQuality)-(b.risk+b.dataQuality)).slice(0,5);
 const hold=ip.items.filter(x=>x.status==='Behåll').sort((a,b)=>b.score-a.score).slice(0,3);
 const guardrails=[];
 if(plan.creditUsed>0)guardrails.push(`Utnyttjad kredit ${kr(plan.creditUsed)} vägs in före nya köp.`);
 if(ip.risky)guardrails.push(`${ip.risky} innehav kräver risk- eller koncentrationskontroll.`);
 if(ip.data<80)guardrails.push(`Datatäckning ${ip.data} %: komplettera ticker, sektor eller värderingsdata.`);
 if(!guardrails.length)guardrails.push('Inga hårda portföljspärrar identifierade i den lokala datan.');
 return `<section class="section decisionCenter"><div class="sectionHead"><div><div class="eyebrow">Capital Allocation Engine</div><h2>Plan för nästa månadskapital</h2></div><span class="decisionBadge">10.8</span></div><div class="allocationSummary"><div><span>Planerat kapital</span><b>${kr(plan.monthly)}</b></div><div><span>Kreditreduktion</span><b>${kr(plan.debt)}</b></div><div><span>Föreslagen investering</span><b>${kr(plan.invest)}</b></div></div>${plan.rows.length?`<div class="allocationList">${plan.rows.map((x,i)=>allocationRow(x,i+1)).join('')}</div>`:`<div class="notice">Ingen kandidat har tillräckligt komplett lokalt underlag. Behåll kapitalet som buffert${plan.debt?' eller minska kredit':''} tills datan är bättre.</div>`}<p class="disclaimer">Simulerad lokal fördelning – inga order skapas och ingen masterdata ändras.</p><div class="guardrail"><b>Skyddsregler före köp</b>${guardrails.map(x=>`<p>• ${esc(x)}</p>`).join('')}</div></section><section class="section"><div class="sectionHead"><h2>Prioriterad arbetslista</h2><small>Lokal och spårbar</small></div><div class="decisionColumns"><div><h3>Öka kandidater</h3>${candidates.map(x=>decisionRow(x,'Öka')).join('')||'<p class="hint">Ingen kandidat passerar gränserna.</p>'}</div><div><h3>Granska först</h3>${review.map(x=>decisionRow(x,'Granska')).join('')||'<p class="hint">Inga akuta granskningspunkter.</p>'}</div><div><h3>Behåll kärnan</h3>${hold.map(x=>decisionRow(x,'Behåll')).join('')||'<p class="hint">Inga tydliga kärninnehav ännu.</p>'}</div></div></section>`;
}
function decisionRow(x,label){const why=x.warnings[0]||x.strengths[0]||x.reasons[0];return `<button class="decisionRow" data-intel-index="${x._i}"><span class="decisionTag">${label}</span><div><b>${esc(x._name)}</b><small>${esc(why)} · Score ${x.score} · Risk ${x.risk} · Vikt ${pct(x.weight)}</small></div><strong>›</strong></button>`}

function yearsToGoal(start,monthly,goal,annualReturn=.07){start=Math.max(0,num(start));monthly=Math.max(0,num(monthly));goal=Math.max(0,num(goal));if(goal<=start)return 0;if(monthly<=0&&annualReturn<=0)return null;const r=Math.pow(1+annualReturn,1/12)-1;let value=start;for(let m=1;m<=1200;m++){value=value*(1+r)+monthly;if(value>=goal)return m/12}return null}
function fmtYears(y){if(y===null)return '—';if(y<1)return `${Math.max(1,Math.round(y*12))} mån`;const years=Math.floor(y),months=Math.round((y-years)*12);return months?`${years} år ${months} mån`:`${years} år`}
function wealthHealth(ip){const hs=canonicalHoldings(),credit=Object.values(admin.credits||{}).reduce((s,x)=>s+num(x.used),0),gross=Math.max(total(),calculatedTotal()),creditRatio=gross?credit/gross*100:0;const largest=hs.length?Math.max(...hs.map(x=>gross?x._value/gross*100:0)):0;const accountCount=new Set(hs.map(x=>x._account)).size,typeCount=new Set(hs.map(x=>x._type)).size;const diversification=Math.max(0,Math.min(100,Math.round(78-largest*1.4+Math.min(12,accountCount*1.5)+Math.min(8,typeCount*2))));const leverage=Math.max(0,Math.min(100,Math.round(100-creditRatio*3.2)));const concentration=Math.max(0,Math.min(100,Math.round(100-largest*3)));const dataScore=ip.data;const dividend=Math.max(0,Math.min(100,Math.round(ip.dimensions.dividend)));const liquidity=Math.max(35,Math.min(100,Math.round(82-creditRatio*2)));const score=Math.round(diversification*.22+leverage*.20+concentration*.18+dataScore*.18+dividend*.12+liquidity*.10);return {score,diversification,leverage,concentration,data:dataScore,dividend,liquidity,creditRatio,largest}}
function riskRadar(ip,health){const risks=[];if(health.creditRatio>12)risks.push({level:'high',title:'Kreditrisk',text:`Utnyttjad kredit motsvarar ${pct(health.creditRatio)} av portföljens bruttovärde.`});else if(health.creditRatio>5)risks.push({level:'medium',title:'Kredit att bevaka',text:`Kreditnivån är ${pct(health.creditRatio)} och bör vägas mot nya köp.`});if(health.largest>12)risks.push({level:'high',title:'Koncentration',text:`Största innehavet väger ${pct(health.largest)}.`});if(ip.data<80)risks.push({level:'medium',title:'Datatäckning',text:`Datatäckningen är ${ip.data} %, vilket begränsar säkra slutsatser.`});if(!risks.length)risks.push({level:'low',title:'Stabil struktur',text:'Inga tydliga hårda riskspärrar i den lokala datan.'});return risks}
function wealthCoach(ip,health,plan){const advice=[];if(plan.creditUsed>0)advice.push({tone:'caution',title:'Minska kredit före nya köp',text:`Väg in ${kr(plan.creditUsed)} utnyttjad kredit. Av nästa månadskapital bör ${kr(plan.debt)} gå till kreditreduktion enligt skyddsreglerna.`});if(health.largest>12)advice.push({tone:'risk',title:'Sänk koncentrationsrisken',text:`Största innehavet väger ${pct(health.largest)}. Undvik att öka det tills portföljvikten är mer balanserad.`});if(ip.data<80)advice.push({tone:'caution',title:'Komplettera beslutsdata',text:`Datatäckningen är ${ip.data} %. Prioritera ticker, sektor, värdering och utdelningsdata före större beslut.`});plan.rows.slice(0,2).forEach((top,i)=>advice.push({tone:'good',title:`${i?'Alternativ':'Nästa bästa handling'}: ${top._name}`,text:`Simulerad lokal allokering ${kr(top.amount)}. ${top.reasons.slice(0,2).join(' · ')}.`}));if(!advice.length)advice.push({tone:'neutral',title:'Behåll planen',text:'Inga hårda riskspärrar identifieras. Fortsätt följa månadsplanen och verifiera underlaget före köp.'});return advice.slice(0,5)}
function goalIntelligence(){const current=total(),monthly=num(data.portfolio?.monthly)||num(data.monthlyPlan?.total)||9000,capital=num(data.goals?.capital)||7500000;return [{label:'500 000 kr',goal:500000},{label:'1 000 000 kr',goal:1000000},{label:'Kapitalmålet',goal:capital}].map(x=>({...x,years:yearsToGoal(current,monthly,x.goal),progress:x.goal?Math.min(100,current/x.goal*100):0}))}
function providerRegistry(){const l=liveState(),providers=Array.isArray(l.providers)?l.providers:[],quotes=Array.isArray(l.quotes)?l.quotes:[],fx=l.fx||l.rates||{},lastSync=l.lastSync||l.updatedAt||l.timestamp||'';let code='ready',status='Förberett';if(typeof navigator!=='undefined'&&!navigator.onLine){code='offline';status='Offline'}else if(l.syncing){code='syncing';status='Synkroniserar'}else if(providers.length&&(quotes.length||Object.keys(fx).length)){code='connected';status='Live-data ansluten'}else if(providers.length){code='pilot';status='Provider-pilot'}return {providers,quotes,fx,lastSync,code,status}}
function wealthDashboard(){const ip=intelligencePortfolio(),health=wealthHealth(ip),plan=allocationPlan(ip),coach=wealthCoach(ip,health,plan),goals=goalIntelligence(),risks=riskRadar(ip,health),registry=providerRegistry();return `<section class="hero wealthHero"><div class="eyebrow">Mästarklass OS 11.0 · Live Intelligence Foundation</div><h2>Din förmögenhetsplan, förklarad.</h2><p>Lokalt, spårbart och read-only. Wealth Intelligence använder Portfolio Ledger, masterdata och skyddsregler utan att skapa order eller ändra dina innehav.</p><div class="wealthHeroGrid"><div><span>Portfolio Health</span><b>${health.score}/100</b></div><div><span>Intelligence</span><b>${ip.grade} · ${ip.score}</b></div><div><span>Nästa kapital</span><b>${kr(plan.monthly)}</b></div><div class="liveState ${registry.code}"><span>Live-lager</span><b><i></i>${registry.status}</b></div></div></section><section class="section coachStack"><div class="sectionHead"><div><div class="eyebrow">Wealth Coach 11.0</div><h2>Prioriterade råd</h2></div><small>${coach.length} råd</small></div><div class="coachAdviceList">${coach.map((x,i)=>`<article class="coachAdvice ${x.tone}"><span>${i+1}</span><div><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p></div></article>`).join('')}</div></section><section class="section"><h2>Portföljhälsa</h2><div class="healthGrid">${[['Diversifiering',health.diversification],['Belåning',health.leverage],['Koncentration',health.concentration],['Datakvalitet',health.data],['Utdelningsstyrka',health.dividend],['Likviditet',health.liquidity]].map(([l,v])=>`<div class="healthItem"><div><span>${l}</span><b>${v}</b></div><div class="bar"><i style="width:${v}%"></i></div></div>`).join('')}</div></section><section class="section"><h2>Målprognos</h2><div class="goalTimeline">${goals.map(g=>`<div class="goalForecast"><div><b>${g.label}</b><small>${pct(g.progress)} uppnått</small></div><strong>${fmtYears(g.years)}</strong></div>`).join('')}</div><p class="disclaimer">Prognosen använder 7 % antagen årlig avkastning och nuvarande månadssparande. Det är en simulering, inte en garanti.</p></section><section class="section"><h2>Riskradar</h2><div class="riskList">${risks.map(r=>`<div class="riskItem ${r.level}"><b>${esc(r.title)}</b><p>${esc(r.text)}</p></div>`).join('')}</div></section><section class="section"><h2>Möjlighetsmotor</h2>${plan.rows.length?`<div class="allocationList">${plan.rows.map((x,i)=>allocationRow(x,i+1)).join('')}</div>`:`<div class="notice">Ingen investeringskandidat passerar nuvarande skyddsregler. Kreditreduktion, buffert eller bättre data prioriteras.</div>`}<p class="disclaimer">Förslagen är lokala beslutsunderlag. Ingen handel utförs.</p></section>`}

function analysis(){const ip=intelligencePortfolio();let items=ip.items;if(intelFilter==='buy')items=items.filter(x=>x.status==='Öka kandidat');if(intelFilter==='watch')items=items.filter(x=>/Bevaka|Komplettera/.test(x.status));if(intelFilter==='risk')items=items.filter(x=>x.risk<45||x.weight>12);if(intelFilter==='quality')items=items.filter(x=>x.score>=70);items.sort((a,b)=>b.score-a.score);const strengths=[],weaknesses=[];if(ip.data>=70)strengths.push('God datatäckning för lokal analys');if(ip.high)strengths.push(`${ip.high} innehav med stark intelligensprofil`);if(canonicalHoldings().some(x=>/fond|etf/i.test(x._type)))strengths.push('Fonder och ETF:er bidrar till riskspridning');if(ip.risky)weaknesses.push(`${ip.risky} innehav behöver risk- eller koncentrationsgranskning`);if(ip.data<80)weaknesses.push('Ticker, sektor eller fundamenta saknas för delar av portföljen');if(Object.values(admin.credits||{}).some(x=>num(x.used)>0))weaknesses.push('Utnyttjad kredit ska vägas in före nya köp');return `<section class="hero"><div class="eyebrow">Mästarklass OS 11.0 · Live Intelligence Foundation</div><h2>Från score till genomförbar månadsplan.</h2><p>11.0 bevarar Portfolio Intelligence, målsimulering, riskradar och kapitalallokering. Allt är lokalt, read-only och spårbart.</p><div class="ratingHero"><div><span class="grade">${ip.grade}</span><b>${ip.score}/100</b><small>${starsFor(ip.score)}</small></div><div class="dimensionGrid"><span>Kvalitet <b>${ip.dimensions.quality}</b></span><span>Risk <b>${ip.dimensions.risk}</b></span><span>Värdering <b>${ip.dimensions.valuation}</b></span><span>Utdelning <b>${ip.dimensions.dividend}</b></span><span>Data <b>${ip.dimensions.data}</b></span></div></div></section><div class="grid"><div class="card metric"><span>Starka profiler</span><b>${ip.high}</b></div><div class="card metric"><span>Bevaka</span><b>${ip.watch}</b></div><div class="card metric"><span>Risk / koncentration</span><b>${ip.risky}</b></div><div class="card metric"><span>Datatäckning</span><b>${ip.data} %</b></div></div><section class="section"><h2>Portföljens läge</h2><div class="insightGrid"><div class="insight good"><b>Styrkor</b>${strengths.map(x=>`<p>✓ ${esc(x)}</p>`).join('')||'<p>Mer verifierad data behövs.</p>'}</div><div class="insight caution"><b>Att förbättra</b>${weaknesses.map(x=>`<p>• ${esc(x)}</p>`).join('')||'<p>Inga tydliga strukturvarningar.</p>'}</div></div></section>${decisionCenter(ip)}<section class="section"><div class="sectionHead"><h2>Intelligenskort</h2><small>${items.length} av ${ip.items.length}</small></div><div class="intelFilters"><button data-intel-filter="all" class="${intelFilter==='all'?'activeChip':''}">Alla</button><button data-intel-filter="buy" class="${intelFilter==='buy'?'activeChip':''}">Öka kandidater</button><button data-intel-filter="quality" class="${intelFilter==='quality'?'activeChip':''}">Hög kvalitet</button><button data-intel-filter="watch" class="${intelFilter==='watch'?'activeChip':''}">Bevaka</button><button data-intel-filter="risk" class="${intelFilter==='risk'?'activeChip':''}">Risk</button></div><div class="intelList">${items.map(intelCard).join('')||'<div class="empty">Inga innehav matchar filtret.</div>'}</div></section>`}
function ideas(){const a=[...(data.ideaBank||[]),...(data.aiRadar||[])];return `<section class="hero"><div class="eyebrow">Idébank</div><h2>Idéer som måste förtjäna sin plats</h2></section><div class="list">${a.map(x=>`<div class="card"><h3>${esc(x.title||x.name||'Idé')}</h3><p>${esc(x.text||x.note||'')}</p></div>`).join('')||'<div class="empty">Idébanken är tom.</div>'}</div>`}
function goals(){const gs=goalIntelligence();return `<section class="hero"><div class="eyebrow">Goal Intelligence 10.8</div><h2>Bygg frihet steg för steg</h2><p>Se hur nuvarande kapital och sparande kan föra dig mot nästa milstolpar.</p></section><section class="section"><h2>Prognoser</h2><div class="goalTimeline">${gs.map(g=>`<div class="goalForecast"><div><b>${g.label}</b><small>${pct(g.progress)} uppnått</small></div><strong>${fmtYears(g.years)}</strong></div>`).join('')}</div></section><div class="card form"><label>Kapitalmål<input id="capitalGoal" inputmode="numeric" value="${num(data.goals.capital)}"></label><label>Årligt utdelningsmål<input id="divGoal" inputmode="numeric" value="${num(data.goals.annualDividend)}"></label><label>Månadssparande<input id="monthly" inputmode="numeric" value="${num(data.portfolio.monthly||data.monthlyPlan.total)}"></label><button id="saveGoals" class="primary">Spara mål lokalt</button></div>`}
function more(){return `<section class="hero"><div class="eyebrow">Säkerhet & data</div><h2>Du äger din data</h2><p>Backupen innehåller basportfölj, administrationslager, kredit och transaktioner.</p></section><div class="card"><h2>Full lokal backup</h2><button id="exportBtn" class="primary">Exportera full backup</button><label class="file">Importera JSON-backup<input id="importFile" type="file" accept=".json,application/json"></label><p><small>Datakälla: ${esc(sourceKey||'ingen lokal portfölj hittad')}</small></p></div>`}
function showHolding(i){const h=canonicalHoldings().find(x=>x._i===i),t=total();if(!h)return;const intel=intelligenceFor(h);openModal(`<div class="eyebrow">Innehavsdetalj</div><h2>${esc(h._name)}</h2><div class="grid"><div class="card metric"><span>Konto</span><b>${esc(h._account)}</b></div><div class="card metric"><span>Tillgångsslag</span><b>${esc(h._type)}</b></div><div class="card metric"><span>Antal</span><b>${dec(h._qty)||'—'}</b></div><div class="card metric"><span>GAV</span><b>${dec(h._gav)||'—'}</b></div><div class="card metric"><span>Marknadsvärde</span><b>${kr(h._value)}</b></div><div class="card metric"><span>Portföljvikt</span><b>${pct(t?h._value/t*100:0)}</b></div><div class="card metric"><span>Valuta</span><b>${esc(text(h,['currency','valuta'],'SEK'))}</b></div><div class="card metric"><span>Värdemetod</span><b>${esc(h._method)}</b></div></div><section class="intelDetail"><div class="sectionHead"><h3>Portfolio Intelligence</h3><span class="scorePill">${intel.grade} ${intel.score}</span></div><p><b>${esc(intel.status)}</b> · ${esc(intel.reasons.join(' · '))}</p><div class="scoreGrid"><span>Kvalitet <b>${intel.quality}</b></span><span>Riskkontroll <b>${intel.risk}</b></span><span>Värdering <b>${intel.valuation}</b></span><span>Utdelning <b>${intel.dividend}</b></span><span>Datakvalitet <b>${intel.dataQuality}</b></span><span>Tillit <b>${intel.confidence}%</b></span></div></section><button class="primary" data-edit-key="${esc(h._key)}">Redigera innehav</button><button class="secondary topGap" data-tx-key="${esc(h._key)}">Registrera köp/sälj</button><section class="section topGap"><h3>Historik</h3><div class="list">${holdingLedger(h._key).slice(0,12).map(x=>`<div class="auditRow"><b>${esc(x.label)}</b><small>${new Date(x.date).toLocaleString('sv-SE')} · ${esc(x.kind)}</small></div>`).join('')||'<div class="empty">Ingen historik ännu.</div>'}</div></section>`)}
function modalParts(){return {root:document.getElementById('globalModal'),card:document.getElementById('globalModalCard'),body:document.getElementById('globalModalBody'),close:document.getElementById('globalModalClose')}}
function openModal(html){
 const {root,card,body}=modalParts();if(!root||!card||!body)return;
 body.innerHTML=html;
 root.hidden=false;
 root.classList.add('isOpen');
 root.setAttribute('aria-hidden','false');
 document.body.classList.add('modalOpen');
 card.scrollTop=0;
 requestAnimationFrame(()=>card.focus({preventScroll:true}));
 if(!history.state?.mkModal)history.pushState({...history.state,mkModal:true},'');
 bindModal();
}
function closeModal({fromHistory=false}={}){
 const {root,body}=modalParts();if(!root||root.hidden)return;
 root.classList.remove('isOpen');
 root.setAttribute('aria-hidden','true');
 root.hidden=true;
 document.body.classList.remove('modalOpen');
 if(body)body.innerHTML='';
 if(!fromHistory&&history.state?.mkModal)history.back();
}
function editHolding(key){const h=canonicalHoldings().find(x=>x._key===key);if(!h)return;openModal(`<div class="eyebrow">Portfolio Administration</div><h2>${esc(h._name)}</h2><div class="form twoCol"><label>Namn<input id="editName" value="${esc(h._name)}"></label><label>Konto<input id="editAccount" value="${esc(h._account)}"></label><label>Tillgångsslag<input id="editType" value="${esc(h._type)}"></label><label>Valuta<input id="editCurrency" value="${esc(text(h,['currency','valuta'],'SEK'))}"></label><label>Antal<input id="editQty" inputmode="decimal" value="${h._qty||''}"></label><label>GAV<input id="editGav" inputmode="decimal" value="${h._gav||''}"></label><label>Ticker<input id="editTicker" value="${esc(text(h,['ticker','symbol'],'') )}"></label><label>Marknadsvärde SEK<input id="editValue" inputmode="decimal" value="${explicitValue(h)||''}"></label></div><button id="saveEdit" class="primary" data-key="${esc(key)}">Spara direktkorrigering</button><p class="hint">Detta skapar ingen köp- eller säljtransaktion. Ändringen loggas och kan ångras.</p>`)}
function saveEdit(key){const h=canonicalHoldings().find(x=>x._key===key);if(!h)return;const before=admin.overrides[key]?{...admin.overrides[key]}:null;const after={name:document.getElementById('editName').value.trim(),account:document.getElementById('editAccount').value.trim(),assetType:document.getElementById('editType').value.trim(),currency:document.getElementById('editCurrency').value.trim().toUpperCase(),quantity:num(document.getElementById('editQty').value),gav:num(document.getElementById('editGav').value),ticker:document.getElementById('editTicker').value.trim(),marketValueSEK:num(document.getElementById('editValue').value)};admin.overrides[key]=after;audit('holding-edit',`Redigerade ${h._name}`,{key,value:before},{key,value:after});persistAdmin();closeModal();render()}
function addHolding(){const h={_key:'new-'+Date.now(),name:document.getElementById('newName').value.trim(),account:document.getElementById('newAccount').value.trim()||'Okänt konto',assetType:document.getElementById('newType').value.trim()||'Övrigt',currency:document.getElementById('newCurrency').value.trim().toUpperCase()||'SEK',quantity:num(document.getElementById('newQty').value),gav:num(document.getElementById('newGav').value),ticker:document.getElementById('newTicker').value.trim(),marketValueSEK:num(document.getElementById('newValue').value)};if(!h.name)return alert('Ange värdepapprets namn.');admin.newHoldings.push(h);audit('holding-add',`Lade till ${h.name}`,null,{key:h._key,value:h});persistAdmin();render()}
function saveCredit(){const account=document.getElementById('creditAccount').value.trim();if(!account)return alert('Ange konto.');const before=admin.credits[account]?{...admin.credits[account]}:null,after={limit:num(document.getElementById('creditLimit').value),used:num(document.getElementById('creditUsed').value),rate:num(document.getElementById('creditRate').value)};admin.credits[account]=after;audit('credit-edit',`Kredit ${account}`,{account,value:before},{account,value:after});persistAdmin();render()}
function saveTransaction(){const key=document.getElementById('txHolding').value,h=canonicalHoldings().find(x=>x._key===key);if(!h)return;const type=document.getElementById('txType').value,q=num(document.getElementById('txQty').value),price=num(document.getElementById('txPrice').value),fee=num(document.getElementById('txFee').value),currency=document.getElementById('txCurrency').value.trim().toUpperCase()||text(h,['currency'],'SEK'),fx=num(document.getElementById('txFx').value)||1;if(q<=0||price<0)return alert('Ange ett giltigt antal och pris.');const oldQ=h._qty,oldG=h._gav;let newQ=oldQ,newG=oldG;if(type==='buy'){newQ=oldQ+q;newG=newQ?((oldQ*oldG)+(q*price)+(fee/fx))/newQ:price}else{if(q>oldQ)return alert('Du kan inte sälja fler enheter än innehavet innehåller.');newQ=oldQ-q;newG=newQ?oldG:0}const before=admin.overrides[key]?{...admin.overrides[key]}:null;admin.overrides[key]={...(admin.overrides[key]||{}),quantity:newQ,gav:newG,currency};const tx={id:'tx-'+Date.now(),type,date:document.getElementById('txDate').value||today(),key,name:h._name,account:h._account,quantity:q,price,fee,currency,fx,previousQuantity:oldQ,previousGav:oldG,newQuantity:newQ,newGav:newG,overrideBefore:before};transactions.unshift(tx);persistTx();audit('transaction',`${type==='buy'?'Köp':'Sälj'} ${h._name}`,null,{txId:tx.id});persistAdmin();render()}
function deleteTransaction(id){const tx=transactions.find(x=>x.id===id);if(!tx||!confirm('Radera transaktionen och återställ antal/GAV till läget före den?'))return;if(tx.overrideBefore)admin.overrides[tx.key]=tx.overrideBefore;else delete admin.overrides[tx.key];transactions=transactions.filter(x=>x.id!==id);persistTx();audit('transaction-delete',`Raderade transaktion ${tx.name}`,null,{id});persistAdmin();render()}
function undoLast(){const x=admin.audit[0];if(!x)return;if(!confirm(`Ångra senaste ändringen: ${x.label}?`))return;if(x.kind==='holding-edit'){if(x.before?.value)admin.overrides[x.before.key]=x.before.value;else delete admin.overrides[x.after.key]}else if(x.kind==='holding-add'){admin.newHoldings=admin.newHoldings.filter(h=>h._key!==x.after.key)}else if(x.kind==='credit-edit'){if(x.before?.value)admin.credits[x.before.account]=x.before.value;else delete admin.credits[x.after.account]}else return alert('Denna loggpost ångras via transaktionshistoriken.');admin.audit.shift();persistAdmin();render()}
function bindModal(){const {root,close}=modalParts();if(!root)return;close.onclick=()=>closeModal();root.onclick=e=>{if(e.target===root)closeModal()};document.querySelector('[data-edit-key]')?.addEventListener('click',e=>editHolding(e.currentTarget.dataset.editKey));document.querySelector('[data-tx-key]')?.addEventListener('click',e=>{const key=e.currentTarget.dataset.txKey;portfolioTab='transactions';closeModal();render();setTimeout(()=>{const sel=document.getElementById('txHolding');if(sel)sel.value=key},0)});document.getElementById('saveEdit')?.addEventListener('click',e=>saveEdit(e.currentTarget.dataset.key))}
function bind(){document.getElementById('buildMappings')?.addEventListener('click',()=>{buildInstrumentMappings();render()});document.getElementById('validateLive')?.addEventListener('click',()=>{validateLiveCache();render()});document.querySelectorAll('[data-intel-filter]').forEach(b=>b.onclick=()=>{intelFilter=b.dataset.intelFilter;render();scrollTo(0,0)});document.querySelectorAll('[data-intel-index]').forEach(b=>b.onclick=()=>showHolding(Number(b.dataset.intelIndex)));document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=e=>{e.preventDefault();portfolioTab=b.dataset.tab||'overview';screen='portfolio';render();requestAnimationFrame(()=>scrollTo({top:0,left:0,behavior:'auto'}))});document.querySelectorAll('[data-tabgo]').forEach(b=>b.onclick=e=>{e.preventDefault();portfolioTab=b.dataset.tabgo||'overview';screen='portfolio';render();requestAnimationFrame(()=>scrollTo({top:0,left:0,behavior:'auto'}))});const s=document.getElementById('search');if(s)s.oninput=e=>{query=e.target.value;render()};const tf=document.getElementById('typeFilter');if(tf)tf.onchange=e=>{typeFilter=e.target.value;render()};const af=document.getElementById('accountFilter');if(af)af.onchange=e=>{accountFilter=e.target.value;render()};const sm=document.getElementById('sortMode');if(sm)sm.onchange=e=>{sortMode=e.target.value;render()};document.querySelectorAll('[data-index]').forEach(b=>b.onclick=()=>showHolding(Number(b.dataset.index)));document.getElementById('openEdit')?.addEventListener('click',()=>editHolding(document.getElementById('adminHolding').value));document.getElementById('addHolding')?.addEventListener('click',addHolding);document.getElementById('saveCredit')?.addEventListener('click',saveCredit);document.getElementById('saveTx')?.addEventListener('click',saveTransaction);document.getElementById('saveLedger')?.addEventListener('click',saveManualLedger);document.querySelectorAll('[data-ledger-id]').forEach(b=>b.onclick=()=>showLedger(b.dataset.ledgerId));document.querySelectorAll('[data-delete-tx]').forEach(b=>b.onclick=()=>deleteTransaction(b.dataset.deleteTx));document.getElementById('undoAudit')?.addEventListener('click',undoLast);const sg=document.getElementById('saveGoals');if(sg)sg.onclick=()=>{data.goals.capital=num(document.getElementById('capitalGoal').value);data.goals.annualDividend=num(document.getElementById('divGoal').value);data.portfolio.monthly=num(document.getElementById('monthly').value);safeSet(SETTINGS_KEY,JSON.stringify({goals:data.goals,portfolio:{monthly:data.portfolio.monthly}}));render()};const ex=document.getElementById('exportBtn');if(ex)ex.onclick=()=>{const payload={version:VERSION,exportedAt:new Date().toISOString(),sourceKey,data,admin,transactions,ledger};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='mastarklass-os-full-backup-'+today()+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};const im=document.getElementById('importFile');if(im)im.onchange=async e=>{const f=e.target.files?.[0];if(!f)return;const x=parse(await f.text());if(!x)return alert('Filen kunde inte läsas.');if(x.data&&looksLikePortfolio(x.data))safeSet(DATA_KEY,JSON.stringify(x.data));if(x.admin)safeSet(ADMIN_KEY,JSON.stringify(x.admin));if(x.transactions)safeSet(TX_KEY,JSON.stringify(x.transactions));if(x.ledger)safeSet(LEDGER_KEY,JSON.stringify(x.ledger));location.reload()}}
function render(){
 const app=document.getElementById('app');if(!app)return;
 nav();
 const views={home,portfolio,market,analysis,ideas,goals,more};
 try{
  const view=views[screen]||home;
  app.innerHTML=view();
 }catch(error){
  console.error(`Render failed: ${screen}`,error);
  screen='portfolio';portfolioTab='overview';
  app.innerHTML=portfolio();
  history.replaceState(null,'','#portfolio');
 }
 const meta=document.getElementById('headerMeta');if(meta)meta.textContent=`${canonicalHoldings().length} innehav · Portfolio Intelligence · ${VERSION}`;
 bind();
}
function boot(){
 data=loadData();
 admin=merge(ADMIN_DEFAULT,parse(safeGet(ADMIN_KEY))||{});
 transactions=parse(safeGet(TX_KEY))||[];
 ledger=parse(safeGet(LEDGER_KEY))||[];
 initializeLiveFoundation();
 const settings=parse(safeGet(SETTINGS_KEY));
 if(settings?.goals)data.goals=merge(data.goals,settings.goals);
 if(settings?.portfolio)data.portfolio=merge(data.portfolio,settings.portfolio);
 screen=(location.hash.slice(1)||'home');
 if(!NAV.some(x=>x[0]===screen))screen='home';
 migrateLedger();
 render();
 document.body.classList.add('appReady');
 window.addEventListener('hashchange',()=>{const next=location.hash.slice(1)||'home';if(NAV.some(x=>x[0]===next)){screen=next;render();requestAnimationFrame(()=>scrollTo({top:0,left:0,behavior:'auto'}))}});
 window.addEventListener('popstate',()=>{const {root}=modalParts();if(root&&!root.hidden)closeModal({fromHistory:true})});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){const {root}=modalParts();if(root&&!root.hidden)closeModal()}});
 if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register(`sw.js?v=${VERSION}`).then(reg=>reg.update()).catch(e=>console.warn(e)),{once:true});
}
try{boot()}catch(error){console.error(error);const app=document.getElementById('app');if(app)app.innerHTML='<div class="fatal"><b>Appen kunde inte starta.</b><p>Lokal data har inte raderats. Stäng appen och öppna den igen.</p></div>';document.body.classList.add('appReady')}
})();
