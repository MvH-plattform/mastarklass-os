
window.MKPrivateVaultCrypto87={
 enc:new TextEncoder(),dec:new TextDecoder(),
 b64(bytes){let s="";new Uint8Array(bytes).forEach(b=>s+=String.fromCharCode(b));return btoa(s);},
 unb64(s){const raw=atob(s),a=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)a[i]=raw.charCodeAt(i);return a;},
 async derive(pass,salt){
   const base=await crypto.subtle.importKey("raw",this.enc.encode(pass),"PBKDF2",false,["deriveKey"]);
   return crypto.subtle.deriveKey({name:"PBKDF2",salt,iterations:250000,hash:"SHA-256"},base,{name:"AES-GCM",length:256},false,["encrypt","decrypt"]);
 },
 async encrypt(data,passphrase){
   if(String(passphrase||"").length<12)throw new Error("Lösenfrasen måste vara minst 12 tecken.");
   const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12));
   const key=await this.derive(passphrase,salt);
   const payload=this.enc.encode(JSON.stringify(data));
   const encrypted=await crypto.subtle.encrypt({name:"AES-GCM",iv},key,payload);
   return {format:"MKPV1",algorithm:"AES-GCM-256",kdf:"PBKDF2-SHA-256",iterations:250000,salt:this.b64(salt),iv:this.b64(iv),ciphertext:this.b64(encrypted),createdAt:new Date().toISOString()};
 },
 async decrypt(wrapper,passphrase){
   if(wrapper?.format!=="MKPV1")throw new Error("Okänt backupformat.");
   const salt=this.unb64(wrapper.salt),iv=this.unb64(wrapper.iv),cipher=this.unb64(wrapper.ciphertext);
   const key=await this.derive(passphrase,salt);
   const plain=await crypto.subtle.decrypt({name:"AES-GCM",iv},key,cipher);
   return JSON.parse(this.dec.decode(plain));
 }
};
