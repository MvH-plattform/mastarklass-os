# Mästarklass OS 11.5.0 — Adaptive Provider Network

Utökar Live Intelligence med intelligent fallback, rate-limit-skydd och en ny Finnhub-adapter.

## Nytt
- Finnhub kan aktiveras som ytterligare prisprovider med lokalt sparad API-nyckel
- HTTP 429 ger automatisk 15 minuters cooldown i stället för upprepade anrop
- nästa provider tar automatiskt över när en källa pausas eller misslyckas
- Stooq Legacy är avstängd som standard i Android/PWA
- tydlig aktiv provider-rutt och Provider Health för varje källa
- Local Cache ligger alltid sist som säker fallback

## Säkerhet
Live-lagret är fortsatt read-only. Antal, GAV, kredit, transaktioner, Portfolio Ledger och historik ändras aldrig av provider-nätverket. API-nycklar sparas endast lokalt på enheten.

## Uppladdning
Ladda upp samtliga åtta filer till GitHub-repots rot och ersätt befintliga filer.
