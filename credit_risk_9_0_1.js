
(function(){
  const pct=(a,b)=>b>0?a/b*100:0;
  window.MKCreditRisk901={
    analyze(account){
      if(!account)return {configured:false,utilizationPct:0,loanToCollateralPct:0,annualInterestSEK:0,monthlyInterestSEK:0,dailyInterestSEK:0,level:"UNKNOWN",label:"Ej konfigurerad"};
      const utilizationPct=pct(account.usedSEK,account.limitSEK);
      const loanToCollateralPct=pct(account.usedSEK,account.collateralValueSEK);
      const annualInterestSEK=account.usedSEK*(account.annualRatePct/100);
      let level="GREEN",label="Mycket god";
      if(utilizationPct>=85){level="RED";label="Kritisk"}
      else if(utilizationPct>=70){level="ORANGE";label="Hög"}
      else if(utilizationPct>=50){level="YELLOW";label="Förhöjd"}
      return {
        configured:true,utilizationPct,loanToCollateralPct,
        annualInterestSEK,monthlyInterestSEK:annualInterestSEK/12,dailyInterestSEK:annualInterestSEK/365,
        level,label,availableSEK:Math.max(0,account.limitSEK-account.usedSEK)
      };
    }
  };
})();
