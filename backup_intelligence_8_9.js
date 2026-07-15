
(function(){
  window.MKBackupIntelligence89={
    analyze(data){
      const meta=window.MKAutomaticBackup885?.meta?.()||{};
      const base=window.MKAutomaticBackup885?.status?.()||{level:"RED",label:"Backup saknas",message:"Skapa backup."};
      const days=meta.lastManual?(Date.now()-new Date(meta.lastManual).getTime())/86400000:null;
      let level=base.level,label=base.label,message=base.message;
      if(days!=null&&days>30){level="RED";label="Backup för gammal";message=`Senaste manuella backup är ${Math.floor(days)} dagar gammal.`}
      else if(days!=null&&days>7&&level==="GREEN"){level="YELLOW";label="Backup rekommenderas";message=`Senaste manuella backup är ${Math.floor(days)} dagar gammal.`}
      return {
        level,label,message,
        lastManual:meta.lastManual||null,
        lastAuto:meta.lastAuto||null,
        changes:meta.changesSinceManual||0,
        holdings:data?.holdings?.length||0,
        transactions:data?.transactions?.length||0
      };
    }
  };
})();
