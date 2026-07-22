# Mästarklass OS 11.15.5 — Interaction & Performance Hotfix

Rättar den kvarvarande knappblockeringen i Global Identity Resolver och minskar fördröjningen när Marknad öppnas.

## Rättat

- batchknappen har nu en direkt global inline-brygga utöver vanlig eventbindning
- klick, tryck och eventdelegation kan inte längre tappa resolverstarten vid omrendering
- knapptexten ändras direkt innan resolverarbetet börjar
- resolver kör fortfarande högst åtta instrument per batch och sparar checkpoint efter varje instrument
- kanoniska innehav cachas under varje rendercykel för betydligt mindre upprepad beräkning
- automatisk tung live-/AI-synk körs inte längre direkt vid appstart eller varje återgång till appen
- fastnad `syncing` återställs både i synkstatus och read-only live-lagret
- helt ny service-worker-cache för 11.15.5

## Säkerhet

11.15.5 ändrar aldrig antal, GAV, kredit, transaktioner eller Portfolio Ledger. Endast identitets-, provider- och read-only värderingsdata kan uppdateras.

## Efter uppladdning

1. Ersätt samtliga åtta filer i GitHub-repots rot.
2. Vänta tills GitHub Pages visar grön deployment.
3. Stäng PWA:n helt och öppna den igen.
4. Kontrollera att 11.15.5 visas.
5. Tryck **Kör nästa batch (max 8)**. Knappen ska direkt visa **Startar batch…**.
