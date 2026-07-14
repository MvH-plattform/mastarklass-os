
window.MKCachePolicy2={
 policy(type){
   return (window.DATA?.verifiedData85?.cachePolicies||[]).find(x=>x.type===type)||null;
 },
 state(item,type){
   const p=this.policy(type);if(!p||!item?.storedAt)return "UNKNOWN";
   const age=(Date.now()-new Date(item.storedAt).getTime())/60000;
   if(age<=p.ttlMinutes)return "FRESH";
   if(age<=p.maxStaleMinutes)return "STALE";
   return "EXPIRED";
 }
};
