
(function(){
  const META_KEY="mk_backup_meta_885";
  const HISTORY_KEY="mk_backup_history_885";
  const read=(k,fallback)=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(fallback))}catch(e){return fallback}};
  const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  window.MKAutomaticBackup885={
    meta(){
      return read(META_KEY,{changesSinceManual:0,lastAuto:null,lastManual:null,lastManualChecksum:null});
    },
    history(){return read(HISTORY_KEY,[])},
    record(type,detail){
      const list=this.history();
      list.unshift({at:new Date().toISOString(),type,detail});
      write(HISTORY_KEY,list.slice(0,100));
    },
    async afterChange(data,reason){
      const meta=this.meta();
      meta.changesSinceManual=(meta.changesSinceManual||0)+1;
      meta.lastAuto=new Date().toISOString();
      write(META_KEY,meta);
      if(window.MKPrivateVaultDB87){
        await window.MKPrivateVaultDB87.put(structuredClone(data),"auto_backup_latest");
      }
      this.record("AUTOMATISK LOKAL BACKUP",reason||"Portföljen ändrades.");
      return meta;
    },
    markManual(checksum,data){
      const meta=this.meta();
      meta.changesSinceManual=0;
      meta.lastManual=new Date().toISOString();
      meta.lastManualChecksum=checksum;
      meta.lastManualHoldings=data?.holdings?.length||0;
      meta.lastManualTransactions=data?.transactions?.length||0;
      write(META_KEY,meta);
      this.record("MANUELL KRYPTERAD BACKUP",`${meta.lastManualHoldings} innehav och ${meta.lastManualTransactions} transaktioner verifierades.`);
      return meta;
    },
    status(){
      const m=this.meta(),n=m.changesSinceManual||0;
      if(!m.lastManual)return {level:"RED",label:"Ingen manuell backup",message:"Skapa din första krypterade backup."};
      if(n===0)return {level:"GREEN",label:"Backup aktuell",message:"Inga ändringar sedan senaste manuella backup."};
      if(n<=10)return {level:"YELLOW",label:`${n} ändringar sedan backup`,message:"Ny backup rekommenderas snart."};
      return {level:"RED",label:`${n} ändringar sedan backup`,message:"Skapa en ny krypterad backup."};
    }
  };
})();
