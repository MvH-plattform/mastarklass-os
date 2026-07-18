(()=>{'use strict';
const VERSION='10.2.1';
const DATA_KEY='mastarklass_os_10_data';
const LIVE_KEY='mastarklass_os_live_readonly_v1';
const SETTINGS_KEY='mastarklass_os_10_settings';
const NAV=[['home','🏠','Hem'],['portfolio','📊','Portfölj'],['market','🌍','Marknad'],['analysis','🧠','Analys'],['ideas','💡','Idéer'],['goals','🎯','Mål'],['more','☰','Mer']];
const DEFAULTS={portfolio:{net:0,monthly:9000,credit:0},holdings:[],accounts:[],goals:{capital:7500000,annualDividend:480000},monthlyPlan:{total:9000},marketCenter:{items:[]},ideaBank:[],aiRadar:[],reports:[],journal:[]};
let data=structuredClone(DEFAULTS),screen='home',sourceKey=null;
let query='',typeFilter='all',accountFilter='all',sortMode='value_desc';

const parse=x=>{try{return JSON.parse(x)}catch{return null}};
const num=x=>{
 if(x===null||x===undefined||x==='') return 0;
 if(typeof x==='number') return Number.isFinite(x)?x:0;
 const s=String(x).replace(/\s/g,'').replace(/[^\d,.\-]/g,'');
 if(!s)return 0;
 const normalized=(s.includes(',')&&s.includes('.'))?s.replace(/\./g,'').replace(',','.'):s.replace(',','.');
 const n=Number(normalized); return Number.isFinite(n)?n:0;
};
const text=(o,keys,f='')=>{for(const k of keys){const v=o?.[k];if(v!==undefined&&v!==null&&String(v).trim()!=='')return String(v).trim()}return f};
const nval=(o,keys)=>{for(const k of keys){const v=num(o?.[k]);if(v)return v}return 0};
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const kr=n=>new Intl.NumberFormat('sv-SE',{maximumFractionDigits:0}).format(num(n))+' kr';
const pct=n=>num(n).toFixed(2).replace('.',',')+' %';
function safeGet(k){try{return localStorage.getItem(k)}catch{return null}}
function safeSet(k,v){try{localStorage.setItem(k,v);return true}catch{return false}}
function merge(a,b){if(Array.isArray(a))return Array.isArray(b)?b:a;if(a&&typeof a==='object'){const o={...a};if(b&&typeof b==='object')for(const k of Object.keys(b))o[k]=k in a?merge(a[k],b[k]):b[k];return o}return b??a}
function looksLikePortfolio(x){return !!(x&&typeof x==='object'&&(Array.isArray(x.holdings)||Array.isArray(x.accounts)||num(x.portfolio?.net)>0))}
function score(x){if(!looksLikePortfolio(x))return 0;return (x.holdings?.length||0)*30+(x.accounts?.length||0)*10+Math.min(1000,num(x.portfolio?.net)/500)}
function loadData(){
 const own=parse(safeGet(DATA_KEY)); if(looksLikePortfolio(own)){sourceKey=DATA_KEY;return merge(DEFAULTS,own)}
 let best=null,bestScore=0,bestKey=null;
 for(let i=0;i<localStorage.length;i++){
  const k=localStorage.key(i); if(!k||k===LIVE_KEY||k===SETTINGS_KEY||/cache|live_readonly/i.test(k))continue;
  const v=parse(safeGet(k)); const s=score(v); if(s>bestScore){best=v;bestScore=s;bestKey=k}
 }
 sourceKey=bestKey; return merge(DEFAULTS,best||{});
}
function liveState(){return parse(safeGet(LIVE_KEY))||{}}
function fxFor(h){
 const direct=nval(h,['fxToSEK','fxRate','exchangeRate','currencyRate','sekRate']); if(direct)return direct;
 const cur=text(h,['currency','valuta'],'SEK').toUpperCase(); if(cur==='SEK')return 1;
 const live=liveState(), fx=live.fx||live.rates||{};
 return num(fx[cur])||num(fx[cur+'SEK'])||num(fx[cur+'/SEK'])||0;
}
function quoteFor(h){
 const direct=nval(h,['latestPrice','price','currentPrice','lastPrice','kurs','quote']); if(direct)return direct;
 const sym=text(h,['symbol','ticker','providerSymbol','isin'],'').toUpperCase();
 const quotes=liveState().quotes||[];
 const q=quotes.find(x=>text(x,['symbol','ticker','providerSymbol','isin'],'').toUpperCase()===sym);
 return q?nval(q,['price','latestPrice','last','value','close']):0;
}
function quantity(h){return nval(h,['quantity','qty','shares','units','antal','amount'])}
function gav(h){return nval(h,['gav','avgPrice','averagePrice','averageCost','costPrice','anskaffningsvardePerEnhet'])}
function explicitValue(h){return nval(h,['marketValueSEK','marketValueSek','marketValue','currentValue','positionValue','valueSEK','value','marknadsvarde','marknadsvärde'])}
function costValue(h){
 const direct=nval(h,['costValueSEK','costBasisSEK','investedCapital','purchaseValue','bookValue','anskaffningsvarde','anskaffningsvärde']); if(direct)return direct;
 const q=quantity(h),g=gav(h),fx=fxFor(h); return q&&g&&fx?q*g*fx:0;
}
function holdingValue(h){
 const direct=explicitValue(h); if(direct)return {value:direct,method:'Marknadsvärde'};
 const q=quantity(h),p=quoteFor(h),fx=fxFor(h); if(q&&p&&fx)return {value:q*p*fx,method:'Kurs × antal'};
 const c=costValue(h); if(c)return {value:c,method:'Anskaffningsvärde'};
 return {value:0,method:'Saknar värde'};
}
function accountName(h){return text(h,['account','accountName','konto','platform','broker'],'Okänt konto')}
function assetType(h){return text(h,['assetType','type','category','tillgangsslag','tillgångsslag'],'Övrigt')}
function holdingName(h){return text(h,['name','securityName','title','instrumentName','symbol','ticker'],'Innehav')}
function canonicalHoldings(){return (data.holdings||[]).map((h,i)=>{const r=holdingValue(h);return {...h,_i:i,_value:r.value,_method:r.method,_name:holdingName(h),_account:accountName(h),_type:assetType(h),_qty:quantity(h),_gav:gav(h),_fx:fxFor(h),_quote:quoteFor(h)}})}
function declaredTotal(){
 return nval(data.portfolio||{},['net','total','totalValue','marketValue','value'])||
        (data.accounts||[]).reduce((s,a)=>s+nval(a,['value','marketValue','totalValue','balance']),0);
}
function calculatedTotal(){return canonicalHoldings().reduce((s,h)=>s+h._value,0)}
function total(){return declaredTotal()||calculatedTotal()}
function diagnostics(){
 const hs=canonicalHoldings(), declared=declaredTotal(), calc=calculatedTotal();
 const unresolved=hs.filter(h=>!h._value), missingGav=hs.filter(h=>!h._gav).length, missingQty=hs.filter(h=>!h._qty).length;
 return {declared,calc,diff:declared?declared-calc:0,unresolved,missingGav,missingQty};
}
function nav(){
 const r=document.getElementById('nav');
 r.innerHTML=NAV.map(([id,icon,label])=>`<button data-screen="${id}" class="${screen===id?'active':''}"><span>${icon}</span>${label}</button>`).join('');
 r.querySelectorAll('button').forEach(b=>b.onclick=()=>{screen=b.dataset.screen;location.hash=screen;render();scrollTo(0,0)});
}
function row(h,t){return `<button class="holdingRow" data-index="${h._i}"><div><b>${esc(h._name)}</b><small>${esc(h._account)} · ${esc(h._type)}</small><div class="bar"><i style="width:${t?Math.min(100,h._value/t*100):0}%"></i></div></div><div class="right"><b>${kr(h._value)}</b><small>${t?pct(h._value/t*100):'0,00 %'}</small><em>${esc(h._method)}</em></div></button>`}
function home(){
 const t=total(),goal=num(data.goals?.capital)||7500000,p=goal?t/goal*100:0,d=diagnostics();
 return `<section class="hero"><div class="eyebrow">Mästarklass OS 10.2.1 · Portfolio Engine</div><h2>Hela portföljen. Spårbara värden.</h2><p>Värden hämtas i tydlig prioritet: marknadsvärde, kurs × antal × valuta eller anskaffningsvärde.</p><div class="value">${kr(t)}</div><div class="bar"><i style="width:${Math.min(100,p)}%"></i></div><small>${pct(p)} av kapitalmålet</small></section>
 <div class="grid"><div class="card metric"><span>Innehav</span><b>${data.holdings.length}</b></div><div class="card metric"><span>Värderade</span><b>${data.holdings.length-d.unresolved.length}</b></div><div class="card metric"><span>Saknar värde</span><b>${d.unresolved.length}</b></div><div class="card metric"><span>Avstämning</span><b>${Math.abs(d.diff)<1?'OK':'Kontroll'}</b></div></div>`;
}
function portfolio(){
 const all=canonicalHoldings(),t=total(),q=query.toLowerCase();
 const types=[...new Set(all.map(h=>h._type))].sort((a,b)=>a.localeCompare(b,'sv'));
 const accounts=[...new Set(all.map(h=>h._account))].sort((a,b)=>a.localeCompare(b,'sv'));
 let hs=all.filter(h=>(typeFilter==='all'||h._type===typeFilter)&&(accountFilter==='all'||h._account===accountFilter)&&(!q||`${h._name} ${h._account} ${h._type}`.toLowerCase().includes(q)));
 const sorts={value_desc:(a,b)=>b._value-a._value,value_asc:(a,b)=>a._value-b._value,name_asc:(a,b)=>a._name.localeCompare(b._name,'sv'),name_desc:(a,b)=>b._name.localeCompare(a._name,'sv')};
 hs.sort(sorts[sortMode]);
 const d=diagnostics(),accountMap=new Map();
 all.forEach(h=>accountMap.set(h._account,(accountMap.get(h._account)||0)+h._value));
 return `<div class="chips"><button data-jump="overview">Översikt</button><button data-jump="accounts">Konton</button><button data-jump="holdings">Alla innehav</button><button data-jump="quality">Datakvalitet</button></div>
 <section id="overview" class="hero"><div class="eyebrow">Portfolio Engine 10.2.1</div><h2>${kr(t)}</h2><p>${all.length} innehav. ${all.length-d.unresolved.length} har beräknat värde.</p></section>
 <section id="accounts" class="section"><h2>Konton</h2><div class="list">${[...accountMap.entries()].sort((a,b)=>b[1]-a[1]).map(([n,v])=>`<div class="simpleRow"><div><b>${esc(n)}</b><small>${pct(t?v/t*100:0)}</small></div><b>${kr(v)}</b></div>`).join('')}</div></section>
 <section id="holdings" class="section"><div class="sectionHead"><h2>Alla innehav</h2><small>${hs.length} av ${all.length}</small></div>
 <div class="tools"><input id="search" type="search" value="${esc(query)}" placeholder="Sök innehav eller konto"><select id="typeFilter"><option value="all">Alla tillgångsslag</option>${types.map(x=>`<option ${x===typeFilter?'selected':''}>${esc(x)}</option>`).join('')}</select><select id="accountFilter"><option value="all">Alla konton</option>${accounts.map(x=>`<option ${x===accountFilter?'selected':''}>${esc(x)}</option>`).join('')}</select><select id="sortMode"><option value="value_desc">Störst värde</option><option value="value_asc" ${sortMode==='value_asc'?'selected':''}>Minst värde</option><option value="name_asc" ${sortMode==='name_asc'?'selected':''}>Namn A–Ö</option><option value="name_desc" ${sortMode==='name_desc'?'selected':''}>Namn Ö–A</option></select></div>
 <div class="list">${hs.map(h=>row(h,t)).join('')}</div></section>
 <section id="quality" class="section"><h2>Datakvalitet och avstämning</h2><div class="grid"><div class="card metric"><span>Deklarerad totalsumma</span><b>${kr(d.declared)}</b></div><div class="card metric"><span>Beräknat från innehav</span><b>${kr(d.calc)}</b></div><div class="card metric"><span>Differens</span><b>${kr(d.diff)}</b></div><div class="card metric"><span>Saknar värde</span><b>${d.unresolved.length}</b></div></div>
 ${d.unresolved.length?`<div class="warning"><b>Poster som behöver kompletteras</b><p>${d.unresolved.slice(0,20).map(h=>esc(h._name)).join(', ')}${d.unresolved.length>20?' …':''}</p></div>`:`<div class="notice okbox">Samtliga innehav har ett spårbart värde.</div>`}</section>
 <div id="modal" class="modal hidden"><div class="modalCard"><button id="closeModal" class="modalClose">×</button><div id="modalBody"></div></div></div>`;
}
function market(){const l=liveState();return `<section class="hero"><div class="eyebrow">Live Data Platform</div><h2>Flytande källor. Spårbara värden.</h2><p>Live-lagret är read-only och får aldrig skriva över antal, GAV eller transaktioner.</p></section><div class="grid"><div class="card metric"><span>Providers</span><b>${(l.providers||[]).length}</b></div><div class="card metric"><span>Kurser</span><b>${(l.quotes||[]).length}</b></div></div>`}
function analysis(){const d=diagnostics();return `<section class="hero"><div class="eyebrow">Portfolio Intelligence</div><h2>Rätt data före rekommendationer</h2><p>10.2.1 färdigställer värdegrund, kontosummor och datakvalitet innan intelligensmotorn aktiveras.</p></section><div class="grid"><div class="card metric"><span>Analyserbara</span><b>${data.holdings.length-d.unresolved.length}</b></div><div class="card metric"><span>Behöver data</span><b>${d.unresolved.length}</b></div></div>`}
function ideas(){const a=[...(data.ideaBank||[]),...(data.aiRadar||[])];return `<section class="hero"><div class="eyebrow">Idébank</div><h2>Idéer som måste förtjäna sin plats</h2></section><div class="list">${a.map(x=>`<div class="card"><h3>${esc(x.title||x.name||'Idé')}</h3><p>${esc(x.text||x.note||'')}</p></div>`).join('')||'<div class="empty">Idébanken är tom.</div>'}</div>`}
function goals(){return `<section class="hero"><div class="eyebrow">Målcentral</div><h2>Bygg frihet steg för steg</h2></section><div class="card form"><label>Kapitalmål<input id="capitalGoal" inputmode="numeric" value="${num(data.goals.capital)}"></label><label>Årligt utdelningsmål<input id="divGoal" inputmode="numeric" value="${num(data.goals.annualDividend)}"></label><label>Månadssparande<input id="monthly" inputmode="numeric" value="${num(data.portfolio.monthly||data.monthlyPlan.total)}"></label><button id="saveGoals" class="primary">Spara mål lokalt</button></div>`}
function more(){return `<section class="hero"><div class="eyebrow">Säkerhet & data</div><h2>Du äger din data</h2></section><div class="card"><h2>Backup</h2><button id="exportBtn" class="primary">Exportera lokal backup</button><label class="file">Importera JSON-backup<input id="importFile" type="file" accept=".json,application/json"></label><p><small>Datakälla: ${esc(sourceKey||'ingen lokal portfölj hittad')}</small></p></div>`}
function showHolding(i){
 const h=canonicalHoldings().find(x=>x._i===i),t=total(); if(!h)return;
 const body=document.getElementById('modalBody'),modal=document.getElementById('modal');
 body.innerHTML=`<div class="eyebrow">Innehavsdetalj</div><h2>${esc(h._name)}</h2><div class="grid"><div class="card metric"><span>Konto</span><b>${esc(h._account)}</b></div><div class="card metric"><span>Tillgångsslag</span><b>${esc(h._type)}</b></div><div class="card metric"><span>Antal</span><b>${h._qty||'—'}</b></div><div class="card metric"><span>GAV</span><b>${h._gav||'—'}</b></div><div class="card metric"><span>Marknadsvärde</span><b>${kr(h._value)}</b></div><div class="card metric"><span>Portföljvikt</span><b>${pct(t?h._value/t*100:0)}</b></div><div class="card metric"><span>Valuta</span><b>${esc(text(h,['currency','valuta'],'SEK'))}</b></div><div class="card metric"><span>Värdemetod</span><b>${esc(h._method)}</b></div></div>${!h._value?'<div class="warning">Denna post saknar marknadsvärde, användbar kurs eller anskaffningsvärde. 10.2.1 visar därför 0 kr utan att hitta på ett värde.</div>':''}`;
 modal.classList.remove('hidden');
}
function bind(){
 document.querySelectorAll('[data-jump]').forEach(b=>b.onclick=()=>document.getElementById(b.dataset.jump)?.scrollIntoView({behavior:'smooth'}));
 const s=document.getElementById('search'); if(s)s.oninput=e=>{query=e.target.value;render()};
 const tf=document.getElementById('typeFilter'); if(tf)tf.onchange=e=>{typeFilter=e.target.value;render()};
 const af=document.getElementById('accountFilter'); if(af)af.onchange=e=>{accountFilter=e.target.value;render()};
 const sm=document.getElementById('sortMode'); if(sm)sm.onchange=e=>{sortMode=e.target.value;render()};
 document.querySelectorAll('[data-index]').forEach(b=>b.onclick=()=>showHolding(Number(b.dataset.index)));
 const cm=document.getElementById('closeModal'); if(cm)cm.onclick=()=>document.getElementById('modal').classList.add('hidden');
 const sg=document.getElementById('saveGoals'); if(sg)sg.onclick=()=>{data.goals.capital=num(document.getElementById('capitalGoal').value);data.goals.annualDividend=num(document.getElementById('divGoal').value);data.portfolio.monthly=num(document.getElementById('monthly').value);safeSet(SETTINGS_KEY,JSON.stringify({goals:data.goals,portfolio:{monthly:data.portfolio.monthly}}));render()};
 const ex=document.getElementById('exportBtn'); if(ex)ex.onclick=()=>{const blob=new Blob([JSON.stringify({version:VERSION,exportedAt:new Date().toISOString(),sourceKey,data},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='mastarklass-os-backup-'+new Date().toISOString().slice(0,10)+'.json';a.click();URL.revokeObjectURL(a.href)};
 const im=document.getElementById('importFile'); if(im)im.onchange=async e=>{const f=e.target.files?.[0];if(!f)return;const x=parse(await f.text());const incoming=x?.data||x;if(!looksLikePortfolio(incoming))return alert('Filen innehåller ingen läsbar portfölj.');if(!safeSet(DATA_KEY,JSON.stringify(incoming)))return alert('Lagringen är full.');location.reload()};
}
function render(){nav();const views={home,portfolio,market,analysis,ideas,goals,more};document.getElementById('app').innerHTML=(views[screen]||home)();document.getElementById('headerMeta').textContent=`${data.holdings.length} innehav · Portfolio Engine · ${VERSION}`;bind()}
async function boot(){
 data=loadData();
 const settings=parse(safeGet(SETTINGS_KEY)); if(settings?.goals)data.goals=merge(data.goals,settings.goals);if(settings?.portfolio)data.portfolio=merge(data.portfolio,settings.portfolio);
 screen=(location.hash.slice(1)||'home'); if(!NAV.some(x=>x[0]===screen))screen='home';
 if('serviceWorker'in navigator)try{await navigator.serviceWorker.register('sw.js?v='+VERSION)}catch(e){console.warn(e)}
 render();
}
boot();
})();