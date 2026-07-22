# Mästarklass OS 11.15.15 — Bootstrap Recovery

Återställer den stabila appstarten från 11.15.13 och behåller en skyddad, beständig resolverdiagnostik.

## Rättat

- appstarten är återställd och diagnostiken får aldrig stoppa övriga Mästarklass OS
- loggfunktionerna är omslutna av felhantering och faller säkert tillbaka vid lagringsproblem
- varje diagnostikrad läggs till i historiken utan att föregående rader ersätts
- upp till 300 rader sparas lokalt
- ny batch lägger till en sessionsmarkör i stället för att rensa historiken
- Visa hela loggen ändrar endast CSS och gör ingen helrendering
- Kopiera hela loggen läser direkt från sparad historik
- ett felaktigt funktionsanrop vid uppdatering av aktuellt instrument är rättat
- globala JavaScript- och Promise-fel loggas utan att krascha appen
- separat 11.15.15-körstatus och service-worker-cache

## Test

1. Ersätt samtliga åtta filer i GitHub-repots rot.
2. Vänta på grön GitHub Pages-deployment.
3. Stäng PWA:n helt och öppna den igen.
4. Kontrollera att 11.15.15 visas och att appen startar normalt.
5. Gå till Marknad, rensa loggen, kör en batch och vänta minst tio sekunder.
6. Kopiera hela loggen och skicka texten.

Portföljens antal, GAV, kredit, transaktioner och Portfolio Ledger ändras inte.
