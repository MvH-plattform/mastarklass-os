# Mästarklass OS 11.15.22 — Resolver Recovery Release

Kontrollerad återställningsrelease efter regressionen i 11.15.21. Bygget återställer den stabila batchmotorn och behåller verifierad permanent lagring.

## Rättat

- exakt högst åtta instrument behandlas per batch
- körningen pausar efter varje batch och kan fortsätta från korrekt checkpoint
- **Stoppa säkert** fungerar mellan instrument och sparar aktuell position
- resolverresultat skrivs till beständig körstatus efter varje instrument
- **Granska resultat** aktiveras så snart kandidater finns
- säkra träffar, granskningsposter och poster utan träff finns kvar efter sidbyte och omstart
- Permanent Registry återläses vid appstart
- godkänd identitet verifieras genom direkt återläsning innan granskningsposten tas bort
- räknarna **Permanent sparade**, **För granskning** och **Återstår** uppdateras direkt
- full Resolver Chain Trace behålls
- tung automatisk efteranalys skjuts upp vid appstart för snabbare navigering till Marknad

## Säkerhet

Versionen ändrar aldrig antal, GAV, kredit, transaktioner eller Portfolio Ledger. Endast identitets-, provider- och read-only värderingsdata kan uppdateras.

## Test

1. Ersätt samtliga åtta filer i GitHub-repots rot.
2. Vänta tills GitHub Pages visar grön deployment.
3. Stäng PWA:n helt och öppna den igen.
4. Kontrollera att version **11.15.22** visas.
5. Kör **nästa batch (max 8)** och kontrollera att den pausar efter högst åtta instrument.
6. Öppna **Granska resultat** och godkänn en tydligt korrekt kandidat.
7. Kontrollera att kandidaten försvinner från granskningen och visas under **Sparade permanent**.
8. Starta om appen och kontrollera att checkpoint, granskningsresultat och permanenta identiteter finns kvar.
