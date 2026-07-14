const CACHE='mastarklass-os-8-8-2-smart-import-center';
const ASSETS=[
'./','./index.html','./manifest.json','./icon.svg',
'./digital_twin.js','./styles_6_1.css',
'./intelligence_7_0.js','./intelligence_7_0.css',
'./portfolio_brain.js','./portfolio_brain.css',
'./scenario_engine.js','./scenario_engine.css',
'./market_intelligence.js','./market_intelligence.css',
'./ai_portfolio_manager.js','./ai_portfolio_manager.css',
'./dividend_intelligence.js','./dividend_intelligence.css',
'./wealth_os.js','./wealth_os.css',
'./integration_7_6_1.js','./integration_7_6_1.css','./cognitive_wealth_8_0.js','./cognitive_wealth_8_0.css','./live_foundation_8_1.js','./live_foundation_8_1.css','./data_manager.js','./source_registry.js','./cache_engine.js','./validation_engine.js','./integration_monitor.js','./live_portfolio_8_2.js','./live_portfolio_8_2.css','./ticker_mapping.js','./portfolio_valuation.js','./snapshot_importer.js','./live_snapshot_template.csv','./market_connect_8_3.js','./market_connect_8_3.css','./official_macro_adapters.js','./market_snapshot_importer.js','./market_calendar.js','./market_snapshot_template.csv','./market_intelligence_8_4.js','./market_intelligence_8_4.css','./market_reasoning_engine.js','./portfolio_attribution.js','./calendar_intelligence.js','./verified_data_8_5.js','./verified_data_8_5.css','./source_trust_engine.js','./data_validation_2.js','./cache_policy_2.js','./data_lineage.js','./legal_compliance.js','./live_source_integration_8_6.js','./live_source_integration_8_6.css','./connector_framework.js','./integration_scheduler.js','./source_health_monitor.js','./provider_router.js','./activation_gate.js','./private_vault_8_7.js','./private_vault_8_7.css','./private_vault_db.js','./private_vault_crypto.js','./private_vault_migration.js','./private_vault_integrity.js'
'./vault_recovery_engine.js','./portfolio_file_importer.js','./vault_health_check.js','./vault_recovery_8_7_1.js','./vault_recovery_8_7_1.css''./portfolio_intelligence_engine.js','./portfolio_exposure_engine.js','./portfolio_health_engine.js','./portfolio_snapshot_engine.js','./portfolio_intelligence_8_8.js','./portfolio_intelligence_8_8.css''./portfolio_discovery_8_8_1.js','./portfolio_candidate_ranker.js','./portfolio_merge_engine.js','./portfolio_import_validator.js','./intelligent_import_8_8_1.js','./intelligent_import_8_8_1.css''./smart_import_center_8_8_2.js','./smart_import_center_8_8_2.css'];

self.addEventListener('install',event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',event=>{
  const req=event.request;
  const url=new URL(req.url);
  if(req.mode==='navigate' || url.pathname.endsWith('/index.html')){
    event.respondWith(
      fetch(req).then(res=>{
        const copy=res.clone();
        caches.open(CACHE).then(cache=>cache.put('./index.html',copy));
        return res;
      }).catch(()=>caches.match('./index.html'))
    );
    return;
  }
  if(req.method==='GET' && url.origin===self.location.origin){
    event.respondWith(
      caches.match(req).then(cached=>cached || fetch(req).then(res=>{
        const copy=res.clone();
        caches.open(CACHE).then(cache=>cache.put(req,copy));
        return res;
      }))
    );
  }
});
