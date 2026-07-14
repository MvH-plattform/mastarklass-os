
(function(){
  const download=(name,text)=>{
    const blob=new Blob([text],{type:"application/json"});
    const url=URL.createObjectURL(blob),a=document.createElement("a");
    a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),500);
  };
  window.MKManualBackup885={
    async create(data,passphrase){
      if(!data?.holdings?.length)throw new Error("Ingen portfölj finns att säkerhetskopiera.");
      if(String(passphrase||"").length<12)throw new Error("Lösenfrasen måste vara minst 12 tecken.");
      const checksum=await window.MKPrivateVaultIntegrity87.checksum(data);
      const payload={
        schemaVersion:2,
        appVersion:"8.8.5",
        createdAt:new Date().toISOString(),
        checksum,
        summary:{
          holdings:data.holdings.length,
          transactions:(data.transactions||[]).length,
          accounts:(data.accounts||[]).length
        },
        data
      };
      const wrapper=await window.MKPrivateVaultCrypto87.encrypt(payload,passphrase);
      const verify=await window.MKPrivateVaultCrypto87.decrypt(wrapper,passphrase);
      const actual=await window.MKPrivateVaultIntegrity87.checksum(verify.data);
      if(actual!==verify.checksum||actual!==checksum)throw new Error("Backupverifieringen misslyckades.");
      const name=`mastarklass-os-8.8.5-${new Date().toISOString().slice(0,10)}.mkbackup`;
      download(name,JSON.stringify(wrapper));
      window.MKAutomaticBackup885.markManual(checksum,data);
      return {name,checksum,summary:payload.summary};
    },
    async restore(file,passphrase){
      if(!file)throw new Error("Ingen backupfil vald.");
      const wrapper=JSON.parse(await file.text());
      const payload=await window.MKPrivateVaultCrypto87.decrypt(wrapper,passphrase);
      const data=payload.data||payload;
      const expected=payload.checksum;
      const actual=await window.MKPrivateVaultIntegrity87.checksum(data);
      if(expected&&expected!==actual)throw new Error("Backupfilens checksumma stämmer inte.");
      if(!Array.isArray(data.holdings))throw new Error("Backupen saknar en giltig portfölj.");
      await window.MKPrivateVaultDB87.put(data,"portfolio");
      return {data,checksum:actual,summary:{holdings:data.holdings.length,transactions:(data.transactions||[]).length}};
    }
  };
})();
