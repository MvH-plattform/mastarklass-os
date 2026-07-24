# Mästarklass OS 11.15.28 — Resolver UX & Provider Cooldown

Stabilitets- och användbarhetsrelease ovanpå den fungerande IndexedDB-grunden i 11.15.27.

## Förbättrat

- Permanent Registry, körstatus, checkpoint, granskningsresultat och full logg ligger fortsatt i IndexedDB.
- Granskningsfönstret visar nu tydlig resultatbalans: mål, behandlade, återstår, kategoriserade och permanent sparade.
- När ett instrument godkänns tas det bort direkt utan att användaren kastas till fel plats i listan.
- Exakt scrollposition bevaras så långt webbläsarens layout tillåter.
- En tydlig grön bekräftelse visar namn, ticker, börs och valuta efter verifierad lagring.
- OpenFIGI går automatiskt i 15 minuters cooldown efter tre upprepade nätverksfel.
- Övriga providers går direkt i cooldown vid HTTP 429 och efter upprepade nätverksfel.
- Cooldown visas i Resolver Chain Trace och hindrar onödig väntetid och loggspam.
- En lyckad providerförfrågan nollställer dess tidigare felräknare.

## Oförändrad säkerhet

Versionen ändrar aldrig antal, GAV, marknadsvärde, kredit, transaktioner, konton eller Portfolio Ledger. Endast identitets-, provider- och read-only live-data kan uppdateras.

## Test efter uppladdning

1. Ersätt samtliga åtta filer i repositoryts rot.
2. Vänta på grön GitHub Pages-deployment.
3. Stäng PWA:n helt och öppna den igen.
4. Kontrollera att version 11.15.28 visas och att tidigare permanent sparade identiteter finns kvar.
5. Fortsätt nästa batch och öppna **Granska resultat**.
6. Godkänn ett korrekt instrument och kontrollera att posten försvinner, scrollpositionen behålls och grön bekräftelse visas.
7. Efter upprepade OpenFIGI-fel ska loggen visa provider-cooldown i stället för fortsatta nätverksanrop.
