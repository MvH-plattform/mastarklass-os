
window.MKOfficialMacroAdapters83={
 registry(){
   return {
     riksbank:{enabled:false,status:"PREPARED",categories:["Valutor","Ränta"]},
     scb:{enabled:false,status:"PREPARED",categories:["Makro"]}
   };
 },
 assertEnabled(id){
   const a=this.registry()[id];
   if(!a)throw new Error("Okänd officiell adapter.");
   if(!a.enabled)throw new Error("Adaptern är inte produktionsgodkänd.");
   return a;
 }
};
