# Mästarklass OS 10.6.0 — Decision Center

En full, sammanhängande release ovanpå den stabila 10.5.2-kärnan. Portfolio Engine, Transaction Engine, Administration Layer, Portfolio Ledger, Core Modal Engine och Portfolio Intelligence finns kvar oförändrade som samma produkt.

## Nytt i 10.6.0

- nytt lokalt **Decision Center** i Analys
- prioriterad köpkö baserad på score, risk, datakvalitet och portföljvikt
- separat lista för **Öka kandidater**, **Granska först** och **Behåll kärnan**
- skyddsregler väger in utnyttjad kredit, koncentration och bristande data
- visar nästa bästa handling och planerat månadskapital
- varje beslut leder till samma stabila innehavsdetalj från 10.5.2
- rekommendationerna är read-only och skriver aldrig över antal, GAV, kredit, transaktioner eller ledger
- version, manifest, cache och service worker är synkroniserade till 10.6.0

## Uppladdning

Ladda upp samtliga åtta filer till GitHub-repots rot och ersätt filer med samma namn. Vänta tills GitHub Pages visar en ny deployment. Stäng därefter den installerade appen helt och öppna den igen.

## Kontroll

1. Öppna **Analys**.
2. Kontrollera avsnittet **Nästa bästa handling**.
3. Tryck på en kandidat i den prioriterade arbetslistan.
4. Kontrollera att samma stabila detaljkort öppnas och kan stängas.
5. Kontrollera att portfölj, transaktioner, ledger och backup fortfarande är oförändrade.
