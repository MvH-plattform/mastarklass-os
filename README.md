# Mästarklass OS 11.1.0 — Live Prices & FX

Första fungerande live-marknadsreleasen ovanpå den stabila 11.0.2-kärnan.

## Nytt i 11.1.0
- Live Price Engine för mappade aktier och ETF:er
- FX Engine med EUR-baserade ECB-referenskurser till SEK
- Stooq-adapter för prisobservationer utan att röra portföljens masterdata
- Provider Router med primär källa och lokal cache-fallback
- livevärde, dagsförändring, kurstäckning och synkstatus på Marknad
- livekurs, källa, förändring och datans ålder i innehavsdetaljen
- validering av pris, tidsstämpel, färskhet och cache
- tydlig felhantering när en källa eller ticker saknar svar

## Säkerhetsmodell
Live-data är strikt read-only och får aldrig skriva över:
- antal
- GAV
- kredit
- transaktioner
- Portfolio Ledger
- lokal historik

## Innan synkronisering
Öppna Marknad och välj **Skapa/uppdatera instrumentmappning**. Innehav behöver en korrekt ticker eller ISIN för automatisk kurshämtning.

## Viktigt
Marknadsdatakällor kan ha fördröjda kurser, begränsad täckning och tillfälliga CORS-/nätverksproblem. Appen behåller senast validerade cache och visar tydligt när uppdateringen inte lyckas.

## Uppladdning
Ladda upp samtliga åtta filer till GitHub-repots rot och ersätt filer med samma namn. Vänta på GitHub Pages-deployment. Stäng därefter den installerade appen helt och öppna den igen.
