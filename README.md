# Mästarklass OS 11.15.32 — ISIN-first Candidate Inspector

Den här versionen bygger vidare på den stabila IndexedDB- och batchmotorn i 11.15.30 och gör identitetsgranskningen tydlig när flera providers visar liknande tickeralternativ.

## Förbättrat

- ISIN visas som primär identitetsnyckel för varje kandidat.
- Varje av högst fyra alternativ visar fullständigt namn, ticker, ISIN, börs, valuta, instrumenttyp och provider.
- Kandidater utan ISIN märks tydligt som **Tickerförslag – ISIN saknas**.
- En kandidat utan ISIN visas aldrig som 100 % verifierad i granskningen.
- Exakt ISIN-match märks **Verifierad – exakt ISIN**.
- Kandidat med giltigt ISIN men utan jämförelseunderlag märks **Stark kandidat – ISIN finns**.
- Konflikter mellan källor markeras och användaren uppmanas kontrollera börs och ISIN.
- Valet görs med tydliga radiokort i stället för en kompakt och svårtolkad lista.
- Godkännandeknappen skiljer mellan verifierad identitet och manuellt tickerförslag.
- Checkpoint, batchstatus, provider-cooldown, permanent register och full logg fortsätter ligga i IndexedDB.

## Oförändrad säkerhet

Antal, GAV, marknadsvärde, kredit, transaktioner, konton, Portfolio Ledger och API-nycklar ändras aldrig av resolvern.

## Test efter uppladdning

1. Ersätt samtliga åtta filer i GitHub-repots rot.
2. Vänta tills GitHub Pages visar grön deployment.
3. Stäng PWA:n helt och öppna den igen.
4. Kontrollera att version **11.15.32** visas.
5. Öppna **Granska resultat**.
6. Expandera ett instrument med flera kandidater, exempelvis Lime Technologies eller en JPM ETF.
7. Kontrollera att varje alternativ visar ISIN, börs, valuta, typ och provider.
8. Kandidater utan ISIN ska vara märkta som tickerförslag och ha högst 89 % visad identitetssäkerhet.
9. Välj rätt alternativ genom att jämföra ISIN först och godkänn därefter.
