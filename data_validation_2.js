
window.MKDataValidation2={
 validate(point){
   const errors=[],warnings=[];
   if(!point?.sourceId)errors.push("Källa saknas.");
   if(!point?.timestamp)errors.push("Tidsstämpel saknas.");
   if(point?.kind==="quote"&&!point?.currency)errors.push("Valuta saknas.");
   if(["quote","nav"].includes(point?.kind)){
     const v=Number(point?.value);
     if(!Number.isFinite(v)||v<=0)errors.push("Ogiltigt prisvärde.");
   }
   if(point?.previousValue!=null&&Number.isFinite(Number(point.value))&&Number.isFinite(Number(point.previousValue))&&Number(point.previousValue)!==0){
     const jump=Math.abs(Number(point.value)/Number(point.previousValue)-1)*100;
     if(jump>35)warnings.push(`Stort hopp: ${jump.toFixed(1)}%.`);
   }
   return {ok:errors.length===0,errors,warnings,status:errors.length?"VALIDATION_FAILED":warnings.length?"VERIFIED_WITH_WARNING":"VERIFIED"};
 }
};
