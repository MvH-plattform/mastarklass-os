# Mästarklass OS 11.15.35 — Recovery Validation & Deployment Refresh

Denna version bygger direkt ovanpå 11.15.34. All ISIN Recovery och Safety Lock från 11.15.34 ingår även om 11.15.34 aldrig hann publiceras.

## Ingår från 11.15.34

- Automatisk sökning efter tidigare sparade ISIN i localStorage och tillgängliga IndexedDB-register.
- Matchning via normaliserat namn, konto, tillgångsslag och ticker.
- Återställning till direktkorrigering, manuellt identitetsregister och live-mappning.
- Tickerförslag utan giltigt ISIN sparas som manuell marknadsrutt, inte verifierad identitet.
- OpenFIGI-cooldown, IndexedDB-checkpoint och stabil batchmotor.

## Nytt i 11.15.35

- **Recovery Validation** kontrollerar att funktionerna från 11.15.34 verkligen fungerar efter publicering.
- Visar hur många innehav som har ISIN, hur många som fortfarande saknar ISIN och om samma ISIN används av olika instrument.
- Söker efter gamla permanenta rutter som felaktigt markerats som verifierade utan ISIN.
- Kontrollerar att lokal beständig lagring kan skrivas och läsas tillbaka.
- Kör en första tyst validering automatiskt vid appstart.
- Ny knapp **Kontrollera 11.15.34** i Global Identity Resolver.
- Ny service-worker-cache och striktare nätverksuppdatering för att minska risken att PWA:n visar föregående version.

## Test efter lyckad deployment

1. Kontrollera att 11.15.35 visas i apphuvudet.
2. Öppna Marknad och Global Identity Resolver.
3. Kontrollera rutorna **ISIN Recovery 11.15.34** och **Recovery Validation 11.15.35**.
4. Tryck **Sök gamla ISIN**.
5. Tryck **Kontrollera 11.15.34**.
6. Kontrollera antal innehav med ISIN, konflikter och att lagring visar OK.
7. Lägg endast in de återstående ISIN manuellt via Portfölj → Administrera → Redigera befintligt innehav.
8. Kör därefter resolverbatcherna vidare.

## Säkerhet

Antal, GAV, marknadsvärde, kredit, konton, transaktioner, Portfolio Ledger och API-nycklar ändras aldrig av Recovery Validation.
