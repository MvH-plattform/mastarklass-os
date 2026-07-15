
// Mästarklass OS 9.0.3
window.CreditRiskEngine={
 classify(u,b){
  const score=Math.max(u,b);
  if(score<20)return {level:'Låg',color:'green'};
  if(score<40)return {level:'Normal',color:'lime'};
  if(score<60)return {level:'Förhöjd',color:'orange'};
  return {level:'Hög',color:'red'};
 },
 advice(r){
  switch(r.level){
   case 'Låg': return 'Krediten används konservativt.';
   case 'Normal': return 'Följ utvecklingen och håll marginal.';
   case 'Förhöjd': return 'Överväg amortering före nya köp.';
   default:return 'Prioritera amortering och minska risken.';
  }
 }
};
