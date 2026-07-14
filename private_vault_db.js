
window.MKPrivateVaultDB87={
 DB_NAME:"mastarklass_private_vault",
 DB_VERSION:1,
 STORE:"private_state",
 open(){
   return new Promise((resolve,reject)=>{
     const req=indexedDB.open(this.DB_NAME,this.DB_VERSION);
     req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains(this.STORE))db.createObjectStore(this.STORE,{keyPath:"id"});};
     req.onsuccess=()=>resolve(req.result);
     req.onerror=()=>reject(req.error);
   });
 },
 async get(id="portfolio"){
   const db=await this.open();
   return new Promise((resolve,reject)=>{
     const tx=db.transaction(this.STORE,"readonly"),req=tx.objectStore(this.STORE).get(id);
     req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>reject(req.error);
   });
 },
 async put(data,id="portfolio"){
   const db=await this.open();
   const record={id,data,updatedAt:new Date().toISOString(),schemaVersion:1};
   return new Promise((resolve,reject)=>{
     const tx=db.transaction(this.STORE,"readwrite");
     tx.objectStore(this.STORE).put(record);
     tx.oncomplete=()=>resolve(record);tx.onerror=()=>reject(tx.error);
   });
 },
 async clear(){
   const db=await this.open();
   return new Promise((resolve,reject)=>{
     const tx=db.transaction(this.STORE,"readwrite");tx.objectStore(this.STORE).clear();
     tx.oncomplete=()=>resolve(true);tx.onerror=()=>reject(tx.error);
   });
 }
};
