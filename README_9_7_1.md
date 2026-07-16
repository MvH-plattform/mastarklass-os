# Mästarklass OS 9.7.1 – Live Integration Fix

Denna korrigering löser felet:

`MKLiveConnectors970 is not defined`

## Vad som rättas

- 9.7-modulerna laddas i säker ordning:
  1. Provider Registry
  2. Live Portfolio Pilot
  3. Live Connectors
  4. Live Foundation UI
- ECB-knappen aktiveras först när connectorn finns.
- Alpha Vantage använder samma korrigerade modulväg.
- synligt versionsmärke uppdateras till 9.7.1.
- tydlig diagnostik visas i appen.
- Service Worker använder network-first för HTML och tar bort äldre Mästarklass-kodcache.
- IndexedDB, LocalStorage, Private Vault, innehav, antal, GAV och transaktioner raderas inte.

## Ladda upp till GitHub

Ladda upp dessa två filer samtidigt i repositoryts rot:

- `sw.js` – ersätter befintlig fil
- `live_integration_9_7_1.js` – ny fil

Gör Commit direkt till `main`.

## Starta den korrigerade versionen

1. Vänta tills GitHub Pages visar grön deployment.
2. Stäng den gamla appfliken/PWA:n helt.
3. Öppna webbplatsen igen.
4. Ladda om sidan en extra gång. Det krävs eftersom den nya Service Workern först måste aktiveras.
5. Öppna Live Portfolio Pilot.
6. Kontrollera att den gröna texten visas:
   `Live 9.7.1 är korrekt ansluten`.
7. Tryck `Uppdatera valutakurser`.

Radera inte webbplatsdata. Fixen är avsiktligt icke-destruktiv.
