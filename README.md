# Mästarklass OS 11.15.11 — Resolver Diagnostics

Diagnostikversion som visar exakt var Global Identity Resolver stannar på Android/PWA.

## Nytt

- synlig tidsstämplad körlogg direkt i resolverpanelen
- loggar lokal mapping, Permanent Registry, Global Registry och varje extern provider före och efter anrop
- visar aktuellt instrument och senaste steg
- pulsräknare visar om huvudtråden fortfarande lever
- providerfel och timeout visas med exakt feltext och svarstid
- stoppknappen loggar om stoppflaggan verkligen skrivs
- knapp för att kopiera hela diagnostikloggen
- ingen extra portföljanalys eller helrendering under instrumentverifieringen
- separat körstatus och ny service-worker-cache

## Test

1. Ersätt samtliga åtta filer i GitHub-repots rot.
2. Vänta på grön GitHub Pages-deployment.
3. Stäng PWA:n helt och öppna den igen.
4. Kontrollera att 11.15.11 visas.
5. Kör en batch.
6. Om den stannar, skicka en bild på den sista synliga loggraden eller använd Kopiera diagnostiklogg.

Portföljens antal, GAV, kredit, transaktioner och Portfolio Ledger ändras aldrig av diagnostiken.
