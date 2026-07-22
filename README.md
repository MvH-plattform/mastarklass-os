# Mästarklass OS 11.15.3 — Resolver Stabilization & Recovery

Stabiliserar Global Identity Resolver för Android/PWA och bygger vidare på 11.15.2.

## Nytt

- resolverpanelen ändrar inte längre en aktiv körning till pausad vid vanlig omrendering
- körning sker i små batcher om högst åtta instrument
- lokal identitet och Global Registry kontrolleras före externa provideranrop
- högst en sökning per extern provider och instrument
- kortare timeout skyddar mot långsamma eller blockerade providers
- checkpoint och granskningsresultat sparas efter varje instrument
- resultat kan granskas även om en körning avbryts
- permanent sparade identiteter uppdaterar värderingen direkt
- inga tunga resolveranrop körs automatiskt vid appstart
- ny separat körstatus gör att en trasig 11.15.2-session inte återanvänds
- service worker använder en helt ny 11.15.3-cache

## Säkerhet

11.15.3 ändrar aldrig antal, GAV, kredit, transaktioner eller Portfolio Ledger. Endast identitets-, provider- och read-only värderingsdata uppdateras.

## Efter uppladdning

1. Ersätt samtliga åtta filer i GitHub-repots rot.
2. Vänta tills GitHub Pages visar grön deployment.
3. Stäng PWA:n helt och öppna den igen.
4. Kontrollera att 11.15.3 visas i sidhuvudet och resolverpanelen.
5. Kör **nästa batch (max 8)**. Granska resultatet eller fortsätt med nästa batch.
