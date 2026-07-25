# Mästarklass OS 11.15.40 — Portfolio Identity Bridge & Cleanup Safety Lock

Denna version bygger direkt ovanpå 11.15.39.

## Portfolio Identity Bridge
- Läser samma aktiva portföljkälla som visar dina 102 innehav: `mastarklass_os_10_data`.
- Synkar identitetsmotorn mot den aktiva portföljen.
- Unified Identity Engine och resolverräknarna använder samma underlag.

## Cleanup Safety Lock
- Automatisk cleanup vid appstart är borttagen.
- All data skyddas som standard.
- Portfölj, innehav, antal, GAV, marknadsvärden, konton, transaktioner, ledger, API-nycklar, direktkorrigeringar och identitetsregister kan aldrig rensas.
- Endast exakt tillåtna logg- och temporärnycklar får rensas.
- Rensning kräver förhandsgranskning och uttryckligt knapptryck.

## Testordning
1. Öppna Marknad → Global Identity Resolver.
2. Tryck **Synka portfölj till identitetsmotorn**.
3. Verifiera cirka `20/102 med ISIN`, `82 saknar`, `1 konflikt`.
4. Öppna konflikter och saknade ISIN.
5. Rätta konflikten och lägg därefter in kvarvarande ISIN.
6. Använd Cleanup endast via **Förhandsgranska säker rensning**.
