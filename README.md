# Mästarklass OS 11.15.41 — Resolver Interaction & Feedback Fix

Denna version bygger direkt ovanpå 11.15.40.

## Korrigerat

- Synkknappen visar `Synkar…` och därefter `Synkning klar ✓`.
- Tidpunkt för senaste lyckade synkning visas.
- Konfliktknappen loggar knapptrycket innan rapporten byggs.
- Konfliktrapporten öppnas via robusta event listeners.
- Separat felhantering visar ett tydligt fel om modalrenderingen misslyckas.
- Reservknappen **Öppna rapport direkt** använder samma säkra öppningsfunktion.
- MutationObserver återansluter knapparna efter varje omrendering.
- Cleanup Safety Lock och portföljdata lämnas oförändrade.

## Test

1. Öppna **Marknad → Global Identity Resolver**.
2. Tryck **Synka portfölj till identitetsmotorn**.
3. Knappen ska visa `Synkar…` och sedan `Synkning klar ✓`.
4. Tryck **Visa konflikter och saknade ISIN**.
5. Rapporten ska öppnas.
6. Vid behov, använd **Öppna rapport direkt**.
7. Loggen ska visa knapptryck och lyckad öppning.
