
window.MKSourceRegistry={
 list(){return (window.DATA?.liveFoundation81?.sources||[]).map(x=>({...x}));},
 enabled(){return this.list().filter(x=>x.enabled);},
 get(id){return this.list().find(x=>x.id===id)||null;},
 canActivate(source){
   return !!source && source.licenseStatus==="GODKÄND" && source.corsStatus==="GODKÄND" && source.adapterStatus==="TESTAD";
 }
};
