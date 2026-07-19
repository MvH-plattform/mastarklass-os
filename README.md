# Mästarklass OS 10.5.2 — Core Modal Engine

En sammanhängande stabiliseringsrelease ovanpå 10.5.1. Portfolio Engine, Transaction Engine, Administration Layer, Portfolio Ledger och Portfolio Intelligence finns kvar som samma produkt.

## Korrigerat i 10.5.2

- en enda global modal-container ligger nu utanför den omrenderade appytan
- detaljkort och mörk backdrop är separerade
- innehavsdetaljer öppnas stabilt från **Alla innehav** och **Analys**
- Android/PWA-backknappen stänger detaljkortet i stället för att lämna appen
- stängning fungerar via kryss, bakgrund och Escape
- appens bakomliggande innehåll låses medan detaljkortet är öppet
- modalens z-index, viewport-höjd och scroll är isolerade från listornas `content-visibility`
- service worker använder network-first för appfiler och rensar äldre Mästarklass-cache
- version, manifest, cache och versionsfil är synkroniserade till 10.5.2
- ingen lokal portföljdata, GAV, antal, kredit, transaktion eller ledger skrivs över

## Uppladdning

Ladda upp samtliga åtta filer till GitHub-repots rot och ersätt filer med samma namn. Vänta tills GitHub Pages visar en ny deployment. Stäng därefter den installerade appen helt och öppna den igen.

## Kontroll

1. Öppna **Portfölj → Alla innehav**.
2. Tryck på flera olika innehav.
3. Kontrollera att detaljkortet alltid syns ovanpå den nedtonade bakgrunden.
4. Stäng med krysset, genom att trycka utanför kortet och med mobilens bakåtknapp.
5. Öppna ett intelligenskort under **Analys** och kontrollera samma flöde.
