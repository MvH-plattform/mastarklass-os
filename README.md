# Mästarklass OS 11.14.0 — Global Identity Resolver

Bygger vidare på 11.13.0 Autonomous Portfolio Intelligence och löser den sista stora identitetsbarriären före full livevärdering.

## Nytt

- verifierar instrument via ISIN när det finns
- testar alternativa tickerformat, inklusive svenska `.ST`, `.STO`, bindestreck och mellanslag
- testar flera börsvarianter och normaliserar Stockholm, NYSE, Nasdaq, LSE och Xetra
- söker parallellt i Global Registry, OpenFIGI, Twelve Data, Alpha Vantage och Finnhub
- väger namn, ISIN, ticker, börs, valuta och instrumenttyp till en gemensam säkerhetspoäng
- upptäcker konflikter mellan starka providerträffar
- sparar godkänd provider, ticker, ISIN, börs och valuta som permanent read-only rutt
- återanvänder permanenta rutter vid framtida live-synk
- bevarar manuella kopplingar om användaren inte uttryckligen godkänner ersättning

## Säkerhet

11.14.0 ändrar aldrig antal, GAV, marknadsvärde, kredit, transaktioner, Portfolio Ledger eller API-nycklar. Endast identitets- och providerdata i det lokala read-only live-lagret kan uppdateras.

## Uppladdning

Ladda upp samtliga åtta filer till GitHub-repots rot och ersätt befintliga filer. Vänta tills GitHub Pages är grön. Stäng sedan den installerade PWA:n helt och öppna den på nytt.
