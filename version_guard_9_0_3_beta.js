
(function(){
  const VERSION="9.0.3-beta";
  const CURRENT_CACHE="mastarklass-os-9-0-3-beta";
  window.MK_BUILD_VERSION=VERSION;

  async function cleanOldAppCaches(){
    if(!("caches" in window))return;
    try{
      const keys=await caches.keys();
      await Promise.all(keys
        .filter(k=>k.startsWith("mastarklass-os-") && k!==CURRENT_CACHE)
        .map(k=>caches.delete(k)));
    }catch(e){console.warn("Cache cleanup skipped",e)}
  }

  async function refreshServiceWorker(){
    if(!("serviceWorker" in navigator))return;
    try{
      const regs=await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r=>r.update().catch(()=>null)));
    }catch(e){console.warn("Service worker update skipped",e)}
  }

  window.addEventListener("load",()=>{
    cleanOldAppCaches();
    refreshServiceWorker();
    document.documentElement.dataset.buildVersion=VERSION;
  });
})();
