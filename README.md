# Mästarklass OS 11.15.12 — Persistent Diagnostic History

Ren diagnostikstabilisering ovanpå 11.15.11. Resolvermotorn är kvar med samma körlogik; ändringen gäller hur loggen sparas och visas.

## Rättat

- varje diagnostikrad läggs till i historiken i stället för att ersätta föregående rad
- loggrader och diagnostikmetadata lagras separat så pulsräknaren inte kan skriva över loggen
- upp till 200 rader sparas lokalt och överlever omrendering
- hela loggen visas i korrekt tidsordning med radnummer
- kompakt scrollbar vy för normal användning
- **Visa hela loggen** expanderar rutan så alla rader kan skärmdumpas genom vanlig sidscrollning
- räknare visar hur många loggrader som finns
- **Kopiera hela loggen** tar med samtliga sparade rader
- **Rensa loggen** rensar endast diagnostikhistoriken
- resolver, providers och batchstorlek är annars oförändrade från 11.15.11

## Test

1. Ersätt samtliga åtta filer i GitHub-repots rot.
2. Vänta på grön GitHub Pages-deployment.
3. Stäng PWA:n helt och öppna den igen.
4. Kontrollera att 11.15.12 visas.
5. Kör en batch.
6. Tryck **Visa hela loggen** och skärmdumpa loggen uppifrån och ned, eller använd **Kopiera hela loggen**.

Portföljens antal, GAV, kredit, transaktioner och Portfolio Ledger ändras aldrig av diagnostiken.
