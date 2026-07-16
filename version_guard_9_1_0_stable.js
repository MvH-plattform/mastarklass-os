
(function(){
  const VERSION="9.1.0-stable";
  const CURRENT_CACHE="mastarklass-os-9-1-0-stable";
  window.MK_BUILD_VERSION=VERSION;

  async function cleanOldCaches(){
    if(!("caches" in window))return;
    try{
      const keys=await caches.keys();
      await Promise.all(
        keys
          .filter(k=>k.startsWith("mastarklass-os-") && k!==CURRENT_CACHE)
          .map(k=>caches.delete(k))
      );
    }catch(e){console.warn("Cache cleanup skipped",e)}
  }

  async function refreshWorkers(){
    if(!("serviceWorker" in navigator))return;
    try{
      const regs=await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r=>r.update().catch(()=>null)));
    }catch(e){console.warn("Service worker update skipped",e)}
  }

  window.addEventListener("load",()=>{
    document.documentElement.dataset.buildVersion=VERSION;
    cleanOldCaches();
    refreshWorkers();
  });
})();
