# Mästarklass OS 11.15.7 — Direct Button Recovery

Rättar det kvarvarande Android/PWA-felet där resolverknappen blinkade men körningen aldrig startade.

## Rättat

- länklösningen från 11.15.6 är helt borttagen
- **Kör nästa batch (max 8)** är åter en riktig HTML-knapp
- knapptrycket fångas via inline-handler, pointer-händelse och central fallback-router
- första återkopplingen sparas synkront som `Knapptryck mottaget…` innan något tungt arbete börjar
- resolverstatus skrivs till lokal lagring innan instrumentlistan beräknas
- dubbeltryck spärras i 700 ms utan att blockera normal användning
- fel visas direkt i resolverpanelen i stället för att försvinna tyst
- gammal `#resolver-run`-navigering och dess blinkande länkstil är borttagen
- Live Portfolio Valuation visar konsekvent version 11.15.7
- ny separat körstatus och service-worker-cache för 11.15.7

## Säkerhet

11.15.7 ändrar aldrig antal, GAV, kredit, transaktioner eller Portfolio Ledger. Endast identitets-, provider- och read-only värderingsdata kan uppdateras.

## Efter uppladdning

1. Ersätt samtliga åtta filer i GitHub-repots rot.
2. Vänta tills GitHub Pages visar grön deployment.
3. Stäng PWA:n helt och öppna den igen.
4. Kontrollera att 11.15.7 visas.
5. Tryck **Kör nästa batch (max 8)**. Texten ska omedelbart ändras till **Knapptryck mottaget…** och därefter **Startar stabil batch…**.
