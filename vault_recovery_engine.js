
window.MKVaultRecovery871={
 isPortfolio(obj){
   return !!obj && typeof obj==="object" && Array.isArray(obj.holdings) && obj.holdings.length>0;
 },
 score(obj){
   if(!this.isPortfolio(obj))return -1;
   let s=obj.holdings.length*10;
   if(obj.accounts?.length)s+=obj.accounts.length*2;
   if(obj.journal?.length)s+=Math.min(50,obj.journal.length);
   if(Number(obj.portfolio?.net)>0)s+=100;
   if(Number(obj.livePortfolio82?.portfolioValueSEK)>0)s+=80;
   return s;
 },
 discover(){
   const candidates=[];
   for(let i=0;i<localStorage.length;i++){
     const key=localStorage.key(i);
     try{
       const raw=localStorage.getItem(key),obj=JSON.parse(raw);
       if(this.isPortfolio(obj))candidates.push({key,data:obj,score:this.score(obj),holdings:obj.holdings.length});
     }catch(e){}
   }
   return candidates.sort((a,b)=>b.score-a.score);
 },
 async recover(){
   const found=this.discover();
   if(!found.length)return {status:"NOT_FOUND",candidates:[]};
   const best=found[0],report=window.MKPrivateVaultIntegrity87.report(best.data);
   await window.MKPrivateVaultDB87.put(best.data,"portfolio");
   localStorage.setItem("mk_vault_871_recovery_report",JSON.stringify({
     at:new Date().toISOString(),sourceKey:best.key,candidates:found.map(x=>({key:x.key,score:x.score,holdings:x.holdings})),report
   }));
   return {status:"RECOVERED",data:best.data,sourceKey:best.key,candidates:found,report};
 }
};
