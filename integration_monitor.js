
window.MKIntegrationMonitor={
 snapshot(){
   const p=window.DATA?.liveFoundation81;
   if(!p)return null;
   return {
     readiness:p.readinessScore,
     registered:p.registeredSources,
     active:p.activeSources,
     passed:p.passedChecks,
     waiting:p.waitingChecks,
     timestamp:new Date().toISOString()
   };
 }
};
