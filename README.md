# Mästarklass OS 10.1 — Clean Foundation

Mästarklass OS är en sammanhängande local-first produkt för långsiktigt sparande, kvalitetsbolag, hållbara utdelningar, återinvestering och målstyrd portföljintelligens.

## Aktiv produktionsstruktur

Endast dessa filer ska ligga kvar i repositoryts produktionsrot:

- `index.html`
- `app.js`
- `styles.css`
- `manifest.json`
- `sw.js`
- `icon.svg`
- `version.json`
- `README.md`

## Grundprinciper

- ingen bankinloggning
- ingen handel eller tradingmotor
- privat portföljdata lagras lokalt
- antal, GAV och transaktioner ägs av användaren
- extern live-data är ett separat read-only-lager
- datakällor väljs genom Provider Registry, Source Rating och Data Router
- ingen enskild leverantör får bli ett permanent beroende
- intelligensen ska hjälpa användaren nå långsiktiga mål utan onödig risk

## Installation och uppdatering

Ladda först upp PART 1 och därefter PART 2. PART 2 innehåller de aktiverande huvudfilerna och ska alltid laddas upp sist.

Gamla filer tas inte bort automatiskt av GitHub. Följ `DELETE_FROM_GITHUB.txt` efter att version 10.1 har verifierats.
