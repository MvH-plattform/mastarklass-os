# Mästarklass OS 11.6.1 — Quality Match Engine

Hotfix för Global Instrument Registry som prioriterar originalnoteringen och rättar felaktiga alternativa listningar.

## Nytt

- Mastercard korrigeras till **MA · NYSE · USD · US57636Q1040** i stället för brasilianska MSCD34
- exakta registernamn prioriteras framför providersökning
- tillgångsslag och valuta vägs in i identitetsmatchningen
- felaktiga automatiska tickers skrivs över av verifierat register
- manuella kopplingar lämnas orörda
- Identity Engine visar hur många felaktiga tickers som rättats
- portföljdata, antal, GAV, historik, Ledger och API-nycklar ändras inte

## Uppladdning

Ladda upp samtliga åtta appfiler till GitHub-repots rot och ersätt befintliga filer. Kör därefter **Identity Engine** en gång och synkronisera live-data.
