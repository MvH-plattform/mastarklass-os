# Mästarklass OS 11.1.2 — Multi-Provider Live Engine

Bygger vidare på 11.1.1 och förstärker live-lagret med faktisk providertelemetri, timeout, retry, cache-fallback, förbättrad symbolrouting och tydligare instrumentidentitet.

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
