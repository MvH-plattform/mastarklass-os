# Mästarklass OS 10.3 — Transaction Engine

En sammanhängande full release ovanpå den stabila 10.2.1-kärnan.

## Nytt i 10.3

- registrera köp och försäljningar
- datum, konto, värdepapper, antal, pris, courtage, valuta och valutakurs
- kompakt lokal transaktionslogg i en separat lagringsnyckel
- automatisk omräkning av antal och viktat GAV
- kontroll som hindrar försäljning av fler enheter än portföljen innehåller
- transaktionshistorik per innehav
- radering av felregistrerade transaktioner med omedelbar omräkning
- full backup av portfölj, mål och transaktioner
- live-lagret är fortsatt read-only och kan aldrig skriva över antal, GAV eller transaktioner

## Installation

Ladda upp samtliga åtta filer till repositoryts rot och ersätt filer med samma namn. Vänta tills GitHub Pages har deployat färdigt. Stäng därefter den installerade appen helt och öppna den igen.

## Aktiv produktstruktur

- `index.html`
- `app.js`
- `styles.css`
- `manifest.json`
- `sw.js`
- `icon.svg`
- `version.json`
- `README.md`

Ingen bankinloggning, handel eller API-nyckel lagras i GitHub. Privat portföljdata och transaktioner stannar lokalt på användarens enhet.
