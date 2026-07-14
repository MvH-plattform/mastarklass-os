
window.MKPrivateVault87={
 legacyKeys:[
  "mastarklass_os_8_6_live_source_integration",
  "mastarklass_os_8_5_verified_data_engine",
  "mastarklass_os_8_4_market_intelligence_engine",
  "mastarklass_os_8_3_market_connect",
  "mastarklass_os_8_2_live_portfolio_engine",
  "mastarklass_os_8_1_live_foundation"
 ],
 saveTimer:null,lastSavedAt:null,
 async bootstrap(publicDefault){
   const stored=await window.MKPrivateVaultDB87.get("portfolio");
   if(stored?.data){
     this.lastSavedAt=stored.updatedAt;
     return {status:"LOADED",source:"INDEXED_DB",data:stored.data,updatedAt:stored.updatedAt};
   }
   for(const key of this.legacyKeys){
     const raw=localStorage.getItem(key);
     if(!raw)continue;
     try{
       const parsed=JSON.parse(raw);
       if(Array.isArray(parsed?.holdings)&&parsed.holdings.length){
         const report=window.MKPrivateVaultIntegrity87.report(parsed);
         await window.MKPrivateVaultDB87.put(parsed,"portfolio");
         localStorage.setItem("mk_vault_87_migration_report",JSON.stringify({from:key,at:new Date().toISOString(),report}));
         return {status:"MIGRATED",source:key,data:parsed,report};
       }
     }catch(e){console.warn("Legacy migration skipped",key,e);}
   }
   return {status:"EMPTY",source:"PUBLIC_TEMPLATE",data:publicDefault};
 },
 scheduleSave(data){
   clearTimeout(this.saveTimer);
   this.saveTimer=setTimeout(async()=>{await window.MKPrivateVaultDB87.put(data,"portfolio");this.lastSavedAt=new Date().toISOString();window.dispatchEvent(new CustomEvent("mk-vault-saved",{detail:{at:this.lastSavedAt}}));},350);
 },
 async saveNow(data){const r=await window.MKPrivateVaultDB87.put(data,"portfolio");this.lastSavedAt=r.updatedAt;return r;},
 async exportEncrypted(data,passphrase){
   const checksum=await window.MKPrivateVaultIntegrity87.checksum(data);
   const wrapper=await window.MKPrivateVaultCrypto87.encrypt({schemaVersion:1,checksum,data},passphrase);
   return wrapper;
 },
 async importEncrypted(wrapper,passphrase){
   const payload=await window.MKPrivateVaultCrypto87.decrypt(wrapper,passphrase);
   const actual=await window.MKPrivateVaultIntegrity87.checksum(payload.data);
   if(actual!==payload.checksum)throw new Error("Integritetskontrollen misslyckades.");
   await window.MKPrivateVaultDB87.put(payload.data,"portfolio");
   return {data:payload.data,report:window.MKPrivateVaultIntegrity87.report(payload.data),checksum:actual};
 }
};
