
(function(){
  window.MKCreditIntegration901={
    async persist(data,reason){
      if(window.MKUnifiedData883)await window.MKUnifiedData883.adopt(data,{source:"investment-credit-9.0.1",persist:false});
      if(window.MKPrivateVault87)await window.MKPrivateVault87.saveNow(data);
      if(window.MKAutomaticBackup885)await window.MKAutomaticBackup885.afterChange(data,reason||"Kredit förändrades");
      window.MKEventBus883?.emit("portfolio:changed",{source:"investment-credit-9.0.1"});
    },
    creditImpactOnIQ(account){
      const r=window.MKCreditRisk901.analyze(account);
      if(!r.configured)return 0;
      if(r.level==="GREEN")return 0;
      if(r.level==="YELLOW")return -2;
      if(r.level==="ORANGE")return -5;
      return -10;
    }
  };
})();
