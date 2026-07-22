# Mästarklass OS 11.14.1 — Resolver Execution & Live Valuation

Korrigeringsversion ovanpå 11.14.0 som aktiverar resolverflödet och kopplar verifierade livekurser till portföljens dynamiska värdering.

## Nytt

- Global Identity Resolver går igenom hela den börshandlade portföljen och visar löpande framsteg.
- Manuellt sparade ISIN och befintliga mappingar bevaras när instrumentregistret byggs om.
- Mycket säkra resolverträffar sparas automatiskt som permanenta read-only-rutter.
- Automatisk livesynk och ny Portfolio Intelligence-analys efter resolverns körning.
- Marknadsvärde prioriterar `antal × livekurs × FX`; senast känt värde används endast som fallback.
- Portföljtotal, vikter, koncentration och AI-analyser använder den dynamiskt beräknade hybridvärderingen.
- Portföljsidan visar live-täckning, dagens förändring, Ledger-bas och senaste värdering.
- Kurser matchas i första hand via instrumentnyckel och därefter via normaliserade providersymboler.

## Skyddad masterdata

Versionen ändrar inte antal, GAV, transaktioner, kredit eller Portfolio Ledger. Marknadsvärdet är ett beräknat presentations- och analysvärde som uppdateras från livekurs/NAV och FX.

## Uppladdning

Ladda upp samtliga åtta filer till GitHub-repots rot och ersätt befintliga filer. Vänta tills GitHub Pages är grön, stäng PWA:n helt och öppna den igen.
