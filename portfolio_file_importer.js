
window.MKPortfolioFileImporter871={
 num(v){
   if(v==null||v==="")return 0;
   const s=String(v).trim().replace(/\s/g,"").replace(",",".");
   const n=Number(s);return Number.isFinite(n)?n:0;
 },
 parseCSV(text){
   const rows=[];let row=[],cell="",quote=false;
   for(let i=0;i<text.length;i++){
     const c=text[i],n=text[i+1];
     if(c==='"'&&quote&&n==='"'){cell+='"';i++;continue;}
     if(c==='"'){quote=!quote;continue;}
     if(c===","&&!quote){row.push(cell);cell="";continue;}
     if((c==="\n"||c==="\r")&&!quote){
       if(c==="\r"&&n==="\n")i++;
       row.push(cell);cell="";
       if(row.some(x=>String(x).trim()!==""))rows.push(row);
       row=[];continue;
     }
     cell+=c;
   }
   if(cell||row.length){row.push(cell);rows.push(row);}
   if(rows.length<2)throw new Error("CSV-filen saknar innehavsrader.");
   const headers=rows[0].map(x=>String(x).trim());
   return rows.slice(1).map(r=>Object.fromEntries(headers.map((h,i)=>[h,r[i]??""])));
 },
 normalizeRecord(r){
   const pick=(...keys)=>{for(const k of keys)if(r[k]!=null&&String(r[k]).trim()!=="")return r[k];return "";};
   const name=pick("name","Namn","instrument","Instrument","värdepapper","Värdepapper");
   if(!name)return null;
   const type=pick("type","Typ","instrumentType","Instrumenttyp")||"Aktie";
   const quantity=this.num(pick("quantity","Antal","antal","shares","units"));
   const marketValue=this.num(pick("marketValueSEK","Marknadsvärde","marknadsvarde","valueSEK","Värde"));
   const costValue=this.num(pick("costValueSEK","Anskaffningsvärde","anskaffningsvarde","costSEK"));
   const averageCost=this.num(pick("averageCost","GAV","gav","snittkurs"));
   return {
     name:String(name).trim(),
     platform:String(pick("platform","Plattform","broker","Mäklare")||"Lokal import").trim(),
     accountId:String(pick("accountId","Konto","konto","account")||"Privat konto").trim(),
     type:String(type).trim(),
     ticker:String(pick("ticker","Ticker","symbol","Symbol")).trim(),
     isin:String(pick("isin","ISIN")).trim(),
     quantity,
     averageCost,
     currency:String(pick("currency","Valuta","valuta")||"SEK").trim(),
     costValueSEK:costValue,
     marketValueSEK:marketValue,
     country:String(pick("country","Land","land")).trim(),
     sector:String(pick("sector","Sektor","sektor")).trim(),
     status:"verified-local-import",
     notes:String(pick("notes","Notering","Anteckning","Kommentar")).trim()
   };
 },
 buildPortfolio(records,base){
   const holdings=records.map(r=>this.normalizeRecord(r)).filter(Boolean);
   if(!holdings.length)throw new Error("Inga giltiga innehav kunde läsas.");
   const result=structuredClone(base||{});
   result.holdings=holdings;
   result.portfolio=result.portfolio||{};
   const mv=holdings.reduce((s,h)=>s+this.num(h.marketValueSEK),0);
   const cv=holdings.reduce((s,h)=>s+this.num(h.costValueSEK),0);
   result.portfolio.net=mv;
   result.portfolio.knownCostBasis=cv;
   result.accounts=[...new Set(holdings.map(h=>h.accountId).filter(Boolean))].map(id=>({id,name:id}));
   result.journal=result.journal||[];
   result.journal.unshift({date:new Date().toISOString().slice(0,10),title:"Portfölj importerad lokalt",text:`${holdings.length} innehav importerades till Private Vault.`});
   return result;
 },
 async importFile(file,base){
   if(!file)throw new Error("Ingen fil vald.");
   const text=await file.text(),lower=file.name.toLowerCase();
   let portfolio;
   if(lower.endsWith(".json")){
     const obj=JSON.parse(text);
     if(Array.isArray(obj))portfolio=this.buildPortfolio(obj,base);
     else if(Array.isArray(obj.holdings))portfolio=obj;
     else throw new Error("JSON-filen saknar holdings.");
   }else{
     portfolio=this.buildPortfolio(this.parseCSV(text),base);
   }
   const report=window.MKPrivateVaultIntegrity87.report(portfolio);
   await window.MKPrivateVaultDB87.put(portfolio,"portfolio");
   localStorage.setItem("mk_vault_871_file_import_report",JSON.stringify({at:new Date().toISOString(),file:file.name,report}));
   return {data:portfolio,report,fileName:file.name};
 }
};
