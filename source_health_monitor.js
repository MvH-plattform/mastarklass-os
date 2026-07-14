
window.MKSourceHealth86={
 classify(connector){
   const h=connector?.health||{};
   if((h.consecutiveFailures||0)>=5)return "OFFLINE";
   if((h.consecutiveFailures||0)>=3)return "DEGRADED";
   if(h.lastSuccess)return "HEALTHY";
   return "UNKNOWN";
 },
 recordSuccess(connector,latencyMs){
   connector.health.status="HEALTHY";
   connector.health.lastCheck=new Date().toISOString();
   connector.health.lastSuccess=connector.health.lastCheck;
   connector.health.latencyMs=latencyMs;
   connector.health.lastError=null;
   connector.health.consecutiveFailures=0;
 },
 recordFailure(connector,error){
   connector.health.lastCheck=new Date().toISOString();
   connector.health.lastError=String(error||"Unknown error");
   connector.health.consecutiveFailures=(connector.health.consecutiveFailures||0)+1;
   connector.health.status=this.classify(connector);
 }
};
