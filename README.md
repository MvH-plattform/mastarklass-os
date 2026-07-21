# Mästarklass OS 11.3.0 — Smart Provider Router

Hotfix av 11.1.2 och förstärker live-lagret med faktisk providertelemetri, timeout, retry, cache-fallback, förbättrad symbolrouting och tydligare instrumentidentitet.

## Nytt
- Provider Health: försök, lyckade svar, fel, svarstid och tillförlitlighet
- kontrollerad timeout och retry för ECB och Stooq
- lokal cache-fallback när extern källa inte svarar
- flera symbolkandidater per börs
- Cache Engine 2.0 med färska, fördröjda och gamla observationer
- försiktiga tickerförslag för ett begränsat antal välkända instrument
- Live-identitet i innehavsdetaljen
- synkstatus: success, partial eller error

## Viktig avgränsning
Ingen provider visas som online innan den faktiskt har svarat. Webbläsarhämtning kan begränsas av nätverk, CORS eller leverantörsvillkor.

## Säkerhet
Live-lagret får aldrig skriva över antal, GAV, kredit, transaktioner, Portfolio Ledger eller historik.

## Uppladdning
Ladda upp samtliga åtta filer till GitHub-repots rot och ersätt befintliga filer.


## Hotfix 11.3.0
- återställer den saknade `market()`-vyn som orsakade total uppstartskrasch
- behåller all lokal portföljdata och alla lagringsnycklar oförändrade


## 11.3.0 Smart Provider Router
- Twelve Data och Alpha Vantage kan aktiveras med lokalt sparade API-nycklar.
- Automatisk providerordning per instrument.
- Stooq nedgraderad till valfri legacy-fallback.
- Synk begränsas till valfritt antal instrument för att respektera providergränser.
- Lokal cache och portföljens masterdata förblir separerade.


## 11.3.0 Intelligent Instrument Mapping
- verifierad lokal namnmatchning för välkända instrument
- automatisk instrumentsökning via Twelve Data och Alpha Vantage
- confidence score och konservativ automatisk verifiering
- kandidater med lägre tillit sparas för manuell granskning
- inga osäkra förslag skrivs över som verifierade
- live-lagret är fortsatt helt read-only mot portföljens masterdata
