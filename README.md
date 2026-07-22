# Mästarklass OS 11.15.4 — Batch Button Hotfix

Rättar felet i 11.15.3 där knappen **Kör nästa batch (max 8)** kunde se aktiv ut men inte starta resolvern i Android/PWA.

## Rättat

- resolverknappen har nu både direkt eventbindning och central fallback-router
- klick fångas säkert även efter omrendering eller PWA-återupptagning
- tydlig status **Startar batch…** visas omedelbart
- synliga fel fångas och visas i resolverpanelen i stället för att klicket verkar göra ingenting
- stopp- och granskningsknappar använder samma stabila interaktionsväg
- fastnad live-synkstatus `syncing` återställs vid appstart
- ny separat 11.15.4-körstatus och service-worker-cache

## Säkerhet

11.15.4 ändrar aldrig antal, GAV, kredit, transaktioner eller Portfolio Ledger. Endast identitets-, provider- och read-only värderingsdata kan uppdateras.

## Efter uppladdning

1. Ersätt samtliga åtta filer i GitHub-repots rot.
2. Vänta tills GitHub Pages visar grön deployment.
3. Stäng PWA:n helt och öppna den igen.
4. Kontrollera att 11.15.4 visas.
5. Tryck **Kör nästa batch (max 8)**. Knappen ska direkt visa **Startar batch…**.
