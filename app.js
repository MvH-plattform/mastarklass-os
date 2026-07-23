(()=>{'use strict';
const VERSION='11.15.23';
const DATA_KEY='mastarklass_os_10_data';
const LIVE_KEY='mastarklass_os_live_readonly_v1';
const SETTINGS_KEY='mastarklass_os_10_settings';
const ADMIN_KEY='mastarklass_os_10_3_1_admin';
const TX_KEY='mastarklass_os_10_3_transactions';
const LEDGER_KEY='mastarklass_os_10_4_ledger';
const LIVE_FOUNDATION_KEY='mastarklass_os_11_live_foundation';
const LIVE_EVENT_KEY='mastarklass_os_11_live_events';
const LIVE_SYNC_KEY='mastarklass_os_11_1_sync';
const PROVIDER_TELEMETRY_KEY='mastarklass_os_11_1_2_provider_telemetry';
const PROVIDER_CONFIG_KEY='mastarklass_os_11_2_provider_config';
const AUTO_STEWARD_KEY='mastarklass_os_11_4_auto_steward';
const INSTRUMENT_REGISTRY_KEY='mastarklass_os_11_6_instrument_registry';
const FUND_NAV_KEY='mastarklass_os_11_8_fund_nav';
const UNIVERSAL_IDENTITY_KEY='mastarklass_os_11_7_universal_identity';
const IDENTITY_REBUILD_KEY='mastarklass_os_11_9_identity_rebuild';
const GLOBAL_RESOLVER_KEY='mastarklass_os_11_10_global_resolver';
const PERMANENT_IDENTITY_KEY='mastarklass_os_11_15_1_permanent_identity_registry';
const RESOLVER_TRACE_KEY='mastarklass_os_11_15_23_resolver_trace';
const ADAPTIVE_DATA_KEY='mastarklass_os_11_11_adaptive_data';
const DATA_CONFIDENCE_KEY='mastarklass_os_11_12_data_confidence';
const AUTONOMOUS_INTELLIGENCE_KEY='mastarklass_os_11_12_autonomous_intelligence';
const AUTONOMOUS_PORTFOLIO_KEY='mastarklass_os_11_13_autonomous_portfolio';
const INTELLIGENCE_TREND_KEY='mastarklass_os_11_13_intelligence_trend';
const LIVE_VALUATION_KEY='mastarklass_os_11_15_live_valuation';
const RESOLVER_RUN_KEY='mastarklass_os_11_15_2_resolver_run';
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
function loadData(){const own=parse(safeGet(DATA_KEY));if(looksLikePortfolio(own)){sourceKey=DATA_KEY;return merge(DEFAULTS,own)}let best=null,bestScore=0,bestKey=null;for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(!k||[LIVE_KEY,SETTINGS_KEY,ADMIN_KEY,TX_KEY,LEDGER_KEY,LIVE_FOUNDATION_KEY,LIVE_EVENT_KEY,LIVE_SYNC_KEY,PROVIDER_TELEMETRY_KEY].includes(k)||/cache|live_readonly/i.test(k))continue;const v=parse(safeGet(k)),s=score(v);if(s>bestScore){best=v;bestScore=s;bestKey=k}}sourceKey=bestKey;return merge(DEFAULTS,best||{})}
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
  {id:'official-fx',name:'ECB FX Adapter',category:'fx',role:'primary',priority:100,quality:98,status:'ready',connector:'ecb',coverage:'EUR-baserade referenskurser till SEK'},
  {id:'market-primary',name:'Stooq Price Adapter',category:'prices',role:'primary',priority:90,quality:82,status:'ready',connector:'stooq',coverage:'Aktier och ETF:er med mappad ticker och timeout/retry'},
  {id:'market-fallback',name:'Local Quote Fallback',category:'prices',role:'fallback',priority:70,quality:70,status:'standby',connector:'local-cache',coverage:'Senast validerade lokala kurs vid nät- eller providerfel'},
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
function inferTickerForHolding(h){
 const explicit=text(h,['ticker','symbol','providerSymbol'],'').trim();
 if(explicit)return explicit;
 const name=holdingName(h).toLowerCase();
 const known=[
  [/alibaba group adr|alibaba/, 'BABA'],[/amazon/, 'AMZN'],[/apple/, 'AAPL'],[/microsoft/, 'MSFT'],[/alphabet|google/, 'GOOGL'],[/nvidia/, 'NVDA'],
  [/investor b/, 'INVE-B.ST'],[/volvo b/, 'VOLV-B.ST'],[/atlas copco b/, 'ATCO-B.ST'],[/abb ltd|\babb\b/, 'ABB.ST'],[/swedbank/, 'SWED-A.ST'],
  [/handelsbanken a/, 'SHB-A.ST'],[/seb a/, 'SEB-A.ST'],[/nordea/, 'NDA-SE.ST'],[/telia/, 'TELIA.ST'],[/tele2 b/, 'TEL2-B.ST'],
  [/sbb b/, 'SBB-B.ST'],[/castellum/, 'CAST.ST'],[/diös/, 'DIOS.ST'],[/np3 fastigheter/, 'NP3.ST'],[/xact norden högutdelande/, 'XACTHDIV.ST']
 ];
 const hit=known.find(([re])=>re.test(name));
 return hit?hit[1]:'';
}
function instrumentMappingCoverage(){
 const hs=canonicalHoldings();
 const mapped=hs.map(h=>{
  const key=h._key;
  const existing=liveFoundation.mappings[key]||{};
  const ticker=inferTickerForHolding(h);
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
function quoteTimestampLocal(q){return text(q,['timestamp','updatedAt','date','datetime','time'],'')}
function quoteFreshness(q){const ts=Date.parse(quoteTimestampLocal(q)||'');if(!ts)return {minutes:null,label:'okänd',fresh:false};const minutes=Math.max(0,(Date.now()-ts)/60000);return {minutes,label:minutes<2?'nyss':minutes<60?`${Math.round(minutes)} min`:minutes<1440?`${Math.round(minutes/60)} tim`:`${Math.round(minutes/1440)} dagar`,fresh:minutes<=1440}}
function liveValuationFor(h){
 const q=marketDataFor(h),qty=quantity(h),fx=fxFor(h),asset=classifyInstrument(h),mapping=liveFoundation.mappings[h._key]||{};
 const price=q?nval(q,['price','latestPrice','last','value','close','nav']):0;
 const quality=q?num(q.quality)||70:0, freshness=q?quoteFreshness(q):{minutes:null,label:'saknas',fresh:false};
 const identityOk=!!(mapping.verified||mapping.ticker||mapping.isin||text(h,['ticker','symbol','isin'],'')||q?.symbol||q?.ticker);
 const usable=!!(qty&&price&&fx&&identityOk&&quality>=45);
 if(usable){
  const value=qty*price*fx,change=nval(q,['change','changeAmount','delta']),changePct=nval(q,['changePct','percentChange','changePercent']);
  return {value,method:asset.pricing==='nav'?'Senaste NAV × antal':'Livekurs × antal × FX',source:q.provider||'Live cache',price,fx,qty,dayChange:change?qty*change*fx:(changePct?value*changePct/(100+changePct):0),quality,freshness:freshness.label,live:true,nav:asset.pricing==='nav'};
 }
 const direct=explicitValue(h);if(direct)return {value:direct,method:'Senast känt marknadsvärde',source:'Portfolio Ledger',price:0,fx:fx||1,qty,dayChange:0,quality:35,freshness:'manuellt',live:false,nav:false};
 const c=costValue(h);if(c)return {value:c,method:'Anskaffningsvärde',source:'Portfolio Ledger',price:0,fx:fx||1,qty,dayChange:0,quality:20,freshness:'historiskt',live:false,nav:false};
 return {value:0,method:'Saknar värde',source:'—',price:0,fx:fx||0,qty,dayChange:0,quality:0,freshness:'saknas',live:false,nav:false};
}
function holdingValue(h){const v=liveValuationFor(h);return {value:v.value,method:v.method,valuation:v}}
function accountName(h){return text(h,['account','accountName','konto','platform','broker'],'Okänt konto')}
function assetType(h){return text(h,['assetType','type','category','tillgangsslag','tillgångsslag'],'Övrigt')}
function holdingName(h){return text(h,['name','securityName','title','instrumentName','symbol','ticker'],'Innehav')}
function identity(h,i=0){return String(h.id||h.uuid||`${accountName(h)}|${holdingName(h)}|${text(h,['currency','valuta'],'SEK')}|${i}`).toLowerCase()}
function rawHoldings(){return [...(data.holdings||[]).map((h,i)=>({...h,_baseIndex:i,_key:identity(h,i)})),...(admin.newHoldings||[]).map((h,i)=>({...h,_newIndex:i,_key:h._key||identity(h,'new'+i)}))]}
function canonicalHoldings(){return rawHoldings().map((base,i)=>{const h={...base,...(admin.overrides[base._key]||{})};const r=holdingValue(h);return {...h,_i:i,_value:r.value,_method:r.method,_valuation:r.valuation,_name:holdingName(h),_account:accountName(h),_type:assetType(h),_qty:quantity(h),_gav:gav(h),_fx:fxFor(h),_quote:quoteFor(h)}})}
function declaredTotal(){return nval(data.portfolio||{},['net','total','totalValue','marketValue','value'])||(data.accounts||[]).reduce((s,a)=>s+nval(a,['value','marketValue','totalValue','balance']),0)}
function calculatedTotal(){return canonicalHoldings().reduce((s,h)=>s+h._value,0)}
function total(){const calc=calculatedTotal();return calc||declaredTotal()}
function liveValuationSnapshot({persist=true}={}){
 const hs=canonicalHoldings(),totalValue=hs.reduce((s,h)=>s+h._value,0),dayChange=hs.reduce((s,h)=>s+num(h._valuation?.dayChange),0);
 const live=hs.filter(h=>h._valuation?.live&&!h._valuation?.nav),nav=hs.filter(h=>h._valuation?.live&&h._valuation?.nav),fallback=hs.filter(h=>!h._valuation?.live&&h._value>0),missing=hs.filter(h=>!h._value);
 const liveValue=[...live,...nav].reduce((s,h)=>s+h._value,0),coverageValue=totalValue?liveValue/totalValue*100:0,coverageCount=hs.length?(live.length+nav.length)/hs.length*100:0;
 const accountValues={};hs.forEach(h=>accountValues[h._account]=(accountValues[h._account]||0)+h._value);
 const top=hs.slice().sort((a,b)=>b._value-a._value)[0];
 const snapshot={version:VERSION,updatedAt:new Date().toISOString(),totalValue,dayChange,dayPct:totalValue-dayChange?dayChange/(totalValue-dayChange)*100:0,liveCount:live.length,navCount:nav.length,fallbackCount:fallback.length,missingCount:missing.length,coverageValue,coverageCount,accountValues,largestWeight:top&&totalValue?top._value/totalValue*100:0};
 if(persist)safeSet(LIVE_VALUATION_KEY,JSON.stringify(snapshot));return snapshot;
}
function valuationHero(){const v=liveValuationSnapshot();return `<section class="hero valuationHero"><div class="eyebrow">Live Portfolio Valuation 11.15.23</div><h2>${kr(v.totalValue)}</h2><p>${v.liveCount} livekurser · ${v.navCount} NAV · ${v.fallbackCount} senast kända värden · ${v.missingCount} saknar värde.</p><div class="grid"><div class="card metric"><span>Live-täckning</span><b>${pct(v.coverageValue)}</b><small>${pct(v.coverageCount)} av innehaven</small></div><div class="card metric"><span>Dagens förändring</span><b class="${v.dayChange>=0?'positive':'negative'}">${v.dayChange>=0?'+':''}${kr(v.dayChange)}</b><small>${v.dayPct>=0?'+':''}${pct(v.dayPct)}</small></div><div class="card metric"><span>Största vikt</span><b>${pct(v.largestWeight)}</b></div><div class="card metric"><span>Senast värderad</span><b>${new Date(v.updatedAt).toLocaleTimeString('sv-SE',{hour:'2-digit',minute:'2-digit'})}</b></div></div></section>`}
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
 if(portfolioTab==='overview')content=`${valuationHero()}<section class="section"><div class="sectionHead"><h2>Portfolio Ledger</h2><small>Basvärde ${kr(declaredTotal())}</small></div><p>${all.length} innehav · ${transactions.length} transaktioner · ${admin.audit.length} spårade korrigeringar. Live-lagret ändrar aldrig antal eller GAV.</p></section><div class="grid"><button class="card actionCard" data-tabgo="transactions"><b>Registrera köp/sälj</b><span>Uppdatera antal och viktat GAV.</span></button><button class="card actionCard" data-tabgo="admin"><b>Administrera portfölj</b><span>Ändra GAV, antal, nya innehav och kredit.</span></button></div>`;
 if(portfolioTab==='accounts')content=`<section class="section"><h2>Konton</h2><div class="list">${[...accountMap.entries()].sort((a,b)=>b[1]-a[1]).map(([n,v])=>`<div class="simpleRow"><div><b>${esc(n)}</b><small>${pct(t?v/t*100:0)}</small></div><b>${kr(v)}</b></div>`).join('')}</div></section>`;
 if(portfolioTab==='holdings')content=`<section class="section"><div class="sectionHead"><h2>Alla innehav</h2><small>${hs.length} av ${all.length}</small></div><div class="tools"><input id="search" type="search" value="${esc(query)}" placeholder="Sök innehav eller konto"><select id="typeFilter"><option value="all">Alla tillgångsslag</option>${types.map(x=>`<option ${x===typeFilter?'selected':''}>${esc(x)}</option>`).join('')}</select><select id="accountFilter"><option value="all">Alla konton</option>${accounts.map(x=>`<option ${x===accountFilter?'selected':''}>${esc(x)}</option>`).join('')}</select><select id="sortMode"><option value="value_desc">Störst värde</option><option value="value_asc" ${sortMode==='value_asc'?'selected':''}>Minst värde</option><option value="name_asc" ${sortMode==='name_asc'?'selected':''}>Namn A–Ö</option><option value="name_desc" ${sortMode==='name_desc'?'selected':''}>Namn Ö–A</option></select></div><div class="list">${hs.map(h=>row(h,t)).join('')}</div></section>`;
 if(portfolioTab==='transactions')content=transactionSection(all);
 if(portfolioTab==='admin')content=adminSection(all,accounts);
 if(portfolioTab==='ledger')content=ledgerSection(all,accounts);
 if(portfolioTab==='quality')content=`<section class="section"><h2>Datakvalitet och avstämning</h2><div class="grid"><div class="card metric"><span>Deklarerad bas</span><b>${kr(d.declared)}</b></div><div class="card metric"><span>Beräknat nu</span><b>${kr(d.calc)}</b></div><div class="card metric"><span>Differens</span><b>${kr(d.diff)}</b></div><div class="card metric"><span>Saknar värde</span><b>${d.unresolved.length}</b></div></div>${d.unresolved.length?`<div class="warning"><b>Poster som behöver kurs eller värde</b><p>${d.unresolved.slice(0,30).map(h=>esc(h._name)).join(', ')}${d.unresolved.length>30?' …':''}</p></div>`:`<div class="notice okbox">Samtliga innehav har ett spårbart värde.</div>`}</section>`;
 return chips()+content}
function transactionSection(all){const opts=all.map(h=>`<option value="${esc(h._key)}">${esc(h._name)} — ${esc(h._account)}</option>`).join('');return `<section class="section"><div class="eyebrow">Transaction Engine</div><h2>Registrera köp eller sälj</h2><div class="form twoCol"><label>Typ<select id="txType"><option value="buy">Köp</option><option value="sell">Sälj</option></select></label><label>Datum<input id="txDate" type="date" value="${today()}"></label><label>Värdepapper<select id="txHolding">${opts}</select></label><label>Antal<input id="txQty" inputmode="decimal" placeholder="0"></label><label>Pris per enhet<input id="txPrice" inputmode="decimal" placeholder="0,00"></label><label>Courtage<input id="txFee" inputmode="decimal" value="0"></label><label>Valuta<input id="txCurrency" value="SEK"></label><label>Valutakurs till SEK<input id="txFx" inputmode="decimal" value="1"></label></div><button id="saveTx" class="primary">Spara transaktion lokalt</button></section><section class="section"><h2>Historik</h2><div class="list">${transactions.length?transactions.map(x=>`<div class="simpleRow"><div><b>${x.type==='buy'?'Köp':'Sälj'} · ${esc(x.name)}</b><small>${esc(x.date)} · ${dec(x.quantity)} st · ${dec(x.price)} ${esc(x.currency)} · courtage ${dec(x.fee)}</small></div><button class="danger smallBtn" data-delete-tx="${esc(x.id)}">Radera</button></div>`).join(''):'<div class="empty">Inga transaktioner registrerade ännu.</div>'}</div></section>`}
function adminSection(all,accounts){const creditNames=[...new Set([...accounts,...Object.keys(admin.credits||{})])];return `<section class="hero"><div class="eyebrow">Master Data</div><h2>Direktkorrigering utan falsk transaktion</h2><p>Använd detta för startvärden, rättning av GAV/antal, nya värdepapper och kredit. Alla ändringar loggas.</p></section><section class="section"><h2>Redigera befintligt innehav</h2><label class="formLabel">Välj innehav<select id="adminHolding">${all.map(h=>`<option value="${esc(h._key)}">${esc(h._name)} — ${esc(h._account)}</option>`).join('')}</select></label><button id="openEdit" class="primary">Öppna redigering</button></section><section class="section"><h2>Lägg till värdepapper</h2><div class="form twoCol"><label>Namn<input id="newName"></label><label>Konto<input id="newAccount" list="accountList"></label><label>Tillgångsslag<input id="newType" value="Aktie"></label><label>Valuta<input id="newCurrency" value="SEK"></label><label>Antal<input id="newQty" inputmode="decimal"></label><label>GAV<input id="newGav" inputmode="decimal"></label><label>Ticker<input id="newTicker"></label><label>Marknadsvärde SEK<input id="newValue" inputmode="decimal"></label></div><datalist id="accountList">${accounts.map(x=>`<option>${esc(x)}</option>`).join('')}</datalist><button id="addHolding" class="primary">Lägg till utan transaktion</button></section><section class="section"><h2>Investeringskredit</h2><div class="form twoCol"><label>Konto<input id="creditAccount" list="accountList"></label><label>Kreditlimit<input id="creditLimit" inputmode="decimal"></label><label>Utnyttjad kredit<input id="creditUsed" inputmode="decimal"></label><label>Ränta %<input id="creditRate" inputmode="decimal"></label></div><button id="saveCredit" class="primary">Spara kredit lokalt</button><div class="list topGap">${creditNames.length?creditNames.map(n=>{const c=admin.credits[n]||{};return `<div class="simpleRow"><div><b>${esc(n)}</b><small>Limit ${kr(c.limit)} · Ränta ${pct(c.rate)}</small></div><b>${kr(c.used)}</b></div>`}).join(''):'<div class="empty">Ingen kredit registrerad.</div>'}</div></section><section class="section"><div class="sectionHead"><h2>Ändringslogg</h2><button id="undoAudit" class="secondary" ${admin.audit.length?'':'disabled'}>Ångra senaste</button></div><div class="list">${admin.audit.slice(0,20).map(x=>`<div class="auditRow"><b>${esc(x.label)}</b><small>${new Date(x.date).toLocaleString('sv-SE')} · ${esc(x.kind)}</small></div>`).join('')||'<div class="empty">Inga direktändringar ännu.</div>'}</div></section>`}

function mappingEditor(){
 const c=instrumentMappingCoverage();
 const rows=c.items.map(x=>{const m=liveFoundation.mappings[x.key]||{},cand=m.candidates?.[0];return `<div class="mappingRow ${m.verified?'verifiedMap':cand?'reviewMap':''}" data-map-key="${esc(x.key)}"><div><b>${esc(x.name)}</b><small>${esc(x.account)} · ${esc(x.assetType)}</small>${m.verified?`<em class="mapStatus ok">Verifierad ${num(m.confidence)||100}%</em>`:cand?`<em class="mapStatus">Förslag: ${esc(cand.ticker)} · ${num(cand.score)}%</em>`:'<em class="mapStatus missing">Saknar säker identitet</em>'}</div><label>Ticker<input data-map-ticker value="${esc(x.ticker||cand?.ticker||'')}" placeholder="Ex. INVE B"></label><label>ISIN<input data-map-isin value="${esc(x.isin||'')}" placeholder="SE0000107419"></label><label>Valuta<input data-map-currency value="${esc(x.currency||cand?.currency||'SEK')}" maxlength="3"></label></div>`}).join('');
 return `<div class="eyebrow">Intelligent Mapping Center 11.3.0</div><h2>Instrumentmappning</h2><p class="disclaimer">Ticker och ISIN sparas endast i live-lagret. Antal, GAV, kredit, transaktioner och Ledger ändras aldrig.</p><div class="mappingSummary"><b>${c.complete}/${c.total} mappade</b><span>${c.missing.length} behöver kompletteras</span></div><div class="mappingList">${rows}</div><button id="saveMappings" class="primary stickyAction">Spara instrumentmappning</button>`;
}
function openMappingEditor(){openModal(mappingEditor());document.getElementById('saveMappings')?.addEventListener('click',saveMappingsFromEditor)}
function saveMappingsFromEditor(){
 document.querySelectorAll('[data-map-key]').forEach(row=>{
  const key=row.dataset.mapKey,prev=liveFoundation.mappings[key]||{};
  liveFoundation.mappings[key]={...prev,ticker:row.querySelector('[data-map-ticker]')?.value.trim()||'',isin:row.querySelector('[data-map-isin]')?.value.trim()||'',currency:(row.querySelector('[data-map-currency]')?.value.trim()||'SEK').toUpperCase(),updatedAt:new Date().toISOString(),source:'manual-live-mapping'};
 });
 liveFoundation.updatedAt=new Date().toISOString();persistLiveFoundation();liveEvent('success','Instrument Mapping','Manuell instrumentmappning sparad');closeModal();render();
}

/* 11.1.2 Multi-Provider Live Engine */
function providerTelemetry(){return merge({
 'ecb':{id:'ecb',name:'ECB FX',attempts:0,successes:0,failures:0,lastAttempt:'',lastSuccess:'',lastError:'',latencyMs:0,status:'idle'},
 'twelvedata':{id:'twelvedata',name:'Twelve Data',attempts:0,successes:0,failures:0,lastAttempt:'',lastSuccess:'',lastError:'',latencyMs:0,status:'unconfigured'},
 'alphavantage':{id:'alphavantage',name:'Alpha Vantage',attempts:0,successes:0,failures:0,lastAttempt:'',lastSuccess:'',lastError:'',latencyMs:0,status:'unconfigured'},
 'finnhub':{id:'finnhub',name:'Finnhub',attempts:0,successes:0,failures:0,lastAttempt:'',lastSuccess:'',lastError:'',latencyMs:0,status:'unconfigured',cooldownUntil:''},
 'stooq':{id:'stooq',name:'Stooq Legacy',attempts:0,successes:0,failures:0,lastAttempt:'',lastSuccess:'',lastError:'',latencyMs:0,status:'idle'},
 'local-cache':{id:'local-cache',name:'Local Cache',attempts:0,successes:0,failures:0,lastAttempt:'',lastSuccess:'',lastError:'',latencyMs:0,status:'standby'}
},parse(safeGet(PROVIDER_TELEMETRY_KEY))||{})}
function persistProviderTelemetry(x){safeSet(PROVIDER_TELEMETRY_KEY,JSON.stringify(x))}
function updateProviderTelemetry(id,patch){const all=providerTelemetry(),old=all[id]||{id,name:id,attempts:0,successes:0,failures:0};all[id]={...old,...patch};persistProviderTelemetry(all);return all[id]}
function providerReliability(p){const attempts=num(p.attempts),successes=num(p.successes);return attempts?Math.round(successes/attempts*100):(p.status==='standby'?100:0)}
async function fetchWithPolicy(url,{provider='unknown',timeoutMs=9000,retries=1,headers={}}={}){
 let lastError=null;
 for(let attempt=0;attempt<=retries;attempt++){
  const current=providerTelemetry()[provider]||{},cooldownUntil=Date.parse(current.cooldownUntil||'')||0;
  if(cooldownUntil>Date.now())throw new Error(`cooldown ${Math.ceil((cooldownUntil-Date.now())/60000)} min`);
  const ctrl=new AbortController(),started=performance.now(),timer=setTimeout(()=>ctrl.abort(),timeoutMs),t=providerTelemetry()[provider]||{};
  updateProviderTelemetry(provider,{...t,attempts:num(t.attempts)+1,lastAttempt:new Date().toISOString(),status:'checking'});
  try{
   const response=await fetch(url,{headers,signal:ctrl.signal,cache:'no-store'});clearTimeout(timer);
   if(!response.ok){
    if(response.status===429){const until=new Date(Date.now()+15*60*1000).toISOString(),latest=providerTelemetry()[provider]||{};updateProviderTelemetry(provider,{...latest,failures:num(latest.failures)+1,lastError:'HTTP 429 · pausad 15 min',cooldownUntil:until,status:'cooling'});throw new Error('HTTP 429 · provider pausad 15 min')}
    throw new Error(`HTTP ${response.status}`)
   }
   const latency=Math.round(performance.now()-started),latest=providerTelemetry()[provider]||{};
   updateProviderTelemetry(provider,{...latest,successes:num(latest.successes)+1,lastSuccess:new Date().toISOString(),lastError:'',latencyMs:latency,status:'online',cooldownUntil:''});
   return response;
  }catch(error){
   clearTimeout(timer);lastError=error;const latest=providerTelemetry()[provider]||{};
   if(latest.status!=='cooling')updateProviderTelemetry(provider,{...latest,failures:num(latest.failures)+1,lastError:error?.name==='AbortError'?'timeout':String(error?.message||error),latencyMs:Math.round(performance.now()-started),status:attempt<retries?'retrying':'degraded'});
   if(attempt<retries)await new Promise(resolve=>setTimeout(resolve,450*(attempt+1)));
  }
 }
 throw lastError||new Error('Providerfel');
}
function providerHealthSummary(){const items=Object.values(providerTelemetry()).map(p=>({...p,reliability:providerReliability(p)}));return {items,active:items.filter(p=>p.status==='online').length,degraded:items.filter(p=>p.status==='degraded'||p.status==='retrying'||p.status==='cooling').length,score:items.length?Math.round(items.reduce((s,p)=>s+p.reliability,0)/items.length):0}}
function cacheHealth(){const live=liveState(),quotes=Array.isArray(live.quotes)?live.quotes:[],now=Date.now();let fresh=0,delayed=0,stale=0;quotes.forEach(q=>{const ts=Date.parse(quoteTimestamp(q)||'');if(!ts){stale++;return}const age=(now-ts)/60000;if(age<=30)fresh++;else if(age<=1440)delayed++;else stale++});return {items:quotes.length,fresh,delayed,stale,hitRate:quotes.length?Math.round((fresh+delayed)/quotes.length*100):0}}
function normalizeInstrumentName(value){return String(value||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\b(ab|plc|inc|corp|corporation|ltd|limited|class|aktiebolag|fund|fond|etf)\b/g,' ').replace(/[^a-z0-9]+/g,' ').trim()}
const GLOBAL_INSTRUMENT_REGISTRY=[
 {names:['mastercard','mastercard a'],ticker:'MA',providerSymbols:{twelve:'MA',alpha:'MA',finnhub:'MA'},isin:'US57636Q1040',currency:'USD',exchange:'NYSE',country:'US',type:'Aktie'},
 {names:['coca cola','coca-cola','the coca cola company'],ticker:'KO',providerSymbols:{twelve:'KO',alpha:'KO',finnhub:'KO'},isin:'US1912161007',currency:'USD',exchange:'NYSE',country:'US',type:'Aktie'},
 {names:['pepsico','pepsi'],ticker:'PEP',providerSymbols:{twelve:'PEP',alpha:'PEP',finnhub:'PEP'},isin:'US7134481081',currency:'USD',exchange:'NASDAQ',country:'US',type:'Aktie'},
 {names:['visa','visa a'],ticker:'V',providerSymbols:{twelve:'V',alpha:'V',finnhub:'V'},isin:'US92826C8394',currency:'USD',exchange:'NYSE',country:'US',type:'Aktie'},
 {names:['realty income'],ticker:'O',providerSymbols:{twelve:'O',alpha:'O',finnhub:'O'},isin:'US7561091049',currency:'USD',exchange:'NYSE',country:'US',type:'Aktie'},
 {names:['stag industrial'],ticker:'STAG',providerSymbols:{twelve:'STAG',alpha:'STAG',finnhub:'STAG'},isin:'US85254J1025',currency:'USD',exchange:'NYSE',country:'US',type:'Aktie'},
 {names:['united parcel service','ups'],ticker:'UPS',providerSymbols:{twelve:'UPS',alpha:'UPS',finnhub:'UPS'},isin:'US9113121068',currency:'USD',exchange:'NYSE',country:'US',type:'Aktie'},
 {names:['blackstone'],ticker:'BX',providerSymbols:{twelve:'BX',alpha:'BX',finnhub:'BX'},isin:'US09260D1072',currency:'USD',exchange:'NYSE',country:'US',type:'Aktie'},
 {names:['blackrock'],ticker:'BLK',providerSymbols:{twelve:'BLK',alpha:'BLK',finnhub:'BLK'},isin:'US09247X1019',currency:'USD',exchange:'NYSE',country:'US',type:'Aktie'},
 {names:['main street capital'],ticker:'MAIN',providerSymbols:{twelve:'MAIN',alpha:'MAIN',finnhub:'MAIN'},isin:'US56035L1044',currency:'USD',exchange:'NYSE',country:'US',type:'Aktie'},
 {names:['amazon'],ticker:'AMZN',providerSymbols:{twelve:'AMZN',alpha:'AMZN',finnhub:'AMZN'},isin:'US0231351067',currency:'USD',exchange:'NASDAQ',country:'US',type:'Aktie'},
 {names:['alibaba'],ticker:'BABA',providerSymbols:{twelve:'BABA',alpha:'BABA',finnhub:'BABA'},isin:'US01609W1027',currency:'USD',exchange:'NYSE',country:'CN',type:'Aktie'},
 {names:['apple'],ticker:'AAPL',providerSymbols:{twelve:'AAPL',alpha:'AAPL',finnhub:'AAPL'},isin:'US0378331005',currency:'USD',exchange:'NASDAQ',country:'US',type:'Aktie'},
 {names:['microsoft'],ticker:'MSFT',providerSymbols:{twelve:'MSFT',alpha:'MSFT',finnhub:'MSFT'},isin:'US5949181045',currency:'USD',exchange:'NASDAQ',country:'US',type:'Aktie'},
 {names:['nvidia'],ticker:'NVDA',providerSymbols:{twelve:'NVDA',alpha:'NVDA',finnhub:'NVDA'},isin:'US67066G1040',currency:'USD',exchange:'NASDAQ',country:'US',type:'Aktie'},
 {names:['investor b'],ticker:'INVE B',providerSymbols:{twelve:'INVE-B:OMX',alpha:'INVE-B.ST',finnhub:'INVE-B.ST'},isin:'SE0015811963',currency:'SEK',exchange:'NASDAQ STOCKHOLM',country:'SE',type:'Aktie'},
 {names:['essity b'],ticker:'ESSITY B',providerSymbols:{twelve:'ESSITY-B:OMX',alpha:'ESSITY-B.ST',finnhub:'ESSITY-B.ST'},isin:'SE0009922164',currency:'SEK',exchange:'NASDAQ STOCKHOLM',country:'SE',type:'Aktie'},
 {names:['volvo b'],ticker:'VOLV B',providerSymbols:{twelve:'VOLV-B:OMX',alpha:'VOLV-B.ST',finnhub:'VOLV-B.ST'},isin:'SE0000115446',currency:'SEK',exchange:'NASDAQ STOCKHOLM',country:'SE',type:'Aktie'},
 {names:['atlas copco b'],ticker:'ATCO B',providerSymbols:{twelve:'ATCO-B:OMX',alpha:'ATCO-B.ST',finnhub:'ATCO-B.ST'},isin:'SE0017486897',currency:'SEK',exchange:'NASDAQ STOCKHOLM',country:'SE',type:'Aktie'},
 {names:['industrivarden c','industrivärden c'],ticker:'INDU C',providerSymbols:{twelve:'INDU-C:OMX',alpha:'INDU-C.ST',finnhub:'INDU-C.ST'},isin:'SE0000107203',currency:'SEK',exchange:'NASDAQ STOCKHOLM',country:'SE',type:'Aktie'},
 {names:['swedbank a'],ticker:'SWED A',providerSymbols:{twelve:'SWED-A:OMX',alpha:'SWED-A.ST',finnhub:'SWED-A.ST'},isin:'SE0000242455',currency:'SEK',exchange:'NASDAQ STOCKHOLM',country:'SE',type:'Aktie'},
 {names:['handelsbanken a','svenska handelsbanken a'],ticker:'SHB A',providerSymbols:{twelve:'SHB-A:OMX',alpha:'SHB-A.ST',finnhub:'SHB-A.ST'},isin:'SE0007100599',currency:'SEK',exchange:'NASDAQ STOCKHOLM',country:'SE',type:'Aktie'},
 {names:['seb a','skandinaviska enskilda banken a'],ticker:'SEB A',providerSymbols:{twelve:'SEB-A:OMX',alpha:'SEB-A.ST',finnhub:'SEB-A.ST'},isin:'SE0000148884',currency:'SEK',exchange:'NASDAQ STOCKHOLM',country:'SE',type:'Aktie'},
 {names:['telia'],ticker:'TELIA',providerSymbols:{twelve:'TELIA:OMX',alpha:'TELIA.ST',finnhub:'TELIA.ST'},isin:'SE0000667925',currency:'SEK',exchange:'NASDAQ STOCKHOLM',country:'SE',type:'Aktie'},
 {names:['tele2 b'],ticker:'TEL2 B',providerSymbols:{twelve:'TEL2-B:OMX',alpha:'TEL2-B.ST',finnhub:'TEL2-B.ST'},isin:'SE0005190238',currency:'SEK',exchange:'NASDAQ STOCKHOLM',country:'SE',type:'Aktie'},
 {names:['castellum'],ticker:'CAST',providerSymbols:{twelve:'CAST:OMX',alpha:'CAST.ST',finnhub:'CAST.ST'},isin:'SE0000379190',currency:'SEK',exchange:'NASDAQ STOCKHOLM',country:'SE',type:'Aktie'},
 {names:['novo nordisk b','novo nordisk'],ticker:'NOVO B',providerSymbols:{twelve:'NOVO-B:OMXCOP',alpha:'NOVO-B.CO',finnhub:'NOVO-B.CO'},isin:'DK0062498333',currency:'DKK',exchange:'NASDAQ COPENHAGEN',country:'DK',type:'Aktie'},
 {names:['xact norden hogutdelande','xact norden högutdelande'],ticker:'XACTHDIV',providerSymbols:{twelve:'XACTHDIV:OMX',alpha:'XACTHDIV.ST',finnhub:'XACTHDIV.ST'},isin:'SE0009778954',currency:'SEK',exchange:'NASDAQ STOCKHOLM',country:'SE',type:'ETF'}
];
function registryAliases(entry){return (entry.names||[]).map(normalizeInstrumentName)}
function registryMatch(item){const n=normalizeInstrumentName(item.name);let best=null,bestScore=0;for(const e of GLOBAL_INSTRUMENT_REGISTRY){for(const a of registryAliases(e)){let score=n===a?100:(n.includes(a)||a.includes(n)?94:nameSimilarity(n,a));if(item.assetType&&e.type&&normalizeInstrumentName(item.assetType)!==normalizeInstrumentName(e.type))score-=18;if(item.currency&&e.currency&&String(item.currency).toUpperCase()!==String(e.currency).toUpperCase())score-=8;if(score>bestScore){best=e;bestScore=score}}}return bestScore>=88?{entry:best,score:bestScore}:null}
function instrumentRegistryState(){return merge({version:'11.6.1',updatedAt:'',recognized:0,unrecognized:0,lastRun:'',entries:GLOBAL_INSTRUMENT_REGISTRY.length},parse(safeGet(INSTRUMENT_REGISTRY_KEY))||{})}
function persistInstrumentRegistryState(x){safeSet(INSTRUMENT_REGISTRY_KEY,JSON.stringify(x))}
function enrichMappingsFromRegistry(){const items=instrumentMappingCoverage().items;let enriched=0,recognized=0,corrected=0;for(const item of items){const hit=registryMatch(item);if(!hit)continue;recognized++;const e=hit.entry,current=liveFoundation.mappings[item.key]||{};const wrongTicker=current.ticker&&normalizeInstrumentName(current.ticker)!==normalizeInstrumentName(e.ticker);if(wrongTicker&&current.source==='manual-live-mapping')continue;if(wrongTicker)corrected++;liveFoundation.mappings[item.key]={...current,ticker:e.ticker,isin:e.isin||'',currency:e.currency,exchange:e.exchange,country:e.country,providerSymbols:e.providerSymbols,type:e.type,name:item.name,account:item.account,assetType:item.assetType,confidence:hit.score,verified:true,source:'global-instrument-registry-quality-match',registryVersion:'11.6.1',updatedAt:new Date().toISOString()};enriched++}
 if(enriched){liveFoundation.updatedAt=new Date().toISOString();persistLiveFoundation();liveEvent('success','Global Instrument Registry',`${enriched} instrumentidentiteter berikades`,{enriched})}
 const state={version:'11.6.1',updatedAt:new Date().toISOString(),lastRun:new Date().toISOString(),recognized,unrecognized:Math.max(0,items.length-recognized),entries:GLOBAL_INSTRUMENT_REGISTRY.length};persistInstrumentRegistryState(state);return {...state,enriched,corrected}}
function mappingSuggestionFor(item){const hit=registryMatch(item);return hit?{...hit.entry,confidence:hit.score,reason:'Global Instrument Registry'}:null}
function applySafeMappingSuggestions(){const c=instrumentMappingCoverage();let suggested=0;c.items.forEach(item=>{const current=liveFoundation.mappings[item.key]||{};if(current.ticker||current.isin)return;const suggestion=mappingSuggestionFor(item);if(!suggestion)return;liveFoundation.mappings[item.key]={...current,...suggestion,name:item.name,account:item.account,assetType:item.assetType,updatedAt:new Date().toISOString(),source:'verified-local-map',verified:true,suggested:true};suggested++});if(suggested){liveFoundation.updatedAt=new Date().toISOString();persistLiveFoundation();liveEvent('success','Intelligent Mapping',`${suggested} verifierade tickerkopplingar lades till`,{suggested})}return suggested}
function autoStewardState(){return merge({lastRun:'',lastCacheValidation:'',safeMappingsAdded:0,suspiciousMappingsFixed:0,cacheValidated:false,status:'ready',message:'Automatiskt dataunderhåll är redo.'},parse(safeGet(AUTO_STEWARD_KEY))||{})}
function persistAutoSteward(x){safeSet(AUTO_STEWARD_KEY,JSON.stringify(x))}
function mappingLooksCompatible(item,m){
 const itemName=normalizeInstrumentName(item.name),mappedName=normalizeInstrumentName(m.name||'');
 if(!m.ticker&&!m.isin)return true;
 if(m.source==='manual-live-mapping')return true;
 if(item.assetType&&/fond|fund/i.test(item.assetType)&&/\b(seb a|inve b|volv b|ko|pep|o|stag|ups)\b/i.test(String(m.ticker||'')))return false;
 if(mappedName&&itemName&&mappedName!==itemName&&nameSimilarity(itemName,mappedName)<45)return false;
 return true;
}
function repairSuspiciousMappings(){
 const coverage=instrumentMappingCoverage(),isinOwners=new Map();let fixed=0;
 coverage.items.forEach(item=>{const m=liveFoundation.mappings[item.key]||{};if(m.isin){const key=String(m.isin).toUpperCase();if(!isinOwners.has(key))isinOwners.set(key,[]);isinOwners.get(key).push({item,m})}});
 const duplicateIsins=new Set([...isinOwners.entries()].filter(([,rows])=>rows.length>1&&new Set(rows.map(r=>normalizeInstrumentName(r.item.name))).size>1).map(([isin])=>isin));
 coverage.items.forEach(item=>{const m=liveFoundation.mappings[item.key]||{},next={...m};let changed=false;
  if(m.isin&&duplicateIsins.has(String(m.isin).toUpperCase())&&m.source!=='manual-live-mapping'){delete next.isin;changed=true}
  if(!mappingLooksCompatible(item,m)){delete next.ticker;delete next.exchange;delete next.isin;next.verified=false;next.confidence=0;next.source='auto-steward-reset';next.candidates=[];changed=true}
  if(changed){next.updatedAt=new Date().toISOString();liveFoundation.mappings[item.key]=next;fixed++}
 });
 if(fixed){liveFoundation.updatedAt=new Date().toISOString();persistLiveFoundation();liveEvent('warning','Auto Data Steward',`${fixed} misstänkta instrumentkopplingar återställdes för ny identifiering`,{fixed})}
 return fixed;
}
function runAutoDataSteward({force=false,reason='manual'}={}){
 const prev=autoStewardState(),now=Date.now(),lastValidation=Date.parse(prev.lastCacheValidation||'')||0;
 const fixed=repairSuspiciousMappings(),added=applySafeMappingSuggestions();let cacheValidated=false;
 if(force||now-lastValidation>24*60*60*1000){validateLiveCache();cacheValidated=true}
 const state={...prev,lastRun:new Date().toISOString(),lastCacheValidation:cacheValidated?new Date().toISOString():prev.lastCacheValidation,safeMappingsAdded:num(prev.safeMappingsAdded)+added,suspiciousMappingsFixed:num(prev.suspiciousMappingsFixed)+fixed,cacheValidated,status:'success',message:`${added} säkra kopplingar · ${fixed} misstänkta återställda${cacheValidated?' · cache validerad':''}`,reason};
 persistAutoSteward(state);return state;
}
function autoStewardSummary(){const s=autoStewardState();return {...s,lastRunLabel:s.lastRun?new Date(s.lastRun).toLocaleString('sv-SE'):'Inte körd ännu'}}
function nameSimilarity(a,b){a=normalizeInstrumentName(a);b=normalizeInstrumentName(b);if(!a||!b)return 0;if(a===b)return 100;if(a.includes(b)||b.includes(a))return 88;const A=new Set(a.split(' ')),B=new Set(b.split(' '));const common=[...A].filter(x=>B.has(x)).length;return Math.round(common/Math.max(A.size,B.size)*80)}
async function searchTwelveDataInstrument(item){const key=providerConfig().twelveDataKey;if(!key)return[];const url=`https://api.twelvedata.com/symbol_search?symbol=${encodeURIComponent(item.name)}&apikey=${encodeURIComponent(key)}&outputsize=8`;const res=await fetchWithPolicy(url,{provider:'twelvedata',timeoutMs:8000,retries:0}),x=await res.json();if(x.status==='error')throw new Error(x.message||'Twelve Data-sökning misslyckades');return (x.data||[]).map(r=>({ticker:r.symbol,name:r.instrument_name||r.name||'',exchange:r.exchange||r.mic_code||'',currency:r.currency||item.currency||'SEK',type:r.instrument_type||'',provider:'Twelve Data'}))}
async function searchAlphaVantageInstrument(item){const key=providerConfig().alphaVantageKey;if(!key)return[];const url=`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(item.name)}&apikey=${encodeURIComponent(key)}`;const res=await fetchWithPolicy(url,{provider:'alphavantage',timeoutMs:9000,retries:0}),x=await res.json();if(x.Note||x.Information)throw new Error(x.Note||x.Information);return (x.bestMatches||[]).map(r=>({ticker:r['1. symbol'],name:r['2. name'],type:r['3. type'],exchange:r['4. region'],currency:r['8. currency']||item.currency||'SEK',provider:'Alpha Vantage',providerScore:num(r['9. matchScore'])*100}))}
function scoreMappingCandidate(item,c){let score=nameSimilarity(item.name,c.name);if(c.providerScore)score=Math.max(score,Math.round(c.providerScore));const wanted=String(item.currency||'').toUpperCase(),got=String(c.currency||'').toUpperCase();if(wanted&&got&&wanted===got)score+=8;if(/fund|fond|etf/i.test(item.assetType||'')&&/fund|etf/i.test(c.type||''))score+=6;if(/aktie|stock|equity/i.test(item.assetType||'')&&/equity|stock/i.test(c.type||''))score+=6;return Math.max(0,Math.min(100,score))}
async function discoverInstrumentMappings(){const button=document.getElementById('discoverMappings');if(button){button.disabled=true;button.textContent='Identifierar instrument…'}applySafeMappingSuggestions();const items=instrumentMappingCoverage().items.filter(x=>!(liveFoundation.mappings[x.key]?.verified)&&(!liveFoundation.mappings[x.key]?.ticker||num(liveFoundation.mappings[x.key]?.confidence)<80)).slice(0,12);let verified=0,review=0,failed=0;for(const item of items){try{let candidates=[];try{candidates.push(...await searchTwelveDataInstrument(item))}catch(e){}try{candidates.push(...await searchAlphaVantageInstrument(item))}catch(e){}const unique=[...new Map(candidates.filter(x=>x.ticker).map(x=>[`${x.ticker}|${x.exchange}`,x])).values()].map(x=>({...x,score:scoreMappingCandidate(item,x)})).sort((a,b)=>b.score-a.score);const best=unique[0];const current=liveFoundation.mappings[item.key]||{};if(best&&best.score>=88){liveFoundation.mappings[item.key]={...current,ticker:best.ticker,exchange:best.exchange,currency:best.currency||item.currency,name:item.name,account:item.account,assetType:item.assetType,confidence:best.score,verified:true,source:`auto-verified:${best.provider}`,candidates:unique.slice(0,3),updatedAt:new Date().toISOString()};verified++}else if(best){liveFoundation.mappings[item.key]={...current,name:item.name,account:item.account,assetType:item.assetType,confidence:best.score,verified:false,source:'candidate-review',candidates:unique.slice(0,3),updatedAt:new Date().toISOString()};review++}else failed++}catch(e){failed++}}
liveFoundation.updatedAt=new Date().toISOString();persistLiveFoundation();liveEvent(verified?'success':'warning','Intelligent Mapping',`${verified} verifierade · ${review} för granskning · ${failed} utan träff`,{verified,review,failed});alert(`Instrumentidentifiering klar.\n${verified} verifierade automatiskt\n${review} behöver granskas\n${failed} utan säker träff`);render()}
function mappingIntelligenceStats(){const items=instrumentMappingCoverage().items,all=items.map(x=>liveFoundation.mappings[x.key]||{});return {verified:all.filter(x=>x.verified).length,review:all.filter(x=>!x.verified&&Array.isArray(x.candidates)&&x.candidates.length).length,unmapped:all.filter(x=>!x.ticker&&!x.isin&&!x.candidates?.length).length,total:items.length}}




/* 11.7.0 Universal Identity Engine */
function universalIdentityState(){return merge({version:'11.7.0',lastRun:'',status:'ready',scanned:0,verified:0,review:0,conflicts:0,duplicates:0,suggestions:[],audit:[]},parse(safeGet(UNIVERSAL_IDENTITY_KEY))||{})}
function persistUniversalIdentity(x){safeSet(UNIVERSAL_IDENTITY_KEY,JSON.stringify(x))}
function identityFingerprint(item,m={}){return [String(m.isin||item.isin||'').toUpperCase(),normalizeInstrumentName(item.name),String(m.exchange||item.exchange||'').toUpperCase(),String(m.currency||item.currency||'').toUpperCase()].join('|')}
function universalConfidence(item,m={}){
 let score=0,reasons=[];
 if(m.verified){score+=35;reasons.push('verifierat register')}
 if(m.isin){score+=25;reasons.push('ISIN')}
 if(m.ticker){score+=15;reasons.push('ticker')}
 if(m.exchange){score+=10;reasons.push('börs')}
 if(m.currency){score+=5;reasons.push('valuta')}
 if(m.providerSymbols&&Object.keys(m.providerSymbols).length){score+=10;reasons.push('providersymboler')}
 const registry=registryMatch(item);if(registry){score=Math.max(score,registry.score);reasons.push('namnmatchning')}
 if(m.source==='manual-live-mapping'){score=Math.max(score,92);reasons.push('manuell koppling')}
 return {score:Math.max(0,Math.min(100,Math.round(score))),reasons:[...new Set(reasons)]};
}
function scanUniversalIdentity(){
 const items=instrumentMappingCoverage().items,seenIsin=new Map(),seenTicker=new Map(),suggestions=[];let verified=0,review=0,conflicts=0,duplicates=0;
 for(const item of items){
  const m=liveFoundation.mappings[item.key]||{},confidence=universalConfidence(item,m),issues=[];
  const registry=registryMatch(item),expected=registry?.entry;
  if(m.isin){const k=String(m.isin).toUpperCase();if(seenIsin.has(k)&&seenIsin.get(k)!==normalizeInstrumentName(item.name)){issues.push('ISIN används av flera olika innehav');duplicates++}else seenIsin.set(k,normalizeInstrumentName(item.name))}
  if(m.ticker){const k=`${String(m.exchange||'').toUpperCase()}|${String(m.ticker).toUpperCase()}`;if(seenTicker.has(k)&&seenTicker.get(k)!==normalizeInstrumentName(item.name)){issues.push('Ticker/börs-kombination används dubbelt');duplicates++}else seenTicker.set(k,normalizeInstrumentName(item.name))}
  if(expected){
   if(m.ticker&&normalizeInstrumentName(m.ticker)!==normalizeInstrumentName(expected.ticker)){issues.push(`Ticker avviker från registret (${expected.ticker})`);conflicts++}
   if(m.currency&&String(m.currency).toUpperCase()!==expected.currency){issues.push(`Valuta avviker från registret (${expected.currency})`);conflicts++}
   if(m.exchange&&normalizeInstrumentName(m.exchange)!==normalizeInstrumentName(expected.exchange)){issues.push(`Börs avviker från registret (${expected.exchange})`);conflicts++}
  }
  const status=issues.length?'conflict':confidence.score>=88?'verified':confidence.score>=65?'review':'unresolved';
  if(status==='verified')verified++;else review++;
  if(status!=='verified')suggestions.push({key:item.key,name:item.name,account:item.account,status,confidence:confidence.score,issues,proposed:expected?{ticker:expected.ticker,isin:expected.isin,exchange:expected.exchange,currency:expected.currency,providerSymbols:expected.providerSymbols}:null});
  liveFoundation.mappings[item.key]={...m,identityConfidence:confidence.score,identityReasons:confidence.reasons,identityStatus:status,identityCheckedAt:new Date().toISOString()};
 }
 liveFoundation.updatedAt=new Date().toISOString();persistLiveFoundation();
 const prev=universalIdentityState(),audit=[{date:new Date().toISOString(),label:`Skannade ${items.length} instrument`,verified,review,conflicts,duplicates},...(prev.audit||[])].slice(0,100);
 const state={version:'11.7.0',lastRun:new Date().toISOString(),status:conflicts?'warning':'success',scanned:items.length,verified,review,conflicts,duplicates,suggestions,audit};persistUniversalIdentity(state);liveEvent(conflicts?'warning':'success','Universal Identity Engine',`${verified} verifierade · ${review} att granska · ${conflicts} konflikter`,state);return state;
}
function applyUniversalSuggestions(){const state=universalIdentityState();let applied=0;for(const s of state.suggestions||[]){if(!s.proposed)continue;const current=liveFoundation.mappings[s.key]||{};if(current.source==='manual-live-mapping')continue;liveFoundation.mappings[s.key]={...current,...s.proposed,verified:true,confidence:Math.max(95,num(current.confidence)),identityConfidence:98,identityStatus:'verified',identityReasons:['Universal Identity Engine','Global Instrument Registry'],source:'universal-identity-verified',registryVersion:'11.7.0',updatedAt:new Date().toISOString()};applied++}if(applied){persistLiveFoundation();liveEvent('success','Universal Identity Engine',`${applied} säkra identitetsförslag tillämpades`,{applied})}const next=scanUniversalIdentity();return {...next,applied}}
function universalIdentityPanel(){const u=universalIdentityState();const rows=(u.suggestions||[]).slice(0,8).map(s=>`<div class="identityIssue ${esc(s.status)}"><div><b>${esc(s.name)}</b><small>${esc(s.account)} · tillit ${num(s.confidence)}%</small>${s.issues?.length?`<p>${s.issues.map(esc).join(' · ')}</p>`:'<p>Saknar tillräckligt säker universell identitet.</p>'}</div><span>${s.proposed?esc(s.proposed.ticker):'—'}</span></div>`).join('');return `<section class="section universalIdentityPanel"><div class="sectionHead"><div><div class="eyebrow">Universal Identity Engine 11.7</div><h2>Identitetskontroll med konfliktskydd</h2></div><span class="healthScore">${u.verified}/${u.scanned||instrumentMappingCoverage().total}</span></div><p>Sammanväger namn, ISIN, ticker, börs, valuta, tillgångsslag och providersymboler. Förslag påverkar endast read-only live-mappningen.</p><div class="grid"><div class="card metric"><span>Verifierade</span><b>${u.verified}</b></div><div class="card metric"><span>Att granska</span><b>${u.review}</b></div><div class="card metric"><span>Konflikter</span><b>${u.conflicts}</b></div><div class="card metric"><span>Dubbletter</span><b>${u.duplicates}</b></div></div><div class="foundationActions"><button id="runUniversalIdentity" class="primary" type="button">Kör Universal Identity</button><button id="applyUniversalIdentity" class="secondary" type="button" ${u.suggestions?.some(x=>x.proposed)?'':'disabled'}>Tillämpa säkra förslag</button></div>${rows?`<div class="identityIssueList">${rows}</div>`:'<div class="notice okbox">Inga öppna identitetsproblem i senaste kontrollen.</div>'}<p class="disclaimer">Manuella kopplingar lämnas orörda. Antal, GAV, kredit, transaktioner och Ledger ändras aldrig.</p></section>`}

function providerConfig(){const c=merge({twelveDataKey:'',alphaVantageKey:'',finnhubKey:'',openFigiKey:'',enableStooq:false,stooqExplicitOptIn:false,maxSymbolsPerSync:30},parse(safeGet(PROVIDER_CONFIG_KEY))||{});if(!c.stooqExplicitOptIn)c.enableStooq=false;return c}
function persistProviderConfig(x){safeSet(PROVIDER_CONFIG_KEY,JSON.stringify(x))}
function providerRouteLabel(){const c=providerConfig(),a=[];if(c.twelveDataKey)a.push('Twelve Data');if(c.alphaVantageKey)a.push('Alpha Vantage');if(c.finnhubKey)a.push('Finnhub');if(c.enableStooq)a.push('Stooq Legacy');a.push('Local Cache');return a.join(' → ')}
function normalizeProviderSymbol(m){return String(m.ticker||'').trim().replace(/\s+/g,'').toUpperCase()}
async function fetchTwelveDataQuote(m){const key=providerConfig().twelveDataKey;if(!key)throw new Error('API-nyckel saknas');const symbol=normalizeProviderSymbol(m);const url=`https://api.twelvedata.com/quote?symbol=${encodeURIComponent(symbol)}&apikey=${encodeURIComponent(key)}`;const res=await fetchWithPolicy(url,{provider:'twelvedata',timeoutMs:8000,retries:0}),x=await res.json();if(x.status==='error'||x.code)throw new Error(x.message||'providerfel');const price=num(x.close||x.price),open=num(x.open),prev=num(x.previous_close);if(!price)throw new Error('ogiltig kurs');return {symbol,providerSymbol:symbol,price,open,change:num(x.change)||(prev?price-prev:0),changePct:num(x.percent_change),currency:m.currency||x.currency||'SEK',timestamp:x.datetime?new Date(x.datetime).toISOString():new Date().toISOString(),provider:'Twelve Data',quality:90,exchange:m.exchange||x.exchange||''}}
async function fetchAlphaVantageQuote(m){const key=providerConfig().alphaVantageKey;if(!key)throw new Error('API-nyckel saknas');const symbol=normalizeProviderSymbol(m);const url=`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${encodeURIComponent(key)}`;const res=await fetchWithPolicy(url,{provider:'alphavantage',timeoutMs:9000,retries:0}),x=await res.json();if(x.Note||x.Information)throw new Error(x.Note||x.Information);const q=x['Global Quote']||{},price=num(q['05. price']),open=num(q['02. open']),change=num(q['09. change']),changePct=num(q['10. change percent']);if(!price)throw new Error('ogiltig kurs');return {symbol,providerSymbol:symbol,price,open,change,changePct,currency:m.currency||'SEK',timestamp:new Date().toISOString(),provider:'Alpha Vantage',quality:88,exchange:m.exchange||''}}
async function fetchFinnhubQuote(m){const key=providerConfig().finnhubKey;if(!key)throw new Error('API-nyckel saknas');const symbol=normalizeProviderSymbol(m);const url=`https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${encodeURIComponent(key)}`;const res=await fetchWithPolicy(url,{provider:'finnhub',timeoutMs:8000,retries:0}),x=await res.json();const price=num(x.c),open=num(x.o),prev=num(x.pc);if(!price)throw new Error('ogiltig kurs');return {symbol,providerSymbol:symbol,price,open,change:num(x.d)||(prev?price-prev:0),changePct:num(x.dp),currency:m.currency||'SEK',timestamp:x.t?new Date(x.t*1000).toISOString():new Date().toISOString(),provider:'Finnhub',quality:87,exchange:m.exchange||''}}
async function fetchStooqQuote(m){let last='';for(const sym of stooqCandidates(m)){try{const url=`https://stooq.com/q/l/?s=${encodeURIComponent(sym)}&f=sd2t2ohlcv&h&e=csv`,res=await fetchWithPolicy(url,{provider:'stooq',timeoutMs:5000,retries:0}),txt=await res.text(),lines=txt.trim().split(/\r?\n/);if(lines.length<2)throw new Error('ingen kursrad');const cols=lines[1].split(','),close=num(cols[6]),open=num(cols[3]);if(!close)throw new Error('ogiltig kurs');return {symbol:normalizeProviderSymbol(m),providerSymbol:sym,price:close,open,change:open?close-open:0,changePct:open?(close-open)/open*100:0,currency:m.currency||'SEK',timestamp:new Date().toISOString(),provider:'Stooq',quality:72,exchange:m.exchange||''}}catch(e){last=String(e?.message||e)}}throw new Error(last||'Stooq svarade inte')}
function adaptiveDataState(){return merge({version:'11.11.0',lastRun:'',successfulRoutes:{},attempts:{},diagnostics:{},summary:{tested:0,updated:0,recovered:0,navRequired:0,failed:0}},parse(safeGet(ADAPTIVE_DATA_KEY))||{})}
function persistAdaptiveData(x){safeSet(ADAPTIVE_DATA_KEY,JSON.stringify(x))}
function adaptiveTickerCandidates(m){
 const raw=[m.ticker,m.providerSymbol,m.routeTicker?.twelvedata,m.routeTicker?.alphavantage,m.routeTicker?.finnhub,m.providerSymbols?.twelveData,m.providerSymbols?.alphaVantage,m.providerSymbols?.finnhub].filter(Boolean).map(x=>String(x).trim());
 const base=String(m.ticker||'').trim(),ex=String(m.exchange||'').toUpperCase();
 if(base){
  raw.push(base.replace(/\s+/g,'-'),base.replace(/\s+/g,'.'),base.replace(/\s+/g,''));
  if(/STOCKHOLM|NASDAQ STOCKHOLM|OMX/.test(ex)){raw.push(base.replace(/\s+/g,'-')+'.ST',base.replace(/\s+/g,'.')+'.ST')}
  if(/LONDON|LSE/.test(ex))raw.push(base+'.L');
  if(/XETRA|FRANKFURT/.test(ex))raw.push(base+'.DE');
  if(/TORONTO|TSX/.test(ex))raw.push(base+'.TO');
 }
 return [...new Set(raw.filter(Boolean))].slice(0,8);
}
function adaptiveDiagnosticFor(h){
 const m=liveFoundation.mappings[h._key]||{},c=classifyInstrument(h),q=liveQuoteFor(h),nav=navFor(h),st=adaptiveDataState(),d=st.diagnostics[h._key]||{};
 const identity=Boolean(m.verified||m.identityStatus==='verified'),hasTicker=Boolean(m.ticker),hasIsin=Boolean(m.isin),hasMarket=Boolean(m.exchange),hasData=Boolean(q||nav);
 let action='Ingen åtgärd krävs.';
 if(c.pricing==='nav'&&!nav)action='NAV saknas. Lägg in senaste fond-NAV eller anslut en fondkälla.';
 else if(!identity)action='Kör Global Identity Resolver och granska identiteten.';
 else if(!hasTicker&&!hasIsin)action='Komplettera ticker eller ISIN i instrumentmappningen.';
 else if(!hasData)action='Kör Adaptive Data Engine. Den testar alternativa tickerformat och providers.';
 return {identity,hasTicker,hasIsin,hasMarket,hasData,pricing:c.pricing,action,lastTried:d.lastTried||'',tested:d.tested||[],lastError:d.lastError||'',successfulRoute:d.successfulRoute||''};
}
async function fetchRoutedQuotes(){
 const c=providerConfig(),mappings=instrumentMappingCoverage().items.filter(x=>x.ticker||x.isin).slice(0,Math.max(1,num(c.maxSymbolsPerSync)||30)),quotes=[],failures=[],state=adaptiveDataState();let recovered=0,navRequired=0;
 for(const original of mappings){
  const holding=canonicalHoldings().find(h=>h._key===original.key),cls=classifyInstrument(holding||original);
  if(cls.pricing==='nav'){navRequired++;state.diagnostics[original.key]={lastTried:new Date().toISOString(),tested:['NAV Center'],lastError:navFor(holding||original)?'':'NAV saknas',successfulRoute:navFor(holding||original)?'Lokalt NAV':''};continue}
  const remembered=state.successfulRoutes[original.key];const candidates=[remembered?.symbol,...adaptiveTickerCandidates(original)].filter(Boolean);let q=null,last='ingen aktiv prisprovider',tested=[];
  for(const symbol of [...new Set(candidates)]){
   const m={...original,ticker:symbol,providerSymbol:symbol,routeTicker:original.providerSymbols||{}};
   const adapters=[];if(c.twelveDataKey)adapters.push(['Twelve Data',fetchTwelveDataQuote]);if(c.alphaVantageKey)adapters.push(['Alpha Vantage',fetchAlphaVantageQuote]);if(c.finnhubKey)adapters.push(['Finnhub',fetchFinnhubQuote]);if(c.enableStooq)adapters.push(['Stooq Legacy',fetchStooqQuote]);
   for(const [name,adapter] of adapters){try{tested.push(`${name}: ${symbol}`);q=await adapter(m);q.instrumentKey=original.key;q.canonicalTicker=original.ticker;if(symbol!==original.ticker)recovered++;state.successfulRoutes[original.key]={provider:name,symbol,updatedAt:new Date().toISOString()};break}catch(e){last=String(e?.message||e)}}
   if(q)break;
  }
  state.diagnostics[original.key]={lastTried:new Date().toISOString(),tested:tested.slice(-12),lastError:q?'':last,successfulRoute:q?`${q.provider} · ${q.providerSymbol||q.symbol}`:''};
  if(q)quotes.push(q);else failures.push({name:original.name,ticker:original.ticker,error:last,key:original.key});
 }
 state.lastRun=new Date().toISOString();state.summary={tested:mappings.length,updated:quotes.length,recovered,navRequired,failed:failures.length};persistAdaptiveData(state);
 return {quotes,errors:failures.length,failures,attempted:mappings.length,recovered,navRequired};
}
function providerSettingsModal(){const c=providerConfig();return `<div class="eyebrow">Universal Identity Engine 11.7.0</div><h2>Prisproviders</h2><p class="disclaimer">API-nycklar sparas endast lokalt. Providers med HTTP 429 pausas automatiskt och nästa källa tar över.</p><div class="form"><label>Twelve Data API-nyckel<input id="tdKey" type="password" value="${esc(c.twelveDataKey)}" autocomplete="off"></label><label>Alpha Vantage API-nyckel<input id="avKey" type="password" value="${esc(c.alphaVantageKey)}" autocomplete="off"></label><label>Finnhub API-nyckel<input id="fhKey" type="password" value="${esc(c.finnhubKey)}" autocomplete="off"></label><label>OpenFIGI API-nyckel (valfri)<input id="figiKey" type="password" value="${esc(c.openFigiKey)}" autocomplete="off"></label><label class="toggleLabel"><input id="enableStooq" type="checkbox" ${c.enableStooq?'checked':''}> Aktivera Stooq Legacy (avråds i Android/PWA)</label><label>Max instrument per synk<input id="maxSymbols" inputmode="numeric" value="${num(c.maxSymbolsPerSync)||30}"></label></div><button id="saveProviderSettings" class="primary">Spara providerinställningar</button>`}
function openProviderSettings(){openModal(providerSettingsModal());document.getElementById('saveProviderSettings')?.addEventListener('click',()=>{persistProviderConfig({twelveDataKey:document.getElementById('tdKey').value.trim(),alphaVantageKey:document.getElementById('avKey').value.trim(),finnhubKey:document.getElementById('fhKey').value.trim(),openFigiKey:document.getElementById('figiKey').value.trim(),enableStooq:document.getElementById('enableStooq').checked,stooqExplicitOptIn:document.getElementById('enableStooq').checked,maxSymbolsPerSync:Math.max(1,Math.min(120,num(document.getElementById('maxSymbols').value)||30))});closeModal();render()})}

function liveSyncState(){return merge({lastAttempt:'',lastSuccess:'',status:'idle',message:'Inte synkroniserad',fxUpdated:0,quotesUpdated:0,errors:[]},parse(safeGet(LIVE_SYNC_KEY))||{})}
function persistLiveSync(x){safeSet(LIVE_SYNC_KEY,JSON.stringify(x))}
function quoteTimestamp(q){return q?.timestamp||q?.updatedAt||q?.date||''}
function quoteAgeLabel(q){const ts=Date.parse(quoteTimestamp(q)||'');if(!ts)return 'okänd tid';const mins=Math.max(0,Math.round((Date.now()-ts)/60000));if(mins<2)return 'nyss';if(mins<60)return `${mins} min`;if(mins<1440)return `${Math.round(mins/60)} tim`;return `${Math.round(mins/1440)} dagar`}
function liveQuoteFor(h){const state=liveState(),mapping=liveFoundation.mappings[h._key]||{},sym=String(mapping.ticker||text(h,['symbol','ticker','providerSymbol','isin'],'')).toUpperCase();return (state.quotes||[]).find(q=>String(q.symbol||q.ticker||q.providerSymbol||q.isin||'').toUpperCase()===sym)||null}
function livePortfolioStats(){const hs=canonicalHoldings();let liveValue=0,daySEK=0,covered=0;hs.forEach(h=>{const q=liveQuoteFor(h),fx=fxFor(h);if(q&&h._qty&&num(q.price)&&fx){covered++;liveValue+=h._qty*num(q.price)*fx;daySEK+=h._qty*num(q.change||0)*fx}else liveValue+=h._value});return {liveValue,daySEK,dayPct:liveValue-daySEK?daySEK/(liveValue-daySEK)*100:0,covered,total:hs.length}}
async function fetchEcbFx(){
 const currencies=['USD','GBP','NOK','DKK','CAD','JPY','CHF'],rates={SEK:1};let count=0,errors=0;
 for(const cur of currencies){try{const url=`https://data-api.ecb.europa.eu/service/data/EXR/D.${cur}+SEK.EUR.SP00.A?startPeriod=${new Date(Date.now()-10*864e5).toISOString().slice(0,10)}&format=csvdata`;const res=await fetchWithPolicy(url,{provider:'ecb',timeoutMs:8500,retries:1,headers:{Accept:'text/csv'}});const txt=await res.text(),lines=txt.trim().split(/\r?\n/),head=lines[0].split(','),ci=head.indexOf('CURRENCY'),vi=head.indexOf('OBS_VALUE'),ti=head.indexOf('TIME_PERIOD'),latest={};for(const line of lines.slice(1)){const cols=line.match(/("[^"]*"|[^,]+)/g)||[],c=(cols[ci]||'').replaceAll('"',''),v=num((cols[vi]||'').replaceAll('"','')),t=(cols[ti]||'').replaceAll('"','');if(c&&v&&(!latest[c]||t>latest[c].t))latest[c]={v,t}}const eurSek=latest.SEK?.v,eurCur=latest[cur]?.v;if(eurSek&&eurCur){rates[cur]=eurSek/eurCur;count++}else throw new Error('saknar senaste referensvärde')}catch(e){errors++;liveEvent('warning','ECB FX',`${cur}: ${e.message}`)}}return {rates,count,errors}}
function stooqCandidates(mapping){const raw=String(mapping.ticker||'').trim().toLowerCase();if(!raw)return[];if(raw.includes('.'))return[raw];const exchange=String(mapping.exchange||'').toUpperCase(),suffix=exchange.includes('STO')?'se':exchange.includes('CPH')?'dk':exchange.includes('OSL')?'no':exchange.includes('LSE')?'uk':'us';return[...new Set([`${raw}.${suffix}`,`${raw}.us`,raw])]}
async function syncLiveData(){const button=document.getElementById('syncLive');if(button){button.disabled=true;button.textContent='Synkroniserar…'}const sync={...liveSyncState(),lastAttempt:new Date().toISOString(),status:'syncing',message:'Adaptive Router hämtar FX och priser',errors:[]};persistLiveSync(sync);render();try{buildInstrumentMappings();applySafeMappingSuggestions();const [fxr,qr]=await Promise.all([fetchEcbFx(),fetchRoutedQuotes()]),old=liveState(),bySymbol=new Map((old.quotes||[]).map(q=>[String(q.symbol||q.ticker||'').toUpperCase(),q]));qr.quotes.forEach(q=>bySymbol.set(String(q.symbol).toUpperCase(),q));const cacheFallbacks=Math.max(0,qr.attempted-qr.quotes.length);if(cacheFallbacks&&(old.quotes||[]).length){const t=providerTelemetry()['local-cache']||{};updateProviderTelemetry('local-cache',{...t,attempts:num(t.attempts)+1,successes:num(t.successes)+1,lastAttempt:new Date().toISOString(),lastSuccess:new Date().toISOString(),status:'standby'})}const next={...old,providers:liveFoundation.registry,fx:{...(old.fx||{}),...fxr.rates},quotes:[...bySymbol.values()],lastSync:new Date().toISOString(),updatedAt:new Date().toISOString(),foundationVersion:VERSION};safeSet(LIVE_KEY,JSON.stringify(next));validateLiveCache();const parts=[`${qr.quotes.length}/${qr.attempted} kurser`,`${fxr.count} FX-kurser`];if(cacheFallbacks)parts.push(`${cacheFallbacks} utan ny kurs`);Object.assign(sync,{lastSuccess:new Date().toISOString(),status:(qr.quotes.length||fxr.count)?(qr.errors?'partial':'success'):'partial',message:parts.join(' · '),fxUpdated:fxr.count,quotesUpdated:qr.quotes.length,errors:qr.failures.slice(0,8).map(x=>`${x.name}: ${x.error}`)});persistLiveSync(sync);liveEvent(sync.status==='success'?'success':'warning','Adaptive Provider Network',sync.message,{quoteErrors:qr.errors,fxErrors:fxr.errors,route:providerRouteLabel()});render()}catch(e){Object.assign(sync,{status:'error',message:String(e?.message||e),errors:[String(e?.message||e)]});persistLiveSync(sync);liveEvent('error','Adaptive Provider Network',`Synkronisering misslyckades: ${sync.message}`);render()}}


/* 11.0.2 Interaction Stability: restored shared Ledger and Intelligence engines. */
function ledgerSection(all,accounts){
 const holdingOpts=all.map(h=>`<option value="${esc(h._key)}">${esc(h._name)} — ${esc(h._account)}</option>`).join('');
 const accountOpts=accounts.map(a=>`<option>${esc(a)}</option>`).join('');
 const kindLabels={transaction:'Transaktion','holding-edit':'Direktkorrigering','holding-add':'Nytt innehav','credit-edit':'Kredit','transaction-delete':'Raderad transaktion',deposit:'Insättning',withdrawal:'Uttag',dividend:'Utdelning',tax:'Skatt',interest:'Ränta',fee:'Avgift',fx:'Valutaväxling',split:'Split',rename:'Namnbyte',note:'Anteckning',ai:'AI-rekommendation'};
 const rows=ledger.map(x=>`<div class="ledgerRow"><div><span class="ledgerKind">${esc(kindLabels[x.kind]||x.kind)}</span><b>${esc(x.label)}</b><small>${new Date(x.date).toLocaleString('sv-SE')}${x.details?.account?' · '+esc(x.details.account):''}</small></div><button type="button" class="secondary smallBtn" data-ledger-id="${esc(x.id)}">Visa</button></div>`).join('');
 return `<section class="hero"><div class="eyebrow">Portfolio Ledger · 11.1.2</div><h2>Portföljens historiska liv</h2><p>Ett gemensamt revisionsspår för köp, försäljningar, korrigeringar, kredit, utdelningar, avgifter och viktiga beslut.</p><div class="value">${ledger.length}</div><small>spårbara ledgerposter</small></section>
 <section class="section"><h2>Registrera annan portföljhändelse</h2><div class="form twoCol"><label>Händelse<select id="ledgerKind"><option value="deposit">Insättning</option><option value="withdrawal">Uttag</option><option value="dividend">Utdelning</option><option value="tax">Skatt</option><option value="interest">Räntekostnad</option><option value="fee">Avgift</option><option value="fx">Valutaväxling</option><option value="split">Split</option><option value="rename">Namnbyte</option><option value="note">Anteckning</option><option value="ai">AI-rekommendation</option></select></label><label>Datum<input id="ledgerDate" type="date" value="${today()}"></label><label>Rubrik<input id="ledgerLabel" placeholder="Beskriv händelsen"></label><label>Konto<input id="ledgerAccount" list="ledgerAccounts"><datalist id="ledgerAccounts">${accountOpts}</datalist></label><label>Innehav<select id="ledgerHolding"><option value="">Hela kontot/portföljen</option>${holdingOpts}</select></label><label>Belopp SEK<input id="ledgerAmount" inputmode="decimal" placeholder="0,00"></label><label class="wide">Kommentar<textarea id="ledgerNote" rows="3" placeholder="Bakgrund, beslut eller annan viktig information"></textarea></label></div><button id="saveLedger" class="primary" type="button">Spara ledgerpost</button></section>
 <section class="section"><div class="sectionHead"><h2>Revisionsspår</h2><span>${ledger.length} poster</span></div><div class="list">${rows||'<div class="empty">Inga ledgerposter ännu.</div>'}</div></section>`;
}
function saveManualLedger(){
 const kind=document.getElementById('ledgerKind')?.value||'note';
 const label=document.getElementById('ledgerLabel')?.value.trim()||'';
 if(!label)return alert('Ange en rubrik för händelsen.');
 const key=document.getElementById('ledgerHolding')?.value||'';
 const h=canonicalHoldings().find(x=>x._key===key);
 ledgerAdd(kind,label,{date:document.getElementById('ledgerDate')?.value||today(),account:document.getElementById('ledgerAccount')?.value.trim()||h?._account||'',holdingKey:key,holdingName:h?._name||'',amountSEK:num(document.getElementById('ledgerAmount')?.value),note:document.getElementById('ledgerNote')?.value.trim()||''});
 render();
}
function showLedger(id){
 const x=ledger.find(y=>y.id===id);if(!x)return;
 const d=x.details||{};
 openModal(`<div class="eyebrow">Portfolio Ledger</div><h2>${esc(x.label)}</h2><div class="grid"><div class="card metric"><span>Typ</span><b>${esc(x.kind)}</b></div><div class="card metric"><span>Datum</span><b>${new Date(x.date).toLocaleDateString('sv-SE')}</b></div><div class="card metric"><span>Konto</span><b>${esc(d.account||'—')}</b></div><div class="card metric"><span>Belopp</span><b>${d.amountSEK?kr(d.amountSEK):'—'}</b></div></div>${d.holdingName?`<section class="section"><b>Innehav</b><p>${esc(d.holdingName)}</p></section>`:''}${d.note?`<section class="section"><b>Kommentar</b><p>${esc(d.note)}</p></section>`:''}<pre class="ledgerJson">${esc(JSON.stringify(d,null,2))}</pre>`);
}
function holdingLedger(key){return ledger.filter(x=>x.details?.holdingKey===key||x.details?.after?.key===key||x.details?.before?.key===key)}
function fieldScore(h,keys,fallback=0){for(const k of keys){const v=num(h?.[k]);if(v)return Math.max(0,Math.min(100,v))}return fallback}
function gradeFor(value){const v=num(value);if(v>=85)return'A';if(v>=75)return'B+';if(v>=65)return'B';if(v>=55)return'C+';if(v>=45)return'C';return'D'}
function starsFor(value){const n=Math.max(1,Math.min(5,Math.round(num(value)/20)));return '★★★★★'.slice(0,n)+'☆☆☆☆☆'.slice(0,5-n)}
function intelligenceFor(h){
 const t=total(),weight=t?h._value/t*100:0;
 const quality=fieldScore(h,['qualityScore','quality','masterclassRating','mastarklassRating','rating'],h._value?58:35);
 const growth=fieldScore(h,['growthScore','growth','tillvaxtScore'],50);
 const dividend=fieldScore(h,['dividendScore','dividendSafety','utdelningScore'],/fond|etf|investment|dividend|utdel/i.test(`${h._type} ${h._name}`)?62:45);
 const valuation=fieldScore(h,['valuationScore','valuation','varderingScore'],50);
 const dataQuality=Math.round((h._value?35:0)+(h._qty?20:0)+(h._gav?15:0)+(text(h,['ticker','symbol'],'')?15:0)+(text(h,['sector','sektor'],'')?8:0)+(text(h,['country','land'],'')?7:0));
 let risk=50;if(weight>20)risk-=28;else if(weight>10)risk-=16;else if(weight>5)risk-=7;else risk+=8;if(!h._value)risk-=25;if(/lever|credit|kredit|china|alibaba|crypto/i.test(`${h._name} ${h._type}`))risk-=12;risk=Math.max(0,Math.min(100,risk));
 const diversification=/fond|etf/i.test(h._type)?72:55;
 const score=Math.round(quality*.25+growth*.14+dividend*.14+valuation*.13+risk*.15+diversification*.08+dataQuality*.11);
 const confidence=Math.max(20,Math.min(100,Math.round(dataQuality*.8+(h._value?10:0)+(h._gav?10:0))));
 let status='Bevaka';if(dataQuality<45)status='Komplettera data';else if(score>=72&&weight<10)status='Öka kandidat';else if(score>=62)status='Behåll';else if(score<45||weight>20)status='Minska / granska';
 const reasons=[],strengths=[],warnings=[];
 if(dataQuality<70){reasons.push('datatäckningen behöver förbättras');warnings.push('Ofullständig beslutsdata')}
 if(weight>10){reasons.push(`hög portföljvikt ${pct(weight)}`);warnings.push('Koncentrationsrisk')}
 if(quality>=70){reasons.push('stark lokal kvalitetspoäng');strengths.push('Stark kvalitet')}
 if(dividend>=65){reasons.push('stödjer utdelningsmålet');strengths.push('Utdelningsbidrag')}
 if(risk<45){reasons.push('förhöjd risk eller koncentration');warnings.push('Förhöjd risk')}
 if(valuation>=65)strengths.push('Gynnsam lokal värderingssignal');
 if(!reasons.length)reasons.push('balanserad lokal profil');
 return {...h,weight,quality,growth,dividend,valuation,risk,diversification,dataQuality,score,grade:gradeFor(score),confidence,status,reasons,strengths,warnings};
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
function wealthDashboard(){const ip=intelligencePortfolio(),health=wealthHealth(ip),plan=allocationPlan(ip),coach=wealthCoach(ip,health,plan),goals=goalIntelligence(),risks=riskRadar(ip,health),registry=providerRegistry();return `<section class="hero wealthHero"><div class="eyebrow">Mästarklass OS 11.15.23 · Resolver Performance & Recovery</div><h2>Din förmögenhetsplan, förklarad.</h2><p>Lokalt, spårbart och read-only. Wealth Intelligence använder Portfolio Ledger, masterdata och skyddsregler utan att skapa order eller ändra dina innehav.</p><div class="wealthHeroGrid"><div><span>Portfolio Health</span><b>${health.score}/100</b></div><div><span>Intelligence</span><b>${ip.grade} · ${ip.score}</b></div><div><span>Nästa kapital</span><b>${kr(plan.monthly)}</b></div><div class="liveState ${registry.code}"><span>Live-lager</span><b><i></i>${registry.status}</b></div></div></section>${autonomousPortfolioPanel({compact:true})}<section class="section coachStack"><div class="sectionHead"><div><div class="eyebrow">Wealth Coach 11.1.2.1</div><h2>Prioriterade råd</h2></div><small>${coach.length} råd</small></div><div class="coachAdviceList">${coach.map((x,i)=>`<article class="coachAdvice ${x.tone}"><span>${i+1}</span><div><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p></div></article>`).join('')}</div></section><section class="section"><h2>Portföljhälsa</h2><div class="healthGrid">${[['Diversifiering',health.diversification],['Belåning',health.leverage],['Koncentration',health.concentration],['Datakvalitet',health.data],['Utdelningsstyrka',health.dividend],['Likviditet',health.liquidity]].map(([l,v])=>`<div class="healthItem"><div><span>${l}</span><b>${v}</b></div><div class="bar"><i style="width:${v}%"></i></div></div>`).join('')}</div></section><section class="section"><h2>Målprognos</h2><div class="goalTimeline">${goals.map(g=>`<div class="goalForecast"><div><b>${g.label}</b><small>${pct(g.progress)} uppnått</small></div><strong>${fmtYears(g.years)}</strong></div>`).join('')}</div><p class="disclaimer">Prognosen använder 7 % antagen årlig avkastning och nuvarande månadssparande. Det är en simulering, inte en garanti.</p></section><section class="section"><h2>Riskradar</h2><div class="riskList">${risks.map(r=>`<div class="riskItem ${r.level}"><b>${esc(r.title)}</b><p>${esc(r.text)}</p></div>`).join('')}</div></section><section class="section"><h2>Möjlighetsmotor</h2>${plan.rows.length?`<div class="allocationList">${plan.rows.map((x,i)=>allocationRow(x,i+1)).join('')}</div>`:`<div class="notice">Ingen investeringskandidat passerar nuvarande skyddsregler. Kreditreduktion, buffert eller bättre data prioriteras.</div>`}<p class="disclaimer">Förslagen är lokala beslutsunderlag. Ingen handel utförs.</p></section>`}



function fundNavState(){return parse(safeGet(FUND_NAV_KEY))||{items:{},updatedAt:''}}
function persistFundNav(state){state.updatedAt=new Date().toISOString();safeSet(FUND_NAV_KEY,JSON.stringify(state));return state}

/* 11.9.0 Global Instrument Registry + Rebuild Identity Registry */
function shareClassInfo(name){
 const raw=String(name||'').trim(),upper=raw.toUpperCase();
 const tokens=['ACC','DIST','UTD','A','B','C','D','E','I','R','V'];
 let cls='';
 for(const t of tokens){if(new RegExp(`(?:\\s|\\(|-|/|^)${t}(?:\\s|\\)|-|/|$)`,'i').test(upper)){cls=t;break}}
 const distribution=/\\b(UTD|DIST|DISTRIBUTION|INC|INCOME)\\b/i.test(upper)?'distribution':/\\b(ACC|ACCUMULATION)\\b/i.test(upper)?'accumulation':'';
 return {shareClass:cls,distribution,base:normalizeInstrumentName(raw.replace(/\\([^)]*\\)/g,' ').replace(/\\b(ACC|DIST|UTD|A|B|C|D|E|I|R|V)\\b/gi,' '))};
}
function identityRebuildState(){return merge({version:'11.9.0',lastRun:'',status:'idle',scanned:0,preserved:0,rebuilt:0,removedUnsafe:0,verified:0,review:0,conflicts:0,backup:null,issues:[]},parse(safeGet(IDENTITY_REBUILD_KEY))||{})}
function persistIdentityRebuild(x){safeSet(IDENTITY_REBUILD_KEY,JSON.stringify(x))}
function isManualMapping(m){return String(m?.source||'').includes('manual')||m?.manual===true}
function isTrustedMapping(m){return isManualMapping(m)||m?.identityStatus==='verified'||m?.verified===true||String(m?.source||'').includes('registry')}
function mappingLooksUnsafe(h,m){
 if(!m||!Object.keys(m).length)return false;
 const ticker=String(m.ticker||'').trim(),cur=String(m.currency||h._currency||'').toUpperCase(),ex=String(m.exchange||'').toUpperCase();
 if(!ticker)return false;
 if(/^[A-Z]{2,5}D\\d{2}$/i.test(ticker)&&!/BRL|BOVESPA/.test(cur+' '+ex))return true;
 if(cur==='USD'&&/BOVESPA|STOCKHOLM|COPENHAGEN/.test(ex))return true;
 if(cur==='SEK'&&/NYSE|NASDAQ(?! STOCKHOLM)/.test(ex))return true;
 const hit=registryMatch({name:h._name,assetType:h._type,currency:h._currency});
 if(hit&&normalizeInstrumentName(ticker)!==normalizeInstrumentName(hit.entry.ticker)&&hit.score>=94)return true;
 return false;
}
function identityCandidateFor(h){
 const direct=registryMatch({name:h._name,assetType:h._type,currency:h._currency});
 if(direct&&direct.score>=94)return {kind:'registry',confidence:Math.min(100,direct.score),entry:direct.entry,reasons:['Exakt eller mycket stark namnmatchning','Valuta och tillgångsslag kontrollerade']};
 const sci=shareClassInfo(h._name),normalized=normalizeInstrumentName(h._name);
 const same=GLOBAL_INSTRUMENT_REGISTRY.map(entry=>({entry,score:Math.max(...registryAliases(entry).map(a=>nameSimilarity(sci.base||normalized,a))) })).sort((a,b)=>b.score-a.score)[0];
 if(same&&same.score>=96)return {kind:'share-class',confidence:96,entry:same.entry,reasons:['Basnamn matchar','Andelsklass separerad']};
 return null;
}
function previewIdentityRebuild(){
 const issues=[];let preserved=0,verified=0,review=0,conflicts=0;
 for(const h of canonicalHoldings()){
  const m=liveFoundation.mappings[h._key]||{},candidate=identityCandidateFor(h),unsafe=mappingLooksUnsafe(h,m),manual=isManualMapping(m);
  if(manual){preserved++;if(unsafe){conflicts++;issues.push({key:h._key,name:h._name,type:'manual-conflict',message:'Manuell koppling avviker från verifierat register och lämnas orörd.'})}continue}
  if(candidate){verified++;if(unsafe)issues.push({key:h._key,name:h._name,type:'replace',message:`Misstänkt automatisk identitet kan ersättas med ${candidate.entry.ticker}.`})}
  else {review++;issues.push({key:h._key,name:h._name,type:m.ticker?'unverified':'missing',message:m.ticker?'Identiteten kan inte verifieras säkert.':'Saknar säker identitet.'})}
 }
 return {scanned:canonicalHoldings().length,preserved,verified,review,conflicts,issues};
}
function runIdentityRebuild(){
 const before=structuredClone(liveFoundation.mappings||{}),preview=previewIdentityRebuild();let rebuilt=0,removedUnsafe=0,preserved=0;
 const now=new Date().toISOString();
 for(const h of canonicalHoldings()){
  const current=liveFoundation.mappings[h._key]||{};
  if(isManualMapping(current)){preserved++;continue}
  const candidate=identityCandidateFor(h);
  if(candidate){const e=candidate.entry;liveFoundation.mappings[h._key]={...current,ticker:e.ticker,isin:e.isin||current.isin||'',currency:e.currency||current.currency||h._currency,exchange:e.exchange||current.exchange||'',country:e.country||current.country||'',providerSymbols:{...(current.providerSymbols||{}),...(e.providerSymbols||{})},instrumentClass:classifyInstrument(h).code,pricingModel:classifyInstrument(h).pricing,shareClass:shareClassInfo(h._name).shareClass,distributionPolicy:shareClassInfo(h._name).distribution,verified:true,identityStatus:'verified',identityConfidence:candidate.confidence,identityReasons:candidate.reasons,source:'global-registry-11.9',registryVersion:'11.9.0',updatedAt:now};rebuilt++;continue}
  if(mappingLooksUnsafe(h,current)&&!isTrustedMapping(current)){liveFoundation.mappings[h._key]={instrumentClass:classifyInstrument(h).code,pricingModel:classifyInstrument(h).pricing,currency:h._currency||current.currency||'SEK',identityStatus:'review',identityConfidence:0,source:'identity-rebuild-reset-11.9',updatedAt:now};removedUnsafe++}
 }
 persistLiveFoundation();
 const after=previewIdentityRebuild(),state={version:'11.9.0',lastRun:now,status:after.conflicts?'warning':'success',scanned:after.scanned,preserved,rebuilt,removedUnsafe,verified:after.verified,review:after.review,conflicts:after.conflicts,backup:{createdAt:now,mappings:before},issues:after.issues};
 persistIdentityRebuild(state);liveEvent(state.status,'Identity Rebuild 11.9',`${rebuilt} byggda · ${removedUnsafe} osäkra återställda · ${preserved} manuella bevarade`,state);return state;
}
function restoreIdentityBackup(){const st=identityRebuildState();if(!st.backup?.mappings)return false;liveFoundation.mappings=structuredClone(st.backup.mappings);persistLiveFoundation();persistIdentityRebuild({...st,status:'restored',lastRestore:new Date().toISOString()});liveEvent('warning','Identity Rebuild 11.9','Föregående identitetsregister återställdes från lokal backup',{});return true}
function identityReviewModal(){const st=identityRebuildState(),p=st.lastRun?st:previewIdentityRebuild();const rows=(p.issues||[]).map(x=>`<div class="identityIssue ${esc(x.type)}"><div><b>${esc(x.name)}</b><p>${esc(x.message)}</p></div><span>${esc(x.type)}</span></div>`).join('');return `<div class="eyebrow">Global Instrument Registry 11.9</div><h2>Identitetsgranskning</h2><p class="disclaimer">Endast read-only live-mappning påverkas. Manuella kopplingar lämnas orörda.</p><div class="grid"><div class="card metric"><span>Verifierbara</span><b>${p.verified||0}</b></div><div class="card metric"><span>Att granska</span><b>${p.review||0}</b></div><div class="card metric"><span>Konflikter</span><b>${p.conflicts||0}</b></div><div class="card metric"><span>Bevarade manuella</span><b>${p.preserved||0}</b></div></div><div class="identityIssueList">${rows||'<div class="notice okbox">Inga öppna identitetsproblem.</div>'}</div>${st.backup?'<button id="restoreIdentityBackup" class="secondary" type="button">Återställ föregående register</button>':''}`}
function openIdentityReview(){openModal(identityReviewModal());document.getElementById('restoreIdentityBackup')?.addEventListener('click',()=>{if(confirm('Återställa föregående lokala identitetsregister?')){restoreIdentityBackup();closeModal();render()}})}
function identityRebuildPanel(){const st=identityRebuildState(),p=st.lastRun?st:previewIdentityRebuild();return `<section class="section identityRebuildPanel"><div class="sectionHead"><div><div class="eyebrow">Global Instrument Registry 11.9</div><h2>Rebuild Identity Registry</h2></div><span class="healthScore">${p.verified||0}/${p.scanned||canonicalHoldings().length}</span></div><p>Sanerar gamla automatiska tickerfel, separerar andelsklasser och bygger om verifierade identiteter. Manuella kopplingar och all portföljmasterdata skyddas.</p><div class="grid"><div class="card metric"><span>Verifierbara</span><b>${p.verified||0}</b></div><div class="card metric"><span>Att granska</span><b>${p.review||0}</b></div><div class="card metric"><span>Konflikter</span><b>${p.conflicts||0}</b></div><div class="card metric"><span>Senast återställda</span><b>${st.removedUnsafe||0}</b></div></div><div class="foundationActions"><button id="runIdentityRebuild" class="primary" type="button">Bygg om identitetsregistret</button><button id="openIdentityReview" class="secondary" type="button">Granska resultat</button></div><p class="disclaimer">Antal, GAV, marknadsvärde, kredit, transaktioner, Ledger och API-nycklar ändras aldrig.</p></section>`}



/* 11.14.0 Global Identity Resolver — permanent multi-provider identity routes */
function globalResolverState(){return merge({version:'11.14.0',status:'idle',lastRun:'',scanned:0,resolved:0,review:0,unresolved:0,errors:0,suggestions:[],routes:{},audit:[]},parse(safeGet(GLOBAL_RESOLVER_KEY))||{})}
function persistGlobalResolver(x){safeSet(GLOBAL_RESOLVER_KEY,JSON.stringify(x))}
function permanentIdentityRegistry(){return merge({version:'11.15.23',updatedAt:'',routes:{},audit:[]},parse(safeGet(PERMANENT_IDENTITY_KEY))||{})}
function persistPermanentIdentityRegistry(x){x.version='11.15.23';x.updatedAt=new Date().toISOString();safeSet(PERMANENT_IDENTITY_KEY,JSON.stringify(x))}
function routeIsUsable(route){return Boolean(route&&(route.ticker||route.isin)&&route.currency&&route.provider)}
function permanentRouteFor(key){return permanentIdentityRegistry().routes?.[key]||null}
function savePermanentIdentityRoute(key,route,meta={}){
 if(!key||!routeIsUsable(route))return false;
 const registry=permanentIdentityRegistry(),previous=registry.routes?.[key]||null;
 registry.routes=registry.routes||{};
 registry.routes[key]={...previous,...route,locked:true,registryVersion:'11.15.23',savedAt:new Date().toISOString(),source:meta.source||route.source||'global-resolver'};
 registry.audit=[{date:new Date().toISOString(),key,provider:route.provider,ticker:route.ticker||'',isin:route.isin||'',action:previous?'updated':'created'},...(registry.audit||[])].slice(0,300);
 persistPermanentIdentityRegistry(registry);return true
}
function hydratePermanentIdentityRoutes(){
 const registry=permanentIdentityRegistry();let restored=0,migrated=0;
 for(const [key,route] of Object.entries(registry.routes||{})){
  if(!routeIsUsable(route))continue;const current=liveFoundation.mappings[key]||{};
  if(!current.permanentRoute||!current.verified){liveFoundation.mappings[key]={...current,...route,permanentRoute:route,verified:true,identityStatus:'verified',identityConfidence:num(route.confidence)||96,resolverVersion:'11.15.23',source:'permanent-identity-registry-11.15.23',updatedAt:new Date().toISOString()};restored++}
 }
 const state=globalResolverState();
 for(const [key,route] of Object.entries(state.routes||{})){if(routeIsUsable(route)&&!registry.routes?.[key]){savePermanentIdentityRoute(key,route,{source:'migration-global-resolver'});migrated++}}
 for(const [key,m] of Object.entries(liveFoundation.mappings||{})){const route=m.permanentRoute||(m.verified&&num(m.identityConfidence||m.confidence)>=92?{provider:m.provider||'Verified mapping',ticker:m.ticker||'',isin:m.isin||'',exchange:m.exchange||'',currency:m.currency||'SEK',figi:m.figi||'',confidence:num(m.identityConfidence||m.confidence)||92,verifiedAt:m.verifiedAt||m.updatedAt||new Date().toISOString()}:null);if(routeIsUsable(route)&&!permanentIdentityRegistry().routes?.[key]){savePermanentIdentityRoute(key,route,{source:'migration-live-foundation'});migrated++}}
 if(restored||migrated){persistLiveFoundation();liveEvent('success','Permanent Identity Registry 11.15.23',`${restored} rutter återställda · ${migrated} migrerade`,{})}
 return {restored,migrated,total:Object.keys(permanentIdentityRegistry().routes||{}).length}
}
function resolverCandidateKey(c){return `${String(c.isin||'').toUpperCase()}|${String(c.ticker||'').toUpperCase()}|${normalizeInstrumentName(c.exchange||'')}|${normalizeInstrumentName(c.name||'')}`}
function validIsin(x){return /^[A-Z]{2}[A-Z0-9]{9}[0-9]$/.test(String(x||'').trim().toUpperCase())}
function normalizedExchange(x){const v=normalizeInstrumentName(x||'');if(/stockholm|nasdaq stockholm|omx|sto/.test(v))return'STO';if(/new york|nyse/.test(v))return'NYSE';if(/nasdaq/.test(v))return'NASDAQ';if(/london|lse/.test(v))return'LSE';if(/xetra|frankfurt/.test(v))return'XETRA';return String(x||'').trim().toUpperCase()}
function tickerVariants(item){
 const raw=String(item.ticker||'').trim().toUpperCase(),name=String(item.name||'').trim(),out=new Set();
 if(raw)out.add(raw);const inferred=inferTickerForHolding(canonicalHoldings().find(h=>h._key===item.key)||item);if(inferred)out.add(inferred.toUpperCase());
 [...out].forEach(t=>{const b=t.replace(/\.(ST|STO)$/,'').replace(/-/g,' ');out.add(b);out.add(b.replace(/\s+/g,'-'));out.add(b.replace(/\s+/g,'.'));out.add(b.replace(/\s+/g,''));if(item.currency==='SEK'||normalizedExchange(item.exchange)==='STO'){out.add(b.replace(/\s+/g,'-')+'.ST');out.add(b.replace(/\s+/g,'-')+'.STO')}});
 const n=normalizeInstrumentName(name);const known=[[/(investor b)/,'INVE-B'],[/(handelsbanken a)/,'SHB-A'],[/(volvo b)/,'VOLV-B'],[/(atlas copco b)/,'ATCO-B'],[/(cibus)/,'CIBUS'],[/(broadcom)/,'AVGO'],[/(mastercard)/,'MA']];for(const [rx,t] of known)if(rx.test(n)){out.add(t);if(item.currency==='SEK')out.add(t+'.ST')}
 return [...out].filter(Boolean).slice(0,12)
}
function exchangeVariants(item){const x=normalizedExchange(item.exchange),out=new Set([x]);if(item.currency==='SEK'||x==='STO'){['STO','NASDAQ STOCKHOLM','OMX','Stockholm'].forEach(v=>out.add(v))}return [...out].filter(Boolean)}
function resolverScore(item,c){
 let score=nameSimilarity(item.name,c.name||c.ticker||'');const wantedCur=String(item.currency||'').toUpperCase(),gotCur=String(c.currency||'').toUpperCase();
 const itemIsin=String(item.isin||'').toUpperCase(),candIsin=String(c.isin||'').toUpperCase();if(itemIsin&&candIsin&&itemIsin===candIsin)score=100;else if(validIsin(candIsin))score+=18;
 if(wantedCur&&gotCur&&wantedCur===gotCur)score+=8;if(normalizedExchange(item.exchange)&&normalizedExchange(item.exchange)===normalizedExchange(c.exchange))score+=8;
 if(item.assetType&&c.type&&normalizeInstrumentName(item.assetType)===normalizeInstrumentName(c.type))score+=7;if(/fond|fund/i.test(item.assetType||'')&&/fund|mutual/i.test(c.type||''))score+=8;if(/etf/i.test(item.assetType||'')&&/etf/i.test(c.type||''))score+=8;if(/aktie|stock|equity|reit/i.test(item.assetType||'')&&/stock|equity|common|reit/i.test(c.type||''))score+=6;
 if(tickerVariants(item).some(t=>t.replace(/[. -]/g,'')===String(c.ticker||'').toUpperCase().replace(/[. -]/g,'')))score+=16;if(c.provider==='Global Registry')score=Math.max(score,98);if(c.provider==='OpenFIGI'&&c.isin)score+=4;if(c.providerScore)score+=Math.min(8,num(c.providerScore)/12);
 return Math.max(0,Math.min(100,Math.round(score)))
}
async function openFigiRequest(payload){const cfg=providerConfig(),ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),11000),headers={'Content-Type':'application/json'};if(cfg.openFigiKey)headers['X-OPENFIGI-APIKEY']=cfg.openFigiKey;try{const res=await fetch('https://api.openfigi.com/v3/mapping',{method:'POST',headers,body:JSON.stringify(payload),signal:ctrl.signal,cache:'no-store'});if(!res.ok)throw new Error(`OpenFIGI HTTP ${res.status}`);return await res.json()}finally{clearTimeout(timer)}}
async function searchOpenFigiPost(item){
 const jobs=[];if(validIsin(item.isin))jobs.push({idType:'ID_ISIN',idValue:String(item.isin).toUpperCase()});for(const t of tickerVariants(item).slice(0,5))jobs.push({idType:'TICKER',idValue:t.replace(/\.(ST|STO)$/,''),exchCode:normalizedExchange(item.exchange)==='STO'?'SS':undefined});
 if(!jobs.length)return[];const x=await openFigiRequest(jobs);return x.flatMap((r,i)=>(r.data||[]).slice(0,5).map(z=>({ticker:z.ticker||jobs[i].idValue,name:z.name||z.securityDescription||'',exchange:z.exchCode||z.marketSector||'',currency:z.currency||item.currency||'',type:z.securityType2||z.securityType||'',isin:(z.securityIdentifiers||[]).find(q=>q.idType==='ID_ISIN')?.idValue||(jobs[i].idType==='ID_ISIN'?jobs[i].idValue:''),figi:z.figi||'',provider:'OpenFIGI'})))
}
async function searchFinnhubInstrument(item){const key=providerConfig().finnhubKey;if(!key)return[];const qs=[item.isin,...tickerVariants(item).slice(0,4),item.name].filter(Boolean),all=[];for(const q of qs){const url=`https://finnhub.io/api/v1/search?q=${encodeURIComponent(q)}&token=${encodeURIComponent(key)}`;const res=await fetchWithPolicy(url,{provider:'finnhub',timeoutMs:8000,retries:0}),x=await res.json();all.push(...(x.result||[]).slice(0,8).map(r=>({ticker:r.symbol||'',name:r.description||'',exchange:r.primaryExchange||'',currency:item.currency||'',type:r.type||'',provider:'Finnhub'})))}return all}
async function searchTwelveDataResolver(item){const key=providerConfig().twelveDataKey;if(!key)return[];const all=[];for(const q of [item.isin,...tickerVariants(item).slice(0,5),item.name].filter(Boolean)){const url=`https://api.twelvedata.com/symbol_search?symbol=${encodeURIComponent(q)}&apikey=${encodeURIComponent(key)}&outputsize=8`;const res=await fetchWithPolicy(url,{provider:'twelvedata',timeoutMs:8000,retries:0}),x=await res.json();if(x.status==='error')continue;all.push(...(x.data||[]).map(r=>({ticker:r.symbol,name:r.instrument_name||r.name||'',exchange:r.exchange||r.mic_code||'',currency:r.currency||item.currency||'',type:r.instrument_type||'',provider:'Twelve Data'})))}return all}
async function searchAlphaVantageResolver(item){const key=providerConfig().alphaVantageKey;if(!key)return[];const all=[];for(const q of [item.isin,...tickerVariants(item).slice(0,4),item.name].filter(Boolean)){const url=`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(q)}&apikey=${encodeURIComponent(key)}`;const res=await fetchWithPolicy(url,{provider:'alphavantage',timeoutMs:9000,retries:0}),x=await res.json();if(x.Note||x.Information)continue;all.push(...(x.bestMatches||[]).map(r=>({ticker:r['1. symbol'],name:r['2. name'],type:r['3. type'],exchange:r['4. region'],currency:r['8. currency']||item.currency||'',provider:'Alpha Vantage',providerScore:num(r['9. matchScore'])*100})))}return all}
function localResolverCandidates(item){const hit=registryMatch(item);if(!hit)return[];const e=hit.entry;return [{ticker:e.ticker,isin:e.isin,name:e.names?.[0]||item.name,exchange:e.exchange,currency:e.currency,type:e.type,providerSymbols:e.providerSymbols,provider:'Global Registry'}]}
function resolverRunState(){return merge({version:'11.15.23',status:'idle',runId:'',startedAt:'',updatedAt:'',completedAt:'',cursor:0,total:0,processed:0,skipped:0,permanent:0,newSafe:0,review:0,failed:0,errors:0,stopRequested:false,targetKeys:[],suggestions:[]},parse(safeGet(RESOLVER_RUN_KEY))||{})}
function persistResolverRun(x){x.version='11.15.23';x.updatedAt=new Date().toISOString();safeSet(RESOLVER_RUN_KEY,JSON.stringify(x));return x}
function recoverResolverRun(){const x=resolverRunState();if(x.status==='running'){x.status='paused';x.stopRequested=false;x.message='Föregående körning avbröts. Tryck kör för att fortsätta.';persistResolverRun(x)}return x}
function requestResolverStop(){const x=resolverRunState();if(x.status!=='running')return;x.stopRequested=true;x.message='Stoppar säkert efter aktuellt instrument…';persistResolverRun(x);const b=document.getElementById('stopGlobalResolver');if(b){b.disabled=true;b.textContent='Stoppar…'}}
function compactResolverSuggestion(row){return {...row,candidates:(row.candidates||[]).slice(0,4),variants:(row.variants||[]).slice(0,6),errors:(row.errors||[]).slice(0,3)}}
function refreshValuationAfterResolver(){try{liveValuationSnapshot({persist:true});runDataConfidenceEngine({reason:'resolver-11.15.23'});runAutonomousPortfolioScan({reason:'resolver-11.15.23',force:true})}catch(error){console.warn('Efteranalys kunde inte köras',error)}}
function resolverTargets(){const routes=permanentIdentityRegistry().routes||{};return instrumentMappingCoverage().items.filter(item=>{if(routeIsUsable(routes[item.key]))return false;const m=liveFoundation.mappings[item.key]||{},cls=classifyInstrument(canonicalHoldings().find(h=>h._key===item.key)||item).code;return !m.verified||num(m.identityConfidence||m.confidence)<92||(!m.ticker&&!m.isin)||(!m.isin&&cls!=='fund'&&!m.ticker)})}
async function resolveOneInstrument(item){
 const m=liveFoundation.mappings[item.key]||{};item={...item,ticker:m.ticker||item.ticker||'',isin:m.isin||item.isin||'',exchange:m.exchange||item.exchange||''};let candidates=[...localResolverCandidates(item)],errors=[];const jobs=[];if(providerConfig().twelveDataKey)jobs.push(searchTwelveDataResolver(item));if(providerConfig().alphaVantageKey)jobs.push(searchAlphaVantageResolver(item));if(providerConfig().finnhubKey)jobs.push(searchFinnhubInstrument(item));jobs.push(searchOpenFigiPost(item));
 const settled=await Promise.allSettled(jobs);for(const r of settled){if(r.status==='fulfilled')candidates.push(...r.value);else errors.push(String(r.reason?.message||r.reason))}
 const unique=[...new Map(candidates.filter(c=>c.ticker||c.isin).map(c=>[resolverCandidateKey(c),c])).values()].map(c=>({...c,score:resolverScore(item,c)})).sort((a,b)=>b.score-a.score);const best=unique[0]||null,second=unique[1]||null,margin=best?best.score-num(second?.score):0;const conflict=Boolean(best&&second&&best.score>=88&&second.score>=88&&normalizeInstrumentName(best.ticker)!==normalizeInstrumentName(second.ticker));const autoSafe=Boolean(best&&best.score>=96&&margin>=4&&!conflict&&(validIsin(best.isin)||best.score>=98));
 return {key:item.key,name:item.name,account:item.account,assetType:item.assetType,currency:item.currency,best,candidates:unique.slice(0,8),confidence:best?.score||0,margin,conflict,autoSafe,variants:tickerVariants(item),exchanges:exchangeVariants(item),errors}
}
async function runGlobalResolver(){
 let run=recoverResolverRun(),targets=resolverTargets();
 const byKey=new Map(instrumentMappingCoverage().items.map(x=>[x.key,x]));
 const resumable=run.status==='paused'&&Array.isArray(run.targetKeys)&&run.targetKeys.length>0&&run.cursor<run.targetKeys.length;
 if(!resumable){
  const previous=globalResolverState();
  run={version:'11.15.23',status:'running',runId:crypto.randomUUID?.()||String(Date.now()),startedAt:new Date().toISOString(),updatedAt:new Date().toISOString(),completedAt:'',cursor:0,total:targets.length,processed:0,skipped:Object.keys(permanentIdentityRegistry().routes||{}).length,permanent:Object.keys(permanentIdentityRegistry().routes||{}).length,newSafe:0,review:0,failed:0,errors:0,stopRequested:false,targetKeys:targets.map(x=>x.key),suggestions:(previous.suggestions||[]).filter(x=>!routeIsUsable(permanentRouteFor(x.key))),message:'Resolvern startar…'};
 }else{
  targets=run.targetKeys.map(k=>byKey.get(k)).filter(Boolean);
  run.status='running';run.stopRequested=false;run.message='Återupptar från senaste sparade position…';
 }
 persistResolverRun(run);render();
 const batchStart=run.cursor;
 const batchEnd=Math.min(targets.length,batchStart+8);
 for(let i=batchStart;i<batchEnd;i++){
  run=resolverRunState();
  if(run.stopRequested){run.status='paused';run.message=`Pausad säkert efter ${run.processed}/${run.total}.`;persistResolverRun(run);syncResolverResultsFromRun(run);render();return true}
  const item=targets[i];
  if(!item){run.cursor=i+1;persistResolverRun(run);continue}
  if(routeIsUsable(permanentRouteFor(item.key))){run.cursor=i+1;run.processed++;run.skipped++;persistResolverRun(run);continue}
  run.message=`Verifierar ${i+1}/${targets.length}: ${item.name}`;persistResolverRun(run);renderResolverProgress(run);
  try{
   const row=await resolveOneInstrument(item);run=resolverRunState();run.cursor=i+1;run.processed++;run.errors+=row.errors.length;
   const compact=compactResolverSuggestion(row);run.suggestions=[...(run.suggestions||[]).filter(x=>x.key!==row.key),compact].slice(-160);
   if(row.autoSafe&&applyResolverSuggestion(row.key,0,{silent:true,rowOverride:row})){run.newSafe++;run.permanent=Object.keys(permanentIdentityRegistry().routes||{}).length;run.suggestions=run.suggestions.filter(x=>x.key!==row.key)}
   else if(row.best)run.review++;else run.failed++;
   persistResolverRun(run)
  }catch(error){run=resolverRunState();run.cursor=i+1;run.processed++;run.failed++;run.errors++;run.suggestions=[...(run.suggestions||[]),{key:item.key,name:item.name,account:item.account,assetType:item.assetType,currency:item.currency,best:null,candidates:[],confidence:0,autoSafe:false,conflict:false,variants:tickerVariants(item),errors:[String(error?.message||error)]}].slice(-160);persistResolverRun(run)}
  syncResolverResultsFromRun(run);
  renderResolverProgress(run);
  await new Promise(resolve=>setTimeout(resolve,0));
 }
 run=resolverRunState();
 const complete=run.cursor>=targets.length;
 run.status=complete?'complete':'paused';
 run.completedAt=complete?new Date().toISOString():'';
 run.permanent=Object.keys(permanentIdentityRegistry().routes||{}).length;
 run.message=complete?`Klar: ${run.newSafe} nya säkra · ${run.review} för granskning · ${run.failed} utan träff.`:`Batch klar: ${run.processed}/${run.total}. ${Math.max(0,run.total-run.processed)} återstår.`;
 persistResolverRun(run);syncResolverResultsFromRun(run);
 if(complete)refreshValuationAfterResolver();
 liveEvent(run.failed?'warning':'success','Global Identity Resolver 11.15.23',run.message,{skipped:run.skipped,permanent:run.permanent,errors:run.errors});
 render();return true
}
function syncResolverResultsFromRun(run){
 const previous=globalResolverState();
 const suggestions=(run.suggestions||[]).filter(x=>!routeIsUsable(permanentRouteFor(x.key)));
 persistGlobalResolver({...previous,version:'11.15.23',status:run.status,lastRun:new Date().toISOString(),scanned:run.processed,resolved:run.newSafe,review:suggestions.filter(x=>x.best).length,unresolved:suggestions.filter(x=>!x.best).length,errors:run.errors,suggestions,routes:previous.routes||{},audit:[{date:new Date().toISOString(),status:run.status,scanned:run.processed,resolved:run.newSafe,review:suggestions.filter(x=>x.best).length,unresolved:suggestions.filter(x=>!x.best).length,errors:run.errors},...(previous.audit||[])].slice(0,100)});
}
function renderResolverProgress(run){
 const btn=document.getElementById('runGlobalResolver');if(btn)btn.textContent=`Verifierar ${Math.min(run.cursor+1,run.total)}/${run.total}…`;
 const stop=document.getElementById('stopGlobalResolver');if(stop)stop.disabled=false;
}
function applyResolverSuggestion(key,index=0,{silent=false,rowOverride=null}={}){const state=globalResolverState(),row=rowOverride||(state.suggestions||[]).find(x=>x.key===key),candidate=row?.candidates?.[index];if(!row||!candidate)return false;const current=liveFoundation.mappings[key]||{};if(isManualMapping(current)&&!silent&&!confirm('Detta instrument har en manuell koppling. Ersätta den med valt resolverförslag?'))return false;const route={provider:candidate.provider,ticker:candidate.ticker||'',isin:candidate.isin||'',exchange:candidate.exchange||'',currency:candidate.currency||row.currency||'SEK',figi:candidate.figi||'',confidence:candidate.score,verifiedAt:new Date().toISOString(),source:'global-resolver-11.15.23'};if(!routeIsUsable(route))return false;liveFoundation.mappings[key]={...current,...route,providerSymbols:{...(current.providerSymbols||{}),...(candidate.providerSymbols||{}),[String(candidate.provider||'provider').toLowerCase().replace(/\s+/g,'_')]:candidate.ticker||candidate.isin},instrumentClass:classifyInstrument(canonicalHoldings().find(h=>h._key===key)||row).code,verified:true,identityStatus:'verified',identityConfidence:candidate.score,identityReasons:[candidate.provider,'Verifierad i Global Identity Resolver 11.15.23'],source:'permanent-identity-registry-11.15.23',resolverVersion:'11.15.23',permanentRoute:route,updatedAt:new Date().toISOString()};persistLiveFoundation();savePermanentIdentityRoute(key,route,{source:'global-resolver-approved'});state.routes=state.routes||{};state.routes[key]=route;row.applied=true;row.appliedAt=new Date().toISOString();row.appliedCandidate=index;persistGlobalResolver(state);liveEvent('success','Permanent Identity Registry 11.15.23',`${row.name} låstes permanent till ${candidate.ticker||candidate.isin}`,route);return true}
function applySafeResolverSuggestions(){const state=globalResolverState();let count=0;for(const row of state.suggestions||[]){if(row.autoSafe&&!row.applied&&applyResolverSuggestion(row.key,0))count++}return count}
function resolverReviewHtml(){const st=globalResolverState();const rows=(st.suggestions||[]).map(row=>{const best=row.best;return `<article class="resolverResult ${row.conflict?'conflict':row.autoSafe?'safe':best?'review':'missing'}"><div class="resolverTitle"><div><b>${esc(row.name)}</b><small>${esc(row.account)} · ${esc(row.assetType)}</small></div><span>${row.applied?'Permanent':best?`${num(row.confidence)}%`:'Ingen träff'}</span></div>${best?`<div class="resolverBest"><strong>${esc(best.ticker||best.isin)}</strong><p>${esc(best.name||'')} · ${esc(best.exchange||'Okänd börs')} · ${esc(best.currency||row.currency||'')}</p><small>${esc(best.provider)}${row.conflict?' · konflikt mellan källor':''}</small></div><div class="resolverMeta"><small>Testade tickers: ${esc((row.variants||[]).slice(0,6).join(' · ')||'—')}</small></div><div class="resolverActions"><button class="primary" data-resolver-apply="${esc(row.key)}" ${row.applied?'disabled':''}>${row.applied?'Sparad permanent':'Godkänn och spara permanent'}</button>${row.candidates.length>1?`<select data-resolver-choice="${esc(row.key)}">${row.candidates.map((c,i)=>`<option value="${i}">${esc(c.ticker||c.isin)} · ${esc(c.provider)} · ${num(c.score)}%</option>`).join('')}</select>`:''}</div>`:`<div class="notice">Ingen säker identitet hittades automatiskt. Instrumentet lämnas orört för manuell granskning.</div>`}</article>`}).join('');return `<div class="eyebrow">Global Identity Resolver 11.15.23</div><h2>Verifiera och lås rätt identitet</h2><p class="disclaimer">ISIN, tickerformat, börsvarianter och flera providers jämförs. Endast uttryckligt godkända eller mycket säkra träffar sparas i read-only live-lagret.</p><div class="grid"><div class="card metric"><span>Sökta</span><b>${st.scanned}</b></div><div class="card metric"><span>Säkra</span><b>${st.resolved}</b></div><div class="card metric"><span>Granskning</span><b>${st.review}</b></div><div class="card metric"><span>Utan träff</span><b>${st.unresolved}</b></div></div><button id="applySafeResolver" class="primary" ${st.resolved?'':'disabled'}>Godkänn alla säkra och spara permanent</button><div class="resolverList">${rows||'<div class="empty">Kör resolvermotorn för att skapa förslag.</div>'}</div>`}
function openGlobalResolverReview(){openModal(resolverReviewHtml());document.getElementById('applySafeResolver')?.addEventListener('click',()=>{const n=applySafeResolverSuggestions();alert(`${n} säkra identiteter sparades permanent.`);closeModal();render()});document.querySelectorAll('[data-resolver-apply]').forEach(btn=>btn.addEventListener('click',()=>{const key=btn.dataset.resolverApply,sel=document.querySelector(`[data-resolver-choice="${CSS.escape(key)}"]`),idx=num(sel?.value);if(applyResolverSuggestion(key,idx)){openGlobalResolverReview();render()}}))}
function globalResolverPanel(){const st=globalResolverState(),run=recoverResolverRun(),coverage=instrumentMappingCoverage(),remaining=resolverTargets().length,saved=Object.keys(permanentIdentityRegistry().routes||{}).length,running=run.status==='running',paused=run.status==='paused';return `<section class="section globalResolverPanel"><div class="sectionHead"><div><div class="eyebrow">Global Identity Resolver 11.15.23</div><h2>Snabbare, återupptagbar och permanent.</h2></div><span class="healthScore">${saved} låsta</span></div><p>Redan lösta instrument hoppas över lokalt. Varje säker identitet sparas direkt, och en avbruten körning kan fortsätta från senaste position utan att börja om.</p><div class="grid"><div class="card metric"><span>Återstår</span><b>${remaining}</b></div><div class="card metric"><span>Permanent sparade</span><b>${saved}</b></div><div class="card metric"><span>Nya säkra</span><b>${run.newSafe||0}</b></div><div class="card metric"><span>För granskning</span><b>${run.review||st.review||0}</b></div><div class="card metric"><span>Överhoppade</span><b>${run.skipped||0}</b></div><div class="card metric"><span>Misslyckade</span><b>${run.failed||0}</b></div></div>${running||paused?`<div class="resolverProgress"><div><span>${paused?'Pausad':'Kör'}</span><b>${run.processed||0}/${run.total||0}</b></div><div class="bar"><i style="width:${run.total?Math.round((run.processed||0)/run.total*100):0}%"></i></div><small>${esc(run.message||'')}</small></div>`:''}<div class="foundationActions"><button id="runGlobalResolver" class="primary" type="button" ${running?'disabled':''}>${paused?'Fortsätt Global Identity Resolver 11.15.23':'Kör Global Identity Resolver 11.15.23'}</button><button id="stopGlobalResolver" class="danger" type="button" ${running?'':'disabled'}>Stoppa säkert</button><button id="reviewGlobalResolver" class="secondary" type="button" ${(st.suggestions||[]).length||(run.suggestions||[]).length?'':'disabled'}>Granska och godkänn</button></div><div class="resolverSources"><span>Permanent Registry</span><span>Global Registry</span><span>OpenFIGI</span><span>Twelve Data</span><span>Alpha Vantage</span><span>Finnhub</span></div><p class="disclaimer">Identitets- och providerdata sparas i read-only live-lagret. Antal, GAV, kredit, transaktioner och Portfolio Ledger ändras aldrig.</p></section>`}

function classifyInstrument(h){
 const raw=`${h._type||assetType(h)} ${h._name||holdingName(h)}`.toLowerCase();
 if(/reit|realty income|stag industrial|cibus/.test(raw))return {code:'reit',label:'REIT',pricing:'exchange'};
 if(/adr/.test(raw))return {code:'adr',label:'ADR',pricing:'exchange'};
 if(/preferred|preferens/.test(raw))return {code:'preferred',label:'Preferensaktie',pricing:'exchange'};
 if(/etn|certifikat|certificate/.test(raw))return {code:'etn',label:'ETN/Certifikat',pricing:'exchange'};
 if(/etf|xact|hanetf|invesco.*(ucits|etf)|jpm.*premium income/.test(raw))return {code:'etf',label:'ETF',pricing:'exchange'};
 if(/fond|fund|indexnära|aktiespararna|spiltan|ålandsbanken|montrose global/.test(raw))return {code:'fund',label:'Fond',pricing:'nav'};
 return {code:'stock',label:'Aktie',pricing:'exchange'};
}
function navFor(h){const st=fundNavState(),x=st.items?.[h._key];if(!x)return null;const price=num(x.nav||x.price);return price?{...x,price,provider:x.provider||'Manuellt NAV',timestamp:x.timestamp||x.updatedAt}:null}
function marketDataFor(h){const c=classifyInstrument(h);const quote=liveQuoteFor(h);const nav=navFor(h);if(c.pricing==='nav')return nav||quote;return quote||nav}
function fundEtfSummary(){
 const hs=canonicalHoldings(),items=hs.map(h=>({h,c:classifyInstrument(h),d:marketDataFor(h)}));
 const funds=items.filter(x=>x.c.code==='fund'),etfs=items.filter(x=>x.c.code==='etf');
 const navReady=funds.filter(x=>x.d).length,exchangeReady=etfs.filter(x=>x.d).length;
 return {items,funds,etfs,navReady,exchangeReady,missing:items.filter(x=>['fund','etf'].includes(x.c.code)&&!x.d)};
}
function fundEtfPanel(){const x=fundEtfSummary();return `<section class="section fundEtfPanel"><div class="sectionHead"><div><div class="eyebrow">Fund & ETF Intelligence 11.8</div><h2>Rätt pris för rätt instrument</h2></div><span class="healthScore">${x.navReady+x.exchangeReady}/${x.funds.length+x.etfs.length}</span></div><p>Aktier och ETF:er använder börskurs. Traditionella fonder använder senaste NAV. Avsaknad av börskurs markeras inte längre som identitetsfel.</p><div class="grid"><div class="card metric"><span>Fonder</span><b>${x.funds.length}</b><small>${x.navReady} med NAV</small></div><div class="card metric"><span>ETF:er</span><b>${x.etfs.length}</b><small>${x.exchangeReady} med kurs</small></div><div class="card metric"><span>Saknar marknadsdata</span><b>${x.missing.length}</b></div><div class="card metric"><span>Prismodell</span><b>NAV + börskurs</b></div></div><div class="foundationActions"><button id="openFundNav" class="primary" type="button">Hantera fond-NAV</button><button id="classifyAssets" class="secondary" type="button">Klassificera instrument</button></div>${x.missing.length?`<div class="warning"><b>Behöver NAV eller kurs</b><p>${x.missing.slice(0,12).map(y=>esc(y.h._name)).join('<br>')}</p></div>`:`<div class="notice okbox">Alla fonder och ETF:er har användbar marknadsdata.</div>`}</section>`}
function fundNavEditor(){const x=fundEtfSummary(),rows=x.funds.map(({h})=>{const n=navFor(h);return `<div class="mappingRow" data-nav-key="${esc(h._key)}"><div><b>${esc(h._name)}</b><small>${esc(h._account)} · Fond</small><em class="mapStatus ${n?'ok':'missing'}">${n?`Senaste NAV ${dec(n.price)} ${esc(n.currency||'SEK')}`:'Saknar NAV'}</em></div><label>NAV<input data-nav-price inputmode="decimal" value="${n?esc(n.price):''}" placeholder="0,00"></label><label>Valuta<input data-nav-currency value="${esc(n?.currency||text(h,['currency','valuta'],'SEK'))}" maxlength="3"></label><label>Datum<input data-nav-date type="date" value="${esc((n?.timestamp||'').slice(0,10)||today())}"></label></div>`}).join('');return `<div class="eyebrow">Fund NAV Center 11.8</div><h2>Senaste fondvärden</h2><p class="disclaimer">NAV sparas endast i live-lagret och ändrar aldrig antal, GAV, transaktioner eller Portfolio Ledger.</p><div class="mappingList">${rows||'<div class="empty">Inga traditionella fonder identifierades.</div>'}</div><button id="saveFundNav" class="primary stickyAction">Spara fond-NAV</button>`}
function openFundNavEditor(){openModal(fundNavEditor());document.getElementById('saveFundNav')?.addEventListener('click',()=>{const st=fundNavState();st.items=st.items||{};document.querySelectorAll('[data-nav-key]').forEach(row=>{const price=num(row.querySelector('[data-nav-price]')?.value);const currency=(row.querySelector('[data-nav-currency]')?.value||'SEK').trim().toUpperCase();const date=row.querySelector('[data-nav-date]')?.value||today();if(price>0)st.items[row.dataset.navKey]={nav:price,currency,timestamp:new Date(`${date}T18:00:00`).toISOString(),provider:'Manuellt NAV',quality:88};else delete st.items[row.dataset.navKey]});persistFundNav(st);closeModal();render()})}
function applyAssetClassifications(){let changed=0;const now=new Date().toISOString();canonicalHoldings().forEach(h=>{const c=classifyInstrument(h),m=liveFoundation.mappings[h._key]||{};if(m.instrumentClass!==c.code||m.pricingModel!==c.pricing){liveFoundation.mappings[h._key]={...m,instrumentClass:c.code,instrumentClassLabel:c.label,pricingModel:c.pricing,updatedAt:now};changed++}});persistLiveFoundation();liveEvent('success','Fund & ETF Intelligence',`${changed} instrument klassificerade`,{});return changed}





/* 11.13.0 Autonomous Portfolio Intelligence */
function autonomousPortfolioState(){return merge({version:'11.13.0',lastRun:'',lastSignature:'',status:'ready',message:'Redo för autonom portföljskanning.',scanCount:0,changedItems:0,summary:{},recommendations:[],opportunities:[],concentration:[],brief:[],history:[]},parse(safeGet(AUTONOMOUS_PORTFOLIO_KEY))||{})}
function persistAutonomousPortfolio(x){safeSet(AUTONOMOUS_PORTFOLIO_KEY,JSON.stringify(x));return x}
function intelligenceTrendState(){return parse(safeGet(INTELLIGENCE_TREND_KEY))||[]}
function persistIntelligenceTrend(x){safeSet(INTELLIGENCE_TREND_KEY,JSON.stringify(x.slice(-120)));return x}
function portfolioSignature(){const rows=canonicalHoldings().map(h=>{const m=liveFoundation.mappings[h._key]||{},q=marketDataFor(h);return [h._key,Math.round(h._value),h._qty,h._gav,m.ticker||'',m.isin||'',q?Math.round(num(q.price)*10000):0,q?quoteTimestamp(q):''].join(':')}).sort();return rows.join('|')}
function autonomousRecommendation(x){const c=confidenceForKey(x._key)||confidenceForHolding(x),guarded=confidenceGuardedStatus(x,x);let action=guarded,priority=50;
 if(c.score<45){action='Kontrollera manuellt';priority=100-c.score}
 else if(x.weight>15||x.risk<38){action='Minska / granska';priority=90+Math.min(10,x.weight)}
 else if(x.score>=72&&x.weight<8&&c.score>=75){action='Öka';priority=80+x.score/10}
 else if(x.score>=60&&x.risk>=48){action='Behåll';priority=60+x.score/20}
 else {action='Bevaka';priority=55+(60-x.score)}
 const why=[...x.reasons];if(c.score<65)why.unshift(`datatillit ${c.score}/100`);if(x.weight>12)why.unshift(`portföljvikt ${pct(x.weight)}`);
 return {key:x._key,index:x._i,name:x._name,account:x._account,type:x._type,action,priority:Math.round(priority),score:x.score,confidence:c.score,weight:x.weight,risk:x.risk,valuation:x.valuation,quality:x.quality,why:[...new Set(why)].slice(0,3)}
}
function concentrationEngine(){const hs=canonicalHoldings(),t=total()||1,groups=[];const add=(kind,label,value,count)=>groups.push({kind,label,value,weight:value/t*100,count,severity:value/t*100>=35?'high':value/t*100>=22?'medium':'low'});
 hs.slice().sort((a,b)=>b._value-a._value).slice(0,8).forEach(h=>{const w=h._value/t*100;if(w>=8)add('holding',h._name,h._value,1)});
 const byAccount=new Map(),byType=new Map();hs.forEach(h=>{byAccount.set(h._account,(byAccount.get(h._account)||0)+h._value);byType.set(h._type,(byType.get(h._type)||0)+h._value)});
 [...byAccount].forEach(([k,v])=>{if(v/t*100>=25)add('account',k,v,hs.filter(h=>h._account===k).length)});[...byType].forEach(([k,v])=>{if(v/t*100>=30)add('type',k,v,hs.filter(h=>h._type===k).length)});
 return groups.sort((a,b)=>b.weight-a.weight).slice(0,12)
}
function opportunityRadar(ip){return ip.items.map(autonomousRecommendation).filter(x=>x.action==='Öka'||(x.action==='Behåll'&&x.score>=68)).sort((a,b)=>(b.score+b.confidence/5+b.risk/8-b.weight*1.5)-(a.score+a.confidence/5+a.risk/8-a.weight*1.5)).slice(0,6)}
function buildMorningBrief(ip,recs,concentration,opps){const health=wealthHealth(ip),plan=allocationPlan(ip),risks=riskRadar(ip,health),brief=[];
 const topAction=recs.find(x=>x.action==='Minska / granska'||x.action==='Kontrollera manuellt')||recs.find(x=>x.action==='Öka')||recs[0];if(topAction)brief.push({tone:topAction.action==='Öka'?'good':'caution',label:'Viktigaste åtgärd',title:`${topAction.action}: ${topAction.name}`,text:topAction.why.join(' · ')});
 if(opps[0])brief.push({tone:'good',label:'Största möjlighet',title:opps[0].name,text:`Score ${opps[0].score} · datatillit ${opps[0].confidence}/100 · vikt ${pct(opps[0].weight)}`});
 if(concentration[0])brief.push({tone:concentration[0].severity==='high'?'risk':'caution',label:'Största koncentration',title:concentration[0].label,text:`${pct(concentration[0].weight)} av portföljen · ${concentration[0].kind}`});
 if(risks[0])brief.push({tone:risks[0].level==='high'?'risk':risks[0].level==='medium'?'caution':'neutral',label:'Riskradar',title:risks[0].title,text:risks[0].text});
 brief.push({tone:'neutral',label:'Nästa kapital',title:kr(plan.monthly),text:plan.debt?`${kr(plan.debt)} prioriteras till kreditreduktion.`:`${kr(plan.invest)} kan fördelas enligt skyddsreglerna.`});return brief.slice(0,5)
}
function runAutonomousPortfolioScan({reason='manual',force=false}={}){const previous=autonomousPortfolioState(),signature=portfolioSignature(),same=signature===previous.lastSignature,elapsed=Date.now()-(Date.parse(previous.lastRun||'')||0);if(!force&&same&&elapsed<5*60*1000)return previous;
 const confidence=runDataConfidenceEngine({reason:`11.13:${reason}`}),ip=intelligencePortfolio(),recommendations=ip.items.map(autonomousRecommendation).sort((a,b)=>b.priority-a.priority),opportunities=opportunityRadar(ip),concentration=concentrationEngine(),brief=buildMorningBrief(ip,recommendations,concentration,opportunities);const changedItems=same?0:canonicalHoldings().length;
 const summary={portfolioScore:ip.score,grade:ip.grade,dataConfidence:confidence.portfolioScore,health:wealthHealth(ip).score,increase:recommendations.filter(x=>x.action==='Öka').length,hold:recommendations.filter(x=>x.action==='Behåll').length,watch:recommendations.filter(x=>x.action==='Bevaka').length,reduce:recommendations.filter(x=>x.action==='Minska / granska').length,manual:recommendations.filter(x=>x.action==='Kontrollera manuellt').length};
 const point={date:new Date().toISOString(),...summary,total:total()};let trend=intelligenceTrendState();const last=trend[trend.length-1];if(!last||Date.now()-Date.parse(last.date)>30*60*1000||force){trend.push(point);persistIntelligenceTrend(trend)}
 const state={version:'11.13.0',lastRun:new Date().toISOString(),lastSignature:signature,status:'success',message:`${summary.increase} öka · ${summary.hold} behåll · ${summary.reduce} minska/granska · datatillit ${summary.dataConfidence}/100`,scanCount:num(previous.scanCount)+1,changedItems,summary,recommendations,opportunities,concentration,brief,history:trend.slice(-30)};persistAutonomousPortfolio(state);return state}
function autonomousPortfolioPanel({compact=false}={}){const st=autonomousPortfolioState(),s=st.summary||{},brief=st.brief||[],recs=st.recommendations||[],trend=st.history||[],first=trend[0],last=trend[trend.length-1],delta=first&&last?num(last.portfolioScore)-num(first.portfolioScore):0;return `<section class="section autonomousPortfolio ${compact?'compact':''}"><div class="sectionHead"><div><div class="eyebrow">Autonomous Portfolio Intelligence 11.13</div><h2>${compact?'AI:n arbetar direkt med portföljen':'Automatisk portföljskanning'}</h2></div><span class="syncStatus ${esc(st.status)}">${esc(st.status)}</span></div><p>${esc(st.message||'Skanningen startar automatiskt när appen öppnas och efter lyckad livesynk.')}</p><div class="autonomousMetrics"><div><span>Öka</span><b>${num(s.increase)}</b></div><div><span>Behåll</span><b>${num(s.hold)}</b></div><div><span>Bevaka</span><b>${num(s.watch)}</b></div><div><span>Minska</span><b>${num(s.reduce)}</b></div><div><span>Manuell kontroll</span><b>${num(s.manual)}</b></div><div><span>Trend</span><b class="${delta>=0?'positive':'negative'}">${delta>=0?'+':''}${delta}</b></div></div>${brief.length?`<div class="morningBrief">${brief.map(x=>`<article class="briefItem ${esc(x.tone)}"><small>${esc(x.label)}</small><b>${esc(x.title)}</b><p>${esc(x.text)}</p></article>`).join('')}</div>`:''}<button id="runAutonomousScan" class="primary" type="button">Kör autonom skanning nu</button>${compact?'':`<div class="recommendationQueue">${recs.slice(0,10).map(x=>`<button data-intel-index="${x.index}" class="recommendationRow"><span class="actionBadge ${x.action==='Öka'?'buy':x.action.includes('Minska')?'reduce':x.action.includes('manuellt')?'manual':'hold'}">${esc(x.action)}</span><div><b>${esc(x.name)}</b><small>${esc(x.why.join(' · '))}</small></div><strong>${x.score}</strong></button>`).join('')}</div>`}<p class="disclaimer">Read-only analys. Inga order skapas och antal, GAV, kredit, transaktioner eller Portfolio Ledger ändras aldrig.</p></section>`}


/* 11.12.0 Data Confidence Engine + Autonomous Intelligence */
function dataConfidenceState(){return merge({version:'11.12.0',lastRun:'',portfolioScore:0,verified:0,probable:0,uncertain:0,manualReview:0,items:{},priority:[]},parse(safeGet(DATA_CONFIDENCE_KEY))||{})}
function persistDataConfidence(x){safeSet(DATA_CONFIDENCE_KEY,JSON.stringify(x));return x}
function autonomousIntelligenceState(){return merge({version:'11.12.0',lastRun:'',lastAutoSyncAttempt:'',lastAutoSyncSuccess:'',status:'ready',message:'Redo för automatisk analys.',runs:0},parse(safeGet(AUTONOMOUS_INTELLIGENCE_KEY))||{})}
function persistAutonomousIntelligence(x){safeSet(AUTONOMOUS_INTELLIGENCE_KEY,JSON.stringify(x));return x}
function confidenceAgeScore(ts,pricing){const t=Date.parse(ts||'');if(!t)return 0;const hours=Math.max(0,(Date.now()-t)/36e5);if(pricing==='nav'){if(hours<=48)return 16;if(hours<=168)return 11;if(hours<=336)return 5;return 0}if(hours<=1)return 18;if(hours<=8)return 14;if(hours<=24)return 9;if(hours<=72)return 4;return 0}
function confidenceForHolding(h){
 const m=liveFoundation.mappings[h._key]||{},cls=classifyInstrument(h),datum=marketDataFor(h),diag=adaptiveDiagnosticFor(h);
 let score=0,reasons=[],gaps=[];
 if(m.identityStatus==='verified'||m.verified){score+=24;reasons.push('identitet verifierad')}else if(m.identityConfidence>=70||m.confidence>=70){score+=14;reasons.push('identitet sannolik')}else gaps.push('identitet');
 if(m.isin){score+=14;reasons.push('ISIN finns')}else gaps.push('ISIN');
 if(m.ticker||cls.pricing==='nav'){score+=10;reasons.push(cls.pricing==='nav'?'NAV-instrument klassificerat':'ticker finns')}else gaps.push('ticker');
 if(m.exchange||cls.pricing==='nav'){score+=7;reasons.push(cls.pricing==='nav'?'börs krävs inte för NAV':'börs finns')}else gaps.push('börs');
 if(m.currency||text(h,['currency','valuta'],'')){score+=7;reasons.push('valuta finns')}else gaps.push('valuta');
 if(datum&&num(datum.price)>0){score+=18;reasons.push(cls.pricing==='nav'?'NAV finns':'kurs finns');score+=confidenceAgeScore(quoteTimestamp(datum),cls.pricing)}else gaps.push(cls.pricing==='nav'?'NAV':'kurs');
 const provider=String(datum?.provider||'');if(datum&&/Finnhub|Twelve Data|Alpha Vantage|ECB|OpenFIGI|Global Registry/i.test(provider)){score+=6;reasons.push('känd källa')}else if(datum){score+=3;reasons.push('lokal källa')}
 if(diag.lastError)score-=6;
 score=Math.max(0,Math.min(100,Math.round(score)));
 const level=score>=85?'verified':score>=65?'probable':score>=45?'uncertain':'manual';
 const label=level==='verified'?'Verifierad data':level==='probable'?'Sannolik data':level==='uncertain'?'Osäker data':'Manuell kontroll krävs';
 return {key:h._key,name:h._name,account:h._account,score,level,label,reasons,gaps,updatedAt:new Date().toISOString(),sourceAge:datum?quoteAgeLabel(datum):'saknas',pricing:cls.pricing,lastError:diag.lastError||''};
}
function runDataConfidenceEngine({reason='manual'}={}){
 const rows=canonicalHoldings().map(confidenceForHolding),items=Object.fromEntries(rows.map(x=>[x.key,x]));
 const weightedDen=canonicalHoldings().reduce((s,h)=>s+(h._value||0),0)||rows.length||1;
 const portfolioScore=Math.round(canonicalHoldings().reduce((s,h)=>s+(items[h._key]?.score||0)*(h._value||1),0)/weightedDen);
 const priority=rows.filter(x=>x.score<75).sort((a,b)=>a.score-b.score).map(x=>({key:x.key,name:x.name,score:x.score,label:x.label,gaps:x.gaps.slice(0,4)}));
 const state={version:'11.12.0',lastRun:new Date().toISOString(),reason,portfolioScore,verified:rows.filter(x=>x.level==='verified').length,probable:rows.filter(x=>x.level==='probable').length,uncertain:rows.filter(x=>x.level==='uncertain').length,manualReview:rows.filter(x=>x.level==='manual').length,items,priority};
 persistDataConfidence(state);return state;
}
function confidenceForKey(key){return dataConfidenceState().items?.[key]||canonicalHoldings().find(h=>h._key===key)&&confidenceForHolding(canonicalHoldings().find(h=>h._key===key))}
function confidenceGuardedStatus(intel,h){const c=confidenceForKey(h._key);if(!c)return intel.status;if(c.score<45)return 'Kontrollera manuellt';if(c.score<65&&intel.status==='Öka kandidat')return 'Bevaka';return intel.status}
function runAutonomousPortfolioAnalysis({reason='automatic'}={}){
 const confidence=runDataConfidenceEngine({reason});
 const ip=intelligencePortfolio(),state=autonomousIntelligenceState();
 const portfolio=runAutonomousPortfolioScan({reason,force:reason==='manual'});
 const next={...state,lastRun:new Date().toISOString(),status:'success',message:`Datatillit ${confidence.portfolioScore}/100 · ${portfolio.message} · Portfolio Intelligence ${ip.grade} ${ip.score}`,runs:num(state.runs)+1,reason};
 persistAutonomousIntelligence(next);return {confidence,intelligence:ip,portfolio,state:next};
}
function shouldAutoSync(){const cfg=providerConfig(),hasProvider=Boolean(cfg.twelveDataKey||cfg.alphaVantageKey||cfg.finnhubKey||cfg.enableStooq),sync=liveSyncState(),last=Date.parse(sync.lastSuccess||'')||0;return navigator.onLine&&hasProvider&&Date.now()-last>30*60*1000&&sync.status!=='syncing'}
async function runAutomaticIntelligenceCycle(reason='app-open'){
 const state=autonomousIntelligenceState(),last=Date.parse(state.lastRun||'')||0;if(reason!=='app-open'&&Date.now()-last<5*60*1000)return;
 runAutonomousPortfolioAnalysis({reason:`${reason}:local`});render();
 if(!shouldAutoSync())return;
 persistAutonomousIntelligence({...autonomousIntelligenceState(),lastAutoSyncAttempt:new Date().toISOString(),status:'syncing',message:'Uppdaterar live-data automatiskt…'});render();
 try{await syncLiveData({automatic:true});const after=runAutonomousPortfolioAnalysis({reason:`${reason}:after-live-sync`});persistAutonomousIntelligence({...after.state,lastAutoSyncSuccess:new Date().toISOString(),status:'success'});render()}catch(e){persistAutonomousIntelligence({...autonomousIntelligenceState(),status:'partial',message:`Lokal analys klar. Automatisk livesynk misslyckades: ${String(e?.message||e)}`});render()}
}
function dataConfidencePanel(){const st=dataConfidenceState(),auto=autonomousIntelligenceState(),rows=(st.priority||[]).slice(0,8).map(x=>`<div class="confidencePriority"><div><b>${esc(x.name)}</b><small>${esc(x.label)} · ${x.gaps.map(esc).join(', ')||'inga tydliga luckor'}</small></div><strong>${x.score}/100</strong></div>`).join('');return `<section class="section confidenceEngine"><div class="sectionHead"><div><div class="eyebrow">Data Confidence Engine 11.12</div><h2>Tillit före starka råd</h2></div><span class="healthScore">${st.portfolioScore}/100</span></div><p>Identitet, ISIN, ticker, börs, valuta, prismodell, källa och färskhet vägs ihop. Wealth Coach tonar automatiskt ned råd när underlaget är svagt.</p><div class="grid"><div class="card metric"><span>Verifierad data</span><b>${st.verified}</b></div><div class="card metric"><span>Sannolik data</span><b>${st.probable}</b></div><div class="card metric"><span>Osäker data</span><b>${st.uncertain}</b></div><div class="card metric"><span>Manuell kontroll</span><b>${st.manualReview}</b></div></div><div class="autoIntelligenceStatus"><b>Automatisk portfölj-AI</b><span class="syncStatus ${esc(auto.status)}">${esc(auto.status)}</span><p>${esc(auto.message)}</p><small>Senast körd: ${auto.lastRun?new Date(auto.lastRun).toLocaleString('sv-SE'):'aldrig'}</small></div><button id="runConfidence" class="primary" type="button">Kör analysen nu</button>${rows?`<div class="confidencePriorityList"><h3>Prioriterade dataåtgärder</h3>${rows}</div>`:'<div class="notice okbox">Inga innehav kräver prioriterad datakontroll.</div>'}<p class="disclaimer">Ändrar aldrig antal, GAV, marknadsvärde, kredit, transaktioner eller Portfolio Ledger.</p></section>`}

function adaptiveDataPanel(){const st=adaptiveDataState(),x=st.summary||{};return `<section class="section adaptiveDataEngine"><div class="sectionHead"><div><div class="eyebrow">Adaptive Data Engine 11.11</div><h2>Rätt kurs för rätt instrument</h2></div><span class="healthScore">${num(x.updated)}/${num(x.tested)}</span></div><p>Motorn testar verifierad identitet, ISIN, alternativa tickerformat, providers och NAV-modell. Fungerande rutter sparas lokalt och används först nästa gång.</p><div class="grid"><div class="card metric"><span>Uppdaterade</span><b>${num(x.updated)}</b></div><div class="card metric"><span>Räddade via alternativ ticker</span><b>${num(x.recovered)}</b></div><div class="card metric"><span>Behöver NAV</span><b>${num(x.navRequired)}</b></div><div class="card metric"><span>Utan träff</span><b>${num(x.failed)}</b></div></div><button id="runAdaptiveData" class="primary" type="button">Kör Adaptive Data Engine</button><p class="disclaimer">Endast read-only live-data och lyckade provider-rutter sparas. Antal, GAV, marknadsvärde, transaktioner och Ledger ändras aldrig.</p></section>`}
function market(){
 const registry=providerRegistry(),providerHealth=providerHealthSummary(),cache=cacheHealth(),sync=liveSyncState(),foundation=foundationHealth(),mapping=instrumentMappingCoverage(),mapIntel=mappingIntelligenceStats(),steward=autoStewardSummary();
 const providerCards=providerHealth.items.map(p=>`<article class="providerHealthCard ${esc(p.status)}"><div><b>${esc(p.name)}</b><span>${esc(p.status)}</span></div><strong>${p.reliability}%</strong><small>${num(p.attempts)} försök · ${num(p.successes)} lyckade · ${num(p.failures)} fel · ${num(p.latencyMs)} ms</small>${p.lastError?`<em>${esc(p.lastError)}</em>`:''}</article>`).join('');
 return `<section class="hero"><div class="eyebrow">Live Intelligence 11.13.0</div><h2>Marknad & live-data</h2><p>Read-only marknadsdata från flera utbytbara providers. Din lokala portföljdata ändras aldrig av live-lagret.</p><div class="liveHeroStats"><div><span>Synkstatus</span><b>${esc(sync.status)}</b></div><div><span>Senaste synk</span><b>${sync.lastSuccess?new Date(sync.lastSuccess).toLocaleString('sv-SE'):'Aldrig'}</b></div><div><span>Instrumentmappning</span><b>${mapping.complete}/${mapping.total}</b></div><div><span>Cache</span><b>${cache.items} kurser</b></div></div></section>
 <section class="section liveSyncPanel"><div class="sectionHead"><div><div class="eyebrow">Adaptive Provider Network</div><h2>Synkronisering</h2></div><span class="syncStatus ${esc(sync.status)}">${esc(sync.status)}</span></div><p>${esc(sync.message)}</p><div class="foundationActions"><button id="syncLive" class="primary" type="button">Synkronisera live-data</button><button id="providerSettings" class="secondary" type="button">Providerinställningar</button><button id="discoverMappings" class="primary" type="button">Identifiera återstående instrument</button><button id="reviewMappings" class="secondary" type="button">Granska osäkra kopplingar</button></div><p class="routeLine"><b>Aktiv rutt:</b> ${esc(providerRouteLabel())}</p>${sync.errors?.length?`<div class="warning"><b>Senaste fel</b><p>${sync.errors.map(esc).join('<br>')}</p></div>`:''}</section>
 ${dataConfidencePanel()}${adaptiveDataPanel()}<section class="section adaptivePanel"><div class="sectionHead"><div><div class="eyebrow">Adaptive Provider Network 11.5</div><h2>Intelligent fallback</h2></div><span class="healthScore">${providerRouteLabel().split(' → ').length} steg</span></div><p>Twelve Data och andra providers pausas automatiskt vid rate limit. Finnhub kan aktiveras som extra extern fallback. Stooq Legacy är avstängd som standard.</p><div class="grid"><div class="card metric"><span>Rate-limit skydd</span><b>15 min cooldown</b></div><div class="card metric"><span>Stooq Legacy</span><b>${providerConfig().enableStooq?'Aktiv':'Avstängd'}</b></div></div></section>
 <section class="section stewardPanel"><div class="sectionHead"><div><div class="eyebrow">Auto Data Steward 11.4</div><h2>Automatiskt dataunderhåll</h2></div><span class="syncStatus ${esc(steward.status)}">${esc(steward.status)}</span></div><p>Säkra tickerkopplingar läggs till automatiskt, misstänkta dubbletter återställs och cache valideras högst en gång per dygn.</p><div class="grid"><div class="card metric"><span>Senast körd</span><b class="smallMetric">${esc(steward.lastRunLabel)}</b></div><div class="card metric"><span>Senaste resultat</span><b class="smallMetric">${esc(steward.message)}</b></div></div><button id="runSteward" class="secondary" type="button">Kör dataunderhåll nu</button></section>
 ${identityRebuildPanel()}
 ${globalResolverPanel()}
 <section class="section registryPanel"><div class="sectionHead"><div><div class="eyebrow">Global Instrument Registry 11.6</div><h2>Identity Engine</h2></div><span class="healthScore">${instrumentRegistryState().entries} poster</span></div><p>Primär ticker, ISIN, börs, valuta och providersymboler kopplas ihop i ett lokalt, versionsstyrt register.</p><div class="grid"><div class="card metric"><span>Igenkända</span><b>${instrumentRegistryState().recognized}</b></div><div class="card metric"><span>Oidentifierade</span><b>${instrumentRegistryState().unrecognized}</b></div><div class="card metric"><span>Senast körd</span><b>${instrumentRegistryState().lastRun?new Date(instrumentRegistryState().lastRun).toLocaleTimeString('sv-SE',{hour:'2-digit',minute:'2-digit'}):'—'}</b></div><div class="card metric"><span>Registerversion</span><b>11.6.1</b></div></div><button id="runRegistry" class="primary" type="button">Kör Identity Engine nu</button></section>
 <section class="section mappingIntel"><div class="sectionHead"><h2>Mapping Intelligence</h2><span class="healthScore">${mapIntel.verified}/${mapIntel.total}</span></div><div class="grid"><div class="card metric"><span>Verifierade</span><b>${mapIntel.verified}</b></div><div class="card metric"><span>För granskning</span><b>${mapIntel.review}</b></div><div class="card metric"><span>Oidentifierade</span><b>${mapIntel.unmapped}</b></div><div class="card metric"><span>Täckning</span><b>${mapIntel.total?Math.round((mapIntel.total-mapIntel.unmapped)/mapIntel.total*100):0}%</b></div></div></section>
 ${universalIdentityPanel()}
 ${fundEtfPanel()}
 <section class="section"><div class="sectionHead"><h2>Provider Health</h2><span class="healthScore">${providerHealth.score}/100</span></div><div class="providerHealthGrid">${providerCards}</div></section>
 <section class="section"><h2>Cache Engine</h2><div class="grid"><div class="card metric"><span>Färska</span><b>${cache.fresh}</b></div><div class="card metric"><span>Fördröjda</span><b>${cache.delayed}</b></div><div class="card metric"><span>Gamla</span><b>${cache.stale}</b></div><div class="card metric"><span>Träffgrad</span><b>${cache.hitRate}%</b></div></div></section>
 <section class="section"><h2>Foundation Health</h2><div class="grid"><div class="card metric"><span>Helhetspoäng</span><b>${foundation.score}/100</b></div><div class="card metric"><span>Providers redo</span><b>${foundation.ready}/${foundation.registry.length}</b></div><div class="card metric"><span>Mappningstäckning</span><b>${foundation.coverage}%</b></div><div class="card metric"><span>Live-lager</span><b>${esc(registry.status)}</b></div></div></section>`;
}

function analysis(){const ip=intelligencePortfolio();let items=ip.items;if(intelFilter==='buy')items=items.filter(x=>x.status==='Öka kandidat');if(intelFilter==='watch')items=items.filter(x=>/Bevaka|Komplettera/.test(x.status));if(intelFilter==='risk')items=items.filter(x=>x.risk<45||x.weight>12);if(intelFilter==='quality')items=items.filter(x=>x.score>=70);items.sort((a,b)=>b.score-a.score);const strengths=[],weaknesses=[];if(ip.data>=70)strengths.push('God datatäckning för lokal analys');if(ip.high)strengths.push(`${ip.high} innehav med stark intelligensprofil`);if(canonicalHoldings().some(x=>/fond|etf/i.test(x._type)))strengths.push('Fonder och ETF:er bidrar till riskspridning');if(ip.risky)weaknesses.push(`${ip.risky} innehav behöver risk- eller koncentrationsgranskning`);if(ip.data<80)weaknesses.push('Ticker, sektor eller fundamenta saknas för delar av portföljen');if(Object.values(admin.credits||{}).some(x=>num(x.used)>0))weaknesses.push('Utnyttjad kredit ska vägas in före nya köp');return `<section class="hero"><div class="eyebrow">Mästarklass OS 11.15.23 · Resolver Performance & Recovery</div><h2>Från score till genomförbar månadsplan.</h2><p>11.0 bevarar Portfolio Intelligence, målsimulering, riskradar och kapitalallokering. Allt är lokalt, read-only och spårbart.</p><div class="ratingHero"><div><span class="grade">${ip.grade}</span><b>${ip.score}/100</b><small>${starsFor(ip.score)}</small></div><div class="dimensionGrid"><span>Kvalitet <b>${ip.dimensions.quality}</b></span><span>Risk <b>${ip.dimensions.risk}</b></span><span>Värdering <b>${ip.dimensions.valuation}</b></span><span>Utdelning <b>${ip.dimensions.dividend}</b></span><span>Data <b>${ip.dimensions.data}</b></span></div></div></section><div class="grid"><div class="card metric"><span>Starka profiler</span><b>${ip.high}</b></div><div class="card metric"><span>Bevaka</span><b>${ip.watch}</b></div><div class="card metric"><span>Risk / koncentration</span><b>${ip.risky}</b></div><div class="card metric"><span>Datatäckning</span><b>${ip.data} %</b></div></div><section class="section"><h2>Portföljens läge</h2><div class="insightGrid"><div class="insight good"><b>Styrkor</b>${strengths.map(x=>`<p>✓ ${esc(x)}</p>`).join('')||'<p>Mer verifierad data behövs.</p>'}</div><div class="insight caution"><b>Att förbättra</b>${weaknesses.map(x=>`<p>• ${esc(x)}</p>`).join('')||'<p>Inga tydliga strukturvarningar.</p>'}</div></div></section>${autonomousPortfolioPanel()}${decisionCenter(ip)}<section class="section"><div class="sectionHead"><h2>Intelligenskort</h2><small>${items.length} av ${ip.items.length}</small></div><div class="intelFilters"><button data-intel-filter="all" class="${intelFilter==='all'?'activeChip':''}">Alla</button><button data-intel-filter="buy" class="${intelFilter==='buy'?'activeChip':''}">Öka kandidater</button><button data-intel-filter="quality" class="${intelFilter==='quality'?'activeChip':''}">Hög kvalitet</button><button data-intel-filter="watch" class="${intelFilter==='watch'?'activeChip':''}">Bevaka</button><button data-intel-filter="risk" class="${intelFilter==='risk'?'activeChip':''}">Risk</button></div><div class="intelList">${items.map(intelCard).join('')||'<div class="empty">Inga innehav matchar filtret.</div>'}</div></section>`}
function ideas(){const a=[...(data.ideaBank||[]),...(data.aiRadar||[])];return `<section class="hero"><div class="eyebrow">Idébank</div><h2>Idéer som måste förtjäna sin plats</h2></section><div class="list">${a.map(x=>`<div class="card"><h3>${esc(x.title||x.name||'Idé')}</h3><p>${esc(x.text||x.note||'')}</p></div>`).join('')||'<div class="empty">Idébanken är tom.</div>'}</div>`}
function goals(){const gs=goalIntelligence();return `<section class="hero"><div class="eyebrow">Goal Intelligence 10.8</div><h2>Bygg frihet steg för steg</h2><p>Se hur nuvarande kapital och sparande kan föra dig mot nästa milstolpar.</p></section><section class="section"><h2>Prognoser</h2><div class="goalTimeline">${gs.map(g=>`<div class="goalForecast"><div><b>${g.label}</b><small>${pct(g.progress)} uppnått</small></div><strong>${fmtYears(g.years)}</strong></div>`).join('')}</div></section><div class="card form"><label>Kapitalmål<input id="capitalGoal" inputmode="numeric" value="${num(data.goals.capital)}"></label><label>Årligt utdelningsmål<input id="divGoal" inputmode="numeric" value="${num(data.goals.annualDividend)}"></label><label>Månadssparande<input id="monthly" inputmode="numeric" value="${num(data.portfolio.monthly||data.monthlyPlan.total)}"></label><button id="saveGoals" class="primary">Spara mål lokalt</button></div>`}
function more(){return `<section class="hero"><div class="eyebrow">Säkerhet & data</div><h2>Du äger din data</h2><p>Backupen innehåller basportfölj, administrationslager, kredit och transaktioner.</p></section><div class="card"><h2>Full lokal backup</h2><button id="exportBtn" class="primary">Exportera full backup</button><label class="file">Importera JSON-backup<input id="importFile" type="file" accept=".json,application/json"></label><p><small>Datakälla: ${esc(sourceKey||'ingen lokal portfölj hittad')}</small></p></div>`}
function showHolding(i){const h=canonicalHoldings().find(x=>x._i===i),t=total();if(!h)return;const intel=intelligenceFor(h),assetClass=classifyInstrument(h),marketDatum=marketDataFor(h);openModal(`<div class="eyebrow">Innehavsdetalj</div><h2>${esc(h._name)}</h2><div class="grid"><div class="card metric"><span>Konto</span><b>${esc(h._account)}</b></div><div class="card metric"><span>Tillgångsslag</span><b>${esc(h._type)}</b></div><div class="card metric"><span>Antal</span><b>${dec(h._qty)||'—'}</b></div><div class="card metric"><span>GAV</span><b>${dec(h._gav)||'—'}</b></div><div class="card metric"><span>Marknadsvärde</span><b>${kr(h._value)}</b></div><div class="card metric"><span>Portföljvikt</span><b>${pct(t?h._value/t*100:0)}</b></div><div class="card metric"><span>Valuta</span><b>${esc(text(h,['currency','valuta'],'SEK'))}</b></div><div class="card metric"><span>Värdemetod</span><b>${esc(h._method)}</b></div><div class="card metric"><span>Värdekälla</span><b>${esc(h._valuation?.source||'—')}</b></div><div class="card metric"><span>Dagens förändring</span><b class="${num(h._valuation?.dayChange)>=0?'positive':'negative'}">${num(h._valuation?.dayChange)>=0?'+':''}${kr(h._valuation?.dayChange||0)}</b></div></div>${(()=>{const q=marketDatum;return q?`<section class="liveQuoteDetail"><div class="sectionHead"><h3>${assetClass.pricing==='nav'?'Senaste NAV':'Livekurs'}</h3><span class="liveProvider">${esc(q.provider||'Live cache')}</span></div><div class="grid"><div class="card metric"><span>Kurs</span><b>${dec(q.price)} ${esc(q.currency||text(h,['currency'],'SEK'))}</b></div><div class="card metric"><span>Idag</span><b class="${num(q.change)>=0?'positive':'negative'}">${num(q.change)>=0?'+':''}${dec(q.change)} · ${num(q.changePct)>=0?'+':''}${pct(q.changePct)}</b></div><div class="card metric"><span>Källa</span><b>${esc(q.provider||'—')}</b></div><div class="card metric"><span>Ålder</span><b>${quoteAgeLabel(q)}</b></div></div></section>`:''})()}${(()=>{const m=liveFoundation.mappings[h._key]||{},q=liveQuoteFor(h);return `<section class="instrumentIdentity"><div class="sectionHead"><h3>Live-identitet</h3><span class="liveProvider">${esc(q?.provider||(assetClass.pricing==='nav'?'NAV saknas':'Ej synkad'))}</span></div><div class="identityGrid"><span>Ticker <b>${esc(m.ticker||text(h,['ticker','symbol'],'—'))}</b></span><span>ISIN <b>${esc(m.isin||text(h,['isin','ISIN'],'—'))}</b></span><span>Börs <b>${esc(m.exchange||text(h,['exchange','bors','börs'],'—'))}</b></span><span>Valuta <b>${esc(m.currency||text(h,['currency','valuta'],'SEK'))}</b></span><span>Instrumentklass <b>${esc(assetClass.label)}</b></span><span>Prismodell <b>${assetClass.pricing==='nav'?'Senaste NAV':'Börskurs'}</b></span><span>Datakvalitet <b>${q?`${num(q.quality)||70}/100`:(assetClass.pricing==='nav'?'Identitet verifierad · NAV saknas':'Ej verifierad')}</b></span><span>Senast uppdaterad <b>${q?quoteAgeLabel(q):'—'}</b></span></div></section>`})()}${(()=>{const d=adaptiveDiagnosticFor(h);return `<section class="dataDiagnostics"><div class="sectionHead"><h3>Datadiagnostik</h3><span class="diagBadge ${d.hasData?'ok':'warn'}">${d.hasData?'Data hittad':'Åtgärd behövs'}</span></div><div class="diagnosticList"><p>${d.identity?'🟢':'🟡'} Identitet ${d.identity?'verifierad':'behöver verifieras'}</p><p>${d.hasIsin?'🟢':'🟡'} ISIN ${d.hasIsin?'finns':'saknas'}</p><p>${d.hasTicker?'🟢':'🟡'} Ticker ${d.hasTicker?'finns':'saknas'}</p><p>${d.hasData?'🟢':'🔴'} ${d.pricing==='nav'?'NAV':'Livekurs'} ${d.hasData?'hittad':'saknas'}</p>${d.successfulRoute?`<p>✅ Fungerande rutt: ${esc(d.successfulRoute)}</p>`:''}${d.tested.length?`<p>Testade: ${d.tested.map(esc).join(' · ')}</p>`:''}${d.lastError?`<p class="negative">Senaste fel: ${esc(d.lastError)}</p>`:''}</div><div class="notice"><b>Rekommenderad åtgärd</b><p>${esc(d.action)}</p></div></section>`})()}${(()=>{const c=confidenceForKey(h._key)||confidenceForHolding(h);return `<section class="confidenceDetail ${esc(c.level)}"><div class="sectionHead"><h3>Datatillit</h3><span class="scorePill">${c.score}/100</span></div><p><b>${esc(c.label)}</b> · ${esc(c.reasons.join(' · ')||'underlag saknas')}</p>${c.gaps.length?`<p class="negative">Saknas: ${c.gaps.map(esc).join(', ')}</p>`:''}</section>`})()}<section class="intelDetail"><div class="sectionHead"><h3>Portfolio Intelligence</h3><span class="scorePill">${intel.grade} ${intel.score}</span></div><p><b>${esc(intel.status)}</b> · ${esc(intel.reasons.join(' · '))}</p><div class="scoreGrid"><span>Kvalitet <b>${intel.quality}</b></span><span>Riskkontroll <b>${intel.risk}</b></span><span>Värdering <b>${intel.valuation}</b></span><span>Utdelning <b>${intel.dividend}</b></span><span>Datakvalitet <b>${intel.dataQuality}</b></span><span>Tillit <b>${intel.confidence}%</b></span></div></section><button class="primary" data-edit-key="${esc(h._key)}">Redigera innehav</button><button class="secondary topGap" data-tx-key="${esc(h._key)}">Registrera köp/sälj</button><section class="section topGap"><h3>Historik</h3><div class="list">${holdingLedger(h._key).slice(0,12).map(x=>`<div class="auditRow"><b>${esc(x.label)}</b><small>${new Date(x.date).toLocaleString('sv-SE')} · ${esc(x.kind)}</small></div>`).join('')||'<div class="empty">Ingen historik ännu.</div>'}</div></section>`)}
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
function addHolding(){const h={_key:'new-'+Date.now(),name:document.getElementById('newName').value.trim(),account:document.getElementById('newAccount').value.trim()||'Okänt konto',assetType:document.getElementById('newType').value.trim()||'Övrigt',currency:document.getElementById('newCurrency').value.trim().toUpperCase()||'SEK',quantity:num(document.getElementById('newQty').value),gav:num(document.getElementById('newGav').value),ticker:document.getElementById('newTicker').value.trim(),marketValueSEK:num(document.getElementById('newValue').value)};if(!h.name)return alert('Ange värdepapprets namn.');admin.newHoldings.push(h);audit('holding-add',`Lade till ${h.name}`,null,{key:h._key,value:h});persistAdmin();runAutoDataSteward({force:false,reason:'holding-added'});render()}
function saveCredit(){const account=document.getElementById('creditAccount').value.trim();if(!account)return alert('Ange konto.');const before=admin.credits[account]?{...admin.credits[account]}:null,after={limit:num(document.getElementById('creditLimit').value),used:num(document.getElementById('creditUsed').value),rate:num(document.getElementById('creditRate').value)};admin.credits[account]=after;audit('credit-edit',`Kredit ${account}`,{account,value:before},{account,value:after});persistAdmin();render()}
function saveTransaction(){const key=document.getElementById('txHolding').value,h=canonicalHoldings().find(x=>x._key===key);if(!h)return;const type=document.getElementById('txType').value,q=num(document.getElementById('txQty').value),price=num(document.getElementById('txPrice').value),fee=num(document.getElementById('txFee').value),currency=document.getElementById('txCurrency').value.trim().toUpperCase()||text(h,['currency'],'SEK'),fx=num(document.getElementById('txFx').value)||1;if(q<=0||price<0)return alert('Ange ett giltigt antal och pris.');const oldQ=h._qty,oldG=h._gav;let newQ=oldQ,newG=oldG;if(type==='buy'){newQ=oldQ+q;newG=newQ?((oldQ*oldG)+(q*price)+(fee/fx))/newQ:price}else{if(q>oldQ)return alert('Du kan inte sälja fler enheter än innehavet innehåller.');newQ=oldQ-q;newG=newQ?oldG:0}const before=admin.overrides[key]?{...admin.overrides[key]}:null;admin.overrides[key]={...(admin.overrides[key]||{}),quantity:newQ,gav:newG,currency};const tx={id:'tx-'+Date.now(),type,date:document.getElementById('txDate').value||today(),key,name:h._name,account:h._account,quantity:q,price,fee,currency,fx,previousQuantity:oldQ,previousGav:oldG,newQuantity:newQ,newGav:newG,overrideBefore:before};transactions.unshift(tx);persistTx();audit('transaction',`${type==='buy'?'Köp':'Sälj'} ${h._name}`,null,{txId:tx.id});persistAdmin();render()}
function deleteTransaction(id){const tx=transactions.find(x=>x.id===id);if(!tx||!confirm('Radera transaktionen och återställ antal/GAV till läget före den?'))return;if(tx.overrideBefore)admin.overrides[tx.key]=tx.overrideBefore;else delete admin.overrides[tx.key];transactions=transactions.filter(x=>x.id!==id);persistTx();audit('transaction-delete',`Raderade transaktion ${tx.name}`,null,{id});persistAdmin();render()}
function undoLast(){const x=admin.audit[0];if(!x)return;if(!confirm(`Ångra senaste ändringen: ${x.label}?`))return;if(x.kind==='holding-edit'){if(x.before?.value)admin.overrides[x.before.key]=x.before.value;else delete admin.overrides[x.after.key]}else if(x.kind==='holding-add'){admin.newHoldings=admin.newHoldings.filter(h=>h._key!==x.after.key)}else if(x.kind==='credit-edit'){if(x.before?.value)admin.credits[x.before.account]=x.before.value;else delete admin.credits[x.after.account]}else return alert('Denna loggpost ångras via transaktionshistoriken.');admin.audit.shift();persistAdmin();render()}
function bindModal(){const {root,close}=modalParts();if(!root)return;close.onclick=()=>closeModal();root.onclick=e=>{if(e.target===root)closeModal()};document.querySelector('[data-edit-key]')?.addEventListener('click',e=>editHolding(e.currentTarget.dataset.editKey));document.querySelector('[data-tx-key]')?.addEventListener('click',e=>{const key=e.currentTarget.dataset.txKey;portfolioTab='transactions';closeModal();render();setTimeout(()=>{const sel=document.getElementById('txHolding');if(sel)sel.value=key},0)});document.getElementById('saveEdit')?.addEventListener('click',e=>saveEdit(e.currentTarget.dataset.key))}
function bind(){document.getElementById('runAutonomousScan')?.addEventListener('click',()=>{runAutonomousPortfolioAnalysis({reason:'manual'});render()});document.getElementById('runConfidence')?.addEventListener('click',()=>{runAutonomousPortfolioAnalysis({reason:'manual'});render()});document.getElementById('runAdaptiveData')?.addEventListener('click',syncLiveData);document.getElementById('runGlobalResolver')?.addEventListener('click',runGlobalResolver);document.getElementById('stopGlobalResolver')?.addEventListener('click',requestResolverStop);document.getElementById('reviewGlobalResolver')?.addEventListener('click',openGlobalResolverReview);document.getElementById('copyResolverTrace')?.addEventListener('click',async()=>{const text=resolverTraceText();try{await navigator.clipboard.writeText(text);alert('Resolverloggen kopierades.')}catch{openModal(`<h2>Resolverlogg</h2><textarea style="width:100%;min-height:60vh">${esc(text)}</textarea>`)}});document.getElementById('clearResolverTrace')?.addEventListener('click',()=>{if(confirm('Rensa endast resolverloggen?'))clearResolverTrace()});document.getElementById('runIdentityRebuild')?.addEventListener('click',()=>{if(!confirm('Bygga om endast det lokala read-only identitetsregistret? Manuella kopplingar och portföljdata bevaras.'))return;const r=runIdentityRebuild();alert(`Identity Rebuild klar. ${r.rebuilt} identiteter byggda · ${r.removedUnsafe} osäkra återställda · ${r.review} att granska.`);render()});document.getElementById('openIdentityReview')?.addEventListener('click',openIdentityReview);document.getElementById('openFundNav')?.addEventListener('click',openFundNavEditor);document.getElementById('classifyAssets')?.addEventListener('click',()=>{const n=applyAssetClassifications();alert(`${n} instrument klassificerades för rätt prismodell.`);render()});document.getElementById('runUniversalIdentity')?.addEventListener('click',()=>{const r=scanUniversalIdentity();alert(`Universal Identity klar. ${r.verified} verifierade · ${r.review} att granska · ${r.conflicts} konflikter.`);render()});document.getElementById('applyUniversalIdentity')?.addEventListener('click',()=>{const r=applyUniversalSuggestions();alert(`${r.applied||0} säkra identitetsförslag tillämpades.`);render()});document.getElementById('runRegistry')?.addEventListener('click',()=>{const r=enrichMappingsFromRegistry();alert(`Identity Engine klar. ${r.recognized} igenkända · ${r.enriched} berikade · ${r.corrected||0} felaktiga tickers rättade.`);render()});document.getElementById('syncLive')?.addEventListener('click',syncLiveData);document.getElementById('runSteward')?.addEventListener('click',()=>{const r=runAutoDataSteward({force:true,reason:'manual'});alert(`Dataunderhåll klart. ${r.message}`);render()});document.getElementById('discoverMappings')?.addEventListener('click',discoverInstrumentMappings);document.getElementById('providerSettings')?.addEventListener('click',openProviderSettings);document.getElementById('reviewMappings')?.addEventListener('click',openMappingEditor);document.getElementById('suggestMappings')?.addEventListener('click',()=>{const n=applySafeMappingSuggestions();alert(n?`${n} tickerförslag lades till i live-lagret.`:'Inga nya säkra förslag hittades.');render()});document.getElementById('buildMappings')?.addEventListener('click',()=>{buildInstrumentMappings();render()});document.getElementById('validateLive')?.addEventListener('click',()=>{validateLiveCache();render()});document.querySelectorAll('[data-intel-filter]').forEach(b=>b.onclick=()=>{intelFilter=b.dataset.intelFilter;render();scrollTo(0,0)});document.querySelectorAll('[data-intel-index]').forEach(b=>b.onclick=()=>showHolding(Number(b.dataset.intelIndex)));document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=e=>{e.preventDefault();portfolioTab=b.dataset.tab||'overview';screen='portfolio';render();requestAnimationFrame(()=>scrollTo({top:0,left:0,behavior:'auto'}))});document.querySelectorAll('[data-tabgo]').forEach(b=>b.onclick=e=>{e.preventDefault();portfolioTab=b.dataset.tabgo||'overview';screen='portfolio';render();requestAnimationFrame(()=>scrollTo({top:0,left:0,behavior:'auto'}))});const s=document.getElementById('search');if(s)s.oninput=e=>{query=e.target.value;render()};const tf=document.getElementById('typeFilter');if(tf)tf.onchange=e=>{typeFilter=e.target.value;render()};const af=document.getElementById('accountFilter');if(af)af.onchange=e=>{accountFilter=e.target.value;render()};const sm=document.getElementById('sortMode');if(sm)sm.onchange=e=>{sortMode=e.target.value;render()};document.querySelectorAll('[data-index]').forEach(b=>b.onclick=()=>showHolding(Number(b.dataset.index)));document.getElementById('openEdit')?.addEventListener('click',()=>editHolding(document.getElementById('adminHolding').value));document.getElementById('addHolding')?.addEventListener('click',addHolding);document.getElementById('saveCredit')?.addEventListener('click',saveCredit);document.getElementById('saveTx')?.addEventListener('click',saveTransaction);document.getElementById('saveLedger')?.addEventListener('click',saveManualLedger);document.querySelectorAll('[data-ledger-id]').forEach(b=>b.onclick=()=>showLedger(b.dataset.ledgerId));document.querySelectorAll('[data-delete-tx]').forEach(b=>b.onclick=()=>deleteTransaction(b.dataset.deleteTx));document.getElementById('undoAudit')?.addEventListener('click',undoLast);const sg=document.getElementById('saveGoals');if(sg)sg.onclick=()=>{data.goals.capital=num(document.getElementById('capitalGoal').value);data.goals.annualDividend=num(document.getElementById('divGoal').value);data.portfolio.monthly=num(document.getElementById('monthly').value);safeSet(SETTINGS_KEY,JSON.stringify({goals:data.goals,portfolio:{monthly:data.portfolio.monthly}}));render()};const ex=document.getElementById('exportBtn');if(ex)ex.onclick=()=>{const payload={version:VERSION,exportedAt:new Date().toISOString(),sourceKey,data,admin,transactions,ledger};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='mastarklass-os-full-backup-'+today()+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};const im=document.getElementById('importFile');if(im)im.onchange=async e=>{const f=e.target.files?.[0];if(!f)return;const x=parse(await f.text());if(!x)return alert('Filen kunde inte läsas.');if(x.data&&looksLikePortfolio(x.data))safeSet(DATA_KEY,JSON.stringify(x.data));if(x.admin)safeSet(ADMIN_KEY,JSON.stringify(x.admin));if(x.transactions)safeSet(TX_KEY,JSON.stringify(x.transactions));if(x.ledger)safeSet(LEDGER_KEY,JSON.stringify(x.ledger));location.reload()}}
function render(){
 const app=document.getElementById('app');if(!app)return;
 nav();
 const views={home,portfolio,market,analysis,ideas,goals,more};
 try{
  const view=views[screen]||home;
  app.innerHTML=view();
 }catch(error){
  console.error(`Render failed: ${screen}`,error);
  app.innerHTML=`<section class="fatal"><b>Vyn ${esc(screen)} kunde inte renderas.</b><p>${esc(error?.message||'Okänt renderingsfel')}</p><button type="button" class="primary" data-screen="home">Till Hem</button></section>`;
 }
 const meta=document.getElementById('headerMeta');if(meta)meta.textContent=`${canonicalHoldings().length} innehav · Portfolio Intelligence · ${VERSION}`;
 bind();
}

function installInteractionRouter(){
 if(document.documentElement.dataset.mkInteractionRouter==='1')return;
 document.documentElement.dataset.mkInteractionRouter='1';
 document.addEventListener('click',event=>{
  const target=event.target.closest('button,[data-screen],[data-tab],[data-tabgo],[data-index],[data-intel-index],[data-ledger-id]');
  if(!target)return;
  if(target.dataset.screen){event.preventDefault();navigateTo(target.dataset.screen);return}
  if(target.dataset.tab||target.dataset.tabgo){event.preventDefault();screen='portfolio';portfolioTab=target.dataset.tab||target.dataset.tabgo||'overview';if(location.hash!=='#portfolio')history.pushState(null,'','#portfolio');render();requestAnimationFrame(()=>scrollTo({top:0,left:0,behavior:'auto'}));return}
  if(target.dataset.index!==undefined){event.preventDefault();showHolding(Number(target.dataset.index));return}
  if(target.dataset.intelIndex!==undefined){event.preventDefault();showHolding(Number(target.dataset.intelIndex));return}
  if(target.dataset.ledgerId){event.preventDefault();showLedger(target.dataset.ledgerId);return}
 },true);
}


/* 11.15.23 Permanent Registry Save Fix */
let resolverReviewTab='review';
function verifiedPermanentWrite(key,route,meta={}){
 if(!key||!routeIsUsable(route))return {ok:false,error:'Ogiltig identitet'};
 try{
  const registry=permanentIdentityRegistry(),previous=registry.routes?.[key]||null,now=new Date().toISOString();
  registry.routes=registry.routes||{};
  registry.routes[key]={...previous,...route,locked:true,registryVersion:'11.15.23',savedAt:now,source:meta.source||route.source||'global-resolver-approved'};
  registry.audit=[{date:now,key,provider:route.provider,ticker:route.ticker||'',isin:route.isin||'',exchange:route.exchange||'',currency:route.currency||'',action:previous?'updated':'created'},...(registry.audit||[])].slice(0,500);
  registry.version='11.15.23';registry.updatedAt=now;
  localStorage.setItem(PERMANENT_IDENTITY_KEY,JSON.stringify(registry));
  const check=parse(localStorage.getItem(PERMANENT_IDENTITY_KEY));
  if(!routeIsUsable(check?.routes?.[key]))throw new Error('Direkt återläsning misslyckades');
  return {ok:true,route:check.routes[key],count:Object.keys(check.routes||{}).length};
 }catch(error){return {ok:false,error:error?.message||String(error)}}
}
function candidateValidation(row,candidate){
 const ticker=String(candidate?.ticker||'').trim().toUpperCase(),exchange=String(candidate?.exchange||'').trim(),currency=String(candidate?.currency||row?.currency||'').trim().toUpperCase();
 if(!candidate)return {ok:false,error:'Ingen kandidat vald'};
 if(!ticker&&!validIsin(candidate.isin))return {ok:false,error:'Kandidaten saknar giltig ticker eller ISIN'};
 if(ticker==='0')return {ok:false,error:'Ticker 0 är ogiltig'};
 if(!currency)return {ok:false,error:'Valuta saknas'};
 const account=String(row?.account||'').toLowerCase(),name=String(row?.name||'').toLowerCase();
 if(account.includes('montrose')&&/(usd|usa|united states|american)/i.test(`${currency} ${candidate.name||''} ${exchange}`)===false&&/paypal|broadcom|best buy|mastercard|realty income|taiwan semiconductor/.test(name))return {ok:false,error:'Amerikanskt Montrose-innehav måste ha USA-notering och USD'};
 return {ok:true};
}
function applyResolverSuggestion(key,index=0,{silent=false,rowOverride=null}={}){
 const state=globalResolverState(),row=rowOverride||(state.suggestions||[]).find(x=>x.key===key),candidate=row?.candidates?.[index];
 if(!row||!candidate)return false;
 const validation=candidateValidation(row,candidate);if(!validation.ok){if(!silent)alert(validation.error);return false}
 const current=liveFoundation.mappings[key]||{};
 if(isManualMapping(current)&&!silent&&!confirm('Detta instrument har en manuell koppling. Ersätta den med vald permanent identitet?'))return false;
 const route={provider:candidate.provider,ticker:candidate.ticker||'',isin:candidate.isin||'',exchange:candidate.exchange||'',currency:candidate.currency||row.currency||'SEK',figi:candidate.figi||'',confidence:num(candidate.score),verifiedAt:new Date().toISOString(),source:'global-resolver-11.15.23'};
 const written=verifiedPermanentWrite(key,route,{source:'global-resolver-approved-11.15.23'});
 if(!written.ok){if(!silent)alert(`Kunde inte spara permanent: ${written.error}`);return false}
 liveFoundation.mappings[key]={...current,...written.route,providerSymbols:{...(current.providerSymbols||{}),...(candidate.providerSymbols||{}),[String(candidate.provider||'provider').toLowerCase().replace(/\s+/g,'_')]:candidate.ticker||candidate.isin},instrumentClass:classifyInstrument(canonicalHoldings().find(h=>h._key===key)||row).code,verified:true,identityStatus:'verified',identityConfidence:num(candidate.score),identityReasons:[candidate.provider,'Verifierad i Permanent Registry 11.15.23'],source:'permanent-identity-registry-11.15.23',resolverVersion:'11.15.23',permanentRoute:written.route,updatedAt:new Date().toISOString()};
 persistLiveFoundation();
 state.routes=state.routes||{};state.routes[key]=written.route;
 state.suggestions=(state.suggestions||[]).filter(x=>x.key!==key);
 state.review=state.suggestions.filter(x=>x.best&&!x.autoSafe).length;
 state.resolved=state.suggestions.filter(x=>x.autoSafe).length;
 state.unresolved=state.suggestions.filter(x=>!x.best).length;
 state.lastSaved={key,name:row.name,ticker:written.route.ticker,exchange:written.route.exchange,currency:written.route.currency,date:new Date().toISOString()};
 persistGlobalResolver(state);
 const run=resolverRunState();run.permanent=written.count;run.review=state.review;run.newSafe=Math.max(num(run.newSafe),0);run.message=`${row.name} sparad permanent som ${written.route.ticker||written.route.isin}`;persistResolverRun(run);
 liveEvent('success','Permanent Registry Save 11.15.23',run.message,written.route);
 return true;
}
function permanentRegistryRows(){
 const registry=permanentIdentityRegistry(),holdings=Object.fromEntries(canonicalHoldings().map(h=>[h._key,h]));
 return Object.entries(registry.routes||{}).sort((a,b)=>String(b[1].savedAt||'').localeCompare(String(a[1].savedAt||''))).map(([key,r])=>{const h=holdings[key]||{};return `<article class="resolverResult safe"><div class="resolverTitle"><div><b>${esc(h._name||key)}</b><small>${esc(h._account||'')} · ${esc(h._type||'')}</small></div><span>Permanent</span></div><div class="resolverBest"><strong>${esc(r.ticker||r.isin)}</strong><p>${esc(r.exchange||'Okänd börs')} · ${esc(r.currency||'')}</p><small>${esc(r.provider||'')}</small></div></article>`}).join('');
}
function resolverReviewHtml(){
 const st=globalResolverState(),saved=Object.keys(permanentIdentityRegistry().routes||{}).length,reviewRows=(st.suggestions||[]).filter(row=>!row.applied).map(row=>{const best=row.best;return `<article class="resolverResult ${row.conflict?'conflict':row.autoSafe?'safe':best?'review':'missing'}" data-review-card="${esc(row.key)}"><div class="resolverTitle"><div><b>${esc(row.name)}</b><small>${esc(row.account)} · ${esc(row.assetType)}</small></div><span>${best?`${num(row.confidence)}%`:'Ingen träff'}</span></div>${best?`<div class="resolverBest"><strong>${esc(best.ticker||best.isin)}</strong><p>${esc(best.name||'')} · ${esc(best.exchange||'Okänd börs')} · ${esc(best.currency||row.currency||'')}</p><small>${esc(best.provider)}${row.conflict?' · konflikt mellan källor':''}</small></div><div class="resolverActions"><button type="button" class="primary" data-resolver-apply="${esc(row.key)}">Godkänn och spara permanent</button>${row.candidates.length>1?`<select data-resolver-choice="${esc(row.key)}">${row.candidates.map((c,i)=>`<option value="${i}">${esc(c.ticker||c.isin)} · ${esc(c.exchange||'')} · ${esc(c.currency||'')} · ${esc(c.provider)} · ${num(c.score)}%</option>`).join('')}</select>`:''}</div>`:`<div class="notice">Ingen säker identitet hittades automatiskt.</div>`}</article>`}).join('');
 const last=st.lastSaved?`<div class="notice okbox"><b>${esc(st.lastSaved.name)} sparad permanent</b><p>${esc(st.lastSaved.ticker)} · ${esc(st.lastSaved.exchange||'')} · ${esc(st.lastSaved.currency||'')}</p></div>`:'';
 return `<div class="eyebrow">Global Identity Resolver 11.15.23</div><h2>Permanent Registry Save Fix</h2>${last}<div class="foundationActions"><button type="button" id="tabResolverReview" class="${resolverReviewTab==='review'?'primary':'secondary'}">För granskning (${(st.suggestions||[]).length})</button><button type="button" id="tabResolverSaved" class="${resolverReviewTab==='saved'?'primary':'secondary'}">Sparade permanent (${saved})</button></div><div class="grid"><div class="card metric"><span>Kvar att granska</span><b>${(st.suggestions||[]).length}</b></div><div class="card metric"><span>Permanent sparade</span><b>${saved}</b></div></div><div class="resolverList">${resolverReviewTab==='saved'?(permanentRegistryRows()||'<div class="empty">Inga permanent sparade identiteter ännu.</div>'):(reviewRows||'<div class="empty">Inga kandidater kvar att granska.</div>')}</div>`;
}
function openGlobalResolverReview(){
 openModal(resolverReviewHtml());
 const modal=document.getElementById('modal')||document;
 modal.querySelector('#tabResolverReview')?.addEventListener('click',()=>{resolverReviewTab='review';openGlobalResolverReview()});
 modal.querySelector('#tabResolverSaved')?.addEventListener('click',()=>{resolverReviewTab='saved';openGlobalResolverReview()});
 modal.querySelectorAll('[data-resolver-apply]').forEach(btn=>btn.addEventListener('click',event=>{
  event.preventDefault();event.stopPropagation();
  const key=btn.dataset.resolverApply,sel=modal.querySelector(`[data-resolver-choice="${CSS.escape(key)}"]`),idx=num(sel?.value),scrollHost=modal.querySelector('.modalCard')||modal,scrollTop=scrollHost.scrollTop;
  btn.disabled=true;btn.textContent='Sparar permanent…';
  if(applyResolverSuggestion(key,idx)){resolverReviewTab='review';openGlobalResolverReview();requestAnimationFrame(()=>{const h=(document.getElementById('modal')||document).querySelector('.modalCard');if(h)h.scrollTop=scrollTop;render()})}else{btn.disabled=false;btn.textContent='Godkänn och spara permanent'}
 }))
}
function globalResolverPanel(){const st=globalResolverState(),run=recoverResolverRun(),remaining=resolverTargets().length,saved=Object.keys(permanentIdentityRegistry().routes||{}).length,running=run.status==='running',paused=run.status==='paused';return `<section class="section globalResolverPanel"><div class="sectionHead"><div><div class="eyebrow">Global Identity Resolver 11.15.23</div><h2>Stabil batchmotor med verifierad permanent lagring.</h2></div><span class="healthScore">${saved} låsta</span></div><p>Godkända identiteter skrivs till Permanent Registry, läses tillbaka direkt och tas därefter bort från granskningslistan.</p><div class="grid"><div class="card metric"><span>Återstår</span><b>${remaining}</b></div><div class="card metric"><span>Permanent sparade</span><b>${saved}</b></div><div class="card metric"><span>För granskning</span><b>${(st.suggestions||[]).length}</b></div><div class="card metric"><span>Misslyckade</span><b>${run.failed||0}</b></div></div>${running||paused?`<div class="resolverProgress"><div><span>${paused?'Pausad':'Kör'}</span><b>${run.processed||0}/${run.total||0}</b></div><div class="bar"><i style="width:${run.total?Math.round((run.processed||0)/run.total*100):0}%"></i></div><small>${esc(run.message||'')}</small></div>`:''}<div class="foundationActions"><button id="runGlobalResolver" class="primary" type="button" ${running?'disabled':''}>${paused?'Fortsätt nästa batch (max 8)':'Kör nästa batch (max 8)'}</button><button id="stopGlobalResolver" class="danger" type="button" ${running?'':'disabled'}>Stoppa säkert</button><button id="reviewGlobalResolver" class="secondary" type="button" ${(st.suggestions||[]).length||saved?'':'disabled'}>Granska resultat</button></div><div class="resolverSources"><span>Permanent Registry</span><span>Global Registry</span><span>OpenFIGI</span><span>Twelve Data</span><span>Alpha Vantage</span><span>Finnhub</span></div><p class="disclaimer">Antal, GAV, kredit, transaktioner och Portfolio Ledger ändras aldrig.</p></section>`}


/* 11.15.23 Resolver Target & Startup Recovery */
function resolverTraceRows(){return parse(safeGet(RESOLVER_TRACE_KEY))||[]}
function resolverTrace(level,step,message,detail=''){
 const rows=resolverTraceRows();rows.push({date:new Date().toISOString(),level,step,message,detail});
 safeSet(RESOLVER_TRACE_KEY,JSON.stringify(rows.slice(-500)));return rows
}
function resolverTraceText(){const run=resolverRunState(),rows=resolverTraceRows();return `Mästarklass OS 11.15.23 Resolver Chain Trace\nRader: ${rows.length}\nStatus: ${run.status} ${run.processed||0}/${run.total||0}\nRunId: ${run.runId||'–'}\n\n${rows.map((r,i)=>`${String(i+1).padStart(3,'0')} ${new Date(r.date).toLocaleTimeString('sv-SE')} [${r.level}] ${r.step} — ${r.message}${r.detail?` · ${r.detail}`:''}`).join('\n')}`}
function clearResolverTrace(){safeSet(RESOLVER_TRACE_KEY,'[]');render()}
function resolverTargetSnapshot(){
 const coverage=instrumentMappingCoverage()?.items||[],coverageMap=new Map(coverage.map(x=>[x.key,x]));
 return canonicalHoldings().map(h=>{const c=coverageMap.get(h._key)||{},m=liveFoundation.mappings[h._key]||{};return {key:h._key,name:h._name,account:h._account,assetType:h._type,currency:m.currency||h._currency||'SEK',ticker:m.ticker||c.ticker||'',isin:m.isin||c.isin||'',exchange:m.exchange||c.exchange||''}})
}
function resolverTargets(){const routes=permanentIdentityRegistry().routes||{};return resolverTargetSnapshot().filter(item=>{if(routeIsUsable(routes[item.key]))return false;const m=liveFoundation.mappings[item.key]||{},cls=classifyInstrument(canonicalHoldings().find(h=>h._key===item.key)||item).code;return !m.verified||num(m.identityConfidence||m.confidence)<92||(!m.ticker&&!m.isin)||(!m.isin&&cls!=='fund'&&!m.ticker)})}
function recoverResolverRun(){const x=resolverRunState();if(x.status==='running'){x.status='paused';x.stopRequested=false;x.message='Föregående körning avbröts. Fortsätt från senaste checkpoint.';persistResolverRun(x);resolverTrace('warning','Startup recovery','Pågående körning återställdes som pausad',`${x.processed||0}/${x.total||0}`)}return x}
async function runGlobalResolver(){
 let run=resolverRunState();
 if(run.status==='running')return false;
 const allTargets=resolverTargets(),byKey=new Map(resolverTargetSnapshot().map(x=>[x.key,x]));
 let resumable=run.status==='paused'&&Array.isArray(run.targetKeys)&&run.targetKeys.length>0&&run.cursor<run.targetKeys.length;
 if(resumable&&run.targetKeys.some(k=>!byKey.has(k)))resumable=false;
 let targets;
 if(!resumable){
  targets=allTargets;
  if(!targets.length){
   run={...run,status:'idle',total:0,processed:0,cursor:0,targetKeys:[],message:'Ingen mållista kunde byggas. Resolvern startades inte.'};persistResolverRun(run);resolverTrace('error','Target guard','Tom mållista blockerades',`innehav=${canonicalHoldings().length}`);render();alert('Resolvern kunde inte bygga en mållista. Ingen körning startades.');return false
  }
  const previous=globalResolverState();
  run={version:'11.15.23',status:'running',runId:crypto.randomUUID?.()||String(Date.now()),startedAt:new Date().toISOString(),updatedAt:new Date().toISOString(),completedAt:'',cursor:0,total:targets.length,processed:0,skipped:Object.keys(permanentIdentityRegistry().routes||{}).length,permanent:Object.keys(permanentIdentityRegistry().routes||{}).length,newSafe:0,review:0,failed:0,errors:0,stopRequested:false,targetKeys:targets.map(x=>x.key),suggestions:(previous.suggestions||[]).filter(x=>!routeIsUsable(permanentRouteFor(x.key))),message:`Mållista klar: ${targets.length} instrument.`};
  resolverTrace('success','Bootstrap','Ny mållista byggd',`${targets.length} instrument`)
 }else{
  targets=run.targetKeys.map(k=>byKey.get(k)).filter(Boolean);run.status='running';run.stopRequested=false;run.message=`Återupptar från ${run.cursor}/${run.total}.`;resolverTrace('info','Resume','Batch återupptas',`${run.cursor}/${run.total}`)
 }
 persistResolverRun(run);render();
 const batchStart=run.cursor,batchEnd=Math.min(targets.length,batchStart+8);resolverTrace('info','Batch start',`${batchStart+1}–${batchEnd} av ${targets.length}`);
 for(let i=batchStart;i<batchEnd;i++){
  run=resolverRunState();
  if(run.stopRequested){run.status='paused';run.message=`Pausad säkert efter ${run.processed}/${run.total}.`;persistResolverRun(run);syncResolverResultsFromRun(run);resolverTrace('warning','Stop','Säker paus genomförd',run.message);render();return true}
  const item=targets[i];if(!item){run.cursor=i+1;persistResolverRun(run);continue}
  if(routeIsUsable(permanentRouteFor(item.key))){run.cursor=i+1;run.processed++;run.skipped++;persistResolverRun(run);resolverTrace('info','Skip',item.name,'redan permanent');continue}
  run.message=`Verifierar ${i+1}/${targets.length}: ${item.name}`;persistResolverRun(run);renderResolverProgress(run);resolverTrace('info','Instrument',item.name,`${i+1}/${targets.length}`);
  try{
   const row=await resolveOneInstrument(item);run=resolverRunState();run.cursor=i+1;run.processed++;run.errors+=row.errors.length;
   const compact=compactResolverSuggestion(row);run.suggestions=[...(run.suggestions||[]).filter(x=>x.key!==row.key),compact].slice(-160);
   if(row.autoSafe&&applyResolverSuggestion(row.key,0,{silent:true,rowOverride:row})){run.newSafe++;run.permanent=Object.keys(permanentIdentityRegistry().routes||{}).length;run.suggestions=run.suggestions.filter(x=>x.key!==row.key);resolverTrace('success','Auto-save',item.name,row.best?.ticker||row.best?.isin||'')}
   else if(row.best){run.review++;resolverTrace('warning','Review',item.name,`${row.best.ticker||row.best.isin||''} ${row.confidence||0}%`)}
   else {run.failed++;resolverTrace('warning','No match',item.name,'ingen kandidat')}
   persistResolverRun(run)
  }catch(error){run=resolverRunState();run.cursor=i+1;run.processed++;run.failed++;run.errors++;run.suggestions=[...(run.suggestions||[]),{key:item.key,name:item.name,account:item.account,assetType:item.assetType,currency:item.currency,best:null,candidates:[],confidence:0,autoSafe:false,conflict:false,variants:tickerVariants(item),errors:[String(error?.message||error)]}].slice(-160);persistResolverRun(run);resolverTrace('error','Instrumentfel',item.name,String(error?.message||error))}
  syncResolverResultsFromRun(run);renderResolverProgress(run);await new Promise(resolve=>setTimeout(resolve,0));
 }
 run=resolverRunState();const complete=run.cursor>=targets.length;run.status=complete?'complete':'paused';run.completedAt=complete?new Date().toISOString():'';run.permanent=Object.keys(permanentIdentityRegistry().routes||{}).length;run.message=complete?`Klar: ${run.newSafe} nya säkra · ${run.review} för granskning · ${run.failed} utan träff.`:`Batch klar: ${run.processed}/${run.total}. ${Math.max(0,run.total-run.processed)} återstår.`;persistResolverRun(run);syncResolverResultsFromRun(run);resolverTrace('success',complete?'Körning klar':'Batch klar',run.message);if(complete)refreshValuationAfterResolver();render();return true
}
function globalResolverPanel(){const st=globalResolverState(),run=resolverRunState(),remaining=resolverTargets().length,saved=Object.keys(permanentIdentityRegistry().routes||{}).length,running=run.status==='running',paused=run.status==='paused',trace=resolverTraceRows();return `<section class="section globalResolverPanel"><div class="sectionHead"><div><div class="eyebrow">Global Identity Resolver 11.15.23</div><h2>Resolver Target & Startup Recovery.</h2></div><span class="healthScore">${saved} låsta</span></div><p>Mållistan byggs och valideras före start. Motorn behandlar högst åtta instrument per batch och återupptar från senaste checkpoint.</p><div class="grid"><div class="card metric"><span>Återstår</span><b>${remaining}</b></div><div class="card metric"><span>Permanent sparade</span><b>${saved}</b></div><div class="card metric"><span>För granskning</span><b>${(st.suggestions||[]).length}</b></div><div class="card metric"><span>Misslyckade</span><b>${run.failed||0}</b></div></div>${running||paused||run.status==='complete'?`<div class="resolverProgress"><div><span>${paused?'Pausad':running?'Kör':'Klar'}</span><b>${run.processed||0}/${run.total||0}</b></div><div class="bar"><i style="width:${run.total?Math.round((run.processed||0)/run.total*100):0}%"></i></div><small>${esc(run.message||'')}</small></div>`:''}<div class="foundationActions"><button id="runGlobalResolver" class="primary" type="button" ${running?'disabled':''}>${paused?'Fortsätt nästa batch (max 8)':'Kör nästa batch (max 8)'}</button><button id="stopGlobalResolver" class="danger" type="button" ${running?'':'disabled'}>Stoppa säkert</button><button id="reviewGlobalResolver" class="secondary" type="button" ${(st.suggestions||[]).length||saved?'':'disabled'}>Granska resultat</button></div><div class="resolverSources"><span>Permanent Registry</span><span>Global Registry</span><span>OpenFIGI</span><span>Twelve Data</span><span>Alpha Vantage</span><span>Finnhub</span></div><div class="resolverTraceBox"><div class="sectionHead"><div><div class="eyebrow">Resolver Chain Trace 11.15.23</div><h3>Beständig körlogg</h3></div><span class="healthScore">${trace.length}</span></div><pre>${esc(trace.slice(-8).map(r=>`${new Date(r.date).toLocaleTimeString('sv-SE')} ${r.step} — ${r.message}`).join('\n')||'Ingen diagnostik ännu.')}</pre><div class="foundationActions"><button id="copyResolverTrace" class="secondary" type="button">Kopiera hela loggen</button><button id="clearResolverTrace" class="secondary" type="button">Rensa loggen</button></div></div><p class="disclaimer">Antal, GAV, kredit, transaktioner och Portfolio Ledger ändras aldrig.</p></section>`}

function boot(){
 data=loadData();
 admin=merge(ADMIN_DEFAULT,parse(safeGet(ADMIN_KEY))||{});
 transactions=parse(safeGet(TX_KEY))||[];
 ledger=parse(safeGet(LEDGER_KEY))||[];
 initializeLiveFoundation();
 const staleSync=liveSyncState();if(staleSync.status==='syncing'){staleSync.status='idle';staleSync.message='Fastlåst synk återställd vid appstart.';persistLiveSync(staleSync)}
 recoverResolverRun();
 hydratePermanentIdentityRoutes();
 const settings=parse(safeGet(SETTINGS_KEY));
 if(settings?.goals)data.goals=merge(data.goals,settings.goals);
 if(settings?.portfolio)data.portfolio=merge(data.portfolio,settings.portfolio);
 screen=(location.hash.slice(1)||'home');
 if(!NAV.some(x=>x[0]===screen))screen='home';
 migrateLedger();
 runAutoDataSteward({force:false,reason:'boot'});
 installInteractionRouter();
 render();
 document.body.classList.add('appReady');
 setTimeout(()=>runAutomaticIntelligenceCycle('app-open'),6000);
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')runAutomaticIntelligenceCycle('app-resume')});
 window.addEventListener('hashchange',()=>{const next=location.hash.slice(1)||'home';if(NAV.some(x=>x[0]===next)){screen=next;render();requestAnimationFrame(()=>scrollTo({top:0,left:0,behavior:'auto'}))}});
 window.addEventListener('popstate',()=>{const {root}=modalParts();if(root&&!root.hidden)closeModal({fromHistory:true})});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){const {root}=modalParts();if(root&&!root.hidden)closeModal()}});
 if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register(`sw.js?v=${VERSION}`).then(reg=>reg.update()).catch(e=>console.warn(e)),{once:true});
}
try{boot()}catch(error){console.error(error);const app=document.getElementById('app');if(app)app.innerHTML='<div class="fatal"><b>Appen kunde inte starta.</b><p>Lokal data har inte raderats. Stäng appen och öppna den igen.</p></div>';document.body.classList.add('appReady')}
})();
