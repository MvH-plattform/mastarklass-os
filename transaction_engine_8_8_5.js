
(function(){
  const num=v=>{const n=Number(v);return Number.isFinite(n)?n:0};
  const round=(v,d=6)=>Math.round(v*10**d)/10**d;
  const now=()=>new Date().toISOString();

  function holdingValue(h){
    return num(h.marketValueSEK||h.marketValue||h.currentValue||h.costValueSEK||0);
  }
  function findHolding(data,id){
    return (data.holdings||[]).find(h=>String(h.id||h.isin||h.ticker||h.name)===String(id));
  }
  function holdingId(h){return String(h.id||h.isin||h.ticker||h.name);}
  function normalize(data){
    data.holdings=Array.isArray(data.holdings)?data.holdings:[];
    data.transactions=Array.isArray(data.transactions)?data.transactions:[];
    return data;
  }
  function recalcPortfolio(data){
    const values=(data.holdings||[]).map(holdingValue);
    const total=values.reduce((s,v)=>s+v,0);
    data.portfolio=data.portfolio||{};
    if(total>0)data.portfolio.net=round(total,2);
  }

  window.MKTransactionEngine885={
    normalize,
    holdingId,
    findHolding,
    preview(data,input){
      const h=findHolding(data,input.holdingId);
      if(!h)throw new Error("Välj ett innehav.");
      const type=input.type;
      const qty=num(input.quantity),price=num(input.price),fee=num(input.fee),fx=num(input.fx)||1;
      const oldQty=num(h.quantity),oldAvg=num(h.averageCost);
      if(type!=="DIVIDEND" && qty<=0)throw new Error("Antalet måste vara större än noll.");
      if(type!=="DIVIDEND" && price<=0)throw new Error("Priset måste vara större än noll.");
      if(type==="SELL" && qty>oldQty)throw new Error(`Du kan inte sälja fler än registrerade ${oldQty}.`);
      let nextQty=oldQty,nextAvg=oldAvg,cashSEK=0;
      if(type==="BUY"){
        nextQty=oldQty+qty;
        const oldCost=oldQty*oldAvg;
        const newCost=qty*price+(fee/fx);
        nextAvg=nextQty?round((oldCost+newCost)/nextQty,6):0;
        cashSEK=-(qty*price*fx+fee);
      }else if(type==="SELL"){
        nextQty=oldQty-qty;
        nextAvg=nextQty>0?oldAvg:0;
        cashSEK=qty*price*fx-fee;
      }else{
        const dividend=num(input.dividendSEK);
        if(dividend<=0)throw new Error("Utdelningsbeloppet måste vara större än noll.");
        cashSEK=dividend;
      }
      return {holding:h,type,oldQty,nextQty,oldAvg,nextAvg,cashSEK,qty,price,fee,fx};
    },
    async apply(data,input){
      normalize(data);
      const p=this.preview(data,input);
      const h=p.holding;
      const before=structuredClone(h);
      if(p.type!=="DIVIDEND"){
        h.quantity=round(p.nextQty,6);
        h.averageCost=round(p.nextAvg,6);
        h.currency=String(input.currency||h.currency||"SEK").toUpperCase();
        h.costValueSEK=round(h.quantity*h.averageCost*p.fx,2);
        const oldMarketValue=holdingValue(before);
        const inferredMarketPrice=p.oldQty>0&&oldMarketValue>0?oldMarketValue/p.oldQty:0;
        h.marketValueSEK=round(h.quantity*(inferredMarketPrice||p.price*p.fx),2);
        h.status=h.status||"verified-local-transaction";
      }
      const tx={
        id:crypto.randomUUID?crypto.randomUUID():`tx-${Date.now()}-${Math.random()}`,
        createdAt:now(),
        date:input.date||now().slice(0,10),
        type:p.type,
        holdingId:this.holdingId(h),
        holdingName:h.name,
        accountId:input.accountId||h.accountId||h.platform||"",
        quantity:p.type==="DIVIDEND"?0:p.qty,
        price:p.type==="DIVIDEND"?0:p.price,
        currency:String(input.currency||h.currency||"SEK").toUpperCase(),
        fxRate:p.fx,
        feeSEK:p.fee,
        dividendSEK:p.type==="DIVIDEND"?num(input.dividendSEK):0,
        cashFlowSEK:round(p.cashSEK,2),
        note:input.note||"",
        before:{quantity:p.oldQty,averageCost:p.oldAvg},
        after:{quantity:p.nextQty,averageCost:p.nextAvg}
      };
      data.transactions.push(tx);
      data.journal=Array.isArray(data.journal)?data.journal:[];
      data.journal.unshift({
        date:tx.date,
        title:`${p.type==="BUY"?"Köp":p.type==="SELL"?"Försäljning":"Utdelning"} · ${h.name}`,
        text:p.type==="DIVIDEND"
          ? `${tx.dividendSEK.toLocaleString("sv-SE")} kr registrerad utdelning.`
          : `${tx.quantity} st à ${tx.price} ${tx.currency}. Nytt antal ${tx.after.quantity}; nytt GAV ${tx.after.averageCost}.`
      });
      recalcPortfolio(data);
      return {data,transaction:tx,preview:p};
    },
    async remove(data,transactionId){
      normalize(data);
      const idx=data.transactions.findIndex(t=>t.id===transactionId);
      if(idx<0)throw new Error("Transaktionen hittades inte.");
      const tx=data.transactions[idx],h=findHolding(data,tx.holdingId);
      if(!h)throw new Error("Innehavet hittades inte.");
      h.quantity=tx.before.quantity;
      h.averageCost=tx.before.averageCost;
      const fx=num(tx.fxRate)||1;
      h.costValueSEK=round(num(h.quantity)*num(h.averageCost)*fx,2);
      data.transactions.splice(idx,1);
      recalcPortfolio(data);
      return tx;
    }
  };
})();
