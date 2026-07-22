# Mästarklass OS 11.13.0 — Autonomous Portfolio Intelligence

Bygger vidare på 11.12.0 Data Confidence Engine och gör portföljens AI mer självständig, förändringsmedveten och direkt användbar.

## Nytt

- autonom portföljskanning när appen öppnas och återupptas
- automatisk ny analys efter lyckad live-synk
- confidence-aware Öka, Behåll, Bevaka, Minska/Granska och Manuell kontroll
- Smart Buy Queue och Opportunity Radar med datatillit, risk, värdering och portföljvikt
- Concentration Engine för innehav, konton och tillgångsslag
- automatisk morgonbrief med viktigaste åtgärd, möjlighet, risk och nästa kapital
- lokal trendhistorik för Portfolio Intelligence, hälsa och datatillit
- förändringssignatur och fem minuters cooldown för att undvika onödiga omräkningar
- endast förändrade portföljlägen skapar nya trendpunkter
- manuella knappar finns kvar för kontroll och felsökning

## Automatik

När appen öppnas körs först lokal analys direkt. Om live-data är äldre än 30 minuter och minst en provider är aktiverad försöker appen sedan synkronisera marknadsdata. Efter lyckad synk körs Data Confidence, risk, diversifiering, Opportunity Radar, Concentration Engine och Wealth Coach på nytt.

## Säkerhet

11.13.0 arbetar endast i read-only live-, AI- och intelligenslagret. Den ändrar aldrig antal, GAV, marknadsvärde, kredit, transaktioner, Portfolio Ledger eller API-nycklar och skapar inga order.

## Uppladdning

Ladda upp samtliga åtta filer till GitHub-repots rot och ersätt befintliga filer. Vänta tills GitHub Pages är grön. Stäng därefter den installerade PWA:n helt och öppna den på nytt.
