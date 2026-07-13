
window.MKSourceTrust85={
 list(){return window.DATA?.verifiedData85?.sourceRatings||[];},
 approved(){return this.list().filter(x=>x.status==="GODKÄND FÖR TEST");},
 best(category){
   return this.list().filter(x=>!category||x.category===category).sort((a,b)=>b.totalScore-a.totalScore)[0]||null;
 }
};
