# Mästarklass OS 11.15.49 — Rate-Limit Scheduler & Exchange Symbol Resolver

Den här versionen bygger direkt ovanpå 11.15.48 och bevarar samtliga portföljdata, identiteter, konton, transaktioner, GAV, kredit, Ledger och Cleanup Safety Lock.

## Nytt i 11.15.49

- Providerbudget per synk för Twelve Data, Alpha Vantage, Finnhub och Stooq Legacy.
- Minsta väntetid mellan anrop för att minska HTTP 429 och onödiga API-anrop.
- Providers i cooldown hoppas över automatiskt i stället för att anropas igen.
- Tidigare olösta instrument prioriteras först vid nästa synk.
- Separat felklassificering: rate-limit, ogiltig symbol, ingen data och providerfel.
- Utökad börssymbolresolver för Stockholm, Oslo, Köpenhamn, Helsingfors, London, Frankfurt/Xetra och Toronto.
- Ny rapport **Rate-Limit Scheduler 11.15.49** med providerbudget, cooldown och återstående kö.
- Full Portfolio Quote Orchestrator kör fortsatt hela portföljen i säkra batcher.
- NAV-instrument skickas fortsatt endast till NAV Center.

## Test efter deployment

1. Öppna **Marknad → Global Identity Resolver**.
2. Tryck **Bygg marknadsrutter**.
3. Tryck **Synkronisera live-data**.
4. Öppna **Full Portfolio Quote Orchestrator** och kontrollera resultatet.
5. Öppna **Rate-Limit Scheduler** och kontrollera providerbudget, cooldown och väntande instrument.
6. Kör en ny synk efter att cooldown har löpt ut. Tidigare olösta instrument ska prioriteras.

## Säkerhet

- Cleanup Safety Lock är fortsatt aktivt.
- Antal, GAV, konton, transaktioner, kredit och Ledger ändras inte.
- API-nycklar och portföljdata stannar lokalt i webbläsaren.
