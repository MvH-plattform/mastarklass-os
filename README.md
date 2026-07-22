# Mästarklass OS 11.15.10 — Resolver Start & Stop Recovery

Rättar stoppet där 11.15.9 sparade “8 instrument förbereds” men aldrig gick vidare till instrument 1.

## Rättat

- resolverarbetaren startas direkt utan timer mellan knapptryck och instrument 1
- status ändras synkront till `Verifierar 1/101` före första provideranropet
- exakt en startväg används via knappens direkta handler
- stoppknappen använder en separat direkt handler och visar omedelbart `Stopp begärt`
- inga dubbla resolverlyssnare skapas i den vanliga renderbindningen
- samma lätta instrumentsnapshot används under hela batchen
- checkpoint sparas efter varje instrument
- varje instrument har högst nio sekunders väntetid
- högst åtta instrument behandlas per batch
- ny separat körstatus och service-worker-cache

## Säkerhet

11.15.10 ändrar aldrig antal, GAV, kredit, transaktioner eller Portfolio Ledger. Endast identitets-, provider- och read-only värderingsdata kan uppdateras.

## Efter uppladdning

1. Ersätt samtliga åtta filer i GitHub-repots rot.
2. Vänta tills GitHub Pages visar grön deployment.
3. Stäng PWA:n helt och öppna den igen.
4. Kontrollera att 11.15.10 visas.
5. Tryck Kör nästa batch. Status ska direkt visa Verifierar 1/101.
