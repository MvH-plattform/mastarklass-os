# Mästarklass OS 11.15.29 — State & Cooldown Fix

## Rättat
- Giltigt pausat checkpoint prioriteras framför tom `idle 0/0`.
- Tom standardstatus får inte skriva över RunId, mållista, cursor eller progress.
- Provider-cooldowns sparas i resolverns IndexedDB-status.
- OpenFIGI går i 15 minuters cooldown efter tre nätverksfel.
- HTTP 429 ger omedelbar 15 minuters cooldown.
- Cooldown kontrolleras före nätverksanrop.
- Loggexporten använder aktuell version.
- UI skiljer på Batch återstår och Portfölj återstår.

## Skydd
Antal, GAV, marknadsvärde, kredit, transaktioner, konton och Portfolio Ledger ändras aldrig.

## Test
1. Ladda upp alla åtta rootfiler.
2. Vänta på grön GitHub Pages-deployment.
3. Stäng och öppna PWA:n.
4. Kontrollera version 11.15.29.
5. Fortsätt en batch.
6. Starta om och kontrollera att checkpoint återställs.
7. Efter tre OpenFIGI-fel ska loggen visa cooldown.
