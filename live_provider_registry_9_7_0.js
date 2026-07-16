
(function(global){
  'use strict';
  const VERSION='9.7.0';
  const KEY='mkos.live.registry.v2';
  const now=()=>new Date().toISOString();
  const defaults=[
    {id:'ecb-fx',name:'ECB Data Portal',type:'remote',enabled:true,priority:100,legalStatus:'approved-pilot',health:'ready',supports:['fx'],frequency:'daily',notes:'Officiella ECB-referenskurser. SEK-kors räknas via EUR.'},
    {id:'alphavantage',name:'Alpha Vantage',type:'remote',enabled:false,priority:80,legalStatus:'approved-pilot-user-key',health:'needs-key',supports:['equity','etf'],frequency:'provider-plan',notes:'Egen API-nyckel. Pilot för ett begränsat antal aktier/ETF:er.'},
    {id:'manual',name:'Manuell verifierad kurs',type:'manual',enabled:true,priority:60,legalStatus:'approved',health:'ready',supports:['equity','etf','fund','fx'],frequency:'manual',notes:'Lokal reservkälla.'},
    {id:'csv',name:'Verifierad CSV-import',type:'file',enabled:true,priority:50,legalStatus:'approved',health:'ready',supports:['equity','etf','fund','fx'],frequency:'manual',notes:'Read-only import med källa och tidsstämpel.'},
    {id:'fund-pilot',name:'Fondkurspilot',type:'remote',enabled:false,priority:40,legalStatus:'research',health:'disabled',supports:['fund'],frequency:'daily',notes:'Ingen extern fondkälla aktiverad ännu.'}
  ];
  function fresh(){return {version:VERSION,updatedAt:now(),providers:structuredClone(defaults)}}
  function load(){
    try{
      const s=JSON.parse(localStorage.getItem(KEY));
      if(!s||!Array.isArray(s.providers))return fresh();
      defaults.forEach(d=>{if(!s.providers.some(p=>p.id===d.id))s.providers.push(structuredClone(d))});
      return s;
    }catch(e){return fresh()}
  }
  function save(s){s.updatedAt=now();localStorage.setItem(KEY,JSON.stringify(s));return s}
  function list(){return load().providers.slice().sort((a,b)=>b.priority-a.priority)}
  function update(id,patch){const s=load(),p=s.providers.find(x=>x.id===id);if(!p)throw new Error('Okänd provider: '+id);Object.assign(p,patch);return save(s)}
  function choose(assetType){return list().find(p=>p.enabled&&String(p.legalStatus).startsWith('approved')&&p.health==='ready'&&p.supports.includes(assetType))||null}
  global.MKLiveProviderRegistry={VERSION,list,load,save,update,choose};
})(window);
