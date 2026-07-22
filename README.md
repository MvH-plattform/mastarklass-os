# Mästarklass OS 11.15.19 — Persistent Resolver Recovery

Återställer den fungerande batchmotorn från 11.15.17 och behåller fond-routing utan regressionen i 11.15.18.

## Rättat

- högst åtta instrument behandlas per batch
- checkpoint och resultat sparas efter varje instrument
- paus/fortsätt fungerar efter omladdning
- full Resolver Chain Trace finns kvar och kan kopieras
- traditionella fonder utan ISIN skickas inte till aktieproviders
- dessa sparas som **Behöver fondidentitet**, inte som misslyckade
- säkra träffar sparas direkt i Permanent Identity Registry
- granskningsresultat ligger kvar efter sidbyte och omstart
- gammal oförenlig 11.15.18-körstatus återställs automatiskt
- antal, GAV, kredit, transaktioner och Portfolio Ledger ändras aldrig

## Test

1. Ersätt samtliga åtta filer i GitHub-repots rot.
2. Vänta tills GitHub Pages visar grön deployment.
3. Stäng PWA:n helt och öppna den igen.
4. Kontrollera att 11.15.19 visas.
5. Gå till Marknad och tryck **Kör nästa batch (max 8)**.
6. Kontrollera att körningen pausar efter högst åtta instrument och att räknarna ligger kvar efter att du lämnat sidan och återvänder.
