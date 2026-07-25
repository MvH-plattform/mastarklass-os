# Mästarklass OS 11.15.39 — Unified Identity Engine

Denna version bygger direkt ovanpå 11.15.38 och innehåller allt från 11.15.34–11.15.38.

## Vad som korrigeras

11.15.38 kunde visa 0/101 med ISIN samtidigt som Recovery Validation visade 20/101. Orsaken var att en tom, tidigt skapad canonical-cache kunde återanvändas efter att portföljdatan hade laddats.

## Nytt

- En gemensam identitetsrapport används nu av:
  - Recovery Validation
  - Identity Conflict Resolver
  - Global Identity Resolver
  - räknarna för ISIN och konflikter
- Canonical holding-cache byggs om när antalet verkliga innehav ändras.
- En andra automatisk avläsning görs efter att portföljdatan hunnit laddas.
- Knappen **Läs om alla identiteter** tvingar en fullständig omläsning.
- Totalen är dynamisk och hårdkodas inte längre till 101.
- Efter sparat ISIN nollställs cachen och alla identitetsräknare uppdateras från samma datakälla.
- Den verkliga konflikten och de verkliga saknade ISIN ska nu visas.

## Testordning

1. Kontrollera att version 11.15.39 visas.
2. Öppna **Marknad → Global Identity Resolver**.
3. Kontrollera att Unified Identity Engine visar samma antal som Recovery Validation.
4. Tryck **Läs om alla identiteter** om siffrorna inte uppdateras direkt.
5. Tryck **Visa konflikter och saknade ISIN**.
6. Kontrollera den verkliga ISIN-konflikten.
7. Lägg därefter in återstående ISIN via:
   **Portfölj → Administrera → Redigera befintligt innehav → välj värdepapper → Öppna redigering → ISIN → Spara direktkorrigering**.
8. Kontrollera att räknaren ökar direkt efter sparning.
