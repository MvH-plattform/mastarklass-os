# Mästarklass OS 11.15.17 – Resolver State Recovery

Rättar det exakta fel som diagnostiken i 11.15.16 visade: körstatusen sparades inte när `localStorage` var full, trots att gränssnittet fortsatte. Workern läste därför en gammal `idle`-status med fel `runId` och avbröt före instrument 1.

## Rättat

- resolverns aktiva körstatus hålls alltid i minnet först
- samma status speglas till `sessionStorage`, som är primär beständig lagring för pågående batch
- `localStorage` används endast som extra checkpoint och får inte längre blockera körningen
- sparningen verifieras i diagnostikloggen med faktisk lagringsnivå
- workern läser exakt samma `runId` och `running`-status som startfunktionen skapade
- en full lokal lagring kan inte längre orsaka `idle · id=avvikelse`
- batchen ska nu fortsätta från `Worker 03` till snapshot, loop och instrument 1
- stoppknappen använder samma delade körstatus
- portföljdata, antal, GAV, kredit, transaktioner och Portfolio Ledger ändras inte

## Test

1. Ersätt samtliga åtta filer i GitHub-repots rot.
2. Vänta på grön GitHub Pages-deployment.
3. Stäng PWA:n helt och öppna den igen.
4. Gå till **Marknad** och rensa loggen.
5. Tryck **Kör nästa batch (max 8)**.
6. Loggen ska visa `Bootstrap 07 ... lagring=sessionStorage`, därefter `Worker 03 ... running · id=match` och sedan instrumentloopen.
