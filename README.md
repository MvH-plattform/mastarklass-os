# Mästarklass OS 11.15.31 — Intelligent Review Mode

Resolverrelease byggd ovanpå den stabila IndexedDB-kedjan i 11.15.30.

## Nytt

- Varje kandidat visar nu **ticker, fullständigt namn, börs, valuta, provider, poäng och ISIN**.
- Kandidatlistan gör det tydligt vad respektive träff faktiskt avser innan den sparas permanent.
- Ny knapp: **Inget av alternativen stämmer**.
- Alla visade felaktiga kandidater kan avvisas permanent för just innehavet och föreslås inte igen.
- Användaren kan komplettera med ISIN, ticker, börs, valuta, exakt namn och kommentar.
- **Avvisa och sök igen** gör om sökningen direkt med de kompletterade uppgifterna.
- **Flytta till Behöver identitet** tar bort instrumentet från vanlig granskning utan att tappa uppgifterna.
- Avvisningar, kompletteringar, checkpoint och granskningsresultat lagras i resolverns IndexedDB-state.
- Om omsökningen misslyckas ligger uppgifterna kvar för ett senare försök.

## Säkerhet

Antal, GAV, marknadsvärde, kredit, transaktioner, konton och Portfolio Ledger ändras aldrig av resolvergranskningen. Endast identitetslagret och resolverns granskningsstate uppdateras.

## Test efter uppladdning

1. Ersätt samtliga åtta filer i GitHub-repots root.
2. Vänta på GitHub Pages-deployment.
3. Stäng PWA:n helt och öppna den igen.
4. Kontrollera version **11.15.31**.
5. Öppna **Granska resultat**.
6. Kontrollera att ISIN visas för varje kandidat, eller tydligt anges som saknat.
7. Tryck **Inget av alternativen stämmer** på ett instrument.
8. Fyll i exempelvis korrekt ISIN och välj **Avvisa och sök igen**.
9. Kontrollera att gamla kandidater inte återkommer.
10. Testa även **Flytta till Behöver identitet** och kontrollera att instrumentet försvinner från vanlig granskning.
