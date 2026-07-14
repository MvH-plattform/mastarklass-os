
(function(){
  const wrapRestore=()=>{
    const names=["restoreSelectedCandidate881","restoreCandidate881","restorePortfolioCandidate881"];
    names.forEach(name=>{
      const old=window[name];
      if(typeof old!=="function"||old.__sync883)return;
      const wrapped=async function(...args){
        const result=await old.apply(this,args);
        const restored=(result&&result.data)||window.MK_VAULT_BOOT?.data||window.DATA;
        if(restored)await window.MKUnifiedData883?.adopt(restored,{source:name,persist:false});
        window.MKEventBus883?.emit("portfolio:changed",{source:name});
        return result;
      };
      wrapped.__sync883=true;
      window[name]=wrapped;
    });
  };
  let tries=0;
  const timer=setInterval(()=>{
    wrapRestore();
    tries++;
    if(tries>20)clearInterval(timer);
  },250);
})();
