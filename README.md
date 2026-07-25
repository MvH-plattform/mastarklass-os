# Mästarklass OS 11.15.36 — Persistence Repair & ISIN Entry Gate

Denna version bygger direkt ovanpå 11.15.35 och innehåller allt från 11.15.34–11.15.35.

## Nytt

- Separat test av **localStorage**, **IndexedDB** och **Permanent Identity Registry**.
- Visar det verkliga felet när lagring misslyckas, exempelvis fullt lagringsutrymme, blockerad IndexedDB eller misslyckad återläsning.
- Försiktig reparation som endast komprimerar diagnostik, äldre loggar, providertelemetri och rapporter.
- Portfölj, antal, GAV, marknadsvärden, transaktioner, konton, API-nycklar och Portfolio Ledger raderas aldrig.
- Direkt återläsning efter skrivtest i samtliga beständiga lager.
- Ny panel **Persistence Repair 11.15.36** i Global Identity Resolver.
- Tydlig **ISIN Entry Gate** som visar exakt när ISIN ska läggas in.

## Rätt ordning för ISIN

1. Öppna **Marknad → Global Identity Resolver**.
2. Tryck **Reparera och testa lagring**.
3. Fortsätt först när localStorage, IndexedDB och Registry visar **OK**.
4. Tryck **Sök gamla ISIN**.
5. Tryck **Kontrollera identiteter**.
6. Lägg endast in de ISIN som fortfarande saknas via:
   **Portfölj → Administrera → Redigera befintligt innehav → välj värdepapper → Öppna redigering → ISIN → Spara direktkorrigering**.
7. Kör sedan resolverbatcherna vidare.
8. När identiteterna är klara kopplas aktier och ETF:er till livekurser; traditionella fonder går vidare till NAV-källan.

## Test

Efter deployment ska version 11.15.36 visas. Kör Persistence Repair och skicka resultatet om något lager fortfarande visar FEL.
