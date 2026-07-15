
(function(){
  const num=v=>{const n=Number(v);return Number.isFinite(n)?n:0};
  const value=h=>num(h.marketValueSEK||h.marketValue||h.currentValue||h.costValueSEK||0);
  const key=h=>String(h.id||h.isin||h.ticker||h.name);
  const group=(holdings,field)=>{
    const total=holdings.reduce((s,h)=>s+value(h),0),map={};
    holdings.forEach(h=>{const k=String(h[field]||"Okänt");map[k]=(map[k]||0)+value(h)});
    return Object.entries(map).map(([name,v])=>({name,value:v,weight:total?v/total*100:0})).sort((a,b)=>b.value-a.value);
  };
  function iq(holdings){
    if(!holdings.length)return 0;
    const total=holdings.reduce((s,h)=>s+value(h),0);
    const vals=holdings.map(value).sort((a,b)=>b-a);
    const largest=total?vals[0]/total*100:0;
    const top5=total?vals.slice(0,5).reduce((s,v)=>s+v,0)/total*100:0;
    const sectors=group(holdings,"sector").length;
    const countries=group(holdings,"country").length;
    const currencies=group(holdings,"currency").length;
    const fields=["name","type","currency","country","sector"];
    const coverage=holdings.reduce((s,h)=>s+fields.filter(f=>String(h[f]||"").trim()).length,0)/(holdings.length*fields.length)*100;
    let score=45+Math.min(20,holdings.length*.25)+Math.min(10,sectors*1.2)+Math.min(8,countries*1.5)+Math.min(7,currencies*1.8)+coverage*.1-largest*.25-Math.max(0,top5-60)*.15;
    return Math.max(0,Math.min(100,Math.round(score)));
  }
  window.MKPortfolioImpact89={
    key,value,group,iq,
    simulate(data,input){
      const holdings=structuredClone(data?.holdings||[]);
      const h=holdings.find(x=>key(x)===String(input.holdingId));
      if(!h)throw new Error("Välj ett innehav.");
      const qty=num(input.quantity),price=num(input.price),fx=num(input.fx)||1,fee=num(input.fee);
      if(qty<=0||price<=0)throw new Error("Ange antal och pris.");
      const oldQty=num(h.quantity),oldValue=value(h),oldAvg=num(h.averageCost);
      if(input.type==="SELL"&&qty>oldQty)throw new Error(`Maximalt registrerat antal är ${oldQty}.`);
      const totalBefore=holdings.reduce((s,x)=>s+value(x),0);
      const iqBefore=iq(holdings);
      const oldWeight=totalBefore?oldValue/totalBefore*100:0;
      if(input.type==="BUY"){
        h.quantity=oldQty+qty;
        const newCostSEK=qty*price*fx+fee;
        h.marketValueSEK=oldValue+newCostSEK;
        h.costValueSEK=num(h.costValueSEK)+newCostSEK;
        h.averageCost=h.quantity?((oldQty*oldAvg)+(qty*price)+(fee/fx))/h.quantity:0;
      }else{
        const reduction=oldQty?oldValue*(qty/oldQty):qty*price*fx;
        h.quantity=oldQty-qty;
        h.marketValueSEK=Math.max(0,oldValue-reduction);
        h.costValueSEK=Math.max(0,num(h.costValueSEK)-num(h.costValueSEK)*(qty/Math.max(oldQty,1)));
      }
      const totalAfter=holdings.reduce((s,x)=>s+value(x),0);
      const newValue=value(h),newWeight=totalAfter?newValue/totalAfter*100:0;
      const sectorsBefore=group(data.holdings||[],"sector");
      const sectorsAfter=group(holdings,"sector");
      const currenciesBefore=group(data.holdings||[],"currency");
      const currenciesAfter=group(holdings,"currency");
      const iqAfter=iq(holdings);
      return {
        holding:h,
        holdings,
        before:{quantity:oldQty,value:oldValue,weight:oldWeight,total:totalBefore,iq:iqBefore},
        after:{quantity:num(h.quantity),value:newValue,weight:newWeight,total:totalAfter,iq:iqAfter},
        delta:{
          quantity:num(h.quantity)-oldQty,
          value:newValue-oldValue,
          weight:newWeight-oldWeight,
          total:totalAfter-totalBefore,
          iq:iqAfter-iqBefore
        },
        sectorsBefore,sectorsAfter,currenciesBefore,currenciesAfter,
        input
      };
    }
  };
})();
