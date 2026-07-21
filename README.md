# Mästarklass OS 11.1.3 — Multi-Provider Live Engine

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


## Hotfix 11.1.3
- återställer den saknade `market()`-vyn som orsakade total uppstartskrasch
- behåller all lokal portföljdata och alla lagringsnycklar oförändrade
