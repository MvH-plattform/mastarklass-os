# Mästarklass OS 7.3 – Market Intelligence

## Nytt
- Market Dashboard
- Market Pulse
- foundation för OMXS30, S&P 500, Nasdaq, Stoxx Europe 600, valutor, råvaror och Bitcoin
- Fear & Greed- och makrocenter utan fabricerade värden
- portföljkopplad marknadspåverkan
- Sector Rotation Foundation
- heatmaps för sektor, land och valuta
- lokalt rapport- och utdelningscenter
- Market Alerts
- källregister och säkerhetsgrind inför framtida live-data
- Intelligence Feed Foundation
- modulär kod med `market_intelligence.js` och `market_intelligence.css`
- alla funktioner och data från 7.2 och tidigare finns kvar

## Aktuellt lokalt underlag
- Market Score: 61/100
- datatäckning: 60%
- marknadsobjekt: 9
- lokala varningar: 5
- livekurser: AV
- makrodata: AV
- nyhets- och rapportflöden: AV

## Viktig princip
7.3 visar inte påhittade marknadsnivåer. Extern data aktiveras först när en källa:
1. är kostnadsfri för avsedd användning,
2. har godkända villkor,
3. är tekniskt stabil,
4. kan visa källa och tidsstämpel,
5. har säker fallback och datakvalitetskontroll.

## Säkerhet
- ingen bankinloggning
- ingen handel
- ingen otillåten scraping
- inga API-hemligheter i frontend
- lokal lagring
- extern live-data är fortsatt avstängd

## Ladda upp och ersätt i GitHub
- index.html
- manifest.json
- icon.svg
- sw.js
- README.md
- portfolio_import_review.csv
- digital_twin.js
- styles_6_1.css
- intelligence_7_0.js
- intelligence_7_0.css
- portfolio_brain.js
- portfolio_brain.css
- scenario_engine.js
- scenario_engine.css
- market_intelligence.js
- market_intelligence.css
