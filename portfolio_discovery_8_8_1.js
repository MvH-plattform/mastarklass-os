
window.MKPortfolioDiscovery881={
 isPortfolio(obj){
   return !!obj && typeof obj==="object" && Array.isArray(obj.holdings) && obj.holdings.length>0;
 },
 async localStorageCandidates(){
   const out=[];
   for(let i=0;i<localStorage.length;i++){
     const key=localStorage.key(i);
     try{
       const raw=localStorage.getItem(key),obj=JSON.parse(raw);
       if(this.isPortfolio(obj))out.push({id:"ls:"+key,source:"LocalStorage",name:key,data:obj});
     }catch(e){}
   }
   return out;
 },
 async readDatabase(name){
   return new Promise(resolve=>{
     const req=indexedDB.open(name);
     let upgraded=false;
     req.onupgradeneeded=()=>{upgraded=true;req.transaction.abort();};
     req.onerror=()=>resolve([]);
     req.onsuccess=async()=>{
       const db=req.result;
       if(upgraded){db.close();resolve([]);return;}
       const found=[];
       try{
         for(const storeName of Array.from(db.objectStoreNames)){
           try{
             const tx=db.transaction(storeName,"readonly"),store=tx.objectStore(storeName);
             const allReq=store.getAll();
             const values=await new Promise(r=>{allReq.onsuccess=()=>r(allReq.result||[]);allReq.onerror=()=>r([]);});
             values.forEach((v,idx)=>{
               const obj=v?.data||v;
               if(this.isPortfolio(obj))found.push({id:`idb:${name}:${storeName}:${idx}`,source:"IndexedDB",name:`${name}/${storeName}`,data:obj});
             });
           }catch(e){}
         }
       }finally{db.close();}
       resolve(found);
     };
   });
 },
 async indexedDBCandidates(){
   const names=new Set(["mastarklass_private_vault","mastarklass_os","mastarklass","portfolio_vault"]);
   try{
     if(indexedDB.databases){
       const dbs=await indexedDB.databases();
       dbs.forEach(d=>{if(d.name)names.add(d.name);});
     }
   }catch(e){}
   const batches=await Promise.all([...names].map(n=>this.readDatabase(n)));
   return batches.flat();
 },
 async all(){
   const [ls,idb]=await Promise.all([this.localStorageCandidates(),this.indexedDBCandidates()]);
   const seen=new Set(),out=[];
   for(const c of [...idb,...ls]){
     const sig=(c.data.holdings||[]).map(h=>`${h.name}|${h.accountId||h.platform||""}|${h.quantity||""}`).sort().join(";");
     if(!seen.has(sig)){seen.add(sig);out.push(c);}
   }
   return out;
 }
};
