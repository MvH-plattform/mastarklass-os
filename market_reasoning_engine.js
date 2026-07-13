
window.MKMarketReasoning84={
 signals(){return window.DATA?.marketIntelligence84?.signals||[];},
 byImpact(impact){return this.signals().filter(x=>x.impact===impact);},
 facts(){return this.signals().filter(x=>x.classification==="FAKTA"||x.classification==="LOKAL DATA");}
};
