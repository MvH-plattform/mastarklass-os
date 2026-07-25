# Mästarklass OS 11.15.42 — Conflict Report Renderer Fix

Den här versionen bygger direkt ovanpå 11.15.41.

## Felet som hittades

Konfliktrapporten öppnades inte eftersom rapportbyggaren anropade `escapeHtml`, men hjälpfunktionen saknades i appen.

## Korrigerat

- Lägger till en central och säker `escapeHtml`-funktion.
- Konfliktrapporten kan nu rendera namn, konton, ISIN och övrig text utan JavaScript-felet.
- Både **Visa konflikter och saknade ISIN** och **Öppna rapport direkt** använder den reparerade renderern.
- Ny automatisk self-test loggar `Conflict Renderer 11.15.42 self-test — escapeHtml OK`.
- Synkfunktionen och tidsstämpeln från 11.15.41 behålls.
- Cleanup Safety Lock och portföljdatan ändras inte.

## Test efter deployment

1. Öppna **Marknad → Global Identity Resolver**.
2. Tryck **Visa konflikter och saknade ISIN**.
3. Rapporten ska öppnas direkt.
4. Kontrollera att loggen visar:
   - `Conflict Resolver 11.15.42 knapptryck`
   - `Conflict Renderer 11.15.42 self-test — escapeHtml OK`
   - `Conflict Resolver 11.15.42 modal öppnad`
5. Testa även **Öppna rapport direkt**.
