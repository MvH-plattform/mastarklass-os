# Mästarklass OS 11.15.16 — Resolver Chain Trace

Diagnostikversion som bygger vidare på 11.15.15 och gör hela resolverns anropskedja synlig utan att vara beroende av full localStorage.

## Rättat

- all resolverdiagnostik använder nu exakt samma minnesbuffer i UI och kopieringsfunktionen
- varje loggrad läggs till i ordning och ersätter aldrig tidigare rader
- upp till 400 rader finns kvar under hela appsessionen även om lokal lagring är full
- sessionStorage används först, localStorage som reserv och minne som sista säkra nivå
- panelen visar vilken lagringsnivå loggen faktiskt använder
- kopiering läser direkt från samma buffer som visas på skärmen
- kopieringsknappen skapar inte längre en ny loggrad som kan ersätta historiken
- startfunktion, Promise-kedja, worker, runId, snapshot, instrumentloop, providers, checkpoint och watchdogs loggas
- watchdogs efter 250 ms, 2 s, 8 s och 20 s visar var kedjan står
- globala JavaScript-fel och ohanterade Promise-fel skrivs i samma logg
- resolverlogik, batchstorlek och portföljskydd är oförändrade

## Test

1. Ersätt samtliga åtta filer i GitHub-repots rot.
2. Vänta på grön GitHub Pages-deployment.
3. Stäng PWA:n helt och öppna den igen.
4. Kontrollera att 11.15.16 visas.
5. Gå till Marknad, tryck **Rensa loggen** och sedan **Kör nästa batch (max 8)**.
6. Vänta minst 20 sekunder.
7. Tryck **Visa hela loggen** eller **Kopiera hela loggen**.

Portföljens antal, GAV, kredit, transaktioner och Portfolio Ledger ändras inte av diagnostiken.
