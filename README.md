# Mästarklass OS 4.1 – Market Intelligence Foundation

## Syfte
4.1 bygger den tekniska och visuella grunden för framtida aktuell marknadsdata utan att aktivera någon extern datakälla ännu.

## Nytt
- nytt Market Intelligence Center
- tydlig status för live-data och integrationsberedskap
- marknadsöversikt för index, valutor och råvaror
- manuell lokal marknadssnapshot under utvecklingen
- källregister och säkerhetsgrind
- kartläggning av verifierade innehav mot framtida tickerkoppling
- förberedelse för dynamisk portföljanalys
- alla funktioner från 3.4 finns kvar

## Viktig princip
Live-data är AV i 4.1. Ingen scraping, bankkoppling, handel eller extern API-nyckel används.

En datakälla aktiveras först när den:
1. är kostnadsfri för den avsedda användningen,
2. uttryckligen tillåter tekniken och användningsfallet,
3. är säker att använda med den valda arkitekturen,
4. visar källa och tidsstämpel,
5. har godkänts manuellt före produktionssättning.

## Ladda upp/ersätt i GitHub
- index.html
- manifest.json
- icon.svg
- sw.js
- README.md
- portfolio_import_review.csv

## Säkerhet
- ingen bankinloggning
- ingen handel
- ingen otillåten scraping
- inga API-hemligheter i frontend
- lokal datalagring
