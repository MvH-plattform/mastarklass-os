# Mästarklass OS 11.15.48 — Full Portfolio Quote Orchestrator

Den här versionen bygger direkt ovanpå 11.15.47.

## Nytt

- Kör samtliga kursrutter automatiskt i säkra batcher i stället för bara de första 30.
- Visar löpande behandlade instrument, batchnummer och slutstatus för hela portföljen.
- Hård NAV-klassificering för Montrose Global Monthly Dividend och Montrose Global Leverage 125.
- NAV-instrument skickas aldrig till Twelve Data, Alpha Vantage eller Finnhub.
- Samma ISIN grupperas i rapporten och kontona visas tillsammans.
- Gamla HTTP 403-fel påverkar inte den nya rapporten när instrumentet har flyttats till NAV Center.
- Senast kända kurser behålls som säker reserv.

## Säkerhet

- Cleanup Safety Lock är fortsatt aktivt.
- Antal, GAV, konton, transaktioner, kredit och Ledger ändras inte.
- API-nycklar och portföljdata stannar lokalt i webbläsaren.

## Test

1. Öppna Marknad → Global Identity Resolver.
2. Tryck Bygg marknadsrutter.
3. Tryck Synkronisera live-data.
4. Öppna Full Portfolio Quote Orchestrator.
5. Kontrollera att alla rutter behandlas och att Montrose-fonderna visas under NAV Center utan HTTP 403.
