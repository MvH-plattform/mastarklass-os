# Mästarklass OS 11.6.0 — Global Instrument Registry

Komplett Identity Engine ovanpå Adaptive Provider Network.

## Nytt
- versionsstyrt lokalt instrumentregister
- primär ticker, ISIN, börs, valuta, land och tillgångstyp
- separata providersymboler för Twelve Data, Alpha Vantage och Finnhub
- automatisk berikning vid start och manuell Identity Engine-körning
- Stooq Legacy stängs av vid migrering om användaren inte uttryckligen väljer den
- befintlig portföljmasterdata, GAV, antal, transaktioner, Ledger och API-nycklar lämnas orörda

## Säkerhet
Registry skriver endast till read-only live-mappningen. Det skapar inga order och ändrar inga innehav.

## Uppladdning
Ladda upp samtliga åtta appfiler till GitHub-repots rot och ersätt befintliga filer.
