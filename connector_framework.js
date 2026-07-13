
window.MKConnectorFramework86={
 list(){return window.DATA?.liveSourceIntegration86?.connectors||[];},
 get(id){return this.list().find(x=>x.id===id)||null;},
 canEnterSandbox(c){
   return !!c && c.sourceStatus!=="BLOCKERAD" && c.productionStatus==="DISABLED";
 },
 canEnterProduction(c){
   if(!c)return false;
   const g=c.activationGate||{};
   return Object.values(g).every(Boolean) && c.sandboxStatus==="PASSED";
 }
};
