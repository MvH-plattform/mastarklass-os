# Mästarklass OS 11.4.0 — Auto Data Steward

Automatiserar instrumentmappning och cacheunderhåll ovanpå Smart Provider Router.

## Nytt
- säkra tickerförslag läggs till automatiskt vid start och när ett nytt innehav skapas
- misstänkta kopplingar återställs, bland annat återanvänd ISIN eller aktieticker på en fond
- cache valideras automatiskt högst en gång per dygn
- Marknad visar senaste automatiska underhåll och resultat
- manuell knapp finns för omedelbar kontroll
- osäkra instrument ligger kvar för manuell granskning

## Säkerhet
Auto Data Steward arbetar endast i live-lagret. Antal, GAV, kredit, transaktioner, Portfolio Ledger och lokal portföljhistorik ändras aldrig. API-nycklar ligger kvar lokalt på enheten.

## Uppladdning
Ladda upp samtliga åtta filer till GitHub-repots rot och ersätt befintliga filer.
