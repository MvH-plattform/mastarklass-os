# Mästarklass OS 11.15.38 — Identity Conflict Resolver

Denna version bygger direkt ovanpå 11.15.37 och innehåller allt från 11.15.34–11.15.37.

## Nytt

- Ny panel **Identity Conflict Resolver 11.15.38** i Global Identity Resolver.
- Visar exakt vilket ISIN som används av flera olika instrument.
- Visar samtliga innehav som fortfarande saknar ISIN.
- Varje rad kan öppna rätt innehav för redigering, eller visar exakt vilket innehav som ska väljas.
- Räknaren uppdateras efter sparad direktkorrigering.
- Säkerhetslåset från 11.15.34 behålls: tickerförslag utan ISIN är en manuell marknadsrutt, inte verifierad identitet.

## Rätt arbetsordning

1. Kontrollera att Storage Cleanup och Persistence Repair visar OK.
2. Öppna **Identity Conflict Resolver 11.15.38**.
3. Börja med den enda ISIN-konflikten och kontrollera vilket innehav som har fel ISIN.
4. Välj därefter ett innehav under **Saknar ISIN**.
5. Lägg in ISIN via:
   **Portfölj → Administrera → Redigera befintligt innehav → välj värdepapper → Öppna redigering → ISIN → Spara direktkorrigering**.
6. Gå tillbaka till resolverpanelen och kontrollera att räknaren ökat.
7. Fortsätt tills alla aktier, ETF:er och fonder har korrekt identitet.
8. Kör därefter resolverbatcher och livekurser/NAV.

## Säkerhet

Identity Conflict Resolver ändrar inte antal, GAV, marknadsvärden, konton, transaktioner, Portfolio Ledger eller API-nycklar.
