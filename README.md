# Mästarklass OS 11.15.21 — Permanent Registry Save Fix

Ren stabilitetsrelease för knappen **Godkänn och spara permanent**.

## Rättat

- knapptrycket hanteras direkt och kan inte försvinna genom modalens övriga klickhantering
- vald kandidat valideras före lagring
- ticker `0`, saknad valuta och uppenbart fel marknad blockeras
- identiteten skrivs permanent till `localStorage`
- lagringen verifieras genom omedelbar återläsning
- först efter godkänd återläsning tas instrumentet bort från granskningslistan
- **För granskning** minskar och **Permanent sparade** ökar direkt
- tydlig grön bekräftelse visar namn, ticker, börs och valuta
- scrollpositionen i granskningsfönstret behålls
- separat flik visar alla **Sparade permanent**
- sparade identiteter återställs till live-lagret efter omstart
- batchmotor, checkpoint, paus/fortsätt och max åtta instrument per batch är oförändrade

## Säkerhet

Versionen ändrar aldrig antal, GAV, kredit, transaktioner eller Portfolio Ledger. Endast identitets-, provider- och read-only värderingsdata kan uppdateras.

## Test

1. Ersätt samtliga åtta filer i GitHub-repots rot.
2. Vänta tills GitHub Pages visar grön deployment.
3. Stäng PWA:n helt och öppna den igen.
4. Kontrollera att version **11.15.21** visas.
5. Kör en batch och öppna **Granska resultat**.
6. Godkänn exempelvis Broadcom.
7. Bekräfta att posten försvinner, räknaren ökar och instrumentet finns under **Sparade permanent**.
8. Starta om appen och kontrollera att det fortfarande är sparat.
