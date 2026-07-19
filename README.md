# Mästarklass OS 10.5.1 — Portfolio Intelligence Modal Stability

En full, sammanhängande stabiliseringsrelease ovanpå 10.5.0. Portfolio Engine, Transaction Engine, Administration Layer, Portfolio Ledger och Portfolio Intelligence finns kvar oförändrade som en gemensam produktstruktur.

## Korrigerat i 10.5.1

- innehavsdetaljer öppnas åter korrekt från **Alla innehav**
- den mörka bakgrunden visas inte längre utan själva detaljkortet
- modalens position är nu knuten till mobilens synliga viewport
- Android/PWA-felet som orsakades av layout-containment runt appytan är borttaget
- detaljkortets stängning, redigering och köp/sälj-knappar fungerar vidare i samma flöde
- versionsnummer, manifest, cache och service worker är synkroniserade till 10.5.1
- ingen lokal portföljdata, GAV, antal, kredit, transaktion eller ledger skrivs över

## Uppladdning

Ladda upp samtliga åtta filer till GitHub-repots rot och ersätt filer med samma namn. Vänta tills GitHub Pages är färdig. Stäng därefter den installerade appen helt och öppna den igen.

## Kontroll efter uppladdning

1. Öppna **Portfölj → Alla innehav**.
2. Tryck på ett innehav.
3. Kontrollera att detaljkortet syns ovanpå den nedtonade bakgrunden.
4. Stäng med krysset och prova ytterligare ett innehav.
