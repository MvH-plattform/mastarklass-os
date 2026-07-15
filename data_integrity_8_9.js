
(function(){
  const checksumLite=d=>{
    const hs=d?.holdings||[];
    return `${hs.length}|${hs.reduce((s,h)=>s+Number(h.quantity||0),0).toFixed(6)}|${(d?.transactions||[]).length}`;
  };
  window.MKDataIntegrity89={
    check(data){
      const issues=[],checks=[];
      const add=(name,ok,detail)=>checks.push({name,status:ok?"PASS":"FAIL",detail});
      const vaultLoaded=!!window.MK_VAULT_BOOT&&["LOADED","MIGRATED"].includes(window.MK_VAULT_BOOT.status);
      add("Private Vault laddat",vaultLoaded,window.MK_VAULT_BOOT?.status||"UNKNOWN");
      add("Unified Data Provider",!!window.MKUnifiedData883,window.MKUnifiedData883?"Tillgänglig":"Saknas");
      add("Innehav",Array.isArray(data?.holdings)&&data.holdings.length>0,`${data?.holdings?.length||0} innehav`);
      add("Transaktioner",Array.isArray(data?.transactions),`${data?.transactions?.length||0} transaktioner`);
      const duplicates=[];
      const seen=new Set();
      (data?.holdings||[]).forEach(h=>{
        const k=String(h.isin||h.ticker||h.name||"").trim().toLowerCase()+"|"+String(h.accountId||h.platform||"");
        if(seen.has(k))duplicates.push(h.name||h.ticker||"Okänt"); else seen.add(k);
      });
      add("Dubblettkontroll",duplicates.length===0,duplicates.length?duplicates.join(", "):"Inga exakta dubbletter");
      const missing=(data?.holdings||[]).filter(h=>!h.name).length;
      add("Obligatoriska namn",missing===0,`${missing} saknade`);
      const providerData=window.MKUnifiedData883?.get?.();
      add("Gemensam datarevision",!providerData||checksumLite(providerData)===checksumLite(data),"Dashboard, Analytics och Brain använder samma referens");
      checks.filter(x=>x.status==="FAIL").forEach(x=>issues.push(x.name));
      return {checks,issues,score:Math.round(checks.filter(x=>x.status==="PASS").length/checks.length*100),checksum:checksumLite(data)};
    }
  };
})();
