# Mästarklass OS 11.8.0 — Fund & ETF Intelligence

Utökar Universal Identity Engine med rätt prismodell för varje instrumenttyp.

## Nytt

- automatisk klassificering av aktie, ETF, fond, REIT, ADR, preferensaktie och ETN/certifikat
- börsnoterade instrument fortsätter använda livekurs från provider-nätverket
- traditionella fonder använder senaste NAV i stället för att rapporteras som felaktig ticker
- separat lokalt Fund NAV Center för fonder som saknar tillgänglig extern kurs
- tydligare status: verifierad identitet kan visas även när NAV eller börskurs saknas
- Fund & ETF Intelligence-panel i Marknad visar täckning och återstående dataluckor
- NAV-data sparas endast i read-only live-lagret

## Säkerhet

Version 11.8.0 ändrar aldrig antal, GAV, kredit, transaktioner, Portfolio Ledger eller portföljhistorik. API-nycklar och NAV-data ligger kvar lokalt på enheten.

## Uppladdning

Ladda upp samtliga åtta filer till GitHub-repots rot och ersätt befintliga filer. Vänta tills GitHub Pages är klar och öppna därefter appen på nytt.
