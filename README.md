# Mästarklass OS 11.15.9 — Resolver Worker Recovery

Rättar stoppet i 11.15.8 där batchen startade men fastnade på 0/101 före första instrumentet.

## Rättat

- instrumentlistan förbereds en gång vid knapptrycket och sparas som en lätt lokal snapshot
- resolverarbetaren återanvänder snapshoten och räknar inte om hela portföljen före första instrumentet
- status går vidare till Verifierar 1/101 innan externa provideranrop startar
- varje instrument har en absolut tidsgräns på 9 sekunder
- fel eller timeout räknas som misslyckat instrument och batchen fortsätter
- checkpoint sparas efter varje instrument
- högst åtta instrument behandlas per batch
- ingen tung automatisk resolver eller portföljanalys körs vid appstart
- ny separat körstatus och service-worker-cache för 11.15.9

## Säkerhet

11.15.9 ändrar aldrig antal, GAV, kredit, transaktioner eller Portfolio Ledger. Endast identitets-, provider- och read-only värderingsdata kan uppdateras.

## Efter uppladdning

1. Ersätt samtliga åtta filer i GitHub-repots rot.
2. Vänta tills GitHub Pages visar grön deployment.
3. Stäng PWA:n helt och öppna den igen.
4. Kontrollera att 11.15.9 visas.
5. Tryck Kör nästa batch (max 8). Status ska gå från Startar batch till Resolverarbetaren är aktiv och sedan Verifierar 1/101.
