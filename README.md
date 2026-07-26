# Mästarklass OS 11.15.47 — Adaptive Quote Engine

Den här versionen bygger direkt ovanpå 11.15.46 och flyttar fokus från identitet till faktisk kurstäckning.

## Nytt
- Färsk lokal cache används först för att minska API-anrop och rate limits.
- Ihågkommen fungerande provider prioriteras per instrument.
- Alternativa tickerformat provas därefter genom Twelve Data, Alpha Vantage, Finnhub och valfri Stooq Legacy.
- Fördröjd cache och senast känd kurs används som säker reserv när providers inte svarar.
- NAV-instrument hålls helt utanför aktieproviders och kan därför inte skapa Montrose HTTP 403.
- Ny rapport **Adaptive Quote Engine** visar providerplan, utfall, cacheträffar och verkliga fel per instrument.
- Resolverlogg visar sammanfattningen för varje synk.

## Test efter deployment
1. Öppna Marknad → Global Identity Resolver.
2. Tryck **Bygg marknadsrutter**.
3. Öppna **Adaptive Quote Engine** och kontrollera providerplanen.
4. Tryck **Synkronisera live-data**.
5. Kontrollera att NAV-instrument inte ger HTTP 403.
6. Öppna rapporten igen och jämför nya providerträffar, färsk cache, reservcache och instrument utan kurs.

## Säkerhet
- Cleanup Safety Lock är fortsatt aktivt.
- Inga antal, GAV, konton, transaktioner, kredit eller Ledger ändras.
- API-nycklar och all portföljdata stannar lokalt i webbläsaren.
