# Mästarklass OS 11.15.8 — Deterministic Batch Engine

Rättar race-felet i 11.15.7 där samma tryck kunde fångas flera gånger av inline-, pointer- och globala klickvägar. Det gjorde att statusen blinkade till men batchen inte fortsatte.

## Rättat

- exakt en klickväg startar resolverbatchen
- inline- och pointer-hanterare är borttagna
- central capture-router ignorerar resolverknapparna
- ett synkront startlås sätts innan någon asynkron väntan
- körstatus, mål och totalantal sparas före första provideranropet
- UI uppdateras utan helrendering under varje instrument
- högst åtta instrument behandlas per batch
- checkpoint sparas efter varje instrument
- tung värderings- och AI-efteranalys körs först när batchen är klar
- tydligt felmeddelande stannar kvar i panelen om batchen misslyckas
- ny separat 11.15.8-körstatus och service-worker-cache

## Säkerhet

11.15.8 ändrar aldrig antal, GAV, kredit, transaktioner eller Portfolio Ledger. Endast identitets-, provider- och read-only värderingsdata kan uppdateras.

## Efter uppladdning

1. Ersätt samtliga åtta filer i GitHub-repots rot.
2. Vänta tills GitHub Pages visar grön deployment.
3. Stäng PWA:n helt och öppna den igen.
4. Kontrollera att 11.15.8 visas.
5. Tryck **Kör nästa batch (max 8)**. Statusen ska stanna kvar och gå vidare till **Verifierar 1/...**.
