
window.MKCacheEngine={
 prefix:"mk_live_81_",
 put(key,payload,ttlMinutes){
   const item={payload,storedAt:Date.now(),expiresAt:Date.now()+ttlMinutes*60000};
   localStorage.setItem(this.prefix+key,JSON.stringify(item));return item;
 },
 get(key){
   try{
     const item=JSON.parse(localStorage.getItem(this.prefix+key)||"null");
     if(!item)return null;
     return {...item,stale:Date.now()>item.expiresAt};
   }catch{return null;}
 },
 clear(){Object.keys(localStorage).filter(k=>k.startsWith(this.prefix)).forEach(k=>localStorage.removeItem(k));}
};
