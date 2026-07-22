# Mästarklass OS 11.15.18 — Fund Identity Routing

Bygger vidare på den fungerande batchmotorn i 11.15.17 och inför en separat resolverväg för vanliga fonder.

## Nytt

- klassificerar varje instrument som fond eller börshandlat innan provideranrop
- vanliga fonder utan ticker/ISIN skickas inte längre till Finnhub, Twelve Data eller Alpha Vantage
- fonder med ISIN kan verifieras via ISIN/OpenFIGI-vägen
- identiska fondnamn på flera konton kan återanvända en redan verifierad fondidentitet
- fonder utan ISIN markeras **Behöver fondidentitet** i stället för **Misslyckad**
- fondmappningen märks med NAV-prismodell och lämnas redo för kommande NAV-källa eller manuell ISIN-komplettering
- aktier, ETF:er, REITs och övriga börshandlade instrument behåller multi-provider-flödet
- batchstorlek, checkpoint, paus/fortsätt och Permanent Identity Registry är oförändrade

## Säkerhet

11.15.18 ändrar aldrig antal, GAV, kredit, transaktioner eller Portfolio Ledger. Endast identitets-, provider- och read-only värderingsdata kan uppdateras.

## Efter uppladdning

1. Ersätt samtliga åtta filer i GitHub-repots rot.
2. Vänta tills GitHub Pages visar grön deployment.
3. Stäng PWA:n helt och öppna den igen.
4. Kontrollera att 11.15.18 visas.
5. Fortsätt resolverbatchen. Fonder utan ISIN ska nu räknas som **Behöver fondidentitet**, inte som providerfel.
