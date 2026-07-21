# Mästarklass OS 11.9.0 — Global Instrument Registry

Bygger vidare på 11.8 med ett säkert, lokalt och versionsstyrt identitetsregister.

## Nytt
- Rebuild Identity Registry med lokal backup och återställning
- bevarar manuellt verifierade kopplingar
- återställer misstänkta automatiska tickers utan att röra portföljdata
- känner igen andelsklasser och utdelande/ackumulerande varianter
- lagrar primär ticker, ISIN, börs, valuta och separata providersymboler
- konfliktgranskning och tydlig lista över instrument som kräver manuell kontroll
- fortsatt stöd för aktier, ETF:er, traditionella fonder och NAV

## Säkerhet
Version 11.9.0 ändrar aldrig antal, GAV, marknadsvärde, kredit, transaktioner, Portfolio Ledger, historik eller API-nycklar. All identitetsdata ligger i det lokala read-only live-lagret.

## Uppdatering
Ladda upp samtliga åtta filer till GitHub-repots rot och ersätt befintliga filer. Vänta tills GitHub Pages är klar och öppna sedan appen på nytt.
