(function(global){
  'use strict';
  const VERSION='9.7.0';
  const STORE='mkos.live.pilot.v1';
  const MAX_AGE={equity:24,etf:24,fund:96,fx:48};
  const iso=()=>new Date().toISOString();
  const num=v=>Number(String(v??'').replace(/\s/g,'').replace(',','.'))||0;
  function state(){
    try{return JSON.parse(localStorage.getItem(STORE))||{version:VERSION,quotes:[],audit:[],settings:{readOnly:true,maxDeviationPct:20}}}
    catch(e){return{version:VERSION,quotes:[],audit:[],settings:{readOnly:true,maxDeviationPct:20}}}
  }
  function persist(s){localStorage.setItem(STORE,JSON.stringify(s));return s}
  function ageHours(ts){return Math.max(0,(Date.now()-new Date(ts).getTime())/36e5)}
  function freshness(q){const limit=MAX_AGE[q.assetType]||48;const age=ageHours(q.timestamp);return age<=limit?'fresh':age<=limit*3?'stale':'expired'}
  function normalize(row){
    const q={
      id:String(row.id||row.ticker||row.name||'').trim(),
      ticker:String(row.ticker||row.id||'').trim(),
      name:String(row.name||row.ticker||row.id||'').trim(),
      assetType:String(row.assetType||row.type||'equity').toLowerCase(),
      currency:String(row.currency||'SEK').toUpperCase(),
      price:num(row.price||row.value),
      fxToSek:num(row.fxToSek||row.fx||1),
      timestamp:row.timestamp||iso(),
      source:String(row.source||'manual'),
      sourceUrl:String(row.sourceUrl||''),
      status:String(row.status||'manual'),
      verified:Boolean(row.verified===true||String(row.verified).toLowerCase()==='true')
    };
    q.sekPrice=q.price*q.fxToSek;
    q.freshness=freshness(q);
    q.valid=Boolean(q.id&&q.price>0&&q.fxToSek>0&&!Number.isNaN(new Date(q.timestamp).getTime()));
    return q;
  }
  function audit(s,type,detail){s.audit.unshift({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),type,detail,at:iso()});s.audit=s.audit.slice(0,300)}
  function upsert(raw){const s=state();const q=normalize(raw);if(!q.valid)throw new Error('Ogiltig kursrad');const i=s.quotes.findIndex(x=>x.id===q.id);if(i>=0)s.quotes[i]=q;else s.quotes.push(q);audit(s,'quote-upsert',{id:q.id,source:q.source,status:q.status});persist(s);dispatch();return q}
  function importCSV(text){
    const lines=String(text||'').trim().split(/\r?\n/);if(lines.length<2)throw new Error('CSV saknar datarader');
    const headers=lines.shift().split(/[;,]/).map(x=>x.trim());let ok=0,errors=[];
    lines.forEach((line,n)=>{if(!line.trim())return;const vals=line.split(/[;,]/);const row={};headers.forEach((h,i)=>row[h]=vals[i]);try{upsert(row);ok++}catch(e){errors.push({line:n+2,error:e.message})}});
    return{ok,errors};
  }
  function compare(holding,quote){
    const local=num(holding.marketValueSEK||holding.marketValue||holding.value||holding.currentValue||holding.costValueSEK);
    const qty=num(holding.quantity||holding.qty||holding.amount);
    const live=qty>0?qty*quote.sekPrice:0;
    const deviation=local>0?((live-local)/local)*100:null;
    const s=state();const blocked=deviation!==null&&Math.abs(deviation)>num(s.settings.maxDeviationPct);
    return{holdingId:holding.id||holding.ticker||holding.name,localValue:local,liveValue:live,deviationPct:deviation,blocked,quote};
  }
  function matchHoldings(holdings){const s=state();return (holdings||[]).map(h=>{const key=String(h.ticker||h.id||h.name||'').trim();const q=s.quotes.find(x=>x.id===key||x.ticker===key||x.name===h.name);return q?compare(h,q):{holdingId:key,missing:true}})}
  function summary(holdings){const rows=matchHoldings(holdings);const usable=rows.filter(x=>!x.missing&&!x.blocked&&x.quote.freshness!=='expired');return{version:VERSION,total:rows.length,matched:rows.filter(x=>!x.missing).length,usable:usable.length,blocked:rows.filter(x=>x.blocked).length,missing:rows.filter(x=>x.missing).length,liveValue:usable.reduce((a,x)=>a+x.liveValue,0),rows}}
  function settings(patch){const s=state();Object.assign(s.settings,patch||{});audit(s,'settings',patch);persist(s);dispatch();return s.settings}
  function clearQuotes(){const s=state();s.quotes=[];audit(s,'quotes-cleared',{});persist(s);dispatch()}
  function dispatch(){window.dispatchEvent(new CustomEvent('mkos:live-pilot-updated',{detail:state()}))}
  global.MKLivePortfolioPilot={VERSION,state,upsert,importCSV,matchHoldings,summary,settings,clearQuotes,normalize,freshness};
})(window);
