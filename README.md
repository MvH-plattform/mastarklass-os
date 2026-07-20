# Mästarklass OS 11.0.2 — Interaction Stability

Stabiliseringsrelease ovanpå 11.0.1.

## Korrigerat
- återställd Ledger-motor och Ledger-vy
- återställd Intelligence Engine som används av Analys och innehavsdetaljer
- klick på innehav öppnar globalt detaljkort igen
- Analys renderas utan att falla tillbaka till Portfölj
- central event delegation för navigation, portföljflikar, innehav, intelligenskort och Ledger
- synlig felvy vid framtida renderingsfel i stället för tyst sidbyte
- versionsnummer och PWA-cache synkroniserade

## Säkerhet
Ingen lokal portföljdata, GAV, antal, kredit, transaktion eller Ledger skrivs över.
