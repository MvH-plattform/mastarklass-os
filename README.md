# Mästarklass OS 10.4.1 – Portfolio Ledger Stability

Stabiliseringsuppdatering ovanpå 10.4 Portfolio Ledger.

## Korrigerat

- Ledger-fliken renderas nu korrekt och visar både migrerad historik och manuella poster.
- Transaktioner och administrationsändringar migreras till ledgern i en enda skrivning i stället för många lokala skrivningar vid varje start.
- Appens första vy renderas innan service worker registreras, vilket minskar flimrande och tomma vyer.
- Versionsnummer är synkroniserade i HTML, manifest, cache och versionsfil.
- Ny cache 10.4.1 tar över och äldre Mästarklass OS-cache rensas vid aktivering.
- Laddningsskal, stabilare listlayout och säkrare felvy har lagts till.
- Befintlig lokal portföljdata, GAV, antal, kredit, transaktioner och ledger skrivs inte över.

## Uppladdning

Ladda upp samtliga åtta filer till repositoryts rot och ersätt filer med samma namn. Vänta tills GitHub Pages är färdig. Stäng därefter den installerade appen helt och öppna den igen.
