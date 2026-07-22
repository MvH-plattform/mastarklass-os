# Mästarklass OS 11.15.13 — Worker Bootstrap Debug

Diagnostikversion som bygger vidare på 11.15.12 och instrumenterar hela uppstarten av Global Identity Resolver innan instrument 1 behandlas.

## Nytt

- loggar knapptryck, startlås, tidigare körstatus och beräkning av mållistan
- loggar när körstatus sparas och när resolverpanelen uppdateras
- loggar när workerflaggan sätts och Promise-kedjan skapas
- bekräftar om Promise-callbacken verkligen körs
- loggar första raden i `runGlobalResolver()` och första passerade `await`
- loggar om runId och körstatus matchar
- watchdog-rader efter 250 ms, 2 sekunder och 8 sekunder visar exakt var uppstarten stannat
- globala JavaScript-fel och ohanterade Promise-fel sparas med feltext
- hela historiken från 11.15.12 finns kvar: upp till 200 rader, radnummer, tidsstämpel, kopiering och expanderad vy
- resolverns providerordning, batchstorlek och portföljskydd är oförändrade

## Förväntad logg

Efter **Kör nästa batch (max 8)** ska loggen normalt visa:

1. Bootstrap 01 Startfunktion anropad
2. Bootstrap 02 Startlås satt
3. Bootstrap 03 Tidigare körstatus läst
4. Bootstrap 04 Mållista beräknas
5. Bootstrap 05 Mållista klar
6. Bootstrap 06 Körstatus byggd
7. Bootstrap 07 Körstatus sparad
8. Bootstrap 08 UI uppdaterat
9. Bootstrap 09 Workerflagga satt
10. Bootstrap 10 Watchdogs aktiverade
11. Bootstrap 11 Schemaläggning klar
12. Bootstrap 11 Promise-callback körs
13. Worker 01 Funktionskropp öppnad
14. Worker 02 Första await passerad
15. Worker 03 Körstatus läst

Den sista raden som visas före stoppet identifierar den blockerande delen.

## Test

1. Ersätt samtliga åtta filer i GitHub-repots rot.
2. Vänta på grön GitHub Pages-deployment.
3. Stäng PWA:n helt och öppna den igen.
4. Kontrollera att 11.15.13 visas.
5. Tryck **Rensa loggen**.
6. Kör en batch och vänta minst 10 sekunder.
7. Tryck **Visa hela loggen** och skärmdumpa loggen uppifrån och ned, eller använd **Kopiera hela loggen**.

11.15.13 ändrar aldrig antal, GAV, kredit, transaktioner eller Portfolio Ledger. Endast diagnostik samt read-only identitets- och providerdata kan uppdateras.
