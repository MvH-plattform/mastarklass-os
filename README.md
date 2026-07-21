# Mästarklass OS 11.10.0 — Global Identity Resolver

Komplett ersättningsversion byggd ovanpå 11.9.0. Resolvermotorn är integrerad i `app.js` och `styles.css`; inga extra resolverfiler ska ligga i repots rot.

## Nytt
- Global Identity Resolver under **Marknad**
- parallell sökning i lokalt Global Registry, OpenFIGI och aktiverade Twelve Data, Alpha Vantage och Finnhub
- sammanvägd matchning av ISIN, officiellt namn, ticker, börs, valuta, instrumenttyp och andelsklass
- konfliktkontroll mellan källor
- tydlig granskningsvy där varje förslag godkänns innan det sparas
- massgodkännande endast för förslag med mycket hög säkerhet
- manuella kopplingar skyddas och skrivs inte över utan uttryckligt godkännande
- Morningstar visas endast som framtida anslutningsplats; appen låtsas inte att en otillgänglig källa har svarat

## Viktig fix
Ta bort de gamla extrafilerna `global_identity_resolver_11_10.js` och `global_identity_resolver_11_10.css` från GitHub. Funktionerna finns nu i kärnfilerna.

## Säkerhet
Resolvern ändrar aldrig antal, GAV, marknadsvärde, kredit, transaktioner, Portfolio Ledger eller historik. Identitetsförslag skrivs enbart till det lokala read-only live-lagret efter godkännande. API-nycklar stannar lokalt på enheten.

## Uppladdning
1. Radera de två gamla extra resolverfilerna om de finns.
2. Ladda upp de åtta filerna i detta paket till repots rot och ersätt befintliga filer.
3. Vänta på GitHub Pages. Om deploy-steget visar `Request timeout` eller `Failed to get ID Token`, kör **Re-run jobs**; det är ett GitHub Actions-fel och inte ett fel i appfilerna.
4. Stäng den installerade PWA:n helt och öppna den igen.
