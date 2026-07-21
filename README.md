# Mästarklass OS 11.12.0 — Data Confidence Engine

Bygger vidare på 11.11.0 Adaptive Data Engine och gör portföljens intelligenslager automatiskt och tillitsstyrt.

## Nytt

- Data Confidence Score 0–100 för varje innehav
- väger ihop identitet, ISIN, ticker, börs, valuta, instrumenttyp, källa och färskhet
- skiljer mellan verifierad, sannolik, osäker och manuellt kontrollerad data
- prioriterar vilka innehav som behöver åtgärdas först
- hindrar starka Öka-råd när underlaget är för svagt
- kör lokal Portfolio Intelligence automatiskt när appen öppnas eller återupptas
- gör automatisk live-synk när data är äldre än 30 minuter och en provider är aktiverad
- kör om analys, risk, diversifiering och Wealth Coach efter lyckad live-synk
- manuella knappar finns kvar för kontroll och felsökning

## Säkerhet

11.12.0 arbetar endast i read-only live- och intelligenslagret. Den ändrar aldrig antal, GAV, marknadsvärde, kredit, transaktioner, Portfolio Ledger eller API-nycklar.

## Uppladdning

Ladda upp samtliga åtta filer till GitHub-repots rot och ersätt befintliga filer. Vänta tills GitHub Pages är grön. Stäng därefter den installerade PWA:n helt och öppna den på nytt.
