# Mästarklass OS 10.5.0 — Portfolio Intelligence Foundation

En full, sammanhängande release ovanpå den stabila 10.4.1-kärnan. Portfolio Engine, Transaction Engine, Administration Layer och Portfolio Ledger finns kvar oförändrade som sanningskälla.

## Nytt i 10.5
- lokalt Portfolio Intelligence Score för hela portföljen
- intelligenskort för samtliga innehav
- spårbara delpoäng för kvalitet, tillväxt, utdelning, värdering, riskkontroll, diversifiering och datakvalitet
- status: Öka kandidat, Behåll, Bevaka, Komplettera data eller Minska/granska
- förklaringsmotor som visar varför en status har satts
- filter för köpkandidater, hög kvalitet, bevakning och risk
- styrkor och förbättringsområden för portföljen
- intelligens i varje innehavs detaljkort

## Säkerhetsprincip
Intelligenslagret är lokalt och read-only mot masterdata. Det ändrar aldrig antal, GAV, kredit, transaktioner eller ledger. Live-data är fortsatt separat och avstängd tills Provider Registry aktiveras i en senare full release.

## Uppladdning
Ladda upp samtliga åtta filer till repositoryts rot och ersätt filer med samma namn. Vänta tills GitHub Pages är färdig. Stäng därefter den installerade appen helt och öppna den igen.
