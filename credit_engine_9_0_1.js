
(function(){
  const num=v=>{const n=Number(v);return Number.isFinite(n)?n:0};
  const round=v=>Math.round(v*100)/100;
  function ensure(data){
    data.investmentCredit901=data.investmentCredit901||{accounts:[],events:[],settings:{}};
    data.investmentCredit901.accounts=Array.isArray(data.investmentCredit901.accounts)?data.investmentCredit901.accounts:[];
    data.investmentCredit901.events=Array.isArray(data.investmentCredit901.events)?data.investmentCredit901.events:[];
    return data.investmentCredit901;
  }
  window.MKCreditEngine901={
    ensure,
    account(data){return ensure(data).accounts[0]||null},
    saveAccount(data,input){
      const root=ensure(data);
      const account={
        id:root.accounts[0]?.id||"avanza-investment-credit",
        name:input.name||"Avanza Kredit",
        platform:input.platform||"Avanza KF",
        limitSEK:round(num(input.limitSEK)),
        usedSEK:round(num(input.usedSEK)),
        annualRatePct:round(num(input.annualRatePct)),
        collateralValueSEK:round(num(input.collateralValueSEK)),
        updatedAt:new Date().toISOString()
      };
      if(account.usedSEK>account.limitSEK&&account.limitSEK>0)throw new Error("Utnyttjad kredit kan inte överstiga kreditlimiten.");
      root.accounts=[account];
      return account;
    },
    previewEvent(data,input){
      const account=this.account(data);
      if(!account)throw new Error("Konfigurera först kreditkontot.");
      const amount=round(num(input.amountSEK));
      if(amount<=0)throw new Error("Beloppet måste vara större än noll.");
      let after=account.usedSEK;
      if(input.type==="DRAW"||input.type==="INTEREST")after+=amount;
      if(input.type==="REPAY")after-=amount;
      if(input.type==="ADJUST")after=amount;
      after=Math.max(0,round(after));
      if(account.limitSEK>0&&after>account.limitSEK)throw new Error("Förändringen överskrider kreditlimiten.");
      return {before:account.usedSEK,after,delta:round(after-account.usedSEK),account};
    },
    applyEvent(data,input){
      const root=ensure(data),p=this.previewEvent(data,input),account=p.account;
      account.usedSEK=p.after;account.updatedAt=new Date().toISOString();
      const event={
        id:crypto.randomUUID?crypto.randomUUID():`credit-${Date.now()}`,
        date:input.date||new Date().toISOString().slice(0,10),
        createdAt:new Date().toISOString(),
        type:input.type,
        amountSEK:round(num(input.amountSEK)),
        link:input.link||"MANUAL",
        note:input.note||"",
        beforeSEK:p.before,
        afterSEK:p.after
      };
      root.events.unshift(event);
      return event;
    },
    simulate(data,type,amount){
      const account=this.account(data);
      if(!account)throw new Error("Konfigurera först kreditkontot.");
      amount=round(num(amount));
      let after=account.usedSEK;
      if(type==="BUY_CREDIT")after+=amount;
      else after-=amount;
      after=Math.max(0,after);
      return {before:account.usedSEK,after,delta:round(after-account.usedSEK),account};
    }
  };
})();
