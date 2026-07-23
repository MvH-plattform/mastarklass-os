# Mästarklass OS 11.15.20 — Permanent Registry Recovery

Återställer och säkrar hela flödet från resolverresultat till permanent identitet.

## Rättat

- godkänd identitet sparas permanent i `localStorage` och verifieras genom direkt återläsning
- sparade identiteter återställs till live-lagret efter omstart
- godkänt instrument försvinner omedelbart från granskningslistan
- räknarna **För granskning**, **Permanent sparade** och **Återstår** uppdateras direkt
- scrollpositionen i granskningsfönstret behålls efter godkännande
- tydlig bekräftelse visar namn, ticker, börs och valuta
- separat flik **Sparade permanent** visar alla låsta identiteter
- **Ångra permanent sparning** återför instrumentet till resolverflödet
- ticker `0` blockeras
- valuta, börs, konto och aktieslag valideras före lagring
- amerikanska Montrose-innehav prioriterar USA-notering och USD
- A-, B-, D- och preferensaktier skiljs strikt; konflikt kräver manuell granskning
- batchmotor, checkpoint, diagnostik och Portfolio Ledger är oförändrade

## Säkerhet

Versionen ändrar aldrig antal, GAV, kredit, transaktioner eller Portfolio Ledger. Endast identitets-, provider- och read-only-värderingsdata kan uppdateras.

## Efter uppladdning

1. Ersätt samtliga åtta filer i GitHub-repots rot.
2. Vänta tills GitHub Pages visar grön deployment.
3. Stäng PWA:n helt och öppna den igen.
4. Kontrollera att 11.15.20 visas.
5. Öppna **Granska resultat**, godkänn ett instrument och kontrollera att det försvinner från listan och syns under **Sparade permanent**.
6. Starta om appen och kontrollera att räknaren **Permanent sparade** ligger kvar.
