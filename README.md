# Mästarklass OS 11.15.37 — Storage Cleanup & Migration

Denna version bygger direkt ovanpå 11.15.36 och innehåller allt från 11.15.34–11.15.36.

## Nytt

- Ny panel **Storage Cleanup 11.15.37**.
- Frigör lagringsutrymme innan Persistence Repair körs.
- Rensar gamla resolverloggar, providertelemetri, diagnostik, cache- och sessionsdata.
- Flyttar stora icke-kritiska localStorage-poster till IndexedDB och verifierar återläsningen innan originalet tas bort.
- Skyddar portfölj, konton, antal, GAV, marknadsvärden, transaktioner, Portfolio Ledger, API-nycklar, direktkorrigeringar och identitetsregister.
- Kör en första försiktig städning automatiskt vid appstart.
- Persistence Repair använder Storage Cleanup automatiskt om localStorage fortfarande är fullt.

## Rätt ordning

1. Öppna **Marknad → Global Identity Resolver**.
2. Tryck **Frigör lagringsutrymme**.
3. Tryck **Reparera och testa lagring**.
4. Fortsätt först när localStorage, IndexedDB och Registry visar **OK**.
5. Tryck **Sök gamla ISIN**.
6. Tryck **Kontrollera identiteter**.
7. Lägg in kvarvarande ISIN via:
   **Portfölj → Administrera → Redigera befintligt innehav → välj värdepapper → Öppna redigering → ISIN → Spara direktkorrigering**.
8. Kör därefter resolverbatcher och livekurser/NAV.

## Säkerhet

Följande raderas aldrig av Storage Cleanup:
- portfölj och innehav
- antal och GAV
- marknadsvärden
- konton och transaktioner
- Portfolio Ledger
- API-nycklar
- direktkorrigeringar
- manuella identiteter
- Permanent Identity Registry
