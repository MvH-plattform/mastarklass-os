
window.MKLiveDataManager={
 async fetchSource(sourceId,requestFn,cacheKey,ttlMinutes){
   const source=window.MKSourceRegistry?.get(sourceId);
   if(!source)throw new Error("Okänd källa.");
   if(!window.MKSourceRegistry.canActivate(source))throw new Error("Källan är inte produktionsgodkänd.");
   const cached=window.MKCacheEngine.get(cacheKey);
   if(cached&&!cached.stale)return {status:"cache",...cached};
   const raw=await requestFn();
   const validation=window.MKValidationEngine.validatePoint(raw);
   if(!validation.ok){
     if(cached)return {status:"fallback",...cached,validation};
     throw new Error(validation.errors.join(" "));
   }
   const saved=window.MKCacheEngine.put(cacheKey,raw,ttlMinutes);
   return {status:"fresh",...saved,validation};
 }
};
