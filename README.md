# Mästarklass OS 11.15.25 – Permanent Registry Write Trace & Storage Recovery

Kontrollerad stabilitetsrelease ovanpå den fungerande batchmotorn i 11.15.24. Den här versionen ändrar endast vägen från **Godkänn och spara permanent** till Permanent Identity Registry.

## Rättat

- varje knapptryck för permanent godkännande skrivs till samma beständiga Resolver Chain Trace
- exakt `localStorage`-nyckel, registerstorlek före skrivning och resultat efter direkt återläsning loggas
- skrivfunktionen returnerar nu verkligt fel om `localStorage.setItem()` misslyckas
- posten verifieras med holdingKey, ticker, ISIN, provider, börs och valuta innan granskningsposten tas bort
- Permanent Registry skrivs **före** live-mappningen, så ett misslyckat sparförsök inte lämnar ett halvsparat tillstånd
- vid lagringstryck komprimeras endast ofarlig read-only diagnostik, livehändelser och providertelemetri; antal, GAV, kredit, transaktioner och Portfolio Ledger berörs aldrig
- granskningsposten tas bort först efter verifierad återläsning
- räknarna **Permanent sparade**, **För granskning** och **Återstår** uppdateras efter lyckad lagring
- bekräftelsen visar namn, ticker, börs och valuta
- batchstorlek, checkpoint, paus/fortsätt och säker stopp från 11.15.24 är oförändrade

## Diagnostik vid fel

Resolver Chain Trace visar nu följande kedja:

1. `Permanent approve 01 Knapptryck`
2. `Permanent write 03 Register läst`
3. `Permanent write 04 Skrivning start`
4. `Permanent write 08 Direkt återläsning klar`
5. `Permanent write 09 Post verifierad`
6. `Permanent approve 06 Klar`

Om lagringen är full visas i stället exakt var skrivningen stoppades och hur stor den lokala lagringen var.

## Säkerhet

Versionen ändrar aldrig antal, GAV, marknadsvärde, kredit, transaktioner eller Portfolio Ledger. Endast identitets-, provider- och read-only live-data får uppdateras.

## Test

1. Ersätt samtliga åtta filer i GitHub-repots rot.
2. Vänta tills GitHub Pages visar grön deployment.
3. Stäng PWA:n helt och öppna den igen.
4. Kontrollera att version **11.15.25** visas.
5. Kör minst två batcher och öppna **Granska resultat**.
6. Godkänn exempelvis Broadcom.
7. Kontrollera att posten försvinner direkt, **Permanent sparade** ökar och en grön bekräftelse visas.
8. Kopiera Resolver Chain Trace och kontrollera att Permanent write 01–09 finns.
9. Starta om appen och kontrollera att den permanent sparade identiteten finns kvar.
