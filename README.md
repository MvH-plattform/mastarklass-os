# Mästarklass OS 11.15.14 – Append-Only Bootstrap Trace

Diagnostikstabilisering ovanpå 11.15.13. Resolvermotorn och providerordningen är oförändrade; endast loggens beständighet, visning och kopiering har byggts om.

## Rättat

- varje diagnostikrad får ett permanent sekvensnummer och läggs till i append-only-historiken
- upp till 300 rader sparas lokalt
- en ny batch lägger till en tydlig sessionsmarkör men rensar aldrig tidigare historik
- **Visa hela loggen** och **Komprimera loggen** ändrar endast CSS och kan inte omrendera eller tömma loggen
- **Kopiera hela loggen** läser direkt från den lokalt sparade historiken
- worker-avslut, stopp, watchdogs och globala fel kan inte ersätta tidigare rader
- endast **Rensa loggen** får ta bort historiken
- pulsräknaren sparas separat från loggraderna
- ny separat körstatus och service-worker-cache för 11.15.14

## Test

1. Ersätt samtliga åtta filer i GitHub-repots rot.
2. Vänta på grön GitHub Pages-deployment.
3. Stäng PWA:n helt och öppna den igen.
4. Kontrollera att 11.15.14 visas.
5. Tryck **Rensa loggen** en gång.
6. Kör en batch och vänta minst 10 sekunder.
7. Tryck **Visa hela loggen**. Historiken ska vara kvar.
8. Tryck **Kopiera hela loggen** och klistra in texten i chatten.

Portföljens antal, GAV, kredit, transaktioner och Portfolio Ledger ändras aldrig av diagnostiken.
