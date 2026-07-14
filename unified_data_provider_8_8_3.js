
(function(){
  let current=null;
  let revision=0;
  const clone=x=>{try{return structuredClone(x)}catch(e){return JSON.parse(JSON.stringify(x))}};
  const normalize=d=>{
    const x=d&&typeof d==="object"?d:{};
    x.holdings=Array.isArray(x.holdings)?x.holdings:[];
    x.accounts=Array.isArray(x.accounts)?x.accounts:[];
    x.portfolio=x.portfolio&&typeof x.portfolio==="object"?x.portfolio:{};
    x.app=x.app&&typeof x.app==="object"?x.app:{};
    x.app.name="Mästarklass OS 8.8.3 – Unified Data Sync";
    x.app.mode=x.app.mode||"8.8.3 Unified Data Sync";
    x.app.version="8.8.3-unified-data-sync";
    x.app.updated="2026-07-14";
    return x;
  };
  window.MKUnifiedData883={
    async adopt(data,opts={}){
      current=normalize(data);
      revision++;
      window.DATA=current;
      if(opts.persist!==false && window.MKPrivateVault87){
        try{window.MKPrivateVault87.scheduleSave(current)}catch(e){}
      }
      window.MKEventBus883?.emit("data:adopted",{source:opts.source||"unknown",revision,holdings:current.holdings.length});
      return current;
    },
    get(){return current||window.DATA||null},
    clone(){return clone(this.get())},
    revision(){return revision},
    holdings(){return this.get()?.holdings||[]},
    accounts(){return this.get()?.accounts||[]},
    status(){
      const d=this.get();
      return {loaded:!!d,holdings:d?.holdings?.length||0,revision,vault:window.MK_VAULT_BOOT?.status||"UNKNOWN"};
    }
  };
})();
