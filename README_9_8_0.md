# Mästarklass OS 9.8.0 – Live Portfolio Engine

9.8.0 bygger vidare på den fungerande ECB-kopplingen i 9.7.2.

## Nytt

- Pilotlista för verkliga innehav
- Alpha Vantage-kurser
- Automatisk valutaomräkning till SEK via ECB
- Marknadsvärde, kostnadsbas och resultat
- Separat read-only-lager
- Kontrollpanel för connector, ECB och uppdateringstid

## Första testet

Börja med IBM:

- Symbol: `IBM`
- Namn: `IBM`
- Valuta: `USD`
- Antal: valfritt verkligt eller testantal
- GAV per aktie i SEK: ditt verkliga GAV eller ett testvärde

Alpha Vantage-nyckeln ska först sparas i den befintliga 9.7-vyn.

## Uppladdning

1. Ladda upp:
   - `live_portfolio_9_8_0.css`
   - `live_portfolio_9_8_0.js`
   - `live_loader_9_8_0.js`
2. Lägg raden från `index_patch_9_8_0.txt` direkt ovanför `</body>` i `index.html`.
3. Commit till `main`.
4. Vänta tills GitHub Pages är grön.
5. Stäng appfliken helt och öppna appen igen.

## Säkerhet

9.8.0 ändrar inte Private Vault, IndexedDB, antal, GAV, transaktioner, Portfolio Ledger eller Investment Credit. Pilotdata sparas separat i LocalStorage.
