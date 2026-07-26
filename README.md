# Mästarklass OS 11.15.44 — ISIN Market Routing & Valuation Bridge

Den här versionen bygger direkt ovanpå 11.15.43 och bevarar samtliga 102 innehav, identiteter, konton, transaktioner, GAV, kredit, Ledger och Cleanup Safety Lock.

## Nytt
- Bygger en permanent marknadsrutt för varje innehav med ISIN som primär identitet.
- Skiljer automatiskt mellan börskurs och fond-NAV.
- Kopplar varje rutt till rätt valuta och FX till SEK.
- Matchar livekurser via holding-ID, ISIN, ticker och providersymboler.
- Livevärderingen använder den säkrade identitetsvalutan i stället för enbart äldre fält i innehavet.
- Visar hur många rutter som har kurs, NAV och FX samt vad som fortfarande saknas.
- Ruttmotorn körs säkert vid appstart utan att ändra antal, GAV eller historik.

## Test efter deployment
1. Öppna Marknad → Global Identity Resolver.
2. Kontrollera att Portfolio Identity Bridge visar 102/102 med ISIN.
3. Tryck **Bygg marknadsrutter**.
4. Kontrollera att knappen visar **Rutter klara ✓**.
5. Se räknarna för marknadsrutter, kurser, NAV och FX.
6. Öppna Portfölj → Översikt och kontrollera livevärderingen.
7. Kör därefter ordinarie livesynk för att fylla rutter som saknar kurs eller NAV.

## Säkerhet
- Ingen automatisk cleanup har lagts till.
- Cleanup Safety Lock är oförändrat aktivt.
- Portföljdata, identiteter och permanent register skyddas.
