# Mästarklass OS 6.1 – Digital Twin Core

## Nytt
- Digital Twin-profiler för alla 101 verifierade innehav
- egen profilsida för varje aktie, ETF och fond
- Portfolio DNA med åtta analysdimensioner
- investeringsidé och köpanledning
- roll, tidshorisont, risknivå, målvikt och maxvikt
- Investment Journal
- kronologisk livslinje
- senaste och nästa planerade genomgång
- målkoppling mot 7 500 000 kr
- lokal AI-sammanfattning per innehav
- sökning, sortering och filter
- modulär kodstart med `digital_twin.js` och `styles_6_1.css`
- alla funktioner och data från 6.0 finns kvar

## Professionell kodstruktur
Nya 6.1-funktioner är separerade från den stora `index.html`:
- `digital_twin.js`
- `styles_6_1.css`

Detta är första steget mot en mer modulär och underhållbar kodbas.

## Säkerhet
- ingen bankinloggning
- ingen handel
- ingen otillåten scraping
- inga API-hemligheter
- lokal lagring
- externa marknadsdata är fortsatt avstängda

## Ladda upp och ersätt i GitHub
- index.html
- manifest.json
- icon.svg
- sw.js
- README.md
- portfolio_import_review.csv
- digital_twin.js
- styles_6_1.css
