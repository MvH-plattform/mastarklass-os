
(function(global){
  'use strict';
  const ALPHA_KEY='mkos.live.alpha.key.v1';
  const MAP_KEY='mkos.live.mappings.v1';
  const FX_KEY='mkos.live.fx.v1';
  const now=()=>new Date().toISOString();
  const num=v=>Number(String(v??'').replace(',','.'))||0;

  function getAlphaKey(){return localStorage.getItem(ALPHA_KEY)||''}
  function setAlphaKey(key){
    key=String(key||'').trim();
    if(!key)throw new Error('API-nyckeln får inte vara tom.');
    localStorage.setItem(ALPHA_KEY,key);
    window.MKLiveProviderRegistry?.update('alphavantage',{enabled:true,health:'ready'});
  }
  function clearAlphaKey(){
    localStorage.removeItem(ALPHA_KEY);
    window.MKLiveProviderRegistry?.update('alphavantage',{enabled:false,health:'needs-key'});
  }
  function mappings(){try{return JSON.parse(localStorage.getItem(MAP_KEY))||[]}catch(e){return[]}}
  function saveMapping(m){
    const list=mappings(),id=String(m.holdingId||'').trim();
    if(!id)throw new Error('Lokalt innehav saknas.');
    if(!m.symbol)throw new Error('Providersymbol saknas.');
    const row={holdingId:id,holdingName:m.holdingName||id,provider:m.provider||'alphavantage',symbol:String(m.symbol).trim(),currency:String(m.currency||'USD').toUpperCase(),assetType:m.assetType||'equity',updatedAt:now()};
    const i=list.findIndex(x=>x.holdingId===id);
    if(i>=0)list[i]=row;else list.push(row);
    localStorage.setItem(MAP_KEY,JSON.stringify(list));
    return row;
  }
  function removeMapping(id){localStorage.setItem(MAP_KEY,JSON.stringify(mappings().filter(x=>x.holdingId!==id)))}

  async function fetchAlphaQuote(symbol){
    const key=getAlphaKey();
    if(!key)throw new Error('Alpha Vantage API-nyckel saknas.');
    const url=`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${encodeURIComponent(key)}`;
    const res=await fetch(url,{cache:'no-store'});
    if(!res.ok)throw new Error(`Alpha Vantage svarade ${res.status}.`);
    const data=await res.json();
    if(data.Note)throw new Error('API-gränsen är nådd. Försök senare.');
    if(data.Information)throw new Error(data.Information);
    const q=data['Global Quote']||{};
    const price=num(q['05. price']);
    if(price<=0)throw new Error(`Ingen giltig kurs för ${symbol}. Kontrollera symbolen.`);
    return {symbol,price,timestamp:q['07. latest trading day']?`${q['07. latest trading day']}T21:00:00Z`:now(),source:'Alpha Vantage',sourceUrl:'https://www.alphavantage.co/',status:'provider',verified:true};
  }

  async function fetchEcbSeries(currency){
    currency=String(currency||'').toUpperCase();
    if(currency==='EUR')return {currency:'EUR',perEur:1,date:now().slice(0,10)};
    const key=`D.${currency}.EUR.SP00.A`;
    const url=`https://data-api.ecb.europa.eu/service/data/EXR/${key}?format=csvdata&lastNObservations=1`;
    const res=await fetch(url,{headers:{Accept:'text/csv'},cache:'no-store'});
    if(!res.ok)throw new Error(`ECB svarade ${res.status} för ${currency}.`);
    const text=await res.text();
    const lines=text.trim().split(/\r?\n/);
    if(lines.length<2)throw new Error(`ECB saknar kurs för ${currency}.`);
    const headers=lines[0].split(',').map(x=>x.replace(/^"|"$/g,''));
    const vals=lines[lines.length-1].split(',').map(x=>x.replace(/^"|"$/g,''));
    const row=Object.fromEntries(headers.map((h,i)=>[h,vals[i]]));
    const val=num(row.OBS_VALUE);
    if(val<=0)throw new Error(`Ogiltig ECB-kurs för ${currency}.`);
    return {currency,perEur:val,date:row.TIME_PERIOD||now().slice(0,10)};
  }
  async function refreshFx(currencies){
    const unique=[...new Set(['SEK',...(currencies||[]).map(x=>String(x||'').toUpperCase()).filter(Boolean)])];
    const fetched={EUR:{currency:'EUR',perEur:1,date:now().slice(0,10)}};
    for(const c of unique){if(c!=='EUR')fetched[c]=await fetchEcbSeries(c)}
    const sek=fetched.SEK;
    if(!sek)throw new Error('ECB SEK-kurs saknas.');
    const rates={SEK:{toSEK:1,date:sek.date,source:'ECB'}};
    Object.values(fetched).forEach(x=>{rates[x.currency]={toSEK:sek.perEur/x.perEur,date:x.date,source:'ECB'}});
    const payload={updatedAt:now(),rates};
    localStorage.setItem(FX_KEY,JSON.stringify(payload));
    return payload;
  }
  function fxState(){try{return JSON.parse(localStorage.getItem(FX_KEY))||{rates:{SEK:{toSEK:1}}}}catch(e){return{rates:{SEK:{toSEK:1}}}}
  function fxToSek(currency){return num(fxState().rates?.[String(currency||'SEK').toUpperCase()]?.toSEK)||0}

  async function refreshMapping(mapping){
    if(mapping.provider!=='alphavantage')throw new Error('Endast Alpha Vantage är extern aktiepilot i 9.7.');
    const q=await fetchAlphaQuote(mapping.symbol);
    let fx=fxToSek(mapping.currency);
    if(!fx){
      await refreshFx([mapping.currency]);
      fx=fxToSek(mapping.currency);
    }
    return window.MKLivePortfolioPilot.upsert({
      id:mapping.holdingId,ticker:mapping.symbol,name:mapping.holdingName,
      assetType:mapping.assetType,currency:mapping.currency,price:q.price,fxToSek:fx,
      timestamp:q.timestamp,source:q.source,sourceUrl:q.sourceUrl,status:'delayed-or-eod',verified:true
    });
  }
  async function refreshAll(){
    const results=[];
    for(const m of mappings()){
      try{results.push({mapping:m,ok:true,quote:await refreshMapping(m)})}
      catch(e){results.push({mapping:m,ok:false,error:e.message})}
    }
    return results;
  }

  global.MKLiveConnectors970={getAlphaKey,setAlphaKey,clearAlphaKey,mappings,saveMapping,removeMapping,fetchAlphaQuote,refreshFx,fxState,fxToSek,refreshMapping,refreshAll};
})(window);
