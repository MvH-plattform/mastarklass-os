# Mästarklass OS 10.0.1 – Stable System Recovery

Detta är en sammanhängande full release av Mästarklass OS, byggd som en ren systemkärna efter 10.0.0:s tomma startvy.

## Investeringsfilosofi

- Långsiktigt sparande och förmögenhetsbyggande
- Hållbara utdelningar och återinvestering
- Kvalitet före jakt på hög direktavkastning
- Ingen trading, ingen bankinloggning och ingen automatisk handel
- Local-first: privat portföljdata stannar i användarens enhet
- Extern marknadsdata får endast användas i ett separat read-only-lager

## 10.0.1

- robust startsekvens med felgräns; appen kan inte längre fastna på en tom sida
- säker genomsökning och migrering av äldre LocalStorage-data
- en enda navigation och en enda aktiv skärm
- Hem, Portfölj, Marknad, Analys, Idéer, Mål och Mer fungerar i samma system
- Portfölj har snabbnavigation inklusive Från analys till handling och Personlig investeringsintelligens
- ny Service Worker-cache `mastarklass-os-10.0.1`
- en enda aktiv versionskälla
- en enda README.md

## Uppladdning

Ladda upp samtliga filer i detta paket till repositoryts rot och ersätt filer med samma namn.

De aktiverande filerna är:

- `manifest.json`
- `README.md`
- `sw.js`
- `index.html`

Dessa ligger även i PART 2-paketet och ska laddas upp sist.

## Säkerhet

Releasekoden raderar inte LocalStorage, IndexedDB, Private Vault, antal, GAV eller transaktioner. Vid startfel visas en säker felvy i stället för en tom skärm.
