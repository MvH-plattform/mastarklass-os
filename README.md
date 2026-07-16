# Mästarklass OS 9.7.0 – Live Portfolio Pilot

## Syfte

9.7.0 gör det möjligt att testa den kompletta investeringsplattformen med verkliga, spårbara marknadsdata utan att liveinformationen får skriva över Private Vault.

## Aktiverade datavägar

### ECB Data Portal

- officiella dagliga valutakurser
- omräkning till SEK via EUR-kors
- källa och kursdatum visas
- ingen API-nyckel

### Alpha Vantage-pilot

- aktier och ETF:er
- användaren anger en egen API-nyckel
- nyckeln lagras endast lokalt i webbläsaren
- endast mappade pilotinnehav uppdateras
- användningen måste följa leverantörens plan, licens och rate limits

### Manuell/CSV-reserv

- aktier, ETF:er, fonder och valuta
- källnamn och tidsstämpel följer med varje kurs
- används när extern täckning saknas

## Säkerhetsmodell

Liveinformationen lagras i ett separat read-only-lager.

Den ändrar inte:

- antal
- GAV
- transaktioner
- Portfolio Ledger
- Investment Credit
- Private Vault

Stora avvikelser blockeras och visas för kontroll innan data får användas av analysmotorerna.

## Rekommenderad pilot

Börja med:

1. en amerikansk aktie
2. en utländsk utdelningsaktie
3. en ETF
4. en svensk aktie om providersymbolen stöds
5. en fond via manuell eller CSV-baserad dagskurs

Verifiera värden, valuta, datum och avvikelse innan piloten breddas.

## GitHub-uppladdning

1. Ladda upp PART1 och gör Commit.
2. Ladda upp PART2 och gör Commit.
3. Vänta tills GitHub Pages är klar.
4. Stäng den gamla appfliken och öppna appen igen.
