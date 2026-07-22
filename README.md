# Mästarklass OS 11.15.6 — Native Action Bridge

Rättar det kvarvarande Android/PWA-felet där **Kör nästa batch (max 8)** kunde visas men inte starta.

## Rättat

- resolverstarten använder nu en vanlig intern länk (`#resolver-run`) och webbläsarens egen hash-navigering
- batchstarten är därför inte beroende av en förlorad `click`-lyssnare efter omrendering
- knappen ger omedelbart återkoppling med **Startar batch…**
- batchen fortsätter behandla högst åtta instrument och sparar checkpoint efter varje instrument
- tung automatisk portföljanalys körs inte längre vid appstart
- Marknadsvyn öppnas utan bakgrundsanalys som konkurrerar om huvudtråden
- ny separat körstatus och service-worker-cache för 11.15.6

## Säkerhet

11.15.6 ändrar aldrig antal, GAV, kredit, transaktioner eller Portfolio Ledger. Endast identitets-, provider- och read-only värderingsdata kan uppdateras.

## Efter uppladdning

1. Ersätt samtliga åtta filer i GitHub-repots rot.
2. Vänta tills GitHub Pages visar grön deployment.
3. Stäng PWA:n helt och öppna den igen.
4. Kontrollera att 11.15.6 visas.
5. Tryck **Kör nästa batch (max 8)**. Adressen växlar kort via `#resolver-run` och status ska omedelbart visa **Startar batch…**.
