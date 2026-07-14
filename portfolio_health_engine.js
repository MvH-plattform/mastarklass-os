
window.MKPortfolioHealth88={
 clamp(v){return Math.max(0,Math.min(100,Math.round(v)));},
 score(data){
   const h=Array.isArray(data?.holdings)?data.holdings:[],x=window.MKPortfolioExposure88,total=x.total(h);
   if(!h.length)return {total:0,components:{},coverage:0,largestWeight:0,issues:["Ingen lokal portfölj är laddad."],priorities:[]};
   const values=h.map(z=>x.value(z)).sort((a,b)=>b-a);
   const largest=total?values[0]/total*100:0;
   const top5=total?values.slice(0,5).reduce((s,v)=>s+v,0)/total*100:0;
   const sectors=x.group(h,"sector"),countries=x.group(h,"country"),currencies=x.group(h,"currency"),assets=x.assets(h);
   const fields=["name","type","currency","country","sector"];
   const filled=h.reduce((s,z)=>s+fields.filter(f=>String(z?.[f]||"").trim()).length,0);
   const coverage=filled/(h.length*fields.length)*100;
   const diversification=this.clamp(Math.min(100,h.length*4));
   const concentration=this.clamp(100-Math.max(0,largest-10)*2-Math.max(0,top5-55));
   const currencyBalance=this.clamp(currencies.length<=1?45:currencies.length===2?70:currencies.length===3?85:95);
   const countryBalance=this.clamp(countries.length<=1?45:countries.length===2?68:countries.length===3?82:95);
   const assetMix=this.clamp(assets.length<=1?55:assets.length===2?80:95);
   const dataCompleteness=this.clamp(coverage);
   const components={Diversifiering:diversification,Koncentration:concentration,Valutabalans:currencyBalance,Landbalans:countryBalance,Tillgångsmix:assetMix,Datakvalitet:dataCompleteness};
   const weights={Diversifiering:.20,Koncentration:.20,Valutabalans:.15,Landbalans:.15,Tillgångsmix:.15,Datakvalitet:.15};
   const totalScore=this.clamp(Object.entries(components).reduce((s,[k,v])=>s+v*weights[k],0));
   const issues=[],priorities=[];
   if(largest>20){issues.push(`Största innehavet väger ${largest.toFixed(1)}%.`);priorities.push({title:"Minska koncentrationsrisken",detail:"Största innehavet överstiger 20 % av portföljen.",impact:"HÖG"});}
   if(top5>60){issues.push(`Fem största innehaven väger ${top5.toFixed(1)}%.`);priorities.push({title:"Bredda kapitalet",detail:"De fem största innehaven dominerar portföljen.",impact:"HÖG"});}
   if(coverage<80){issues.push(`Datatäckningen är ${coverage.toFixed(0)}%.`);priorities.push({title:"Komplettera innehavsdata",detail:"Land, sektor, valuta eller tillgångstyp saknas för flera innehav.",impact:"MEDEL"});}
   if(currencies.length<=1){priorities.push({title:"Granska valutaexponeringen",detail:"Portföljen är registrerad i endast en valuta.",impact:"MEDEL"});}
   if(countries.length<=1){priorities.push({title:"Granska landexponeringen",detail:"Portföljen är registrerad mot endast ett land.",impact:"MEDEL"});}
   if(!priorities.length)priorities.push({title:"Behåll strukturen",detail:"Inga större lokala strukturproblem har identifierats.",impact:"LÅG"});
   return {total:totalScore,components,coverage,largestWeight:largest,top5Weight:top5,sectors,countries,currencies,assets,issues,priorities};
 }
};
