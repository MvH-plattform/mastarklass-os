
window.MKValidationEngine={
 validatePoint(point){
   const errors=[],warnings=[];
   if(!point||typeof point!=="object")errors.push("Datapunkt saknas.");
   const value=Number(point?.value);
   if(!Number.isFinite(value))errors.push("Värdet är inte numeriskt.");
   if(point?.kind==="quote"&&value<=0)errors.push("Kurs måste vara större än noll.");
   if(!point?.sourceId)errors.push("Källa saknas.");
   if(!point?.timestamp)errors.push("Tidsstämpel saknas.");
   if(point?.previousValue!=null&&Number.isFinite(Number(point.previousValue))&&Number(point.previousValue)!==0){
     const jump=Math.abs(value/Number(point.previousValue)-1)*100;
     if(jump>35)warnings.push(`Ovanligt hopp: ${jump.toFixed(1)}%.`);
   }
   return {ok:errors.length===0,errors,warnings};
 }
};
