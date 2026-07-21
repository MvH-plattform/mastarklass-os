# Mästarklass OS 11.10.0 — Global Identity Resolver

## Nytt

- Ny resolverpanel under Marknad.
- Söker i OpenFIGI, Twelve Data, Finnhub och det lokala identitetsregistret.
- Sammanväger officiellt namn, ticker, börs, valuta, instrumenttyp och andelsklass.
- Automatisk verifiering kräver hög förtroendescore; osäkra träffar läggs för manuell granskning.
- Manuella live-kopplingar skrivs aldrig över automatiskt.
- Portföljdata, antal, GAV, marknadsvärde, kredit, transaktioner och Ledger ändras aldrig.

## Viktig avgränsning

Morningstar, Yahoo Finance, Stooq och börsernas databaser finns som planerade/kompatibla källor men används inte automatiskt utan en stabil, laglig och CORS-kompatibel anslutning. Versionen låtsas inte att en källa har svarat när den inte har gjort det.

## Uppladdning

Behåll nuvarande `app.js`, `styles.css` och `icon.svg`. Ladda upp och ersätt/lägg till följande filer i repositoryts rot:

- `index.html`
- `manifest.json`
- `sw.js`
- `version.json`
- `README.md`
- `global_identity_resolver_11_10.js`
- `global_identity_resolver_11_10.css`

Vänta tills GitHub Pages är klar. Stäng sedan appen helt och öppna den på nytt.
