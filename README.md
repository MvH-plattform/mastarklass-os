# Mästarklass OS 11.15.46 — Smart Provider Router & Valuation Confidence

Den här versionen bygger direkt ovanpå 11.15.45 och bevarar samtliga portföljdata, identiteter, konton, transaktioner, GAV, kredit, Ledger och Cleanup Safety Lock.

## Nytt i 11.15.46
- Smart Provider Router skiljer automatiskt kursinstrument från NAV-instrument.
- Prisproviders används bara när ett kursinstrument saknar giltig lokal cache.
- NAV-instrument skyddas fortsatt från Twelve Data, Alpha Vantage och Finnhub.
- Varje innehav får Valuation Confidence Score 0–100 %.
- Ny rapport visar providerplan, färskhet, datakällor och lägst datatillit först.
- Marknadsrutter och datatillit byggs automatiskt vid appstart och efter knapptryck.
- Senast känt marknadsvärde används som säker reserv när livekurs eller NAV saknas.

## Test efter deployment
1. Öppna Marknad → Global Identity Resolver.
2. Tryck **Bygg marknadsrutter**.
3. Kontrollera **Rutter klara 102/102**.
4. Öppna **Datatillit och providerplan**.
5. Kontrollera att fonder visar **NAV-källa** och aktier/ETF:er visar **Cache** eller **Prisprovider**.
6. Kör **Synkronisera live-data** och kontrollera att NAV-instrument inte ger HTTP 403.

## Säkerhet
- Ingen automatisk cleanup.
- Cleanup Safety Lock är fortsatt aktivt.
- Portföljdata, antal, GAV, kredit, transaktioner och Ledger ändras inte av routermotorn.
