# Mästarklass OS 11.15.2 — Resolver Performance & Recovery

Bygger vidare på 11.15.1 Permanent Identity Registry och gör Global Identity Resolver snabbare, återupptagbar och stabilare i Android/PWA.

## Nytt

- redan permanent lösta instrument hoppas över innan någon provider anropas
- varje säker identitet sparas omedelbart i Permanent Identity Registry
- körposition och resultat sparas efter varje instrument
- avbruten eller stängd körning återställs som pausad och kan fortsätta
- säker stoppknapp avslutar efter aktuellt instrument
- tydlig statistik för permanenta, nya säkra, granskning, misslyckade och överhoppade
- progress visar behandlade instrument och aktuell status
- tillfälliga resultat komprimeras för lägre minnesanvändning
- fastnad `running/syncing` återställs automatiskt vid nästa appstart
- Live Portfolio Valuation, Data Confidence och Autonomous Portfolio Intelligence uppdateras efter en slutförd resolverkörning

## Säkerhet

11.15.2 ändrar aldrig antal, GAV, kredit, transaktioner eller Portfolio Ledger. Endast identitets-, provider- och read-only värderingsdata uppdateras.

## Efter uppladdning

1. Ladda upp samtliga åtta filer till GitHub-repots rot och ersätt befintliga filer.
2. Vänta tills GitHub Pages är grön.
3. Stäng den installerade PWA:n helt och öppna den igen.
4. Kontrollera att appen visar version 11.15.2.
5. Kör Global Identity Resolver. Du kan stoppa säkert och fortsätta senare.
