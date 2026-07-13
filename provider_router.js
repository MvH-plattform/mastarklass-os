
window.MKProviderRouter86={
 candidates(category){
   return (window.DATA?.liveSourceIntegration86?.connectors||[])
     .filter(c=>!category||c.category===category)
     .sort((a,b)=>(b.trustScore||0)-(a.trustScore||0));
 },
 choose(category){
   return this.candidates(category).find(c=>c.enabled&&c.productionStatus==="ENABLED"&&window.MKConnectorFramework86.canEnterProduction(c))||null;
 }
};
