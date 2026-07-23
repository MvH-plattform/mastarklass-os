# Mästarklass OS 11.15.24 — Verified Resolver Recovery

Kontrollerad återställning byggd från den fungerande 11.15.19-batchmotorn.

## Återställt och rättat

- mållistan byggs från portföljens kanoniska instrumentlista
- högst åtta instrument behandlas per batch
- checkpoint, paus, fortsättning och säker stopp fungerar i samma körstatus
- Resolver Chain Trace och granskningsresultat sparas beständigt
- fondrouting från 11.15.19 behålls
- fastlåst live-status `syncing` återställs vid appstart
- permanent sparning verifieras med omedelbar återläsning
- sparat instrument tas direkt bort från granskningslistan
- räknarna Permanent sparade, För granskning och Återstår uppdateras direkt
- scrollpositionen i granskningsfönstret behålls
- tydlig grön bekräftelse visar namn, ticker, börs och valuta
- ticker `0` och ofullständiga kandidater blockeras
- antal, GAV, kredit, transaktioner och Portfolio Ledger ändras aldrig

## Kontroll

Bygget har kontrollerats med JavaScript-syntaxkontroll, JSON-validering, service-worker-cachekontroll och statiska regressionskontroller för batchstorlek, mållista, checkpoint, stopp, logg, granskning och permanent återläsning.

## Test efter uppladdning

1. Ersätt samtliga åtta filer i GitHub-repots rot.
2. Vänta tills GitHub Pages visar grön deployment.
3. Stäng PWA:n helt och öppna den igen.
4. Kontrollera att 11.15.24 visas.
5. Kör nästa batch. Den ska behandla högst åtta instrument och pausa.
6. Öppna Granska resultat och spara ett tydligt korrekt instrument.
7. Kontrollera att posten försvinner direkt, att Permanent sparade ökar och att grön bekräftelse visas.
8. Starta om PWA:n och kontrollera att den permanent sparade identiteten ligger kvar.
