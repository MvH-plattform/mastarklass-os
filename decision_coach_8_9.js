
(function(){
  window.MKDecisionCoach89={
    advise(data,simulation){
      const integrity=window.MKDataIntegrity89.check(data);
      const backup=window.MKBackupIntelligence89.analyze(data);
      const items=[];
      if(simulation){
        const d=simulation.delta;
        if(d.iq>0)items.push({level:"POSITIVE",title:"Portfolio IQ förbättras",detail:`Förändringen höjer IQ med ${d.iq} poäng.`});
        if(d.iq<0)items.push({level:"WARNING",title:"Portfolio IQ försämras",detail:`Förändringen sänker IQ med ${Math.abs(d.iq)} poäng.`});
        if(simulation.after.weight>20)items.push({level:"WARNING",title:"Hög koncentration",detail:`Innehavet skulle väga ${simulation.after.weight.toFixed(1)} %.`});
        if(Math.abs(d.weight)<.1)items.push({level:"INFO",title:"Liten strukturell effekt",detail:"Affären förändrar portföljvikten med mindre än 0,1 procentenheter."});
        if(!items.length)items.push({level:"INFO",title:"Neutral portföljpåverkan",detail:"Ingen större förändring av IQ eller koncentration identifierades."});
      }else{
        items.push({level:"INFO",title:"Testa innan du registrerar",detail:"Använd Sandbox för att se portföljpåverkan utan att ändra Private Vault."});
      }
      if(backup.level!=="GREEN")items.push({level:"WARNING",title:backup.label,detail:backup.message});
      if(integrity.score<100)items.push({level:"WARNING",title:"Dataintegritet kräver kontroll",detail:`Integritetspoäng ${integrity.score}/100.`});
      return items;
    }
  };
})();
