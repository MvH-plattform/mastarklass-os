# Mästarklass OS 11.15.1 — Permanent Identity Registry

Bygger vidare på 11.15.0 Live Portfolio Valuation Engine och rättar problemet där Global Identity Resolver hittade instrument men inte återanvände resultaten permanent.

## Nytt

- nytt lokalt Permanent Identity Registry för verifierade provider-rutter
- säkra resolverträffar sparas automatiskt efter genomförd körning
- manuellt godkända träffar sparas både i live-mappningen och det permanenta registret
- sparade rutter återställs automatiskt när appen öppnas
- befintliga verifierade 11.14-rutter migreras utan att användaren behöver börja om
- redan permanent lösta innehav hoppas över vid nästa resolver-körning
- tydlig körprogress, exempelvis `Verifierar 54/89…`
- permanent sparat räknas från det faktiska registret, inte från tillfälliga förslag
- 11.15 Live Portfolio Valuation fortsätter använda livekurs/NAV, FX och fallback-värden

## Säkerhet

11.15.1 ändrar aldrig antal, GAV, kredit, transaktioner eller Portfolio Ledger. Endast identitets- och providerdata sparas i det separata lokala read-only live-lagret. Marknadsvärden beräknas av värderingsmotorn men skriver inte över portföljens masterdata.

## Efter uppladdning

1. Ladda upp samtliga åtta filer till GitHub-repots rot och ersätt befintliga filer.
2. Vänta tills GitHub Pages är grön.
3. Stäng den installerade PWA:n helt och öppna den igen.
4. Kör Global Identity Resolver 11.15.1 en gång.
5. Säkra träffar sparas automatiskt; övriga visas under Granska och godkänn.
