# Mästarklass OS 11.15.23 — Resolver Target & Startup Recovery

Kontrollerad återställning av Global Identity Resolver efter regressionen i 11.15.22.

## Rättat

- mållistan byggs direkt från portföljens kanoniska 101 innehav före körstart
- tom mållista blockeras med tydligt fel i stället för `Verifierar 0/0`
- exakt högst åtta instrument behandlas per batch
- paus, fortsättning och säker stopp använder samma checkpoint
- renderingen får inte längre ändra en aktiv körning från `running` till `paused`
- full beständig Resolver Chain Trace återställd, med kopiering och rensning
- Permanent Registry och granskningsresultat behålls
- fastlåst `syncing` återställs till `idle` vid appstart
- tung automatisk intelligenscykel skjuts upp för snabbare app- och Marknad-start

## Säkerhet

Antal, GAV, kredit, transaktioner och Portfolio Ledger ändras aldrig. Endast identitets-, provider- och read-only live-data kan uppdateras.

## Test

1. Ersätt samtliga åtta filer i GitHub-repots rot.
2. Vänta på grön GitHub Pages-deployment.
3. Stäng PWA:n helt och öppna den igen.
4. Kontrollera att version 11.15.23 visas.
5. Tryck **Kör nästa batch (max 8)**.
6. Bekräfta att totalen är större än 0 och att körningen pausar efter högst åtta instrument.
7. Kontrollera att Resolver Chain Trace innehåller mållista, instrument och batchresultat.
