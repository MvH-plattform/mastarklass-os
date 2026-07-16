
(function(){
  const VERSION="9.2.0";
  const CACHE="mastarklass-os-9-2-0";
  window.MK_BUILD_VERSION=VERSION;
  window.addEventListener("load",async()=>{
    document.documentElement.dataset.buildVersion=VERSION;
    if("caches" in window){
      try{
        const keys=await caches.keys();
        await Promise.all(keys.filter(k=>k.startsWith("mastarklass-os-")&&k!==CACHE).map(k=>caches.delete(k)));
      }catch(e){console.warn("Cacheväxling hoppades över",e)}
    }
    if("serviceWorker" in navigator){
      try{(await navigator.serviceWorker.getRegistrations()).forEach(r=>r.update().catch(()=>null))}catch(e){}
    }
  });
})();
